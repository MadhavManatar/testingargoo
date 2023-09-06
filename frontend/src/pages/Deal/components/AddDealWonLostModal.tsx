// ** external packages **
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// ** redux **
// import store from 'redux/store';
import { setLoadTimeLines } from 'redux/slices/commonSlice';
import { useDispatch } from 'react-redux';

// ** components **
import Modal from 'components/Modal';
import DealWonLostForm from './DealWonLostForm';
import AddDealLostModal from './detail/AddDealLostModal';

// ** services **

// ** types **
import { FormFieldProps } from 'components/FormField/types/formField.types';
import {
  AddDealWonLostFormFieldsType,
  DealWonLostFieldType,
} from '../types/deals.types';
import { entityDataType } from 'pages/Activity/types/activity.types';

// ** others **
import { dealWonLostSchema } from '../validation-schema/deal.schema';
import { useUpdateDealStageMutation } from 'redux/api/dealStageHistoryApi';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  dealWonLostData: { entityData?: entityDataType; stageType: string };
  displayField?: DealWonLostFieldType;
  displayFieldProps?: {
    [key in keyof AddDealWonLostFormFieldsType]?: {
      [formKey in keyof FormFieldProps<AddDealWonLostFormFieldsType>]?: any;
    };
  };
  onAdd?: () => void;
}
const AddDealWonLostModal = (props: Props) => {
  const {
    closeModal,
    isOpen,
    displayField,
    displayFieldProps,
    dealWonLostData,
    onAdd,
  } = props;

  // ** states **
  const [openLostReasonModal, setOpenLostReasonModal] = useState(false);
  const [currentStageId, setCurrentStageId] = useState<number>();

  // ** Hooks **
  // const { auth } = store.getState();
  // const { user } = auth;
  const dispatch = useDispatch();

  // ** services **
  const [updateDealStageAPI, { isLoading }] = useUpdateDealStageMutation();

  // ** Custom hooks **
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
    watch,
    getValues,
    setValue,
  } = useForm<AddDealWonLostFormFieldsType>({
    resolver: yupResolver(dealWonLostSchema),
  });

  // ** functions **
  const onSubmit = handleSubmit(async (value) => {
    if (value.stage_type === 'Win') {
      await updateDealStage(value.stage_id as string).then(() => {
        close();
      });
    } else if (value.stage_type === 'Lost') {
      setCurrentStageId(Number(value.stage_id));
      setOpenLostReasonModal(true);
    }
  });

  const updateDealStage = async (stage_id: string) => {
    const DealFormData = new FormData();
    DealFormData.append('stage_id', stage_id);
    DealFormData.append('is_deal', 'true');
    DealFormData.append(
      'deal_id',
      (dealWonLostData?.entityData?.id &&
        dealWonLostData?.entityData?.id.toString()) ||
        ''
    );
    const data = await updateDealStageAPI({ data: DealFormData });
    if (data) {
      onAdd?.();
      dispatch(setLoadTimeLines({ timeline: true }));
    }
  };

  const close = () => {
    reset();
    closeModal();
  };

  const closeDealLostModal = () => {
    setOpenLostReasonModal(false);
    reset();
    closeModal();
  };

  return (
    <>
      {isOpen ? (
        <Modal
          modalWrapperClass="deal__stage__modal"
          title="Set Deal Stage"
          visible={isOpen}
          onClose={() => close()}
          onCancel={() => close()}
          onSubmit={onSubmit}
          submitLoading={isLoading}
          width="476px"
          submitButtonText="Change"
        >
          <form onSubmit={onSubmit}>
            <DealWonLostForm
              control={control}
              errors={errors}
              reset={reset}
              register={register}
              getValues={getValues}
              watch={watch}
              setValue={setValue}
              displayField={displayField}
              displayFieldProps={displayFieldProps}
              dealWonLostData={dealWonLostData}
            />
          </form>
        </Modal>
      ) : (
        <></>
      )}
      {openLostReasonModal ? (
        <>
          <AddDealLostModal
            isOpen={openLostReasonModal}
            closeModal={closeDealLostModal}
            id={
              dealWonLostData.entityData?.id
                ? Number(dealWonLostData.entityData?.id)
                : 0
            }
            stageId={currentStageId}
            onAdd={onAdd}
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default AddDealWonLostModal;
