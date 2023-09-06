// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import RouteChangeConformationModal from 'components/Modal/RouteChangeConformationModal';
import EditLeadSkeleton from '../skeletons/EditLeadSkeleton';
import LeadForm from './LeadForm';

// ** Services **
import { useGetLeadDetails } from '../hooks/useLeadService';

// ** Types **
import { AddLeadFormFieldsType } from '../types/lead.type';
import { KeepTimelineEmails } from 'pages/Deal/types/deals.types';

// ** Schemas **
import { leadSchema } from '../validation-schema/leads.schema';

// ** Constants **
import { BREAD_CRUMB } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Others **
import {
  convertNumberOrNull,
  setUrlParams,
  usCurrencyFormat,
} from 'utils/util';
import { generateLeadFormData, setContacts } from '../helper/leads.helper';
import store from 'redux/store';
import { useSelector, useDispatch } from 'react-redux';
import {
  QuickEntry,
  SetQuickPopupAction,
  getQuickPopup,
  setQuickPopup,
} from 'redux/slices/quickPopupDefaultSlice';
import { setLoadDetails } from 'redux/slices/commonSlice';
import { useAddLeadMutation, useUpdateLeadMutation } from 'redux/api/leadApi';

interface Props {
  leadId?: number | null;
  onAdd?: (data?: any) => void;
  closeModal?: () => void;
  isQuickModal?: boolean;
  modalName?: string;
}

