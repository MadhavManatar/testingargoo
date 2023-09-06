// ** import packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

// ** modal **
import Modal from 'components/Modal';

// ** Types **
import { ActivityResultFieldType } from '../types/activity-result.types';

// ** others **
import ActivityResultFormSkeleton from '../skeletons/ActivityResultFormSkeleton';
import { activityResultsSchema } from '../validation-schema/activityResults.schema';
import ActivityResultForm from './ActivityResultForm';
import DiscardConfirmationModal from '../../../../../../components/Modal/DiscardConfirmationModal';
import { agGridSelectedProps } from 'components/TableInfiniteScroll';
import {
  useAddActivityResultMutation,
  useLazyGetActivityResultByIdQuery,
  useUpdateActivityResultMutation,
} from 'redux/api/activityResultApi';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  onAdd: () => void;
  id?: number | null;
  setActivityResultInfo?: React.Dispatch<
    React.SetStateAction<agGridSelectedProps>
  >;
}

interface ActivityType {
  middleTableId: number;
  activityTypeId: number;
  name: string;
}

const AddResultModal = (props: Props) => {
  const { closeModal, isOpen, onAdd, id, setActivityResultInfo } = props;

  // ** State **
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>();
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);
  const [universalResult, setUniversalResult] = useState<boolean>(false);

  // ** APIS **
  const [addActivityResultAPI, { isLoading: addResultLoading }] =
    useAddActivityResultMutation();
  const [updateActivityResultByIdAPI, { isLoading: updateResultIsLoading }] =
    useUpdateActivityResultMutation();

  // ** Custom hooks **
  const [getActivityResultByIdAPI, { isLoading }] =
    useLazyGetActivityResultByIdQuery();

  const formMethods = useForm<ActivityResultFieldType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(activityResultsSchema),
  });
  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
    control,
    clearErrors,
  } = formMethods;

  useEffect(() => {
    if (universalResult) {
      clearErrors('activity_types');
    }
  }, [universalResult]);

  const getActivityResult = async (resultId: number) => {
    const { data, error } = await getActivityResultByIdAPI(
      {
        id: resultId,
        params: {
          'include[types_results][include][activity_type]': 'all',
        },
      },
      true
    );

    if (data && !error) {
      const tempActivityType: ActivityType[] = data?.types_results.map(
        (obj: { id: number; activity_type: { name: string; id: number } }) => ({
          activityTypeId: obj.activity_type.id,
          name: obj.activity_type.name,
          middleTableId: obj.id,
        })
      );

      setActivityTypes(tempActivityType);
      setUniversalResult(data.is_universal);
      reset({
        activity_types: data?.types_results?.map(
          (obj: { activity_type_id: number }) => obj?.activity_type_id
        ),
        result: data?.result,
        isMemo: data?.isMemo,
        is_universal: data?.is_universal,
      });
    }
  };

  useEffect(() => {
    if (id) {
      getActivityResult(id);
    }
  }, [id]);

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  const onSubmit = handleSubmit(async (value) => {
    if (value.is_universal === null) {
      value.is_universal = false;
    }
    if (setActivityResultInfo) setActivityResultInfo([]);
    if (id) {
      updateActivityResult(id, value);
    } else {
      addActivityResult({ ...value });
    }
  });

  const addActivityResult = async (formVal: ActivityResultFieldType) => {
    const data = await addActivityResultAPI({ data: formVal });
    if ('data' in data && data.data) {
      close();
      onAdd();
    }
  };

  const updateActivityResult = async (
    resultId: number,
    formVal: ActivityResultFieldType
  ) => {
    const selectedActivityTypes = formVal.activity_types;

    const removed_activity_middle_table_ids = activityTypes
      ?.filter((obj) => !selectedActivityTypes.includes(obj.activityTypeId))
      .map((obj) => obj.middleTableId);
    const new_activity_types = selectedActivityTypes.filter(
      (selectedTypeId) =>
        !activityTypes?.find((obj) => obj.activityTypeId === selectedTypeId)
    );

    const data = await updateActivityResultByIdAPI({
      id: resultId,
      data: {
        result: formVal.result,
        removed_activity_middle_table_ids,
        new_activity_types,
        isMemo: formVal.isMemo,
        is_universal: formVal.is_universal,
      },
    });

    if ('data' in data && data.data) {
      close();
      if (onAdd) {
        onAdd();
      }
    }
  };
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
      title={`${id ? 'Update' : 'Add'} Activity Result`}
      visible={isOpen}
      onClose={onCancelForm}
      onCancel={onCancelForm}
      onSubmit={onSubmit}
      submitLoading={id ? updateResultIsLoading : addResultLoading}
      submitButtonText={id ? 'Update' : 'Add'}
    >
      {isLoading ? (
        <ActivityResultFormSkeleton />
      ) : (
        <FormProvider {...formMethods}>
          <form onSubmit={onSubmit}>
            <ActivityResultForm
              errors={errors}
              register={register}
              control={control}
              activityTypes={activityTypes}
              universalResult={universalResult}
              setUniversalResult={setUniversalResult}
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

export default AddResultModal;
