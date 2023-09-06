// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// ** Redux **
import { getCurrentUser, getDetailSection } from 'redux/slices/authSlice';
import {
  getIsLoadDetailsLoad,
  setDetailSectionView,
  setLoadDetails,
} from 'redux/slices/commonSlice';

// ** Components **
import Editable from 'components/Editable';
import FollowersSection from 'components/EntityDetails/FollowFollowing';
import InfoWrapper from 'components/EntityDetails/InfoWrapper';
import StayInTouchReminder from 'components/EntityDetails/StayInTouch/components/StayInTouchReminder';
import InformationSkeleton from 'components/EntityDetails/skeletons/InformationSkeleton';
import Map from 'components/Map';
import DuplicateFieldWarningModal from 'components/Modal/DuplicateFieldWarningModal/DuplicateFieldWarningModal';
import RelatedContacts from 'pages/Contact/components/detail/RelatedContacts';

// ** Schema **
import { accountSchema } from 'pages/Account/validation-schema/account.schema';

// ** Hook **
import usePermission from 'hooks/usePermission';
import useAccountInfo from 'pages/Account/hooks/useAccountInfo';
import useAccountInlineFormObject from 'pages/Account/hooks/useAccountInlineFormObject';
import useResetAccountFormValue from 'pages/Account/hooks/useResetAccountFormValue';

// ** Types **
import { DuplicateFieldModalType } from 'components/Modal/DuplicateFieldWarningModal/types/index.types';
import {
  AccountInfoPropsType,
  AddAccountFormFieldsType,
} from 'pages/Account/types/account.types';
import { DealFilter, RelatedContact } from 'pages/Contact/types/contacts.types';

// ** Constant **
import { GENERAL_SETTING_VALID_KEYS } from 'constant';
import { ModuleNames, POLYMORPHIC_MODELS } from 'constant/permissions.constant';

// ** Others **
import { getSaveButtonDisabled } from 'helper/inlineEditHelper';
import generateAccountFormData from 'pages/Account/helper/account.helper';
import { convertNumberOrNull } from 'utils/util';
import useLeadDealChart from 'pages/Contact/hooks/useLeadDealChart';
import RelatedLeads from 'pages/Contact/components/detail/RelatedLeads';
import RelatedDeals from 'pages/Contact/components/detail/RelatedDeals';
import { useLazyGetGeneralSettingQuery } from 'redux/api/generalSettingApi';
import KeepEmailTimelineModal from 'components/Modal/KeepEmailTimelineModal/KeepEmailTimelineModal';
import { KeepEmailTimelineModalType } from 'components/Modal/KeepEmailTimelineModal/types/index.types';
import { KeepTimelineEmails } from 'pages/Deal/types/deals.types';
import { useUpdateAccountMutation } from 'redux/api/accountApi';