const AddEditLead = (props: Props) => {
  // ** for open a add lead page from header ** //
  const location = useLocation();
  const isEditLeadRoute = location.pathname.includes('leads/edit/');
  let { leadId } = props;
  const { onAdd, closeModal, isQuickModal, modalName } = props;
  // ** hooks **
  if (!leadId && isEditLeadRoute && !isQuickModal) {
    const { id } = useParams();
    leadId = convertNumberOrNull(id);
  }
  const navigate = useNavigate();
  const { auth } = store.getState();
  const { user } = auth;
  const [searchParams] = useSearchParams();
  const queryPopup = searchParams?.get('quickPopup');

  const dispatch = useDispatch();
  // ** States **
  const [customIsDirty, setCustomIsDirty] = useState<boolean>(true);

  const [keepTimelineEmails, setTimelineEmails] = useState<
    KeepTimelineEmails[]
  >([]);

  // ** Custom Hooks **
  const [updateLeadByIdAPI, { isLoading }] = useUpdateLeadMutation();
  const { leadData, isLoading: isLeadLoading } = useGetLeadDetails({
    leadId,
  });
  const [addLeadAPI, { isLoading: addLoading }] = useAddLeadMutation();
  const selectorQuick = useSelector(getQuickPopup);

  // ** Default Value ** //
  let accountId: number | string = '';
  let contactId: number | string = '';
  let jobRole: string | undefined = '';

  if (selectorQuick && queryPopup) {
    accountId = Number(selectorQuick.account?.id) || '';
    contactId = Number(selectorQuick.contact?.id) || '';
    jobRole = selectorQuick?.contact?.jobRole || '';
  }

  const formMethods = useForm<AddLeadFormFieldsType>({
    resolver: yupResolver(leadSchema),
  });

  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
  } = formMethods;

  useEffect(() => {
    const {
      lead_source,
      lead_status_id,
      name,
      deal_value,
      description,
      lead_owner,
      lead_score,
    } = leadData.lead;

    if ((leadId && leadData?.lead?.id) || leadId === undefined || (selectorQuick && queryPopup)) {
      reset({
        lead_source: lead_source?.id || '',
        lead_status_id: lead_status_id || undefined,
        name,
        deal_value: deal_value ? usCurrencyFormat(deal_value) : undefined,
        description,
        related_account:
          leadData?.lead?.related_account?.id || accountId || undefined,
        lead_owner_id: lead_owner?.id || user?.id || undefined,
        contacts: leadData.lead.related_contacts?.length
          ? setContacts(leadData.lead.related_contacts)
          : [{ contact_id: contactId, job_role: jobRole, is_primary: true }] || [
            { job_role: '', contact_id: '', is_primary: true },
          ],
        lead_temp_id: leadData.lead?.lead_temperature?.id,
        lead_score,
      });
      if (leadData.lead.id) {
        // ** Store Deal in the Redux for quick Popup default Value
        const state_data: SetQuickPopupAction = {
          entity: QuickEntry.DEAL,
          data: {
            id: leadData.lead?.id,
            name: leadData.lead?.name,
          },
        };
        dispatch(setQuickPopup(state_data));
        // ** Store Account in the Redux for quick Popup default Value
        const state_data_account: SetQuickPopupAction = {
          entity: QuickEntry.ACCOUNT,
          data: {
            id: leadData.lead?.related_account?.id,
            name: leadData.lead?.related_account?.name,
          },
        };
        dispatch(setQuickPopup(state_data_account));
        // ** Store Contact in the Redux for quick Popup default Value
        const primaryContact = leadData.lead?.related_contacts?.find(
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
    }
  }, [leadData]);

  const cancelForm = () => {
    navigate(-1);
  };

  const onSubmit = handleSubmit(async (value) => {
    // we are set setCustomIsDirty to false cause after submit DirtyField value is always true
    setCustomIsDirty(false);
    if (!leadId) {
      addLead(value);
    } else {
      updateLead(value);
    }
  });

  const addLead = async (value: AddLeadFormFieldsType) => {
    const { deal_value } = value;
    const updatedDealValue = deal_value?.match(/(\d+)(\.\d+)?/g)?.join('');

    const LeadFormData = generateLeadFormData({
      ...value,
      deal_value: updatedDealValue,
    });

    LeadFormData.append('is_deal', 'false');

    const data = await addLeadAPI({
      data: LeadFormData,
    });

    if ('data' in data && !('error' in data)) {
      if (closeModal) {
        dispatch(
          setLoadDetails({
            loadModuleDetails: {
              accounts: false,
              contacts: false,
              leads: false,
              deals: true,
              activity: true,
            },
          })
        );
        closeModal();
        if (onAdd) {
          onAdd(data);
        }
      } else {
        navigate(
          setUrlParams(PRIVATE_NAVIGATION.leads.detailPage, data?.data?.id),
          {}
        );
      }
    }
  };

  const updateLead = async (value: AddLeadFormFieldsType) => {
    const { deal_value } = value;
    const updatedDealValue = deal_value?.match(/(\d+)(\.\d+)?/g)?.join('');
    const LeadFormData = generateLeadFormData(
      {
        ...value,
        deal_value: updatedDealValue,
      },
      'edit',
      leadData.lead.related_contacts,
      keepTimelineEmails
    );
    LeadFormData.append('is_deal', 'false');

    const data = await updateLeadByIdAPI({
      id: leadId || 0,
      data: LeadFormData,
    });

    if ('data' in data && !('error' in data) && leadId) {
      if (closeModal) {
        reloadModalDetails();
        closeModal();
        if (onAdd) {
          onAdd(data);
        }
      } else {
        navigate(setUrlParams(PRIVATE_NAVIGATION.leads.detailPage, leadId), {});
      }
    }
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
  return (
    <>
      {(leadId || !leadId) && (
        <>
          <Breadcrumbs
            path={leadId ? BREAD_CRUMB.editLead : BREAD_CRUMB.addLead}
          />
          <div>
            {isLeadLoading ? (
              <>
                <EditLeadSkeleton />
              </>
            ) : (
              (leadData.lead.id || !leadId) && (
                <div className="ipTabsWrapper">
                  <div className="ipTabs">
                    <div className="ipTabsContantWrapper">
                      <div className="fixed__wrapper__leadEdit ip__FancyScroll">
                        <FormProvider {...formMethods}>
                          <form>
                            <LeadForm
                              setValue={setValue}
                              watch={watch}
                              control={control}
                              errors={errors}
                              register={register}
                              editFormFlag
                              leadDetail={leadData?.lead}
                              setTimelineEmails={setTimelineEmails}
                              keepTimelineEmails={keepTimelineEmails}
                            />
                          </form>
                        </FormProvider>
                      </div>
                      <div className="action__fixed__btn__leadEdit flex flex-wrap">
                        <Button
                          className="cancel__btn secondary__Btn mr-[7px] min-w-[120px] sm:min-w-[calc(50%_-_7px)]"
                          onClick={() => {
                            if (closeModal) {
                              closeModal();
                            } else {
                              cancelForm();
                            }
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={onSubmit}
                          className="save__btn primary__Btn min-w-[120px] py-[11px] ml-[7px] sm:min-w-[calc(50%_-_7px)]"
                          type="button"
                          isLoading={isLoading || addLoading}
                        >
                          {leadId ? 'Update' : 'Create'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </>
      )}
      <RouteChangeConformationModal
        isDirtyCondition={
          Object.values(dirtyFields)?.length > 0 && customIsDirty
        }
      />
    </>
  );
};

export default AddEditLead;
