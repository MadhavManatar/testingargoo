// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState, useRef } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

// ** Redux **
import { getDetailSection } from 'redux/slices/authSlice';
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
import Map from 'components/Map';
import DuplicateFieldWarningModal from 'components/Modal/DuplicateFieldWarningModal/DuplicateFieldWarningModal';
import RelatedContacts from './RelatedContacts';

// ** Hooks **
import usePermission from 'hooks/usePermission';
import useContactInlineFormObject from 'pages/Contact/hooks/useContactInlineFormObject';
import useResetFormValue from 'pages/Contact/hooks/useResetContactFormValue';

// ** Services **
import useContactInfo from 'pages/Contact/hooks/useContactInfo';

// ** Types **
import { AddressFormFields } from 'components/Address/types/address.types';
import { DuplicateFieldModalType } from 'components/Modal/DuplicateFieldWarningModal/types/index.types';
import {
  AddContactFormFieldsType,
  ContactDetails,
  ContactInfoPropsType,
  ContactResponseFollowers,
  DealFilter,
  RelatedLead,
  RelatedLeadData,
} from 'pages/Contact/types/contacts.types';

// ** Schema **
import { contactSchema } from 'pages/Contact/validation-schema/contacts.schema';

// ** Other **
import { getSaveButtonDisabled } from 'helper/inlineEditHelper';
import { generateContactFormData } from 'pages/Contact/helper/contacts.helper';
import { ModuleNames } from 'constant/permissions.constant';
import RelatedAccounts from './RelatedAccounts';
import RelatedLeads from './RelatedLeads';
import RelatedDeals from './RelatedDeals';
import useLeadDealChart from 'pages/Contact/hooks/useLeadDealChart';
import { useUpdateContactMutation } from 'redux/api/contactApi';

