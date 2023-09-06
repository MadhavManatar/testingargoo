// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import {
  FormProvider,
  UseFormReset,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

// ** Redux **
import { setLoadDetails } from 'redux/slices/commonSlice';
import {
  QuickEntry,
  SetQuickPopupAction,
  getQuickPopup,
  setQuickPopup,
} from 'redux/slices/quickPopupDefaultSlice';
import store from 'redux/store';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import DuplicateFieldWarningModal from 'components/Modal/DuplicateFieldWarningModal/DuplicateFieldWarningModal';
import RouteChangeConformationModal from 'components/Modal/RouteChangeConformationModal';
import EditAccountSkeleton from '../skeletons/EditAccountSkeleton';
import AccountForm from './AccountForm';

// ** Hook **
import useAddAccount from '../hooks/useAddAccount';

// ** Schema **
import { accountSchema } from '../validation-schema/account.schema';

// ** Services **
import { useGetAccountDetails } from '../hooks/useAccountService';

// ** Types **
import { DuplicateFieldModalType } from 'components/Modal/DuplicateFieldWarningModal/types/index.types';
import { KeepTimelineEmails } from 'pages/Deal/types/deals.types';
import {
  AccountResponseType,
  AddAccountFormFieldsType,
} from '../types/account.types';

// ** Constant **
import { ALLOWED_MIME_TYPES, BREAD_CRUMB, NAME_BADGE_COLOR_COMBINATIONS } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Others **
import {
  convertNumberOrNull,
  setUrlParams,
  usCurrencyFormat,
} from 'utils/util';
import generateAccountFormData, {
  setContactsRelatedToAccount,
} from '../helper/account.helper';
import {
  useAddAccountMutation,
  useUpdateAccountMutation,
} from 'redux/api/accountApi';

interface Props {
  accountId?: number | null | undefined;
  onAdd?: (data?: any) => void;
  closeModal?: () => void;
  isQuickModal?: boolean;
  modalName?: string;
}