const AccountInfo = (props: AccountInfoPropsType) => {
  const {
    setIsStayInTouchOpen,
    scheduleActivityData,
    setShowLoader,
    isLoading,
    accountData,
    getScheduleActivity,
    isScheduleActivityLoading,
    parentChildData,
  } = props;
  // ** Hooks **
  const { id } = useParams();
  const accountId = convertNumberOrNull(id);
  const { updateAccountPermission, readContactPermission } = usePermission();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const divRefForInputField = useRef<HTMLDivElement>(null);
  const isKeyDownCreatableRef = useRef<any>(null);
  const {
    register,
    formState: { errors },
    control,
    setValue,
    watch,
    setError,
    reset,
    clearErrors,
    handleSubmit,
  } = useForm<AddAccountFormFieldsType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(accountSchema),
  });

  const dispatch = useDispatch();
  const IsAccountDetailsLoad = useSelector(getIsLoadDetailsLoad);
  const section = useSelector(getDetailSection);
  const currentUser = useSelector(getCurrentUser);

  // ** States **
  const [duplicateMailModal, setDuplicateMailModal] =
    useState<DuplicateFieldModalType>({
      isOpen: false,
      data: null,
    });
  const [isEditing, setIsEditing] = useState<keyof AddAccountFormFieldsType>();
  const [submit, setSubmit] = useState<boolean>(true);
  const [isSubAccountEnable, setIsSubAccountEnable] = useState<boolean>(false);

  // ** APIS **
  const [getGeneralSetting] = useLazyGetGeneralSettingQuery();

  // Open Close Accordion
  const [accordion, setAccordion] = useState<{ [key: string]: boolean }>({
    ...(section?.[`${accountId}_account`] || {
      lead: true,
      desc: true,
      followers: true,
      relContact: true,
      stay: true,
    }),
  });
  const [dealFilter, setDealFilter] = useState<DealFilter>({
    won: false,
    lost: false,
    active: false,
  });
  const [isKeyDownCreatable, setIsKeyDownCreatable] = useState(false);

  const openCloseAccordion = (accType: string) => {
    setAccordion({
      ...accordion,
      [accType]: !accordion[accType],
    });
  };
  const [emailTimelineModal, setEmailTimelineModal] =
    useState<KeepEmailTimelineModalType>({ isOpen: false, data: [] });
  const [keepTimelineEmails, setTimelineEmails] = useState<
    KeepTimelineEmails[]
  >([]);
  // ** Custom Hooks **
  const { accountInfo } = useAccountInfo({
    accountInfo: accountData.account,
  });

  const {
    fields: phoneFields,
    insert: insertPhone,
    remove: removePhone,
  } = useFieldArray({ name: 'phones', control });

  const {
    fields: emailFields,
    insert: insertEmail,
    remove: removeEmail,
  } = useFieldArray({ name: 'emails', control });

  // Set value
  useResetAccountFormValue({ account: accountData.account, reset, isEditing });

  // ** APIS ** //
  const [updateAccountByIdAPI, { isLoading: isAccountUpdateLoading }] =
    useUpdateAccountMutation();

  const { formObject } = useAccountInlineFormObject({
    accountData,
    control,
    errors,
    register,
    setValue,
    watch,
    phoneFields,
    removePhone,
    insertPhone,
    emailFields,
    insertEmail,
    removeEmail,
    setError,
    clearErrors,
    setSubmit,
    parent_account: accountData.account.parent_account,
    accountId,
    isKeyDownCreatableRef,
    setIsKeyDownCreatable,
    setEmailTimelineModal,
    defaultTimezone: {
      label: accountData?.account?.timezone || 'America/New_York',
      value: accountData?.account?.timezone || 'America/New_York',
    },
  });
  useEffect(() => {
    dispatch(
      setDetailSectionView({ [`${accountId}_account`]: { ...accordion } })
    );
  }, [accordion]);

  useEffect(() => {
    if (isEditing) {
      divRefForInputField?.current?.querySelector('input')?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    isKeyDownCreatableRef.current = '';
    setIsKeyDownCreatable(false);
  }, [isKeyDownCreatable]);
  const handleKeyDown = () => {
    const excludeFields = [
      'account_owner_id',
      'rating',
      'parent_account_id',
      'timezone',
      'phones',
    ];

    if (buttonRef?.current && !excludeFields.includes(isEditing || '')) {
      buttonRef.current?.click();
    }

    if (
      buttonRef?.current &&
      excludeFields.includes(isEditing || '') &&
      isKeyDownCreatableRef.current !== 'is_new'
    ) {
      buttonRef.current?.click();
    }

    isKeyDownCreatableRef.current = '';
  };

  // here form reset the value

  useEffect(() => {
    if (accountId && accountData.account.id) {
      fetchSubAccountEnableSettingData();
    }
  }, [accountData, accountId]);

  const fetchSubAccountEnableSettingData = async () => {
    const { data: isSubAccountData, error: subAccountDataError } =
      await getGeneralSetting(
        {
          params: {
            'q[key]': GENERAL_SETTING_VALID_KEYS.is_parent_account_enable,
            'q[model_name]': POLYMORPHIC_MODELS.USER,
            'q[model_record_id]': currentUser?.id,
            module: ModuleNames.ACCOUNT,
          },
        },
        true
      );
    if (isSubAccountData && !subAccountDataError) {
      const subAccountBoolean = isSubAccountData[0]?.value === 'true';
      setIsSubAccountEnable(subAccountBoolean);
    }
  };

  const onSave = (key: keyof AddAccountFormFieldsType) => {
    return handleSubmit((formValues) => {
      const { annual_revenue, emails, phones } = formValues;

      const values = {
        [key]: formValues[`${key}`],
        annual_revenue:
          annual_revenue?.match(/(\d+)(\.\d+)?/g)?.join('') || '0.0',
        ...(key !== 'emails'
          ? { emails: accountData.account.emails }
          : {
              emails,
            }),
        ...(key !== 'phones'
          ? { phone: accountData.account.phones }
          : {
              phones,
            }),
      };

      const accountForm = generateAccountFormData(
        values,
        'edit',
        accountData.account
      );

      const AccountFormData = new FormData();

      AccountFormData.set(key, accountForm.get(key) || '');

      if (submit || key !== 'parent_account_id') {
        clearErrors('parent_account_id');
        updateAccount(accountId || 0, AccountFormData);
      } else {
        setError('parent_account_id', {
          type: 'custom',
          message: 'Please select another parent',
        });
      }

      return false;
    });
  };

  const updateAccount = async (
    account_id: number | null,
    AccountFormData: FormData
  ) => {
    const data = await updateAccountByIdAPI({
      id: account_id || 0,
      data: AccountFormData,
      params: { toast: false },
    });
    if (
      'error' in data &&
      (data?.error as any)?.data?.duplicateField &&
      (data?.error as any)?.data?.duplicateField?.moduleName !== ''
    ) {
      setDuplicateMailModal({
        isOpen: true,
        data: (data?.error as any)?.data?.duplicateField,
      });
    }
    if ('data' in data && !('error' in data) && IsAccountDetailsLoad) {
      setShowLoader(false);
      dispatch(
        setLoadDetails({
          loadModuleDetails: { ...IsAccountDetailsLoad, accounts: true },
        })
      );
      setIsEditing(undefined);
    }
  };

  const onCloseWarningModal = () => {
    setDuplicateMailModal({ isOpen: false, data: null });
    if (duplicateMailModal?.data?.field === 'name') {
      setValue('name', accountInfo.name);
    }
    if (duplicateMailModal?.data?.field === 'email' && setValue) {
      const filteredMail = (accountData.account.emails || [])?.map((mail) => ({
        ...mail,
        value: mail.value === duplicateMailModal?.data?.value ? '' : mail.value,
      }));
      setValue(
        'emails',
        filteredMail?.length ? filteredMail : [{ value: '', isPrimary: true }]
      );
    }
  };

  // Chart For Lead & Deal
  const {
    relatedLeads,
    relatedDeals,
    LeadToDealChart,
    convertedValueChart,
    wonRationChart,
    WonDealsValueChart,
    leadComplateDaysAvg,
    dealComplateDaysAvg,
  } = useLeadDealChart({
    relatedData: accountData.account.allLeads,
    dealFilter,
    setDealFilter,
  });

  return (
    <>
      {isLoading ? (
        <InformationSkeleton infoCount={15} addressCount={6} isDescription />
      ) : (
        <>
          <div className="contantTab__wrapper__new">
            {/* Contact Information */}
            <div className="account__info mb-[30px]">
              <div
                className="section__header"
                onClick={() => openCloseAccordion('lead')}
              >
                <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_32px)] pr-[10px]">
                  Account Information
                </span>
                <button
                  className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[""] before:absolute before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-ipBlack__borderColor before:border-b-[2px] before:border-b-ipBlack__borderColor before:-rotate-45 before:top-[8px] ${
                    accordion.lead ? 'active' : ''
                  } `}
                >
                  .
                </button>
              </div>
              {accordion.lead && (
                <div className="border border-whiteScreen__BorderColor rounded-[12px] ip__info__sec">
                  <div className="p-[24px] pb-[5px] 3xl:px-[15px] 3xl:py-[15px] 3xl:pb-[9px] sm:pb-[16px]">
                    <div
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleKeyDown();
                        }
                      }}
                      ref={divRefForInputField}
                      className="flex flex-wrap mx-[-10px]"
                    >
                      <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                        <p className="ipInfo__View__Label">Owner</p>
                        <pre className="ipInfo__View__Value whitespace-normal">
                          <Editable
                            onCancel={() => setIsEditing(undefined)}
                            setIsEditing={() =>
                              setIsEditing('account_owner_id')
                            }
                            isEditing={isEditing === 'account_owner_id'}
                            isLoading={isLoading || isAccountUpdateLoading}
                            onSave={onSave('account_owner_id')}
                            editComponent={
                              formObject.information.account_owner_id
                            }
                            disabled={!updateAccountPermission}
                            isSaveButtonDisable={false}
                            buttonRef={buttonRef}
                          >
                            <InfoWrapper
                              isCustomLabelHide={!updateAccountPermission}
                              field={accountInfo.account_owner}
                            />
                          </Editable>
                        </pre>
                      </div>
                      <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                        <p className="ipInfo__View__Label">Rating</p>
                        <pre className="ipInfo__View__Value whitespace-normal">
                          <Editable
                            onCancel={() => setIsEditing(undefined)}
                            setIsEditing={() => setIsEditing('rating')}
                            isEditing={isEditing === 'rating'}
                            isLoading={isLoading || isAccountUpdateLoading}
                            onSave={onSave('rating')}
                            editComponent={formObject.information.rating}
                            disabled={!updateAccountPermission}
                            isSaveButtonDisable={false}
                            buttonRef={buttonRef}
                          >
                            <InfoWrapper
                              isCustomLabelHide={!updateAccountPermission}
                              field={accountInfo.rating}
                            />
                          </Editable>
                        </pre>
                      </div>
                      <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                        <p className="ipInfo__View__Label">Name</p>
                        <pre className="ipInfo__View__Value whitespace-normal">
                          <Editable
                            onCancel={() => setIsEditing(undefined)}
                            setIsEditing={() => setIsEditing('name')}
                            isEditing={isEditing === 'name'}
                            isLoading={isLoading || isAccountUpdateLoading}
                            onSave={onSave('name')}
                            editComponent={formObject.information.name}
                            disabled={!updateAccountPermission}
                            isSaveButtonDisable={false}
                            buttonRef={buttonRef}
                          >
                            <InfoWrapper
                              isCustomLabelHide={!updateAccountPermission}
                              field={accountInfo.name}
                            />
                          </Editable>
                        </pre>
                      </div>
                      <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                        <p className="ipInfo__View__Label">Phone</p>
                        <pre className="ipInfo__View__Value whitespace-normal">
                          <Editable
                            onCancel={() => setIsEditing(undefined)}
                            setIsEditing={() => setIsEditing('phones')}
                            isEditing={isEditing === 'phones'}
                            isLoading={isLoading || isAccountUpdateLoading}
                            onSave={onSave('phones')}
                            editComponent={formObject.information.phones}
                            disabled={!updateAccountPermission}
                            isSaveButtonDisable={getSaveButtonDisabled(
                              accountData.account.phones?.find(
                                (item) => item.isPrimary
                              )?.value,
                              (watch('phones') || []).find(
                                (item) => item.isPrimary
                              )?.value
                            )}
                            buttonRef={buttonRef}
                          >
                            <InfoWrapper
                              isCustomLabelHide={!updateAccountPermission}
                              field={accountInfo?.phones}
                            />
                          </Editable>
                        </pre>
                      </div>
                      <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                        <p className="ipInfo__View__Label">Fax</p>
                        <pre className="ipInfo__View__Value whitespace-normal">
                          <Editable
                            onCancel={() => setIsEditing(undefined)}
                            setIsEditing={() => setIsEditing('fax')}
                            isEditing={isEditing === 'fax'}
                            isLoading={isLoading || isAccountUpdateLoading}
                            onSave={onSave('fax')}
                            editComponent={formObject.information.fax}
                            disabled={!updateAccountPermission}
                            isSaveButtonDisable={getSaveButtonDisabled(
                              accountData.account.fax,
                              watch('fax')
                            )}
                            buttonRef={buttonRef}
                          >
                            <InfoWrapper
                              isCustomLabelHide={!updateAccountPermission}
                              field={accountInfo.fax}
                            />
                          </Editable>
                        </pre>
                      </div>
                      <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                        <p className="ipInfo__View__Label">Email</p>
                        <pre className="ipInfo__View__Value whitespace-normal !text-primaryColor">
                          <Editable
                            onCancel={() => setIsEditing(undefined)}
                            setIsEditing={() => setIsEditing('emails')}
                            isEditing={isEditing === 'emails'}
                            isLoading={isLoading || isAccountUpdateLoading}
                            onSave={onSave('emails')}
                            editComponent={formObject.information.emails}
                            disabled={!updateAccountPermission}
                            isSaveButtonDisable={getSaveButtonDisabled(
                              accountData.account.emails?.find(
                                (item) => item.isPrimary
                              )?.value,
                              (watch('emails') || []).find(
                                (item) => item.isPrimary
                              )?.value
                            )}
                            buttonRef={buttonRef}
                          >
                            {' '}
                            <InfoWrapper
                              isCustomLabelHide={!updateAccountPermission}
                              field={accountInfo?.emails}
                            />
                          </Editable>
                        </pre>
                      </div>
                      <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                        <p className="ipInfo__View__Label">Website</p>
                        <pre className="ipInfo__View__Value whitespace-normal">
                          <Editable
                            onCancel={() => setIsEditing(undefined)}
                            setIsEditing={() => setIsEditing('website')}
                            isEditing={isEditing === 'website'}
                            isLoading={isLoading || isAccountUpdateLoading}
                            onSave={onSave('website')}
                            editComponent={formObject.information.website}
                            disabled={!updateAccountPermission}
                            isSaveButtonDisable={getSaveButtonDisabled(
                              accountData.account.website,
                              watch('website')
                            )}
                            buttonRef={buttonRef}
                          >
                            <InfoWrapper
                              isCustomLabelHide={!updateAccountPermission}
                              field={accountInfo.website}
                            />
                          </Editable>
                        </pre>
                      </div>

                      {isSubAccountEnable ? (
                        <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                          <p className="ipInfo__View__Label">Parent</p>
                          {parentChildData &&
                          parentChildData?.child.filter((ch) => ch.level === 4)
                            .length >= 1 ? (
                            <div className="ipInfo__View__Value whitespace-normal">
                              <span className="text-light__TextColor cursor-not-allowed">
                                <span> + Add</span>
                              </span>
                            </div>
                          ) : (
                            <pre className="ipInfo__View__Value whitespace-normal">
                              <Editable
                                onCancel={() => setIsEditing(undefined)}
                                setIsEditing={() =>
                                  setIsEditing('parent_account_id')
                                }
                                isEditing={isEditing === 'parent_account_id'}
                                isLoading={isLoading || isAccountUpdateLoading}
                                onSave={onSave('parent_account_id')}
                                editComponent={
                                  formObject.information.parent_account_id
                                }
                                disabled={!updateAccountPermission}
                                isSaveButtonDisable={getSaveButtonDisabled(
                                  accountData.account.parent_account_id,
                                  watch('parent_account_id')
                                )}
                                buttonRef={buttonRef}
                              >
                                <InfoWrapper
                                  isCustomLabelHide={!updateAccountPermission}
                                  field={accountInfo.parent_account}
                                />
                              </Editable>
                            </pre>
                          )}
                        </div>
                      ) : (
                        <></>
                      )}
                      <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                        <p className="ipInfo__View__Label">Type</p>
                        <pre className="ipInfo__View__Value whitespace-normal">
                          <Editable
                            onCancel={() => setIsEditing(undefined)}
                            setIsEditing={() => setIsEditing('account_type')}
                            isEditing={isEditing === 'account_type'}
                            isLoading={isLoading || isAccountUpdateLoading}
                            onSave={onSave('account_type')}
                            editComponent={formObject.information.account_type}
                            disabled={!updateAccountPermission}
                            isSaveButtonDisable={getSaveButtonDisabled(
                              accountData.account.account_type,
                              watch('account_type')
                            )}
                            buttonRef={buttonRef}
                          >
                            <InfoWrapper
                              isCustomLabelHide={!updateAccountPermission}
                              field={accountInfo.account_type}
                            />
                          </Editable>
                        </pre>
                      </div>
                      <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                        <p className="ipInfo__View__Label">Ownership</p>
                        <pre className="ipInfo__View__Value whitespace-normal">
                          <Editable
                            onCancel={() => setIsEditing(undefined)}
                            setIsEditing={() => setIsEditing('ownership')}
                            isEditing={isEditing === 'ownership'}
                            isLoading={isLoading || isAccountUpdateLoading}
                            onSave={onSave('ownership')}
                            editComponent={formObject.information.ownership}
                            disabled={!updateAccountPermission}
                            isSaveButtonDisable={getSaveButtonDisabled(
                              accountData.account.ownership,
                              watch('ownership')
                            )}
                            buttonRef={buttonRef}
                          >
                            <InfoWrapper
                              isCustomLabelHide={!updateAccountPermission}
                              field={accountInfo.ownership}
                            />
                          </Editable>
                        </pre>
                      </div>
                      <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                        <p className="ipInfo__View__Label">Industry</p>
                        <pre className="ipInfo__View__Value whitespace-normal">
                          <Editable
                            onCancel={() => setIsEditing(undefined)}
                            setIsEditing={() => setIsEditing('industry')}
                            isEditing={isEditing === 'industry'}
                            isLoading={isLoading || isAccountUpdateLoading}
                            onSave={onSave('industry')}
                            editComponent={formObject.information.industry}
                            disabled={!updateAccountPermission}
                            isSaveButtonDisable={getSaveButtonDisabled(
                              accountData.account.industry,
                              watch('industry')
                            )}
                            buttonRef={buttonRef}
                          >
                            <InfoWrapper
                              isCustomLabelHide={!updateAccountPermission}
                              field={accountInfo.industry}
                            />
                          </Editable>
                        </pre>
                      </div>
                      <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                        <p className="ipInfo__View__Label">Employees</p>
                        <pre className="ipInfo__View__Value whitespace-normal">
                          <Editable
                            onCancel={() => setIsEditing(undefined)}
                            setIsEditing={() => setIsEditing('employees')}
                            isEditing={isEditing === 'employees'}
                            isLoading={isLoading || isAccountUpdateLoading}
                            onSave={onSave('employees')}
                            editComponent={formObject.information.employees}
                            disabled={!updateAccountPermission}
                            isSaveButtonDisable={getSaveButtonDisabled(
                              accountData.account.employees,
                              watch('employees')
                            )}
                            buttonRef={buttonRef}
                          >
                            <InfoWrapper
                              isCustomLabelHide={!updateAccountPermission}
                              field={accountInfo.employees}
                            />
                          </Editable>
                        </pre>
                      </div>
                      <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                        <p className="ipInfo__View__Label">Annual Revenue</p>
                        <pre className="ipInfo__View__Value whitespace-normal !text-[#24BD64]">
                          <Editable
                            onCancel={() => setIsEditing(undefined)}
                            setIsEditing={() => setIsEditing('annual_revenue')}
                            isEditing={isEditing === 'annual_revenue'}
                            isLoading={isLoading || isAccountUpdateLoading}
                            onSave={onSave('annual_revenue')}
                            editComponent={
                              formObject.information.annual_revenue
                            }
                            disabled={!updateAccountPermission}
                            isSaveButtonDisable={
                              Number(accountData.account.annual_revenue) ===
                              Number(watch('annual_revenue'))
                            }
                            buttonRef={buttonRef}
                          >
                            <InfoWrapper
                              isCustomLabelHide={!updateAccountPermission}
                              field={accountInfo.annual_revenue.toString()}
                            />
                          </Editable>
                        </pre>
                      </div>
                      <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                        <p className="ipInfo__View__Label">Time Zone</p>
                        <pre className="ipInfo__View__Value whitespace-normal">
                          <Editable
                            onCancel={() => setIsEditing(undefined)}
                            setIsEditing={() => setIsEditing('timezone')}
                            isEditing={isEditing === 'timezone'}
                            isLoading={isLoading || isAccountUpdateLoading}
                            onSave={onSave('timezone')}
                            editComponent={formObject.information.timezone}
                            disabled={!updateAccountPermission}
                            isSaveButtonDisable={getSaveButtonDisabled(
                              accountData.account.timezone,
                              watch('timezone')
                            )}
                            buttonRef={buttonRef}
                          >
                            <InfoWrapper
                              isCustomLabelHide={!updateAccountPermission}
                              field={accountInfo.timezone}
                            />
                          </Editable>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Get In Touch */}
            {scheduleActivityData?.start_date ? (
              <StayInTouchReminder
                activityName={accountData.account.name}
                info={scheduleActivityData}
                setIsStayInTouchOpen={setIsStayInTouchOpen}
                model_record_id={accountId}
                getScheduleActivity={getScheduleActivity}
                isScheduleActivityLoading={isScheduleActivityLoading}
                accordion={accordion}
                openCloseAccordion={openCloseAccordion}
              />
            ) : null}
            {/* Information */}
            <div className="description__details__page mb-[30px]">
              <div
                className="section__header"
                onClick={() => openCloseAccordion('desc')}
              >
                <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_32px)] pr-[10px]">
                  Description
                </span>
                <button
                  className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[""] before:absolute before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-ipBlack__borderColor before:border-b-[2px] before:border-b-ipBlack__borderColor before:-rotate-45 before:top-[8px] ${
                    accordion.desc ? 'active' : ''
                  } `}
                >
                  .
                </button>
              </div>
              {accordion.desc && (
                <div className="details__page__description border border-whiteScreen__BorderColor rounded-[12px] p-[24px] 3xl:p-[15px]">
                  <div className="ipInfo__ViewBox w-full">
                    <pre className="ipInfo__View__Value whitespace-normal !w-full">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('description')}
                        isEditing={isEditing === 'description'}
                        isLoading={isLoading || isAccountUpdateLoading}
                        onSave={onSave('description')}
                        editComponent={formObject.descriptionInfo.description}
                        disabled={!updateAccountPermission}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          isCustomLabelHide={!updateAccountPermission}
                          field={accountInfo.description}
                        />
                      </Editable>
                    </pre>
                  </div>
                </div>
              )}
            </div>
            {/* Related Leads */}
            {relatedLeads.length > 0 && (
              <RelatedLeads
                leads={relatedLeads}
                LeadToDealChart={LeadToDealChart}
                convertedValueChart={convertedValueChart}
                avgDays={leadComplateDaysAvg}
                accordion={accordion}
                openCloseAccordion={openCloseAccordion}
              />
            )}
            {/* Related Deals */}
            {(relatedDeals.length > 0 ||
              dealFilter.won === true ||
              dealFilter.lost === true ||
              dealFilter.active === true) && (
              <RelatedDeals
                deals={relatedDeals}
                wonRationChart={wonRationChart}
                WonDealsValueChart={WonDealsValueChart}
                avgDays={dealComplateDaysAvg}
                accordion={accordion}
                openCloseAccordion={openCloseAccordion}
                dealFilter={dealFilter}
                setDealFilter={setDealFilter}
              />
            )}
            {/* Related Contact */}
            {readContactPermission &&
            accountData?.account?.AccountContacts?.filter(
              (obj) => obj.contact !== null
            )?.length ? (
              <div className="dealDetails__rc">
                <RelatedContacts
                  contacts={
                    accountData?.account?.AccountContacts?.map((val) => ({
                      contact: val?.contact,
                      job_role: val?.job_role,
                    })) as RelatedContact[]
                  }
                  accordion={accordion}
                  openCloseAccordion={openCloseAccordion}
                />
              </div>
            ) : (
              <></>
            )}

            <FollowersSection
              accordion={accordion}
              followers={accountData?.account?.account_followers}
              count={accountData?.account?.total_followers}
              openCloseAccordion={openCloseAccordion}
              module_name={ModuleNames.ACCOUNT}
              entityId={accountId || 0}
            />

            {accountData?.account?.address_details?.position?.lat &&
              accountData?.account?.address_details?.position?.lng && (
                <div className="details__address__wrapper">
                  <div className="flex flex-wrap items-center bg-[#ECF2F6] rounded-[12px] py-[10px] px-[15px] mb-[15px]">
                    <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_24px)] pl-[6px]">
                      Address
                    </span>
                  </div>
                  <div className="activity__map border border-whiteScreen__BorderColor py-[10px] px-[10px] rounded-[12px]">
                    <Map
                      data={{
                        latitude:
                          accountData?.account?.address_details?.position?.lat,
                        longitude:
                          accountData?.account?.address_details?.position?.lng,
                        name:
                          accountData?.account?.address_details?.title || '',
                      }}
                    />
                  </div>
                </div>
              )}
          </div>
          {emailTimelineModal && emailTimelineModal.isOpen ? (
            <KeepEmailTimelineModal
              isOpen
              data={emailTimelineModal.data}
              closeModal={() => {
                if (emailTimelineModal.data) {
                  const data = keepTimelineEmails?.find(
                    (k) =>
                      k.key === emailTimelineModal.data.key &&
                      k.data === emailTimelineModal.data.value
                  );
                  if (!data && setTimelineEmails && keepTimelineEmails) {
                    const keepD = {
                      ...emailTimelineModal.data,
                      keep: false,
                    };
                    keepTimelineEmails.push(keepD);
                    setTimelineEmails([...keepTimelineEmails]);
                  }
                  setEmailTimelineModal({ isOpen: false, data: null });
                }
              }}
              keepTimeline={() => {
                if (emailTimelineModal.data) {
                  const data = keepTimelineEmails?.find(
                    (k) =>
                      k.key === emailTimelineModal.data.key &&
                      k.data === emailTimelineModal.data.value
                  );
                  if (!data && setTimelineEmails && keepTimelineEmails) {
                    const keepD = {
                      ...emailTimelineModal.data,
                      keep: true,
                    };
                    keepTimelineEmails.push(keepD);
                    setTimelineEmails([...keepTimelineEmails]);
                  }
                  setEmailTimelineModal({ isOpen: false, data: null });
                }
              }}
            />
          ) : (
            <></>
          )}
          {duplicateMailModal.isOpen && (
            <DuplicateFieldWarningModal
              isOpen
              data={duplicateMailModal.data}
              closeModal={() => onCloseWarningModal()}
            />
          )}
        </>
      )}
    </>
  );
};

export default AccountInfo;
