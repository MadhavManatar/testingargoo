// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

// ** Redux **
import { setDealQuickAdd } from 'redux/slices/commonSlice';

// ** Components **
import Modal from 'components/Modal';
import DiscardConfirmationModal from '../../../../../../components/Modal/DiscardConfirmationModal';
import LostReasonFormSkeleton from '../skeletons/LostReasonFormSkeleton';
import DealLostReasonForm from './LostReasonForm';

// ** Service **
import {
  EntityAttributesEnum,
} from 'redux/api/entityAttributesApi';

// ** Schema **
import { lostReasonSchema } from '../validation-schema/lostReason.schema';

// ** Types **
import {
  AddDealLostReasonFormFieldsType,
  AddLostReasonModalPropsType,
} from '../types/lostReason.types';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { MODULE_PERMISSION } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';
import { useAddDealLostReasonMutation, useLazyGetDealLostReasonByIdQuery, useUpdateDealLostReasonMutation } from 'redux/api/dealLostReasonApi';

const AddLostReasonModal = (props: AddLostReasonModalPropsType) => {
  const {
    closeModal,
    isOpen,
    onAdd,
    displayField,
    isQuickModal = false,
    setDealLostInfo,
    id,
  } = props;

  // ** APIS **
  const [getDealLostReasonByIdApi, { isLoading: getLostReasonLoading }] =
    useLazyGetDealLostReasonByIdQuery();
  const [addDealLostReasonApi, { isLoading }] = useAddDealLostReasonMutation();
  const [updateDealLostReasonApi, { isLoading: isUpdateLoading }] =
    useUpdateDealLostReasonMutation();

  // ** states **
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);
  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
    control,
    setValue,
  } = useForm<AddDealLostReasonFormFieldsType>({
    resolver: yupResolver(lostReasonSchema),
  });
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  useEffect(() => {
    if (id) {
      getDealLostReason(id);
    }
  }, [id]);

  const getDealLostReason = async (reasonId: number) => {
    const { data, error } = await getDealLostReasonByIdApi({ id: reasonId });
    if (data && !error) {
      reset({
        reason: data?.name,
      });
    }
  };
  const onSubmit = handleSubmit(async (value) => {
    if (id) {
      updateDealLostReason(id, value);
    } else {
      addDealLostReason(value);
    }
  });

  const addDealLostReason = async (
    formVal: AddDealLostReasonFormFieldsType
  ) => {
    const data = await addDealLostReasonApi({
      data: {
        name: formVal.reason,
        type: EntityAttributesEnum.DEAL_LOST_REASON,
        toastMsg: ToastMsg.settings.moduleSettings.deal.lostReason.createMsg,
      },
      params: { ...MODULE_PERMISSION.DEAL.create },
    });

    if (data) {
      if (
        isQuickModal &&
        pathname ===
        PRIVATE_NAVIGATION.settings.moduleSetting.deal.lostReason.view
      ) {
        dispatch(setDealQuickAdd({ deal: true }));
      }
      if (setDealLostInfo) setDealLostInfo([]);
      close();
      if (onAdd) {
        onAdd();
      }
    }
  };

  const updateDealLostReason = async (
    reasonId: number,
    formVal: AddDealLostReasonFormFieldsType
  ) => {
    const data = await updateDealLostReasonApi({
      id: reasonId,
      data: {
        name: formVal.reason,
        type: EntityAttributesEnum.DEAL_LOST_REASON,
        toastMsg: ToastMsg.settings.moduleSettings.deal.lostReason.updateMsg,
      },
      params: { ...MODULE_PERMISSION.DEAL.update },
    });

    if (data) {
      if (
        isQuickModal &&
        pathname ===
        PRIVATE_NAVIGATION.settings.moduleSetting.deal.lostReason.view
      ) {
        dispatch(setDealQuickAdd({ deal: true }));
      }
      close();
      if (setDealLostInfo) setDealLostInfo([]);
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
      title={id ? `Edit Lost Reason` : `Create Lost Reason`}
      visible={isOpen}
      onClose={onCancelForm}
      onCancel={onCancelForm}
      onSubmit={onSubmit}
      submitLoading={id ? isUpdateLoading : isLoading}
      submitButtonText={id ? `Update` : `Create`}
    >
      {getLostReasonLoading ? (
        <LostReasonFormSkeleton />
      ) : (
        <form onSubmit={onSubmit}>
          <DealLostReasonForm
            errors={errors}
            register={register}
            displayField={displayField}
            control={control}
            reset={reset}
            setValue={setValue}
          />
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
  ) : (
    <></>
  );
};

export default AddLostReasonModal;
