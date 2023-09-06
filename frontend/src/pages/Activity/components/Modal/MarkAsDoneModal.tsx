// ** import packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// ** components **
import Modal from 'components/Modal';
import MarkAsDoneForm from '../Form/MarkAsDoneForm';

// ** Schema **
import { markAsDoneActivitySchema } from '../../validation-schema/activity.schema';

// ** Type **
import { MarkAsDoneFormFields } from '../../types/activity.types';
import {
  useLazyGetActivityByIdQuery,
  useUpdateActivityMutation,
} from 'redux/api/activityApi';

// ** Helper **
import { getDefaultActivityResult } from 'pages/Setting/module-setting/Activity/ActivityType/helper/activityType.helper';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  onAdd?: (data?: any) => void;
  activityId?: number;
  activityTypeId?: number;
  saveAndDoneApiCall?: (
    saveDoneFormValues: MarkAsDoneFormFields
  ) => Promise<void>;
  setOpenCompleteModal?: Dispatch<SetStateAction<boolean>>;
  isSubmitLoading?: boolean;
}

const MarkAsDoneModal = (props: Props) => {
  const {
    closeModal,
    isOpen,
    onAdd,
    activityId,
    activityTypeId,
    saveAndDoneApiCall,
    setOpenCompleteModal,
    isSubmitLoading,
  } = props;

  // ** states ** //
  const [defaultResult, setDefaultResult] = useState<{
    id: number;
    result: string;
  }>({ id: 0, result: '' });

  const [activityResultName, setActivityResultName] = useState<string>();

  // ** APIS **
  const [getActivityByIdAPI, { isLoading: isGetActivityLoading }] =
    useLazyGetActivityByIdQuery();

  // ** Custom hooks ** //
  const {
    formState: { errors },
    control,
    reset,
    watch,
    handleSubmit,
    setValue,
  } = useForm<MarkAsDoneFormFields>({
    resolver: yupResolver(markAsDoneActivitySchema),
    defaultValues: { result: defaultResult?.id?.toString() || '' },
  });

  // ** APIS **
  const [updateActivityByIdAPI, { isLoading }] = useUpdateActivityMutation();

  useEffect(() => {
    if (activityId) {
      getActivity(activityId);
    }
  }, [activityId]);

  const getActivity = async (id: number) => {
    const { data, error } = await getActivityByIdAPI({
      id,
      data: {
        query: {
          'include[activity_type][include][types_results][include][activity_result][select]':
            'id,result',
        },
      },
    });
    if (data && !error) {
      const activityResult = getDefaultActivityResult(data.activity_type);
      setDefaultResult(activityResult);
      setValue('result', activityResult?.id?.toString() || '');
    }
  };

  const onSubmit = handleSubmit(async (formValue: MarkAsDoneFormFields) => {
    if (saveAndDoneApiCall) {
      saveAndDoneApiCall(formValue);
    } else if (activityId) {
      const data = await updateActivityByIdAPI({
        id: activityId,
        data: {
          completed: true,
          result: activityResultName || 'other',
          memo: formValue.memo,
        },
      });
      if ('data' in data) {
        close();
        onAdd?.(data.data);
      }
    }
  });

  const close = () => {
    reset();
    closeModal();
  };

  const closeCompleteModal = () => {
    if (saveAndDoneApiCall && setOpenCompleteModal) {
      setOpenCompleteModal(false);
    } else {
      close();
    }
  };

  return isOpen ? (
    <Modal
      title="Mark As Done"
      visible={isOpen}
      onClose={() => closeCompleteModal()}
      onCancel={() => closeCompleteModal()}
      onSubmit={onSubmit}
      submitButtonText="Mark as Done"
      submitLoading={isLoading || isSubmitLoading}
      modalWrapperClass="mark__as__done__modal"
    >
      <form onSubmit={onSubmit}>
        <MarkAsDoneForm
          control={control}
          errors={errors}
          watch={watch}
          setActivityResultName={setActivityResultName}
          setValue={setValue}
          activityTypeId={activityTypeId}
          defaultResult={defaultResult}
          isGetActivityLoading={isGetActivityLoading}
        />
      </form>
    </Modal>
  ) : (
    <></>
  );
};

export default MarkAsDoneModal;
