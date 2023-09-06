// ** Import Packages **
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// ** Components **
import Button from 'components/Button';
import Breadcrumbs from 'components/Breadcrumbs';
import DealForm from './DealForm';
import EditDealSkeleton from '../skeletons/EditDealSkeleton';
import RouteChangeConformationModal from 'components/Modal/RouteChangeConformationModal';
import AddDealLostModal from './detail/AddDealLostModal';

// ** Types **
import {
  AddDealFormFieldsType,
  KeepTimelineEmails,
} from '../types/deals.types';

// ** Services **
import { useGetDealDetails } from '../hooks/useDealService';

// ** Schema **
import { dealSchema } from '../validation-schema/deal.schema';

//  ** Constant **
import { BREAD_CRUMB } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Other **
import generateDealFormData from '../helper/deal.helper';
import { convertNumberOrNull, setUrlParams } from 'utils/util';
import useResetDealFormValue from '../hooks/useResetDealFormValue';
import { useDispatch } from 'react-redux';
import { setLoadDetails } from 'redux/slices/commonSlice';
import {
  QuickEntry,
  SetQuickPopupAction,
  setQuickPopup,
} from 'redux/slices/quickPopupDefaultSlice';
import { useAddLeadMutation, useUpdateLeadMutation } from 'redux/api/leadApi';

interface Props {
  dealId?: number | null;
  onAdd?: (data?: any) => void;
  closeModal?: () => void;
  isQuickModal?: boolean;
  modalName?: string;
}

