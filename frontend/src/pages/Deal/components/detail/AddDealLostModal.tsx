// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// ** Redux **
import { setDealQuickAdd, setLoadTimeLines } from 'redux/slices/commonSlice';

// ** Components **
import Modal from 'components/Modal';
import DealLostForm from './DealLostForm';

// ** Types **
import {
  AddDealFormFieldsType,
  AddDealLostFormFieldsType,
  DealLostFieldType,
} from 'pages/Deal/types/deals.types';

// ** Custom Hooks **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Schema **
import {
  dealLostSchema,
  dealLostWithMemoSchema,
} from 'pages/Deal/validation-schema/deal.schema';

// ** Constant **
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Other **
import generateDealFormData, {
  generateDealLostFormData,
} from 'pages/Deal/helper/deal.helper';
import { convertStringToBoolean, setUrlParams } from 'utils/util';
import { LeadDetailPageType } from 'pages/Lead/types/lead.type';
import { useLazyGetGeneralSettingQuery } from 'redux/api/generalSettingApi';
import { useUpdateDealStageMutation } from 'redux/api/dealStageHistoryApi';
import { useAddLeadMutation, useUpdateLeadMutation } from 'redux/api/leadApi';

interface Props {
  isQuickModal?: boolean;
  isOpen: boolean;
  onAdd?: () => void;
  closeModal: (data?: string) => void;
  displayField?: DealLostFieldType;
  id?: number | null;
  stageId?: number | null;
  isEditPage?: boolean;
  formData?: AddDealFormFieldsType;
  leadData?: LeadDetailPageType;
  setCustomIsDirty?: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddLostReasonModal = (props: Props) => {
  const {
    closeModal,
    isOpen,
    onAdd,
    setCustomIsDirty,
    displayField,
    isQuickModal = false,
    id,
    stageId,
    isEditPage,
    formData,
    leadData,
  } = props;

  // ** Hooks
  const { pathname } = useLocation();

  // ** Store
  const dispatch = useDispatch();
  const currentUser = useSelector(getCurrentUser);

  const navigate = useNavigate();
  // ** states **
  const [isMemoAllowed, setIsMemoAllowed] = useState(false);

  // ** APIS **
  const [getGeneralSetting] = useLazyGetGeneralSettingQuery();
  const [addLeadApi] = useAddLeadMutation();
  const [updateDealStageAPI] = useUpdateDealStageMutation();
  const [updateLeadByIdAPI, { isLoading }] = useUpdateLeadMutation();

  useEffect(() => {
    checkIfMemoAllowed();
  }, []);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
  } = useForm<AddDealLostFormFieldsType>({
    resolver: yupResolver(
      isMemoAllowed ? dealLostWithMemoSchema : dealLostSchema
    ),
  });

  const updateDeal = async (
    reasonId: number,
    formVal: AddDealLostFormFieldsType
  ) => {
    const dealLostReasonFormData = generateDealLostFormData(formVal);

    const data = await updateLeadByIdAPI({
      id: reasonId,
      data: dealLostReasonFormData,
      params: { toast: false },
    });

    if ('data' in data && !('error' in data)) {
      if (
        isQuickModal &&
        pathname ===
          PRIVATE_NAVIGATION.settings.moduleSetting.deal.lostReason.view
      ) {
        onAdd?.();
        dispatch(setDealQuickAdd({ deal: true }));
      }
      close('success');
      if (onAdd) {
        onAdd();
      }
    }
  };

  const updateDealStage = async (info: {
    stage_id: number;
    deal_id: number;
  }) => {
    const DealFormData = new FormData();
    DealFormData.append('stage_id', info?.stage_id?.toString());
    DealFormData.append('is_deal', 'true');
    DealFormData.append('deal_id', info.deal_id.toString());

    const data = await updateDealStageAPI({ data: DealFormData });
    if (data) {
      dispatch(setLoadTimeLines({ timeline: true }));
    }
  };

  const checkIfMemoAllowed = async () => {
    const { data, error } = await getGeneralSetting(
      {
        params: {
          'q[key]': 'is_memo_allowed_in_deal_lost',
          'q[model_name]': POLYMORPHIC_MODELS.USER,
          'q[model_record_id]': currentUser?.id,
          module: ModuleNames.DEAL,
        },
      },
      true
    );

    if (data && !error) {
      setIsMemoAllowed(convertStringToBoolean(data?.[0]?.value));
    }
  };

  const onSubmit = handleSubmit(async (value) => {
    if (setCustomIsDirty) setCustomIsDirty(false);
    let newId = id;
    const updatedDealValue = formData?.deal_value
      ?.match(/(\d+)(\.\d+)?/g)
      ?.join('');
    const updatedProbability = formData?.probability
      ?.match(/(\d+)(\.\d+)?/g)
      ?.join('');
    if (!id) {
      const DealFormData = generateDealFormData({
        ...formData,
        deal_value: updatedDealValue,
        probability: updatedProbability,
      });

      const data = await addLeadApi({
        data: DealFormData,
        params: { toast: false },
      });

      if ('data' in data && !('error' in data)) {
        newId = data?.data?.id;
      }
    } else {
      const LeadFormData = generateDealFormData(
        {
          ...formData,
          deal_value: updatedDealValue || '',
          probability: updatedProbability,
        },
        'edit',
        leadData?.lead.related_contacts
      );
      LeadFormData.append('is_converted', 'true');
      if (id) {
        await updateLeadByIdAPI({
          id,
          data: LeadFormData,
        });
      }
    }
    if (value.reason === 'other') {
      value.reason = value.otherReason as string;
    }
    if (value.otherReason || value.otherReason === '') {
      delete value.otherReason;
    }
    if (isEditPage) {
      close('success');
      onAdd?.();
    } else {
      updateDeal(newId as number, value);
    }
    if (newId) {
      updateDealStage({ stage_id: stageId as number, deal_id: newId });
      navigate(setUrlParams(PRIVATE_NAVIGATION.deals.detailPage, newId));
    }
  });

  const close = (data?: string) => {
    reset();
    closeModal(data);
  };

  return isOpen ? (
    <Modal
      title="Mark as Lost"
      visible={isOpen}
      onClose={() => close()}
      onCancel={() => close()}
      onSubmit={onSubmit}
      submitLoading={isLoading}
      width="476px"
      submitButtonText="Mark as Lost"
      submitButtonClass="delete__Btn"
    >
      <form onSubmit={onSubmit}>
        <DealLostForm
          errors={errors}
          register={register}
          displayField={displayField}
          control={control}
          reset={reset}
          setValue={setValue}
          watch={watch}
          isMemoAllowed={isMemoAllowed}
        />
        <p className="text-[16px] font-biotif__Regular text-light__TextColor">
          Manage lost reasons on{' '}
          <Link
            to={PRIVATE_NAVIGATION.settings.view}
            className="text-primaryColor underline"
          >
            Company settings
          </Link>
        </p>
      </form>
    </Modal>
  ) : (
    <></>
  );
};

export default AddLostReasonModal;
