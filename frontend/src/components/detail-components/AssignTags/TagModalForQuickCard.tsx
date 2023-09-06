/* eslint-disable no-underscore-dangle */
// ** Import Packages **
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

// ** Components **
import Modal from 'components/Modal';
import AssignTagForm from './AssignTagForm';
import AssignTagsList from './AssignTagsList';

// ** Redux **
import { setLoadTimeLines } from 'redux/slices/commonSlice';

// ** Types **
import { AssignTagsProps } from 'components/EntityDetails/types';
import {
  AssignTagFormValueType,
  TagModalForQuickCardPropsType,
  tag,
} from './types/assignTags.type';

// ** Constant **
import { ToastMsg } from 'constant/toast.constants';
import {
  useAssignTagMutation,
  useLazyGetAssignedTagByModelRecordIdQuery,
  useRearrangeTagMutation,
} from 'redux/api/tagApi';

const TagModalForQuickCard = (props: TagModalForQuickCardPropsType) => {
  const { modelName, modelRecordId, closeModal, isOpen, editTagsPermission } =
    props;

  const {
    control,
    setError,
    formState: { errors },
    reset,
  } = useForm<AssignTagFormValueType>({
    defaultValues: { tags: [] },
  });

  // ** Store **
  const dispatch = useDispatch();

  // ** States **
  const [assignedTags, setAssignedTags] = useState<AssignTagsProps>({
    list: [],
    total: 0,
  });

  const assignedTagIds = assignedTags?.list.length
    ? assignedTags?.list.map((val) => val.tag.id)
    : [];

  // ** APIS **
  const [getAssignedTagByModelRecordId, { isLoading: assignedTagLoading }] =
    useLazyGetAssignedTagByModelRecordIdQuery();
  const [assignTag, { isLoading }] = useAssignTagMutation();
  const [disableSaveBtn, setDisableSaveBtn] = useState<boolean>(true);
  const [alreadyAssignID, setAlreadyAssignID] = useState<number[]>(
    assignedTagIds || []
  );
  const [rearrangeTag, { isLoading: reArrangeTagLoading }] =
    useRearrangeTagMutation();

  const getAssignedTags = async () => {
    const { data, error } = await getAssignedTagByModelRecordId(
      {
        modelName,
        id: modelRecordId,
        params: { select: 'tag', 'q[model_name]': modelName },
      },
      true
    );
    if (data && !error) {
      const alreadyAssigned = (data?.rows || []).map(
        (item: { tag_id: number }) => {
          return item?.tag_id;
        }
      );
      setAlreadyAssignID(alreadyAssigned);
      setAssignedTags({
        list: data.rows,
        total: data?.total,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      getAssignedTags();
      reset();
    }
  }, [isOpen]);

  // On tag Model Submit

  const tagModelSubmit = async () => {
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
      } else if ('data' in data && data.data) {
        if (getAssignedTags) getAssignedTags();
        closeModal();
      }
      dispatch(setLoadTimeLines({ timeline: true }));
    }
  };

  const deleteAssignedTag = async (deletedId: number, tagDetail?: tag) => {
    const filteredArray = assignedTags.list.filter((obj) => {
      return obj.tag.id !== tagDetail?.id && obj.tag.name !== tagDetail?.name;
    });
    setAssignedTags({ list: filteredArray, total: filteredArray.length });
    const data = await assignTag({
      id: modelRecordId,
      data: {
        modelName,
        tags: { deletedTagIds: [deletedId] },
        message: ToastMsg.common.deleteTag,
      },
    });
    if (data) {
      dispatch(setLoadTimeLines({ timeline: true }));
    } else {
      getAssignedTags();
    }
  };

  return (
    <Modal
      title="Tags"
      visible={isOpen}
      onClose={() => closeModal()}
      onCancel={() => closeModal()}
      // onSubmit={onSubmit}
      submitLoading={isLoading || reArrangeTagLoading}
      submitBtnDisabled={disableSaveBtn}
      tagModelSubmit={tagModelSubmit}
    >
      {assignedTagLoading ? (
        <div className="w-full">
          <div className="mb-[30px] sm:mb-[25px]">
            <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={(e) => e.preventDefault()}>
            <AssignTagForm
              errors={errors}
              control={control}
              assignedTagIds={assignedTagIds}
              assignedTags={assignedTags}
              setAssignedTags={setAssignedTags}
              setDisableSaveBtn={setDisableSaveBtn}
              reset={reset}
              modelRecordId={modelRecordId}
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
        </>
      )}
    </Modal>
  );
};

export default TagModalForQuickCard;