const ContactInfo = (props: ContactInfoPropsType) => {
  const {
    contactData: { contact },
    isLoading,
    setIsStayInTouchOpen,
    scheduleActivityData,
    setShowMainLoader,
    getScheduleActivity,
    isScheduleActivityLoading,
  } = props;
  const [isDuplicateAccount, setIsDuplicateAccount] =
    useState<DuplicateFieldModalType>({
      isOpen: false,
      data: null,
    });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const divRefForInputField = useRef<HTMLDivElement>(null);
  const isKeyDownCreatableRef = useRef<any>(null);
  const dispatch = useDispatch();
  const IsContactDetailsLoad = useSelector(getIsLoadDetailsLoad);
  const section = useSelector(getDetailSection);
  const { updateContactPermission } = usePermission();

  // ** States **

  const [duplicateMailModal, setDuplicateMailModal] =
    useState<DuplicateFieldModalType>({
      isOpen: false,
      data: null,
    });
  const [isEditing, setIsEditing] = useState<keyof AddContactFormFieldsType>();
  // Open Close Accordion
  const [accordion, setAccordion] = useState<{ [key: string]: boolean }>({
    ...(section?.[`${contact?.id}_contact`] || {
      contact: true,
      desc: true,
      relContact: true,
      relAccount: true,
      relLead: true,
      relDeal: true,
      followers: true,
      stay: true,
      address: true,
      social: true,
    }),
  });
  const [isKeyDownCreatable, setIsKeyDownCreatable] = useState(false);
  const [dealFilter, setDealFilter] = useState<DealFilter>({
    won: false,
    lost: false,
    active: false,
  });

  const openCloseAccordion = (accType: string) => {
    setAccordion({ ...accordion, [accType]: !accordion[accType] });
  };

  useEffect(() => {
    dispatch(
      setDetailSectionView({ [`${contact?.id}_contact`]: { ...accordion } })
    );
  }, [accordion]);
  const {
    register,
    formState: { errors },
    control,
    reset,
    watch,
    getValues,
    handleSubmit,
    setValue,
  } = useForm<AddContactFormFieldsType & AddressFormFields>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(contactSchema),
  });
  const useWatchData = useWatch({
    control,
  });

  const { fields: emailFields } = useFieldArray({ name: 'emails', control });
  const { fields: phoneFields } = useFieldArray({ name: 'phones', control });

  // ** APIS **
  const [updateContactAPI, { isLoading: updateLoading, isError }] =
    useUpdateContactMutation();

  const { contactInfo } = useContactInfo({ contact });

  // here form reset the value
  useResetFormValue({ contact: contact as ContactDetails, reset, isEditing });

  const { formObject } = useContactInlineFormObject({
    control,
    errors,
    register,
    watch,
    emailFields,
    phoneFields,
    contactData: contact,
    inlineEditing: true,
    isKeyDownCreatableRef,
    setIsKeyDownCreatable,
    defaultTimezone: {
      label: contact?.timezone || 'America/New_York',
      value: contact?.timezone || 'America/New_York',
    },
    isDuplicateAccount,
    setIsDuplicateAccount,
  });

  useEffect(() => {
    if (isEditing) {
      divRefForInputField?.current?.querySelector('input')?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    isKeyDownCreatableRef.current = null;
    setIsKeyDownCreatable(false);
  }, [isKeyDownCreatable]);

  const handleKeyDown = () => {
    const excludeFields = [
      'phones',
      'contact_owner_id',
      'reporting_to',
      'job_role',
      'timezone',
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
    isKeyDownCreatableRef.current = null;
  };

  const onSave = (key: keyof AddContactFormFieldsType) =>
    handleSubmit(async (formValues) => {
      const values = {
        [key]: formValues[`${key}`],
        ...(key !== 'emails'
          ? { emails: contact.emails }
          : { emails: getValues('emails') }),
        ...(key !== 'phones'
          ? { phones: contact.phones }
          : { phones: getValues('phones') }),
        name: getValues('name'),
      };
      const contactFormData = generateContactFormData(values, 'edit', contact);
      // send only updated data in request
      const ContactFormData = new FormData();
      ContactFormData.set(key, contactFormData.get(key) || '');

      const data = await updateContactAPI({
        id: contact.id || 0,
        data: ContactFormData,
        params: { toast: true },
      });

      if (
        'error' in data &&
        'data' in data.error &&
        data.error.data?.duplicateField &&
        data.error.data?.duplicateField?.moduleName !== ''
      ) {
        setDuplicateMailModal({
          isOpen: true,
          data: data.error.data?.duplicateField,
        });
      }
      if ('data' in data && IsContactDetailsLoad) {
        setShowMainLoader(false);
        dispatch(
          setLoadDetails({
            loadModuleDetails: { ...IsContactDetailsLoad, contacts: true },
          })
        );
      }
    });

  // when full loaded the data after editing the need to set loader false
  useEffect(() => {
    if (isLoading === false) {
      setIsEditing(undefined);
    }
  }, [isLoading]);

  const onCloseWarningModal = () => {
    setDuplicateMailModal({ isOpen: false, data: null });
    if (duplicateMailModal?.data?.field === 'name') {
      setValue('name', contactInfo.name);
    }
    if (duplicateMailModal?.data?.field === 'email' && setValue) {
      const filteredMail = (contact.emails || [])?.map((mail) => ({
        ...mail,
        value: mail.value === duplicateMailModal?.data?.value ? '' : mail.value,
      }));
      setValue(
        'emails',
        filteredMail?.length ? filteredMail : [{ value: '', is_primary: true }]
      );
    }
  };

  const relatedDataOfLeads: RelatedLead[] = [];
  contact?.related_leads?.forEach((value: RelatedLeadData) => {
    relatedDataOfLeads.push(value.lead);
  });

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
    relatedData: relatedDataOfLeads,
    dealFilter,
    setDealFilter,
  });

  return (
    <>
      <div className="contantTab__wrapper__new">
        {/* Contact Information */}
        <div className="contact__info mb-[30px]">
          <div
            className="section__header"
            onClick={() => openCloseAccordion('contact')}
          >
            <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_32px)] pr-[10px]">
              Contact Information
            </span>
            <button
              className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[""] before:absolute before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-ipBlack__borderColor before:border-b-[2px] before:border-b-ipBlack__borderColor before:-rotate-45 before:top-[8px] ${
                accordion.contact ? 'active' : ''
              } `}
            >
              .
            </button>
          </div>
          {accordion.contact && (
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
                        setIsEditing={() => setIsEditing('contact_owner_id')}
                        isEditing={isEditing === 'contact_owner_id'}
                        isLoading={isLoading || updateLoading}
                        onSave={onSave('contact_owner_id')}
                        editComponent={formObject.information.contact_owner_id}
                        disabled={!updateContactPermission}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          isCustomLabelHide={!updateContactPermission}
                          field={contactInfo.contactOwner}
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
                        isLoading={isLoading || updateLoading}
                        isError={isError}
                        onSave={onSave('name')}
                        editComponent={formObject.information.name}
                        disabled={!updateContactPermission}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          isCustomLabelHide={!updateContactPermission}
                          field={contactInfo.name}
                        />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Email</p>
                    <pre className="ipInfo__View__Value whitespace-normal">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('emails')}
                        isEditing={isEditing === 'emails'}
                        isLoading={isLoading || updateLoading}
                        onSave={onSave('emails')}
                        isError={isError}
                        editComponent={formObject.information.emails}
                        disabled={!updateContactPermission}
                        isSaveButtonDisable={getSaveButtonDisabled(
                          contact.emails?.find((item) => item.is_primary)
                            ?.value,
                          (watch('emails') || []).find(
                            (item) => item.is_primary
                          )?.value
                        )}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          isCustomLabelHide={!updateContactPermission}
                          field={contactInfo.email}
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
                        isLoading={isLoading || updateLoading}
                        onSave={onSave('phones')}
                        isError={isError}
                        editComponent={formObject.information.phones}
                        disabled={!updateContactPermission}
                        isSaveButtonDisable={getSaveButtonDisabled(
                          contact.phones?.find((item) => item.is_primary)
                            ?.value,
                          (watch('phones') || []).find(
                            (item) => item.is_primary
                          )?.value
                        )}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          isCustomLabelHide={!updateContactPermission}
                          field={contactInfo.phone?.toString()}
                        />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Department</p>
                    <pre className="ipInfo__View__Value whitespace-normal">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('department')}
                        isEditing={isEditing === 'department'}
                        isLoading={isLoading || updateLoading}
                        onSave={onSave('department')}
                        editComponent={formObject.information.department}
                        disabled={!updateContactPermission}
                        isSaveButtonDisable={getSaveButtonDisabled(
                          contact.department,
                          useWatchData.department
                        )}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          isCustomLabelHide={!updateContactPermission}
                          field={contactInfo.department}
                        />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Reporting To</p>
                    <pre className="ipInfo__View__Value whitespace-normal">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('reporting_to')}
                        isEditing={isEditing === 'reporting_to'}
                        isLoading={isLoading || updateLoading}
                        onSave={onSave('reporting_to')}
                        editComponent={formObject.information.reporting_to}
                        disabled={!updateContactPermission}
                        isSaveButtonDisable={getSaveButtonDisabled(
                          contact.reporting_to,
                          useWatchData.reporting_to
                        )}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          isCustomLabelHide={!updateContactPermission}
                          field={contactInfo.reportingTo}
                        />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Date Of Birth</p>
                    <pre className="ipInfo__View__Value whitespace-normal">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('birth_date')}
                        isEditing={isEditing === 'birth_date'}
                        isLoading={isLoading || updateLoading}
                        onSave={onSave('birth_date')}
                        editComponent={formObject.information.birth_date}
                        disabled={!updateContactPermission}
                        isSaveButtonDisable={getSaveButtonDisabled(
                          contact.birth_date,
                          useWatchData.birth_date
                        )}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          isCustomLabelHide={!updateContactPermission}
                          field={contactInfo.birth_date}
                        />
                      </Editable>
                    </pre>
                  </div>
                  <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                    <p className="ipInfo__View__Label">Job Role</p>
                    <pre className="ipInfo__View__Value whitespace-normal">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('job_role')}
                        isEditing={isEditing === 'job_role'}
                        isLoading={isLoading || updateLoading}
                        onSave={onSave('job_role')}
                        editComponent={formObject.information.job_role}
                        disabled={!updateContactPermission}
                        isSaveButtonDisable={getSaveButtonDisabled(
                          contact.job_role,
                          useWatchData.job_role
                        )}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          isCustomLabelHide={!updateContactPermission}
                          field={contactInfo.jobRole}
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
                        isLoading={isLoading || updateLoading}
                        onSave={onSave('timezone')}
                        editComponent={formObject.information.timezone}
                        disabled={!updateContactPermission}
                        isSaveButtonDisable={false}
                        buttonRef={buttonRef}
                      >
                        <InfoWrapper
                          isCustomLabelHide={!updateContactPermission}
                          field={contactInfo.timezone}
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
        {scheduleActivityData?.start_date && (
          <StayInTouchReminder
            activityName={contact.name}
            info={scheduleActivityData}
            setIsStayInTouchOpen={setIsStayInTouchOpen}
            model_record_id={contact.id}
            getScheduleActivity={getScheduleActivity}
            isScheduleActivityLoading={isScheduleActivityLoading}
            accordion={accordion}
            openCloseAccordion={openCloseAccordion}
          />
        )}
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
              <div className="inline__editing__btn__static pt-[24px] pr-[20px] pb-[9px] pl-[15px] md:pt-[15px] md:pb-[14px] md:pl-[5px] md:pr-[5px]">
                <div className="flex flex-wrap">
                  <div className="ipInfo__ViewBox !w-full">
                    <pre className="ipInfo__View__Value !w-full 3xl:!pl-0">
                      <Editable
                        onCancel={() => setIsEditing(undefined)}
                        setIsEditing={() => setIsEditing('description')}
                        isEditing={isEditing === 'description'}
                        isLoading={isLoading || updateLoading}
                        onSave={onSave('description')}
                        editComponent={formObject.descriptionInfo.description}
                        disabled={!updateContactPermission}
                      >
                        <InfoWrapper
                          isCustomLabelHide={!updateContactPermission}
                          field={contactInfo.description}
                          customLabel="Add Description"
                        />
                      </Editable>
                    </pre>
                  </div>
                </div>
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
            contactData={{
              id: contact?.id,
              name: contact?.name,
            }}
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
            contactData={{
              id: contact?.id,
              name: contact?.name,
            }}
          />
        )}
        {/* Related Contact */}
        {contact?.related_contacts?.filter((obj) => obj.contact !== null)
          ?.length > 0 && (
          <RelatedContacts
            contacts={contact.related_contacts}
            accordion={accordion}
            openCloseAccordion={openCloseAccordion}
            relatedAccountName={contact?.related_accounts[0]?.account?.name}
          />
        )}
        {/* Related Account */}
        {contact?.related_accounts?.filter((obj) => obj.account !== null)
          ?.length > 0 && (
          <RelatedAccounts
            accounts={contact.related_accounts}
            accordion={accordion}
            openCloseAccordion={openCloseAccordion}
            relatedContactData={{ id: contact?.id, name: contact?.name }}
          />
        )}
        {/* Follwer Section - inline type assigned because of contact follower type file build error */}
        <FollowersSection
          accordion={accordion}
          followers={
            (contact as ContactDetails & ContactResponseFollowers)
              ?.contact_followers
          }
          count={
            (contact as ContactDetails & ContactResponseFollowers)
              ?.total_followers
          }
          openCloseAccordion={openCloseAccordion}
          module_name={ModuleNames.CONTACT}
          entityId={contact?.id || 0}
        />

        {/* Hidden for now As per client Requirement  */}
        {/* <ContactSocial
        {/* Contact Social Hidden for now as per client requirement */}
        {/* <ContactSocial
          accordion={accordion}
          openCloseAccordion={openCloseAccordion}
        />  */}
        {/* Map */}
        {contactInfo.address_details?.position?.lat &&
          contactInfo.address_details.position?.lng && (
            <div className="details__address__wrapper sm:mb-[15px]">
              <div className="flex flex-wrap items-center bg-[#ECF2F6] rounded-[12px] py-[10px] px-[24px] pr-[10px] mb-[15px] 3xl:pl-[15px]">
                <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_32px)] pr-[10px]">
                  Address
                </span>
                <button className='section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[""] before:absolute before:top-[7px] before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-black before:border-b-[2px] before:border-b-black before:-rotate-45'>
                  .
                </button>
              </div>
              <div className="activity__map border border-whiteScreen__BorderColor py-[10px] px-[10px] rounded-[12px] 3xl:py-[5px] 3xl:px-[5px] sm:py-0 sm:px-0 sm:border-0">
                <Map
                  data={{
                    latitude: contactInfo.address_details.position.lat,
                    longitude: contactInfo.address_details.position.lng,
                    name: contactInfo.address_details.title || '',
                  }}
                />
              </div>
            </div>
          )}
      </div>
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

export default ContactInfo;
