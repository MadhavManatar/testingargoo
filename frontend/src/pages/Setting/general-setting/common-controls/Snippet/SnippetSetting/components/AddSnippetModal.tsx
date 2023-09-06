// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

// ** Components **
import Modal from 'components/Modal';
import DiscardConfirmationModal from 'components/Modal/DiscardConfirmationModal';
import SnippetFormSkeleton from '../skeletons/SnippetFormSkeleton';
import SnippetForm from './SnippetForm';

// ** Redux **
import {
  useAddSnippetSettingMutation,
  useLazyGetSnippetSettingByIdQuery,
  useUpdateSnippetSettingMutation,
} from 'redux/api/snippetSettingApi';

// ** Schema **
import { AddSnippetTypeSchema } from '../validation-schema/Snippet.schema';

// ** Types **
import {
  ACCESSIBILITY_TYPE,
  AddSnippetFieldType,
  AddSnippetModalPropsTypes,
  SnippetResponseType,
} from '../types/snippetText.types';

// ** Helper **
import { filterCategoryData } from '../helper/snippet.helper';

const AddSnippetModal = (props: AddSnippetModalPropsTypes) => {
  const { closeModal, isOpen, onAdd, id, defaultValue } = props;

  const [snippetInfo, setSnippetInfo] = useState<
    SnippetResponseType | undefined
  >();

  // ** hooks **//

  const formMethods = useForm<AddSnippetFieldType>({
    resolver: yupResolver(AddSnippetTypeSchema),
    defaultValues: {
      type: defaultValue.type,
      accessibility: ACCESSIBILITY_TYPE.PUBLIC,
    },
  });

  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
    control,
    setValue,
  } = formMethods;

  const snippetData = useWatch({ control });

  // ** States **
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);

  // ** APIS **
  const [addSnippetAPI, { isLoading: addSnippetLoading }] =
    useAddSnippetSettingMutation();
  const [updateSnippetByIdAPI, { isLoading: updateSnippetLoading }] =
    useUpdateSnippetSettingMutation();
  const [getSnippetByIdAPI, { isLoading: getSnippetLoading }] =
    useLazyGetSnippetSettingByIdQuery();

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  useEffect(() => {
    if (id) {
      getSnippet(id);
    }
  }, [id]);

  const getSnippet = async (snippetId: number) => {
    const { data, error } = await getSnippetByIdAPI({ id: snippetId }, true);
    if (data && !error) {
      setSnippetInfo(data);
      reset({
        title: data?.title,
        type: data?.type || defaultValue.type,
        accessibility: data?.accessibility,
        category: data?.category_id,
        snippet_text: data?.snippet,
      });
    }
  };

  const onSubmit = handleSubmit(async (value: AddSnippetFieldType) => {
    const formObj = {
      ...value,
      category: filterCategoryData(snippetData?.category),
    };
    const data = await (id
      ? updateSnippetByIdAPI({ id, data: formObj })
      : addSnippetAPI({ data: formObj }));
    if ('data' in data && data.data) {
      close();
      onAdd?.();
    }
  });

  const onCancelForm = () => {
    const isDirtyFields = Object.values(dirtyFields);
    if (isDirtyFields.length) {
      setOpenDiscardModal(true);
    } else {
      close();
    }
  };
  const close = () => {
    reset();
    closeModal();
  };

  return isOpen ? (
    <Modal
      title={`${id ? 'Update' : 'New'} Snippet`}
      visible={isOpen}
      onClose={onCancelForm}
      onCancel={onCancelForm}
      onSubmit={onSubmit}
      submitButtonText={`${id ? 'Update' : 'Save'} Snippet`}
      submitLoading={updateSnippetLoading || addSnippetLoading}
      contentClass="add__pipeline__modal"
    >
      {getSnippetLoading ? (
        <SnippetFormSkeleton />
      ) : (
        <FormProvider {...formMethods}>
          <form>
            <SnippetForm
              snippetInfo={snippetInfo}
              errors={errors}
              register={register}
              control={control}
              setValue={setValue}
            />
          </form>
        </FormProvider>
      )}
      {openDiscardModal ? (
        <DiscardConfirmationModal
          discardActivity={close}
          isOpen={openDiscardModal}
          closeModal={() => setOpenDiscardModal(false)}
        />
      ) : null}
    </Modal>
  ) : (
    <></>
  );
};

export default AddSnippetModal;
