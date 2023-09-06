// ** import packages **
import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// ** Components **
import Modal from 'components/Modal';
import DiscardConfirmationModal from 'components/Modal/DiscardConfirmationModal';
import LeadStatusFormSkeleton from '../skeletons/LeadStatusFormSkeleton';
import LeadStatusForm from './LeadStatusForm';

// ** API **
import { useLazyGetDealLostReasonByIdQuery } from 'redux/api/dealLostReasonApi';
import { useAddLeadStatusMutation, useUpdateLeadStatusMutation } from 'redux/api/leadStatusApi';

// ** types **
import {
  AddLeadStatusModalPropsType,
  LeadStatusFieldType,
} from '../types/lead-status.types';

// ** services **
import {
  EntityAttributesEnum,
} from 'redux/api/entityAttributesApi';

// ** Schema **
import { leadStatusSchema } from '../validation-schema/leadStatus.schema';

// ** Constant **
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';

const AddLeadStatusModal = (props: AddLeadStatusModalPropsType) => {
  const { closeModal, isOpen, onAdd, id, changeColor, setLeadStatus } = props;

  // ** States **
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);

  // ** APIS **
  const [getDealLostResonByIdApi, { isLoading }] =
    useLazyGetDealLostReasonByIdQuery();
  const [addLeadStatusApi, { isLoading: addLeadLoading }] =
    useAddLeadStatusMutation();
  const [updateLeadStatusApi, { isLoading: updateIsLoading }] =
    useUpdateLeadStatusMutation();

  const formMethods = useForm<LeadStatusFieldType>({
    resolver: yupResolver(leadStatusSchema),
    defaultValues: { color: '#1776BA' },
  });

  const {
    register,
    formState: { errors, defaultValues },
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
  } = formMethods;
  const getDealLostReason = async (reasonId: number) => {
    const { data, error } = await getDealLostResonByIdApi({ id: reasonId });
    if (data && !error) {
      reset({
        name: data?.name,
        color: data?.color,
      });
    }
  };

  useEffect(() => {
    if (id) {
      getDealLostReason(id);
    }
  }, [id]);

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  const onSubmit = handleSubmit(async (value) => {
    if (id) {
      updateLeadStatus(id, value);
    } else {
      addLeadStatus({ ...value });
    }
  });

  const addLeadStatus = async (formVal: LeadStatusFieldType) => {
    const data = await addLeadStatusApi({
      data: {
        name: formVal.name,
        color: formVal.color,
        type: EntityAttributesEnum.LEAD_STATUS,
        toastMsg: ToastMsg.settings.moduleSettings.lead.status.createMsg,
      },
      params: { ...MODULE_PERMISSION.LEAD.create },
    });
    if (data) {
      if (setLeadStatus) setLeadStatus([]);
      close();
      onAdd();
    }
  };

  const updateLeadStatus = async (
    statusId: number,
    formVal: LeadStatusFieldType
  ) => {
    const data = await updateLeadStatusApi({
      id: statusId,
      data: {
        name: formVal.name,
        color: formVal.color,
        type: EntityAttributesEnum.LEAD_STATUS,
        toastMsg: ToastMsg.settings.moduleSettings.lead.status.updateMsg,
      },
      params: { ...MODULE_PERMISSION.LEAD.update },
    });
    if (data) {
      if (setLeadStatus) setLeadStatus([]);
      close();
      if (onAdd) {
        onAdd();
      }
    }
  };

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

  return isOpen ? (
    <Modal
      title={`${id ? 'Update' : 'Add'} Lead Status`}
      visible={isOpen}
      onClose={() => (id ? onCancelForm() : close())}
      onCancel={() => (id ? onCancelForm() : close())}
      onSubmit={onSubmit}
      submitButtonText={id ? 'Update' : 'Add'}
      submitLoading={id ? updateIsLoading : addLeadLoading}
    >
      {isLoading ? (
        <LeadStatusFormSkeleton />
      ) : (
        <form onSubmit={onSubmit}>
          <LeadStatusForm
            errors={errors}
            register={register}
            setValue={setValue}
            watch={watch}
            onlyChangeColor={changeColor}
          />
        </form>
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

export default AddLeadStatusModal;
