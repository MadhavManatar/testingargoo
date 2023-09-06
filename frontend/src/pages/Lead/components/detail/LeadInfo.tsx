// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

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
import InformationSkeleton from 'components/EntityDetails/skeletons/InformationSkeleton';
import RelatedContacts from 'pages/Contact/components/detail/RelatedContacts';
import { RelatedContact } from 'pages/Contact/types/contacts.types';

// ** Hook **
import usePermission from 'hooks/usePermission';
import useLeadInfo from 'pages/Lead/hooks/useLeadInfo';
import useLeadInlineFormObject from 'pages/Lead/hooks/useLeadInlineFormObject';
import useResetFormValue from 'pages/Lead/hooks/useResetLeadFormValue';

// ** Services **

// ** Type **
import {
  AddLeadFormFieldsType,
  LeadInfoPropsType,
} from 'pages/Lead/types/lead.type';

// ** Schema **
import { leadSchema } from 'pages/Lead/validation-schema/leads.schema';

// ** Other **
import { getSaveButtonDisabled } from 'helper/inlineEditHelper';
import { generateLeadFormData } from 'pages/Lead/helper/leads.helper';
import { convertNumberOrNull } from 'utils/util';
import { ModuleNames } from 'constant/permissions.constant';
import RelatedAccounts from 'pages/Contact/components/detail/RelatedAccounts';
import { useUpdateLeadMutation } from 'redux/api/leadApi';

