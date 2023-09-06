// ** external packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// ** components **
import Modal from 'components/Modal';
import TagModalSkeleton from '../skeletons/TagModalSkeleton';
import TagForm from './TagForm';

// ** types **
import { TagFormValueType } from '../types/tag.type';

// ** services **
import { useGetTagDetailById } from '../hooks/useTagService';

// ** schema **
import { tagSchema } from '../validation-schema/tags.schema';
import DiscardConfirmationModal from '../../../../../../components/Modal/DiscardConfirmationModal';
import _ from 'lodash';
import { agGridSelectedProps } from 'components/TableInfiniteScroll';
import { useAddTagMutation, useUpdateTagMutation } from 'redux/api/tagApi';

interface Props {
  isOpen: {
    add: boolean;
    delete: boolean;
    changeColor: boolean;
  };
  onAdd: () => void;
  closeModal: () => void;
  setTagInfo?: React.Dispatch<React.SetStateAction<agGridSelectedProps>>;
  id: number | undefined;
}

function AddTagModal(props: Props) {
  const { onAdd, isOpen, closeModal, id, setTagInfo } = props;
  // ** hooks **
  const {
    formState: { errors, defaultValues },
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<TagFormValueType>({
    resolver: yupResolver(tagSchema),
    defaultValues: { color: '#1776BA' },
  });

  // ** States **
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);

  // ** APIS **
  const [addTag, { isLoading: addLoading }] = useAddTagMutation();
  const [updateTagById, { isLoading: updateLoading }] = useUpdateTagMutation();

  // ** custom hooks **
  const { getTagDetailById, isLoading } = useGetTagDetailById({ reset });

  useEffect(() => {
    if (id) {
      getTagDetailById(id);
    }
  }, [id]);

  const onSubmit = handleSubmit(async (formVal: TagFormValueType) => {
    const dataObj = { color: formVal?.color, name: formVal?.name.trim() };
    if (id) {
      const data = await updateTagById({ id, data: { ...dataObj } });
      if ('data' in data && data.data) {
        if (setTagInfo) setTagInfo([]);
        closeModal();
        onAdd();
      }
    } else {
      const data = await addTag({ data: { ...dataObj } });
      if ('data' in data && data.data) {
        closeModal();
        onAdd();
      }
    }
  });

  const onCancelForm = () => {
    const isDirtyFields = _.isEqual(defaultValues, getValues());
    if (!isDirtyFields) {
      setOpenDiscardModal(true);
    } else {
      close();
    }
  };
  const close = () => {
    reset();
    closeModal();
  };

  return (
    <>
      <Modal
        title={`${id ? 'Update' : 'Add'} Tag`}
        visible={isOpen.add || isOpen.changeColor}
        onClose={() => (id ? onCancelForm() : close())}
        onCancel={() => (id ? onCancelForm() : close())}
        onSubmit={onSubmit}
        submitButtonText={id ? 'Update' : 'Add'}
        submitLoading={updateLoading || addLoading}
      >
        {isLoading ? (
          <TagModalSkeleton />
        ) : (
          <form onSubmit={(e) => e.preventDefault()}>
            <TagForm
              setValue={setValue}
              watch={watch}
              register={register}
              errors={errors}
              onlyChangeColor={isOpen.changeColor}
            />
          </form>
        )}
      </Modal>
      {openDiscardModal ? (
        <DiscardConfirmationModal
          discardActivity={close}
          isOpen={openDiscardModal}
          closeModal={() => setOpenDiscardModal(false)}
        />
      ) : null}
    </>
  );
}

export default AddTagModal;
