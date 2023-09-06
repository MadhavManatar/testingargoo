// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// ** Components **
import Modal from 'components/Modal';
import DiscardConfirmationModal from 'components/Modal/DiscardConfirmationModal';
import LeadStatusFormSkeleton from '../skeletons/LeadTemperatureStatusFormSkeleton';
import LeadStatusForm from './LeadTemperatureStatusForm';

// ** Types **
import {
  AddLeadTemperaturePropsType,
  LeadStatusFieldType,
} from '../types/lead-temperature-status.types';

// ** Services **
import {
  EntityAttributesEnum,
} from 'redux/api/entityAttributesApi';

// ** Schema **
import { leadStatusSchema } from '../validation-schema/leadTemperatureStatus.schema';

// ** Constant **
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';
import { useAddLeadTempStatusMutation, useLazyGetLeadTempStatusByIdQuery, useUpdateLeadTempStatusMutation } from 'redux/api/leadTempStatusApi';

const AddLeadTemperatureStatusModal = (props: AddLeadTemperaturePropsType) => {
  const { closeModal, isOpen, onAdd, id, changeColor, setLeadTempInfo } = props;
  // ** states **
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);

  // ** APIS **
  const [getLeadTempStatusById, { isLoading }] =
    useLazyGetLeadTempStatusByIdQuery();
  const [addLeadTempStatusApi, { isLoading: addLeadLoading }] =
    useAddLeadTempStatusMutation();
  const [updateLeadTempStatusApi, { isLoading: isUpdateLoading }] =
    useUpdateLeadTempStatusMutation();

  const {
    register,
    formState: { errors, defaultValues },
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
  } = useForm<LeadStatusFieldType>({
    resolver: yupResolver(leadStatusSchema),
    defaultValues: { color: '#1776BA' },
  });

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

  const getDealLostReason = async (reasonId: number) => {
    const { data, error } = await getLeadTempStatusById({ id: reasonId });
    if (data && !error) {
      reset({
        name: data?.name,
        color: data?.color,
      });
    }
  };

  const onSubmit = handleSubmit(async (value) => {
    if (id) {
      updateLeadStatus(id, value);
    } else {
      addLeadStatus({ ...value });
    }
  });

  const addLeadStatus = async (formVal: LeadStatusFieldType) => {
    const data = await addLeadTempStatusApi({
      data: {
        name: formVal.name,
        color: formVal.color,
        type: EntityAttributesEnum.LEAD_TEMP_STATUS,
        toastMsg:
          ToastMsg.settings.moduleSettings.lead.leadTempStatus.createMsg,
      },
      params: { ...MODULE_PERMISSION.LEAD.create },
    });
    if (data) {
      if (setLeadTempInfo) setLeadTempInfo([]);
      close();
      onAdd();
    }
  };

  const updateLeadStatus = async (
    statusId: number,
    formVal: LeadStatusFieldType
  ) => {
    const data = await updateLeadTempStatusApi({
      id: statusId,
      data: {
        name: formVal.name,
        color: formVal.color,
        type: EntityAttributesEnum.LEAD_TEMP_STATUS,
        toastMsg:
          ToastMsg.settings.moduleSettings.lead.leadTempStatus.updateMsg,
      },
      params: { ...MODULE_PERMISSION.LEAD.update },
    });
    if (data) {
      if (setLeadTempInfo) setLeadTempInfo([]);
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
  const title = `${id ? 'Update' : 'Add'} Lead Temperature Status`;

  return isOpen ? (
    <Modal
      title={title}
      visible={isOpen}
      onClose={() => (id ? onCancelForm() : close())}
      onCancel={() => (id ? onCancelForm() : close())}
      onSubmit={onSubmit}
      submitButtonText={id ? 'Update' : 'Add'}
      submitLoading={id ? isUpdateLoading : addLeadLoading}
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

export default AddLeadTemperatureStatusModal;
