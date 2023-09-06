// ** import packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

// ** components **
import Modal from 'components/Modal';
import NoteForm from 'components/detail-components/Notes/components/NoteForm';
import DeleteNoteModal from './DeleteNoteModal';

// ** redux **
import {
  useAddNoteMutation,
  useDeleteNoteMutation,
  useLazyGetNoteByIdQuery,
  useUpdateNoteMutation,
} from 'redux/api/noteApi';
import {
  setLoadDetails,
  setLoadNotes,
  setLoadPinTimeLines,
  setLoadTimeLines,
} from 'redux/slices/commonSlice';

// ** types **
import {
  NoteFieldType,
  NoteResponse,
  NoteResponseFileType,
} from 'components/detail-components/Notes/types/notes.type';
import { TimelineType } from '../types';

// ** Schema **
import {
  noteSchema,
  noteSchemaAutoSave,
} from 'components/detail-components/Notes/validation-schema/notes.schema';

interface Props {
  id?: number;
  isOpen: boolean;
  modelName: string;
  modelRecordId: number;
  closeModal: () => void;
  updatedNote?: (value: string) => void;
  setHistoryData?: React.Dispatch<React.SetStateAction<TimelineType[]>>;
}

function AddNoteModal(props: Props) {
  const {
    isOpen,
    closeModal,
    modelName,
    modelRecordId,
    id,
    updatedNote,
    setHistoryData,
  } = props;

  // ** Hooks **
  const dispatch = useDispatch();

  // ** States **
  const [deleteNoteModal, setDeleteNoteModal] = useState<boolean>(false);

  const [notes, setNotes] = useState<(File | NoteResponseFileType)[]>([]);
  const [pin, setPin] = useState<boolean>(true);
  const [attachment, setAttachment] = useState<boolean>(true);
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<number[]>(
    []
  );
  const [userIDs, setUserIds] = useState<number[]>();
  const [noteData, setNoteData] = useState<NoteResponse>();

  // ** APIS **
  const [getNoteByIdAPI, { isLoading }] = useLazyGetNoteByIdQuery();
  const [addNoteAPI, { isLoading: isAddNoteLoading }] = useAddNoteMutation();
  const [updateNoteByIdAPI, { isLoading: isUpdateNoteLoading }] =
    useUpdateNoteMutation();
  const [deleteNoteAPI, { isLoading: isDeleteNoteLoading }] =
    useDeleteNoteMutation();

  const formMethods = useForm<NoteFieldType>({
    resolver: yupResolver(noteSchema),
  });

  const isNoteFormValid = async () => {
    try {
      await noteSchemaAutoSave.validate(getValues(), { abortEarly: false });
      return true;
    } catch (error) {
      return false;
    }
  };

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    getValues,
    clearErrors,
    setValue,
    watch,
  } = formMethods;

  const documentRef = useRef<() => void>();
  const savedCallback = useRef<NoteResponse>();

  const watchDescription = watch('description');

  useEffect(() => {
    if (id) getNoteDetail(id);
  }, [id]);

  useEffect(() => {
    if (noteData) {
      reset({ description: noteData.description, title: noteData.title });
      setNotes(
        noteData?.attachments?.map((attach) => {
          return {
            mimeType: attach.doc_details.mimeType,
            url: attach.url,
            id: attach.id,
            original_name: attach.doc_details.original_name,
          };
        })
      );
    }
  }, [noteData]);

  useEffect(() => {
    if (isOpen && !noteData) {
      reset({ description: '', title: '' });
      setNotes([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const isValid = await isNoteFormValid();
      if (isValid) {
        handleFunc(watchDescription);
      }
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [watchDescription]);

  const handleFunc = async (desc: string) => {
    if (desc) {
      handleSaveAndData({
        formVal: getValues(),
        autoSave: true,
      });
    }
  };

  const getNoteDetail = async (noteId: number) => {
    const { data, error } = await getNoteByIdAPI(
      {
        id: noteId,
        params: {
          'include[timeline]': 'all',
        },
      },
      true
    );

    if (data && !error) {
      savedCallback.current = data;
      setNoteData(data);
    }
  };

  const deleteFile = (deleteId: number, attach_id: number) => {
    setNotes((prev) => {
      return prev.filter((_val, index) => deleteId !== index);
    });
    if (attach_id) setDeletedAttachmentIds((prev) => [...prev, attach_id]);
  };

  const setNoteFile = (fileObj: FileList) => {
    setNotes((prev) => [...prev, ...fileObj]);
  };

  const onSubmit = ({
    autoSave,
    inPinned,
  }: {
    autoSave?: boolean;
    inPinned?: boolean;
  }) =>
    handleSubmit(async (val: NoteFieldType) => {
      handleSaveAndData({
        formVal: val,
        autoSave,
        inPinned,
      });
    });

  const handleSaveAndData = async (noteFormValue: {
    formVal: NoteFieldType;
    autoSave?: boolean;
    inPinned?: boolean;
  }) => {
    const { formVal, autoSave, inPinned } = noteFormValue;

    const noteFormData = new FormData();

    noteFormData.append('description', formVal.description || '');
    noteFormData.append(
      'is_drafted',
      JSON.stringify(
        formVal.is_default && !autoSave === false ? true : autoSave
      )
    );
    if (!autoSave) {
      noteFormData.append(
        'is_pinned',
        JSON.stringify(formVal.is_default || false)
      );
    } else {
      noteFormData.append('is_pinned', JSON.stringify(true));
    }
    noteFormData.append(
      'userIds',
      `[${JSON.stringify({
        new: userIDs || [],
        old: [],
        deleted: [],
      })}]`
    );
    if (attachment === true || autoSave === true) {
      notes?.forEach((file) => {
        const noteFile = file as File;
        if (noteFile?.size) {
          noteFormData.append(`attachments`, noteFile);
        }
      });
    }

    let response;

    // for update note
    if (noteData?.id || savedCallback.current?.id) {
      noteFormData.append(
        'deletedAttachmentIds',
        JSON.stringify(deletedAttachmentIds)
      );
      const updateResponse = await updateNoteByIdAPI({
        id: noteData?.id ? noteData.id : (savedCallback.current?.id as number),
        data: noteFormData,
      });

      if ('data' in updateResponse || 'error' in updateResponse) {
        response = {
          data: 'data' in updateResponse && updateResponse.data.result,
          error: 'error' in updateResponse && updateResponse?.error.message,
        };
        if ('data' in updateResponse) {
          setHistoryData?.((prev) => {
            const finIndex = prev.findIndex(
              (obj) =>
                obj.id === updateResponse.data.timeLineUpdatedNoteData?.id
            );
            prev[finIndex] = updateResponse.data.timeLineUpdatedNoteData;
            return [...prev];
          });
        }
      }

      // for add note
    } else {
      noteFormData.append('model_name', modelName);
      noteFormData.append('model_record_id', `${modelRecordId}`);

      if (formVal.description.length <= 0) {
        return closeModal();
      }

      response = await addNoteAPI({ data: noteFormData });
      if ('data' in response) {
        dispatch(setLoadTimeLines({ timeline: true }));
      }
    }

    if (response && 'data' in response && !autoSave && inPinned === false) {
      setPin(true);
      dispatch(setLoadNotes({ note: true }));

      if (!response.data?.id) {
        dispatch(
          setLoadDetails({
            loadModuleDetails: {
              leads: modelName === 'leads',
              accounts: modelName === 'accounts',
              contacts: modelName === 'contacts',
              deals: modelName === 'deals',
              activity: modelName === 'activities',
            },
          })
        );
      }
      reset({ description: '', files: [], title: '' });
      if (updatedNote) updatedNote(response.data?.description);
      closeModal();
      setNotes([]);
      setDeletedAttachmentIds([]);
    } else if (response && 'data' in response) {
      savedCallback.current = response.data;
    }

    dispatch(setLoadPinTimeLines({ pinTimeline: true }));
  };

  const close = async () => {
    const isValid = await isNoteFormValid();
    if (isValid) {
      setAttachment(true);
      if (!id) {
        handleSaveAndData({
          formVal: getValues(),
          autoSave: true,
          inPinned: true,
        });
      }
    }
    reset({ description: '', files: [], title: '' });
    closeModal();
    dispatch(setLoadPinTimeLines({ pinTimeline: true }));
    dispatch(setLoadTimeLines({ timeline: true }));
  };

  const handelCancel = async () => {
    if (savedCallback?.current?.id) {
      await deleteNoteAPI({ id: savedCallback?.current?.id });
      closeModal();
      reset({ description: '', files: [], title: '' });
      dispatch(setLoadPinTimeLines({ pinTimeline: true }));
      dispatch(setLoadTimeLines({ timeline: true }));
    }
    closeModal();
  };
 
  const discardMange = () => {
    const formVal = getValues()
    if(formVal?.description !== ''){
      setDeleteNoteModal(true);
    }else{
      closeModal();
    }
  };

  return (
    <>
      <Modal
        modalWrapperClass="add__note__modal"
        title={`${id === undefined ? 'Add' : 'Edit'} Note`}
        visible={isOpen}
        onClose={() => close()}
        onCancel={discardMange}
        onSubmit={() => {
          onSubmit({ autoSave: false, inPinned: false })();
          setPin(false);
        }}
        submitLoading={pin ? false : isAddNoteLoading || isUpdateNoteLoading}
        width="778px"
        cancelButtonText="Discard"
        submitButtonText="Save"
        isNoteModal
        noteButtonAction={documentRef.current}
      >
        {isLoading ? (
          <h1>Loading</h1>
        ) : (
          <>
            <FormProvider {...formMethods}>
              <form>
                <NoteForm
                  isAddForm={id !== undefined}
                  errors={errors}
                  control={control}
                  setUserIds={setUserIds}
                  noteData={noteData}
                  register={register}
                  getValue={getValues}
                  setValue={setValue}
                  setPin={setPin}
                  clearErrors={clearErrors}
                  setError={setError}
                  notes={notes}
                  deleteFile={deleteFile}
                  setNoteFile={setNoteFile}
                  documentRef={documentRef}
                />
              </form>
            </FormProvider>
          </>
        )}
      </Modal>
      {deleteNoteModal && (
        <DeleteNoteModal
          closeModal={() => setDeleteNoteModal(false)}
          isOpen={deleteNoteModal}
          isLoading={isDeleteNoteLoading}
          deleteNote={handelCancel}
        />
      )}
    </>
  );
}

export default AddNoteModal;
