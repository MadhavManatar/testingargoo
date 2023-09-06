// ** external packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// ** components **
import Modal from 'components/Modal';
import TagForm from './AssignTagForm';
import AssignTagsList from './AssignTagsList';

// ** types **
import {
  AssignTagFormValueType,
  AssignTagModalProps,
} from './types/assignTags.type';

// **  schema **
import { assignTagSchema } from './validation-schema/assignTags.schema';
import { ToastMsg } from 'constant/toast.constants';

// ** constants **
import { setLoadTimeLines } from 'redux/slices/commonSlice';
import { useDispatch } from 'react-redux';
import { useRearrangeTagMutation } from 'redux/api/tagApi';

const AssignTagModal = (props: AssignTagModalProps) => {
  const {
    isOpen,
    closeModal,
    refreshTable,
    setAssignedTags,
    modelName,
    modelRecordId,
    assignedTags,
    editTagsPermission,
    deleteAssignedTag,
    getAssignedTags,
  } = props;

  const {
    control,
    setError,
    formState: { errors },
    reset,
  } = useForm<AssignTagFormValueType>({
    resolver: yupResolver(assignTagSchema),
    defaultValues: { tags: [] },
  });

  // APIS **
  const [rearrangeTag, { isLoading }] = useRearrangeTagMutation();
  const assignedTagIds = assignedTags?.list.length
    ? assignedTags?.list.map((val) => val.tag.id)
    : [];

  // ** Hooks
  const dispatch = useDispatch();

  // ** State
  const [disableSaveBtn, setDisableSaveBtn] = useState<boolean>(true);
  const [assignedTagsInitial] = useState(assignedTags);

  const [alreadyAssignID, setAlreadyAssignID] = useState<number[]>(
    assignedTagIds || []
  );

  useEffect(() => {
    if (isOpen) {
      if (getAssignedTags) getAssignedTags();
      reset();
    }
  }, [isOpen]);

  // On tag Model Submit
  const tagModelSubmit = async () => {
    if (refreshTable) {
      refreshTable();
    }
    if (modelRecordId) {
      const data = await rearrangeTag({
        id: modelRecordId,
        data: {
          newTags: assignedTags.list,
          modelName,
          message: ToastMsg.modal.assignTag.updateMsg,
        },
      });

      if ('error' in data) {
        setError('tags', {
          type: 'custom',
          message: data.error.message,
        });
      } else if (data.data) {
        closeModal();
      }
      dispatch(setLoadTimeLines({ timeline: true }));
    }
  };
  // Tag Custom Close Button
  const tagModelClose = () => {
    if (getAssignedTags) getAssignedTags();
    if (setAssignedTags) setAssignedTags(assignedTagsInitial);
    closeModal();
  };

  return (
    <Modal
      title="Tags"
      visible={isOpen}
      onClose={() => tagModelClose()}
      onCancel={() => tagModelClose()}
      tagModelSubmit={() => tagModelSubmit()}
      submitBtnDisabled={disableSaveBtn}
      submitLoading={isLoading}
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <TagForm
          errors={errors}
          control={control}
          assignedTagIds={assignedTagIds}
          assignedTags={assignedTags}
          setAssignedTags={setAssignedTags}
          setDisableSaveBtn={setDisableSaveBtn}
          reset={reset}
          modelRecordId={modelRecordId && modelRecordId}
          modelName={modelName}
          setError={setError}
          setAlreadyAssignID={setAlreadyAssignID}
          alreadyAssignID={alreadyAssignID}
        />
      </form>
      {assignedTags?.list.length ? (
        <AssignTagsList
          isFullList
          modelName={modelName}
          modelRecordId={modelRecordId}
          setAssignedTags={setAssignedTags}
          editTagsPermission={editTagsPermission}
          assignedTags={assignedTags}
          deleteAssignedTag={deleteAssignedTag}
          setDisableSaveBtn={setDisableSaveBtn}
          setAlreadyAssignID={setAlreadyAssignID}
        />
      ) : null}
    </Modal>
  );
};

export default AssignTagModal;