const AddEditDeal = (props: Props) => {
  // ** Hooks **
  let { dealId } = props;
  const { onAdd, closeModal, isQuickModal, modalName } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const isEditContactRoute = location.pathname.includes('deals/edit');

  if (!dealId && !isQuickModal && isEditContactRoute) {
    const { id } = useParams();
    dealId = convertNumberOrNull(id);
  }
  // ** states ** //
  const [customIsDirty, setCustomIsDirty] = useState<boolean>(true);
  const [stageLostIds, setStageLostIds] = useState<number[]>([]);
  const [openDealLostModal, setOpenDealLostModal] = useState<{
    isOpen: boolean;
    formData: AddDealFormFieldsType;
  }>({
    isOpen: false,
    formData: {},
  });
  const [keepTimelineEmails, setTimelineEmails] = useState<
    KeepTimelineEmails[]
  >([]);
  // ** Custom Hooks **
  const [updateLeadByIdAPI, { isLoading }] = useUpdateLeadMutation();

  const [addLead, { isLoading: addLoading }] = useAddLeadMutation();

  const dispatch = useDispatch();
  const formMethods = useForm<AddDealFormFieldsType>({
    resolver: yupResolver(dealSchema),
  });
  const {
    reset,
    handleSubmit,
    formState: { dirtyFields },
  } = formMethods;

  const {
    dealData,
    isLoading: isDealLoading,
    getDealDetail,
    setDealData,
  } = useGetDealDetails({
    dealId,
  });

  useEffect(() => {
    if (dealId && dealData?.lead?.id) {
      // ** Store Deal in the Redux for quick Popup default Value
      const state_data: SetQuickPopupAction = {
        entity: QuickEntry.DEAL,
        data: {
          id: dealData.lead?.id,
          name: dealData.lead?.name,
        },
      };
      dispatch(setQuickPopup(state_data));
      // ** Store Account in the Redux for quick Popup default Value
      const state_data_account: SetQuickPopupAction = {
        entity: QuickEntry.ACCOUNT,
        data: {
          id: dealData.lead?.related_account?.id,
          name: dealData.lead?.related_account?.name,
        },
      };
      dispatch(setQuickPopup(state_data_account));
      // ** Store Contact in the Redux for quick Popup default Value
      const primaryContact = dealData.lead?.related_contacts?.find(
        (val) => val.is_primary
      );
      const state_data_contact: SetQuickPopupAction = {
        entity: QuickEntry.CONTACT,
        data: {
          id: primaryContact?.contact?.id,
          name: primaryContact?.contact?.name,
        },
      };
      dispatch(setQuickPopup(state_data_contact));
    }
  }, [dealData]);

  useResetDealFormValue({ dealData: dealData.lead, reset, isDealLoading });

  useEffect(() => {
    if (dealId) {
      getDealDetail(dealId);
      setDealData({ ...dealData });
    }
  }, [dealId]);

  const onSubmit = handleSubmit(async (formVal: AddDealFormFieldsType) => {
    if (
      stageLostIds.includes(Number(formVal.deal_stage_id || 0)) &&
      Number(dealData?.lead?.deal_stage_id || 0) !==
        Number(formVal?.deal_stage_id || 0)
    ) {
      setOpenDealLostModal({
        formData: formVal,
        isOpen: true,
      });
    } else if (dealId) {
      updateDeal(formVal);
    } else {
      createDeal(formVal);
    }
  });

  const createDeal = async (value: AddDealFormFieldsType) => {
    setCustomIsDirty(false);
    const { deal_value, probability } = value;

    const updatedDealValue = deal_value?.match(/(\d+)(\.\d+)?/g)?.join('');
    const updatedProbability = probability?.match(/(\d+)(\.\d+)?/g)?.join('');

    const DealFormData = generateDealFormData({
      ...value,
      deal_value: updatedDealValue,
      probability: updatedProbability,
    });

    const data = await addLead({
      data: DealFormData,
    });
    if ('data' in data && !('error' in data)) {
      if (closeModal) {
        closeModal();
        if (onAdd) {
          onAdd(data);
        }
      } else {
        navigate(
          setUrlParams(PRIVATE_NAVIGATION.deals.detailPage, data?.data?.id)
        );
      }
    }
  };

  const updateDeal = async (formVal: AddDealFormFieldsType) => {
    // we are set setCustomIsDirty to false cause after submit DirtyField value is always true
    setCustomIsDirty(false);
    const { deal_value, probability } = formVal;
    const updatedDealValue = deal_value?.match(/(\d+)(\.\d+)?/g)?.join('');
    const updatedProbability = probability?.match(/(\d+)(\.\d+)?/g)?.join('');

    const DealFormData = generateDealFormData(
      {
        ...formVal,
        deal_value: updatedDealValue,
        probability: updatedProbability,
      },
      'edit',
      dealData.lead.related_contacts,
      keepTimelineEmails
    );

    if (dealId) {
      const data = await updateLeadByIdAPI({
        id: dealId || 0,
        data: DealFormData,
      });
      if ('data' in data && !('error' in data) && dealId) {
        if (closeModal) {
          reloadModalDetails();
          closeModal();
          if (onAdd) {
            onAdd(data);
          }
        } else {
          navigate(setUrlParams(PRIVATE_NAVIGATION.deals.detailPage, dealId));
          reset();
        }
      }
    }
  };

  const onCancelForm = () => {
    navigate(-1);
  };

  const reloadModalDetails = () => {
    dispatch(
      setLoadDetails({
        loadModuleDetails: {
          leads: modalName === 'leads',
          accounts: modalName === 'accounts',
          contacts: modalName === 'contacts',
          deals: modalName === 'deals',
          activity: modalName === 'activities',
        },
      })
    );
  };
  const closeDealLostModal = () => {
    setOpenDealLostModal({
      ...openDealLostModal,
      isOpen: false,
    });
  };

  return (
    <>
      <>
        <Breadcrumbs
          path={dealId ? BREAD_CRUMB.editDeal : BREAD_CRUMB.addDeal}
        />
        <div>
          {isDealLoading || (dealId && !dealData.lead.id) ? (
            <EditDealSkeleton />
          ) : (
            <div className="ipTabsWrapper">
              <div className="ipTabs">
                <div className="ipTabsContantWrapper">
                  <div className="fixed__wrapper__dealEdit ip__FancyScroll">
                    <FormProvider {...formMethods}>
                      <form onSubmit={onSubmit}>
                        <DealForm
                          editFormFlag
                          dealDetail={dealData?.lead}
                          setStageLostIds={setStageLostIds}
                          setTimelineEmails={setTimelineEmails}
                          keepTimelineEmails={keepTimelineEmails}
                        />
                      </form>
                    </FormProvider>
                  </div>
                  <div className="action__fixed__btn__dealEdit flex flex-wrap">
                    <Button
                      className="cancel__btn secondary__Btn mr-[7px] min-w-[120px] sm:min-w-[calc(50%_-_7px)]"
                      onClick={() => {
                        if (closeModal) {
                          closeModal();
                        } else {
                          onCancelForm();
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="save__btn primary__Btn min-w-[120px] py-[11px] ml-[7px] sm:min-w-[calc(50%_-_7px)]"
                      type="button"
                      onClick={onSubmit}
                      isLoading={isLoading || addLoading}
                    >
                      {dealId ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>

      <RouteChangeConformationModal
        isDirtyCondition={
          Object.values(dirtyFields)?.length > 0 && customIsDirty
        }
      />
      {openDealLostModal.isOpen && (
        <AddDealLostModal
          isOpen={openDealLostModal.isOpen}
          closeModal={closeDealLostModal}
          id={dealId}
          stageId={openDealLostModal.formData?.deal_stage_id}
          formData={openDealLostModal?.formData}
          onAdd={() => updateDeal(openDealLostModal.formData)}
          isEditPage
          setCustomIsDirty={setCustomIsDirty}
        />
      )}
    </>
  );
};

export default AddEditDeal;