const AddEditAccount = (props: Props) => {
  // ** Hooks **
  const navigate = useNavigate();
  const location = useLocation();
  const isEditAccountRoute = location.pathname.includes('accounts/edit/');
  let { accountId } = props;
  const { onAdd, closeModal, isQuickModal, modalName } = props;
  if (!accountId && isEditAccountRoute && !isQuickModal) {
    const params = useParams();
    accountId = convertNumberOrNull(params.id);
  }

  const { auth } = store.getState();
  const { user } = auth;
  const [searchParams] = useSearchParams();
  const queryPopup = searchParams?.get('quickPopup');
  const queryAccount = searchParams?.get('quickAccount');

  // ** apis **
  const [updateAccountByIdAPI, { isLoading }] = useUpdateAccountMutation();
  const [addAccountAPI, { isLoading: addLoading }] = useAddAccountMutation();

  // ** Custom Hooks **
  const formMethods = useForm<AddAccountFormFieldsType>({
    mode: 'onChange',
    resolver: yupResolver(accountSchema),
  });
  const dispatch = useDispatch();
  const selectorQuick = useSelector(getQuickPopup);

  // ** Default Value ** //
  let contactId: number | string = '';
  let jobRole: string | undefined = '';
  let parentId: string | number = '';
  if (selectorQuick && queryPopup) {
    contactId = Number(selectorQuick.contact?.id) || '';
    jobRole = selectorQuick?.contact?.jobRole || '';
  }
  if (selectorQuick && queryAccount) {
    parentId = selectorQuick?.parent?.id || '';
  }

  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
  } = formMethods;
  const { accountData, isAccountLoading } = useGetAccountDetails({
    accountId,
  });

  const {
    fields: phoneFields,
    insert: insertPhone,
    remove: removePhone,
  } = useFieldArray({
    name: 'phones',
    control,
  });

  const {
    fields: emailFields,
    insert: insertEmail,
    remove: removeEmail,
  } = useFieldArray({
    name: 'emails',
    control,
  });
  const {
    fields: relatedContactsFields,
    append: appendRelatedContacts,
    remove: removeRelatedContacts,
  } = useFieldArray({ name: 'related_contacts', control });

  // ** States **
  const [duplicateMailModal, setDuplicateMailModal] =
    useState<DuplicateFieldModalType>({
      isOpen: false,
      data: null,
    });
  const [profileImg, setProfileImg] = useState<string | File>('');
  const [submit, setSubmit] = useState<boolean>(true);
  const [isDisableKeyDownEvent, setDisableKeyDownEvent] =
    useState<boolean>(false);
  const [timezoneLoading, setTimezoneLoading] = useState(false);
  const [customIsDirty, setCustomIsDirty] = useState<boolean>(true);
  const [keepTimelineEmails, setTimelineEmails] = useState<
    KeepTimelineEmails[]
  >([]);
  if (accountId) {
    useResetEditAccountForm(accountData, reset);
  }

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
  const { addAccount } = useAddAccount({
    isQuickModal: false,
    addAccountAPI,
    onAdd,
    closeModal,
  });

  useEffect(() => {
    if (accountData.account.id) {
      const primaryContact = accountData?.account?.AccountContacts?.find(
        (val) => val.is_primary
      );
      // ** Store Account in the Redux for quick Popup default Value
      const state_data: SetQuickPopupAction = {
        entity: QuickEntry.ACCOUNT,
        data: {
          id: accountData?.account.id,
          name: accountData?.account.name,
        },
      };

      dispatch(setQuickPopup(state_data));
      // ** Store Contact in the Redux for quick Popup default Value
      const state_data_contact: SetQuickPopupAction = {
        entity: QuickEntry.CONTACT,
        data: {
          id: Number(primaryContact?.id) || '',
          name: primaryContact?.contact?.name || '',
          jobRole: primaryContact?.contact?.job_role || '',
        },
      };
      dispatch(setQuickPopup(state_data_contact));
      // ** Store Lead in the Redux for quick Popup default Value
      const state_data_lead: SetQuickPopupAction = {
        entity: QuickEntry.LEAD,
        data: {
          id: '',
          name: '',
          jobRole: '',
        },
      };
      dispatch(setQuickPopup(state_data_lead));
      // ** Store Deal in the Redux for quick Popup default Value
      const state_data_deal: SetQuickPopupAction = {
        entity: QuickEntry.DEAL,
        data: {
          id: '',
          name: '',
          jobRole: '',
        },
      };
      dispatch(setQuickPopup(state_data_deal));
    }

    // **
  }, [accountData.account.id]);

  useEffect(() => {
    if (!accountId) {
      reset({
        account_owner_id: user?.id || undefined,
        timezone: 'America/New_York',
        phones: [{ isPrimary: true, phoneType: null, value: '' }],
        emails: [{ isPrimary: true, value: '' }],
        related_contacts: [
          { job_role: jobRole, value: contactId, is_primary: true },
        ],
        state_id: 1436,
        country_id: 233,
        parent_account_id: `${parentId}`,
      });
    }
  }, [selectorQuick]);

  const onFileSelect: React.ChangeEventHandler<HTMLInputElement> | undefined = (
    e
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file && ALLOWED_MIME_TYPES.includes(file.type)) {
      if (file.size < 10 * 1024 * 1024) {
        clearErrors('account_image');
        setProfileImg(file);
      } else {
        setError('account_image', {
          type: 'custom',
          message: 'Please upload image less than 10MB',
        });
      }
    } else {
      setError('account_image', {
        type: 'custom',
        message: 'Only PNG,JPEG,JPG are allowed',
      });
    }
  };

  const onSubmit = handleSubmit(async (formVal: any) => {
    // we are set setCustomIsDirty to false cause after submit DirtyField value is always true
    setCustomIsDirty(false);
    const { annual_revenue } = formVal;

    const data: string[] = ['emails', 'phones', 'related_contacts'];
    Object.keys(formVal).forEach((key: any) => {
      if (data.includes(key)) {
        formVal[key] = formVal[key].filter((val: any) => val.value !== '');
      }
    });

    if (!accountId) {
      addAccount({
        ...formVal,
        account_image: profileImg,
        initial_color: NAME_BADGE_COLOR_COMBINATIONS[
            Math.floor(Math.random() * NAME_BADGE_COLOR_COMBINATIONS.length)
          ]?.Color,
      });
    } else {
      const updatedAnnualValue = annual_revenue
        ?.match(/(\d+)(\.\d+)?/g)
        ?.join('');

      const AccountFormData = generateAccountFormData(
        {
          ...formVal,
          annual_revenue: updatedAnnualValue || '0.0',
          account_image: profileImg,
        },
        'edit',
        accountData.account,
        keepTimelineEmails
      );

      if (submit) {
        clearErrors('parent_account_id');
        updateAccount(accountId || 0, AccountFormData);
      } else {
        setError('parent_account_id', {
          type: 'custom',
          message: 'Please Select another parent',
        });
      }
    }
  });

  const updateAccount = async (
    account_id: number | null,
    AccountFormData: FormData
  ) => {
    const data = await updateAccountByIdAPI({
      id: account_id || 0,
      data: AccountFormData,
    });
    if ('data' in data && !('error' in data) && accountId) {
      if (closeModal) {
        reloadModalDetails();
        closeModal();
        if (onAdd) {
          onAdd(data);
        }
      } else {
        navigate(
          setUrlParams(PRIVATE_NAVIGATION.accounts.detailPage, accountId)
        );
      }
    }
  };

  const onCancelForm = () => {
    navigate(-1);
  };

  const onCloseWarningModal = () => {
    setDuplicateMailModal({ isOpen: false, data: null });
    if (duplicateMailModal?.data?.field === 'name') {
      setValue('name', '');
    }
    if (
      duplicateMailModal?.data?.field === 'email' &&
      setValue &&
      emailFields.length
    ) {
      const filteredMail = emailFields?.map((mail) => ({
        ...mail,
        value: mail.value === duplicateMailModal?.data?.value ? '' : mail.value,
      }));
      setValue('emails', filteredMail);
    }

    if (duplicateMailModal?.data?.field === 'relatedContact' && setValue) {
      const filteredContacts = (relatedContactsFields || [])?.map(
        (contact) => ({
          ...contact,
          value:
            contact.value === duplicateMailModal?.data?.value
              ? ''
              : contact.value,
        })
      );
      setValue(
        'related_contacts',
        filteredContacts?.length
          ? filteredContacts
          : [{ value: '', is_primary: true, job_role: '', isCreatable: true }]
      );
    }
  };
  return (
    <>
      <>
        <Breadcrumbs
          path={accountId ? BREAD_CRUMB.editAccount : BREAD_CRUMB.addAccount}
        />

        <div>
          {isAccountLoading ? (
            <EditAccountSkeleton />
          ) : (
            <div className="ipTabsWrapper">
              <div className="ipTabs">
                <div className="ipTabsContantWrapper">
                  <div className="fixed__wrapper__dealEdit ip__FancyScroll">
                    <FormProvider {...formMethods}>
                      <form
                        onSubmit={onSubmit}
                        {...(isDisableKeyDownEvent && {
                          onKeyDown: (event) => {
                            event.preventDefault();
                          },
                        })}
                      >
                        {(accountData.account.id || !accountId) && (
                          <AccountForm
                            control={control}
                            errors={errors}
                            register={register}
                            account_owner={accountData?.account?.account_owner}
                            parent_account={
                              accountData?.account?.parent_account
                            }
                            sub_account={accountData?.account?.sub_account}
                            accountId={accountData?.account?.id}
                            accountData={accountData}
                            watch={watch}
                            editFormFlag
                            profileImg={profileImg}
                            onFileSelect={onFileSelect}
                            setProfileImg={setProfileImg}
                            phoneFields={phoneFields}
                            removePhone={removePhone}
                            insertPhone={insertPhone}
                            setValue={setValue}
                            emailFields={emailFields}
                            insertEmail={insertEmail}
                            removeEmail={removeEmail}
                            setError={setError}
                            clearErrors={clearErrors}
                            setSubmit={setSubmit}
                            relatedContactsFields={relatedContactsFields}
                            appendRelatedContacts={appendRelatedContacts}
                            removeRelatedContacts={removeRelatedContacts}
                            setDisableKeyDownEvent={setDisableKeyDownEvent}
                            setTimezoneLoading={setTimezoneLoading}
                            timezoneLoading={timezoneLoading}
                            setTimelineEmails={setTimelineEmails}
                            keepTimelineEmails={keepTimelineEmails}
                          />
                        )}
                      </form>
                    </FormProvider>
                  </div>
                  <div className="action__fixed__btn__accountEdit flex flex-wrap">
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
                      isDisabled={timezoneLoading}
                    >
                      {accountId ? 'Update' : 'Create'}
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
      {duplicateMailModal.isOpen && (
        <DuplicateFieldWarningModal
          isOpen
          data={duplicateMailModal.data}
          closeModal={() => onCloseWarningModal()}
        />
      )}
    </>
  );
};

export default AddEditAccount;

const useResetEditAccountForm = (
  accountData: AccountResponseType,
  reset: UseFormReset<AddAccountFormFieldsType>
) => {
  useEffect(() => {
    const { account } = accountData;

    if (accountData?.account?.id) {
      reset({
        account_owner_id: account?.account_owner_id,
        rating: (account?.rating || '')?.toString(),
        name: account?.name,
        emails:
          account?.emails?.length > 0
            ? account?.emails.map((val) => {
                return {
                  value: val.value,
                  isPrimary: val.isPrimary,
                };
              })
            : [{ isPrimary: true, value: '' }],
        phones:
          account?.phones?.length > 0
            ? (account?.phones || []).map((item) => {
                return {
                  isPrimary: item.isPrimary,
                  phoneType: item?.phoneType || null,
                  value: item.value,
                };
              })
            : [{ isPrimary: true, phoneType: null, value: '' }],
        fax: account?.fax,
        parent_account_id: (account?.parent_account_id || '').toString(),
        sub_account_id: (account?.sub_account_id || '').toString(),
        website: account?.website,
        account_type: account?.account_type,
        ownership: account?.ownership,
        industry: account?.industry,
        employees: account?.employees,
        annual_revenue: account?.annual_revenue
          ? usCurrencyFormat(Number(account?.annual_revenue).toString())
          : '0.00',
        description: account?.description,
        zip: account?.zip,
        city: account?.city,
        county: account?.county,
        state_id: account?.state?.id,
        country_id: account?.country?.id,
        address1: account?.address1 || '',
        address2: account?.address2,
        timezone: account?.timezone,
        related_contacts: account?.AccountContacts?.length
          ? setContactsRelatedToAccount(account?.AccountContacts)
          : [{ is_primary: true, job_role: '', value: '' }],
      });
    }
  }, [accountData]);
};