const LeadInfo = (props: LeadInfoPropsType) => {
  const {
    leadData,
    isLoading,
    setIsStayInTouchOpen,
    scheduleActivityData,
    isShowMainLoader,
    setShowMainLoader,
    getScheduleActivity,
    isScheduleActivityLoading,
  } = props;
  // ** Hooks **
  const buttonRef = useRef<HTMLButtonElement>(null);
  const divRefForInputField = useRef<HTMLDivElement>(null);
  const isKeyDownCreatableRef = useRef<any>(null);
  const { id } = useParams();
  const leadId = convertNumberOrNull(id);
  const dispatch = useDispatch();
  const section = useSelector(getDetailSection);
  const IsLeadDetailsLoad = useSelector(getIsLoadDetailsLoad);
  const { updateLeadPermission, readContactPermission } = usePermission();

  // ** States **
  const [isEditing, setIsEditing] = useState<keyof AddLeadFormFieldsType>();
  const [isKeyDownCreatable, setIsKeyDownCreatable] = useState(false);

  // Open Close Accordion
  const [accordion, setAccordion] = useState<{ [key: string]: boolean }>({
    ...(section?.[`${leadId}_lead`] || {
      desc: true,
      followers: true,
      lead: true,
      relContact: true,
      relAccount: true,
    }),
  });

  const openCloseAccordion = (accType: string) => {
    setAccordion({
      ...accordion,
      [accType]: !accordion[accType],
    });
  };
  useEffect(() => {
    dispatch(setDetailSectionView({ [`${leadId}_lead`]: { ...accordion } }));
  }, [accordion]);

  const [updateLeadByIdAPI, { isLoading: updateLoading }] =
    useUpdateLeadMutation();

  // ** Custom Hooks **

  const { leadInfo } = useLeadInfo({ lead: leadData.lead });

  const { related_contacts, related_account } = leadData.lead;

  const {
    register,
    formState: { errors },
    control,
    setValue,
    getValues,
    reset,
    watch,
  } = useForm<AddLeadFormFieldsType>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(leadSchema),
  });

  const { formObject } = useLeadInlineFormObject({
    leadDetail: leadData?.lead,
    control,
    errors,
    register,
    setValue,
    watch,
    setIsKeyDownCreatable,
    isKeyDownCreatableRef,
  });

  // here form reset the value
  useResetFormValue({ lead: leadData, reset, isEditing });

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
      'lead_source',
      'lead_status_id',
      'lead_owner_id',
      'lead_temp_id',
      'lead_score',
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

  const onSave = async (key: keyof AddLeadFormFieldsType) => {
    if (!errors[key]) {
      const formObj: AddLeadFormFieldsType = { [key]: getValues(`${key}`) };
      if (key === 'deal_value') {
        const updatedDealValue = getValues('deal_value')
          ?.match(/(\d+)(\.\d+)?/g)
          ?.join('');

        formObj.deal_value = updatedDealValue;
      }

      const leadForm = generateLeadFormData(
        formObj,
        'edit',
        leadData.lead.related_contacts
      );

      // send only updated data in request
      const LeadFormData = new FormData();
      LeadFormData.set(key, leadForm.get(key) || '');

      LeadFormData.append('is_deal', 'false');

      const data = await updateLeadByIdAPI({
        id: leadId || 0,
        data: LeadFormData,
        params: { toast: false },
      });

      if ('data' in data && !('error' in data) && IsLeadDetailsLoad) {
        setShowMainLoader(false);
        dispatch(
          setLoadDetails({
            loadModuleDetails: { ...IsLeadDetailsLoad, leads: true },
          })
        );
      }
    }
  };

  // when full loaded the data after editing the need to set loader false
  useEffect(() => {
    if (isLoading === false) {
      setIsEditing(undefined);
    }
  }, [isLoading]);

  return (
    <>
      {isLoading && isShowMainLoader ? (
        <InformationSkeleton infoCount={8} isDescription />
      ) : (
        <>
          {leadData.lead.id && (
            <div className="contantTab__wrapper__new">
              <div className="lead__info mb-[30px]">
                <div
                  className="section__header"
                  onClick={() => openCloseAccordion('lead')}
                >
                  <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_32px)] pr-[10px]">
                    Lead Information
                  </span>
                  <button
                    className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[""] before:absolute before:top-[12px] before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-ipBlack__borderColor before:border-b-[2px] before:border-b-ipBlack__borderColor before:-rotate-45 before:top-[8px] ${
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
                              setIsEditing={() => setIsEditing('lead_owner_id')}
                              isEditing={isEditing === 'lead_owner_id'}
                              isLoading={isLoading || updateLoading}
                              onSave={() => onSave('lead_owner_id')}
                              editComponent={
                                formObject.information.lead_owner_id
                              }
                              disabled={!updateLeadPermission}
                              buttonRef={buttonRef}
                            >
                              <InfoWrapper
                                field={leadInfo.leadOwner}
                                isCustomLabelHide={!updateLeadPermission}
                              />
                            </Editable>
                          </pre>
                        </div>
                        <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                          <p className="ipInfo__View__Label">Status</p>
                          <pre className="ipInfo__View__Value whitespace-normal">
                            <Editable
                              onCancel={() => setIsEditing(undefined)}
                              setIsEditing={() =>
                                setIsEditing('lead_status_id')
                              }
                              isEditing={isEditing === 'lead_status_id'}
                              isLoading={isLoading || updateLoading}
                              onSave={() => onSave('lead_status_id')}
                              editComponent={
                                formObject.information.lead_status_id
                              }
                              disabled={!updateLeadPermission}
                              buttonRef={buttonRef}
                            >
                              <InfoWrapper
                                field={leadInfo.leadStatus}
                                isCustomLabelHide={!updateLeadPermission}
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
                              onSave={() => onSave('name')}
                              editComponent={formObject.information.name}
                              disabled={!updateLeadPermission}
                              buttonRef={buttonRef}
                            >
                              <InfoWrapper
                                field={leadInfo.name}
                                isCustomLabelHide={!updateLeadPermission}
                              />
                            </Editable>
                          </pre>
                        </div>

                        <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                          <p className="ipInfo__View__Label">Value</p>
                          <pre className="ipInfo__View__Value whitespace-normal !text-ip__SuccessGreen">
                            <Editable
                              onCancel={() => setIsEditing(undefined)}
                              setIsEditing={() => setIsEditing('deal_value')}
                              isEditing={isEditing === 'deal_value'}
                              isLoading={isLoading || updateLoading}
                              onSave={() => onSave('deal_value')}
                              editComponent={formObject.information.deal_value}
                              disabled={!updateLeadPermission}
                              isSaveButtonDisable={
                                Number(leadData.lead.deal_value) ===
                                Number(watch('deal_value'))
                              }
                              buttonRef={buttonRef}
                            >
                              <InfoWrapper
                                field={leadInfo.dealValue}
                                isCustomLabelHide={!updateLeadPermission}
                              />
                            </Editable>
                          </pre>
                        </div>

                        <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                          <p className="ipInfo__View__Label">Source</p>
                          <pre className="ipInfo__View__Value whitespace-normal">
                            <Editable
                              onCancel={() => setIsEditing(undefined)}
                              setIsEditing={() => setIsEditing('lead_source')}
                              isEditing={isEditing === 'lead_source'}
                              isLoading={isLoading || updateLoading}
                              onSave={() => onSave('lead_source')}
                              editComponent={formObject.information.lead_source}
                              disabled={!updateLeadPermission}
                              isSaveButtonDisable={getSaveButtonDisabled(
                                leadData.lead?.lead_source?.id,
                                watch('lead_source')
                              )}
                              buttonRef={buttonRef}
                            >
                              <InfoWrapper
                                field={leadInfo.leadSource}
                                isCustomLabelHide={!updateLeadPermission}
                              />
                            </Editable>
                          </pre>
                        </div>

                        <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                          <p className="ipInfo__View__Label">Temperature</p>
                          <pre className="ipInfo__View__Value whitespace-normal">
                            <Editable
                              onCancel={() => setIsEditing(undefined)}
                              setIsEditing={() => setIsEditing('lead_temp_id')}
                              isEditing={isEditing === 'lead_temp_id'}
                              isLoading={isLoading || updateLoading}
                              onSave={() => onSave('lead_temp_id')}
                              editComponent={
                                formObject.information.lead_temp_id
                              }
                              disabled={!updateLeadPermission}
                              buttonRef={buttonRef}
                            >
                              <InfoWrapper
                                field={leadInfo.leadTemperature}
                                isCustomLabelHide={!updateLeadPermission}
                              />
                            </Editable>
                          </pre>
                        </div>

                        <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                          <p className="ipInfo__View__Label">Score</p>
                          <pre className="ipInfo__View__Value whitespace-normal">
                            <Editable
                              onCancel={() => setIsEditing(undefined)}
                              setIsEditing={() => setIsEditing('lead_score')}
                              isEditing={isEditing === 'lead_score'}
                              isLoading={isLoading || updateLoading}
                              onSave={() => onSave('lead_score')}
                              editComponent={formObject.information.lead_score}
                              disabled={!updateLeadPermission}
                              isSaveButtonDisable={getSaveButtonDisabled(
                                leadData.lead.lead_score,
                                watch('lead_score')
                              )}
                              buttonRef={buttonRef}
                            >
                              <InfoWrapper
                                field={leadInfo.leadScore}
                                isCustomLabelHide={!updateLeadPermission}
                              />
                            </Editable>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {scheduleActivityData?.start_date ? (
                <StayInTouchReminder
                  activityName={leadData.lead.name}
                  info={scheduleActivityData}
                  setIsStayInTouchOpen={setIsStayInTouchOpen}
                  model_record_id={leadId}
                  getScheduleActivity={getScheduleActivity}
                  isScheduleActivityLoading={isScheduleActivityLoading}
                  accordion={accordion}
                  openCloseAccordion={openCloseAccordion}
                />
              ) : null}
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
                    <div className="flex flex-wrap">
                      <div className="ipInfo__ViewBox !w-full">
                        <pre className="ipInfo__View__Value !w-full 3xl:!pl-0">
                          <Editable
                            onCancel={() => setIsEditing(undefined)}
                            setIsEditing={() => setIsEditing('description')}
                            isEditing={isEditing === 'description'}
                            isLoading={isLoading || updateLoading}
                            onSave={() => onSave('description')}
                            editComponent={
                              formObject.descriptionInfo.description
                            }
                            disabled={!updateLeadPermission}
                          >
                            <InfoWrapper
                              field={leadInfo.description}
                              isCustomLabelHide={!updateLeadPermission}
                            />
                          </Editable>
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {readContactPermission &&
                (related_contacts?.filter((obj) => obj.contact !== null)
                  ?.length || 0) > 0 && (
                  <div className="leadDetails__relatedContact">
                    <RelatedContacts
                      contacts={
                        related_contacts?.map((val) => ({
                          contact: val?.contact,
                          job_role: val?.job_role || undefined,
                        })) as RelatedContact[]
                      }
                      accordion={accordion}
                      openCloseAccordion={openCloseAccordion}
                    />
                  </div>
                )}

              {related_account && (
                <div className="leadDetails__relatedContact">
                  <RelatedAccounts
                    accounts={[
                      {
                        account_id: related_account?.id || 0,
                        job_role: '',
                        account: related_account,
                      },
                    ]}
                    accordion={accordion}
                    openCloseAccordion={openCloseAccordion}
                  />
                </div>
              )}

              <FollowersSection
                accordion={accordion}
                followers={leadData.lead?.lead_followers}
                count={leadData.lead?.total_followers}
                openCloseAccordion={openCloseAccordion}
                module_name={ModuleNames.LEAD}
                entityId={leadId || 0}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default LeadInfo;
