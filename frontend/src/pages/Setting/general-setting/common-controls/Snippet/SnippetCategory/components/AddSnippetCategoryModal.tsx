// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

// ** Components **
import FormField from 'components/FormField';
import Modal from 'components/Modal';
import DiscardConfirmationModal from 'components/Modal/DiscardConfirmationModal';
import SnippetCategoryFormSkeleton from '../skeletons/SnippetCategoryFormSkeleton';

// ** Types **
import {
  AddSnippetCategoryFieldType,
  AddSnippetCategoryModalPropsTypes,
} from '../types/snippetCategory.types';

// ** Schema **
import { AddSnippetCategoryTypeSchema } from '../validation-schema/SnippetCategory.schema';
import {
  useAddSnippetCategoryMutation,
  useLazyGetSnippetCategoryByIdQuery,
  useUpdateSnippetCategoryMutation,
} from 'redux/api/snippetCategoryApi';

const AddSnippetCategoryModal = (props: AddSnippetCategoryModalPropsTypes) => {
  const { closeModal, isOpen, onAdd, id } = props;

  const formMethods = useForm<AddSnippetCategoryFieldType>({
    resolver: yupResolver(AddSnippetCategoryTypeSchema),
  });

  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
    control,
  } = formMethods;

  // ** States **
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);

  // ** APIS **
  const [addSnippetCategoryAPI, { isLoading: addSnippetLoading }] =
    useAddSnippetCategoryMutation();
  const [updateSnippetCategoryByIdAPI, { isLoading: updateSnippetLoading }] =
    useUpdateSnippetCategoryMutation();
  const [getSnippetCategoryByIdAPI, { isLoading: getSnippetLoading }] =
    useLazyGetSnippetCategoryByIdQuery();

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

  const getSnippet = async (snippetCategoryId: number) => {
    const { data, error } = await getSnippetCategoryByIdAPI({
      id: snippetCategoryId,
    });
    if (data && !error) {
      reset({ name: data?.name });
    }
  };

  const onSubmit = handleSubmit(async (value: AddSnippetCategoryFieldType) => {
    const data = await (id
      ? updateSnippetCategoryByIdAPI({ id, data: value })
      : addSnippetCategoryAPI({ data: value }));
    if ('data' in data) {
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
      title={`${id ? 'Update' : 'New'} Snippet Category`}
      visible={isOpen}
      onClose={onCancelForm}
      onCancel={onCancelForm}
      onSubmit={onSubmit}
      submitButtonText={`${id ? 'Update' : 'Save'} Category`}
      submitLoading={updateSnippetLoading || addSnippetLoading}
      contentClass="add__pipeline__modal"
    >
      {getSnippetLoading ? (
        <SnippetCategoryFormSkeleton />
      ) : (
        <FormProvider {...formMethods}>
          <form onSubmit={(e) => e.preventDefault()}>
            <FormField<AddSnippetCategoryFieldType>
              required
              type="text"
              label="Name"
              name="name"
              fieldLimit={25}
              control={control}
              register={register}
              error={errors?.name}
              labelClass="if__label__blue"
              placeholder="Enter Category Name"
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

export default AddSnippetCategoryModal;
