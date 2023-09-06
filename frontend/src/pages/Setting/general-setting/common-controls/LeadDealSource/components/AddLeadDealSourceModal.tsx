// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// ** Components **
import Modal from 'components/Modal';
import DiscardConfirmationModal from 'components/Modal/DiscardConfirmationModal';
import LeadDealSourceFormSkeleton from '../skeletons/LeadDealSourceFormSkeleton';
import LeadDealSourceForm from './LeadDealSourceForm';

// ** API **
import { useLazyGetDealLostReasonByIdQuery } from 'redux/api/dealLostReasonApi';
import { useAddLeadDealSourceMutation, useUpdateLeadDealSourceMutation } from 'redux/api/leadDealSourceApi';

// ** types **
import {
  AddLeadDealSourceModalPropsType,
  LeadDealSourceFieldType,
} from '../types/lead-deal-source.types';

// ** services **
import {
  EntityAttributesEnum,
} from 'redux/api/entityAttributesApi';

// ** Constants **
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';

// ** Schema **
import { leadDealSourceSchema } from '../validation-schema/leadDealSource.schema';

const AddLeadDealSourceModal = (props: AddLeadDealSourceModalPropsType) => {
  const { closeModal, isOpen, onAdd, id, setSourceInfo } = props;
  // ** states **
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);

  // ** APIS **
  const [addLeadDealSourceAPI, { isLoading: addLeadLoading }] =
    useAddLeadDealSourceMutation();

  // ** API **
  const [getDealLostReasonByIdApi, { isLoading }] =
    useLazyGetDealLostReasonByIdQuery();
  const [updateLeadDealSourceApi, { isLoading: updateIsLoading }] =
    useUpdateLeadDealSourceMutation();

  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
  } = useForm<LeadDealSourceFieldType>({
    resolver: yupResolver(leadDealSourceSchema),
  });

  const getDealLostReason = async (reasonId: number) => {
    const { data, error } = await getDealLostReasonByIdApi({ id: reasonId });

    if (data && !error) {
      reset({ name: data?.name });
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
      updateLeadDealSource(id, value);
    } else {
      addLeadDealSource({ ...value });
    }
  });

  const addLeadDealSource = async (formVal: LeadDealSourceFieldType) => {
    const data = await addLeadDealSourceAPI({
      data: {
        name: formVal.name,
        type: EntityAttributesEnum.LEAD_DEAL_SOURCE,
        toastMsg:
          ToastMsg.settings.generalSettings.commonControls.leadDealSource
            .createMsg,
      },
      params: { ...MODULE_PERMISSION.LEAD.create },
    });

    if (data) {
      if (setSourceInfo) setSourceInfo([]);
      close();
      onAdd();
    }
  };

  const updateLeadDealSource = async (
    statusId: number,
    formVal: LeadDealSourceFieldType
  ) => {
    const data = await updateLeadDealSourceApi({
      id: statusId,
      data: {
        name: formVal.name,
        type: EntityAttributesEnum.LEAD_DEAL_SOURCE,
        toastMsg:
          ToastMsg.settings.generalSettings.commonControls.leadDealSource
            .updateMsg,
      },
      params: { ...MODULE_PERMISSION.LEAD.update },
    });

    if (data) {
      if (setSourceInfo) setSourceInfo([]);
      close();
      if (onAdd) {
        onAdd();
      }
    }
  };

  const onCancelForm = () => {
    const isDirtyFields = Object.values(dirtyFields);
    if (isDirtyFields.length && id) {
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
      title={`${id ? 'Update' : 'Add'} Source`}
      visible={isOpen}
      onClose={onCancelForm}
      onCancel={onCancelForm}
      onSubmit={onSubmit}
      submitButtonText={id ? 'Update' : 'Add'}
      submitLoading={id ? updateIsLoading : addLeadLoading}
    >
      {isLoading ? (
        <LeadDealSourceFormSkeleton />
      ) : (
        <form onSubmit={onSubmit}>
          <LeadDealSourceForm errors={errors} register={register} />
        </form>
      )}
      {openDiscardModal && id ? (
        <DiscardConfirmationModal
          discardActivity={close}
          isOpen={openDiscardModal}
          closeModal={() => setOpenDiscardModal(false)}
        />
      ) : null}
    </Modal>
  ) : null;
};

export default AddLeadDealSourceModal;
