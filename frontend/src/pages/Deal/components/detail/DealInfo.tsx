// ** Import Packages ** //
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState, useRef } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

// ** Redux ** //
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
import AddDealLostModal from '../detail/AddDealLostModal';

// ** Hooks & Services **
import usePermission from 'hooks/usePermission';
import useDealInfo from 'pages/Deal/hooks/useDealInfo';
import useDealInlineFormObject from 'pages/Deal/hooks/useDealInlineFormObject';
import useResetDealFormValue from 'pages/Deal/hooks/useResetDealFormValue';

// ** Type **
import { RelatedContact } from 'pages/Contact/types/contacts.types';
import {
  AddDealFormFieldsType,
  DealInformationPropsType,
} from 'pages/Deal/types/deals.types';

// ** Schema **
import { dealSchema } from 'pages/Deal/validation-schema/deal.schema';

// ** others **
import { getSaveButtonDisabled } from 'helper/inlineEditHelper';
import generateDealFormData from 'pages/Deal/helper/deal.helper';
import { convertNumberOrNull } from 'utils/util';
import { ModuleNames } from 'constant/permissions.constant';
import RelatedAccounts from 'pages/Contact/components/detail/RelatedAccounts';
import DateFormat from 'components/DateFormat';
import { useUpdateStageByDealIdMutation } from 'redux/api/dealStageHistoryApi';
import { useUpdateLeadMutation } from 'redux/api/leadApi';

const DealInfo = (props: DealInformationPropsType) => {
  const {
    dealData,
    isLoading,
    setIsStayInTouchOpen,
    scheduleActivityData,
    setShowMainLoader,
    getScheduleActivity,
    isShowMainLoader,
    isScheduleActivityLoading,
  } = props;

  // ** hooks ** //
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isKeyDownCreatableRef = useRef<any>(null);
  const divRefForInputField = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const dealId = convertNumberOrNull(id);
  const IsDealDetailsLoad = useSelector(getIsLoadDetailsLoad);
  const dispatch = useDispatch();
  const section = useSelector(getDetailSection);

  const { updateDealPermission, readContactPermission } = usePermission();

  // ** states ** //
  const [isEditing, setIsEditing] = useState<keyof AddDealFormFieldsType>();
  const [stageLostIds, setStageLostIds] = useState<number[]>([]);
  const [openDealLostModal, setOpenDealLostModal] = useState<{
    isOpen: boolean;
    formData: AddDealFormFieldsType;
  }>({
    isOpen: false,
    formData: {},
  });
  const [isKeyDownCreatable, setIsKeyDownCreatable] = useState(false);

  const ID = `${dealId}_deal`;

  // Open Close Accordion
  const [accordion, setAccordion] = useState<{ [key: string]: boolean }>({
    ...(section?.[ID] || {
      lead: true,
      desc: true,
      followers: true,
      relContact: true,
      stay: true,
    }),
  });

  useEffect(() => {
    dispatch(setDetailSectionView({ [`${dealId}_deal`]: { ...accordion } }));
  }, [accordion]);

  // ** APIS **
  const [updateLeadByIdAPI, { isLoading: isUpdateLoading }] =
    useUpdateLeadMutation();
  const [updateDealStageByDealIDAPI, { isError }] =
    useUpdateStageByDealIdMutation();

  // ** custom hooks ** //
  const { dealInfoComponents } = useDealInfo({ dealData: dealData.lead });

  const {
    control,
    getValues,
    register,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<AddDealFormFieldsType>({
    resolver: yupResolver(dealSchema),
  });
  const useWatchData = useWatch({ control });
  const {
    fields: contactsFields,
    insert: insertContacts,
    remove: removeContacts,
  } = useFieldArray({ name: 'contacts', control });

  useResetDealFormValue({
    dealData: dealData.lead,
    reset,
    isEditing,
  });

  const { formObject } = useDealInlineFormObject({
    contactsFields,
    control,
    errors,
    getValues,
    insertContacts,
    register,
    removeContacts,
    setValue,
    watch,
    dealDetail: dealData.lead,
    inlineEditing: true,
    setStageLostIds,
    setIsKeyDownCreatable,
    isKeyDownCreatableRef,
  });

  useEffect(() => {
    if (isEditing) {
      divRefForInputField?.current?.querySelector('input')?.focus();
    }
  }, [isEditing]);

  // when full loaded the data after editing the need to set loader false
  useEffect(() => {
    if (isLoading === false) {
      setIsEditing(undefined);
    }
  }, [isLoading]);

  useEffect(() => {
    isKeyDownCreatableRef.current = '';
    setIsKeyDownCreatable(false);
  }, [isKeyDownCreatable]);

  const handleKeyDown = () => {
    const excludeFields = [
      'lead_source',
      'lead_status_id',
      'lead_owner_id',
      'lead_score',
      'deal_stage_id',
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

  const currentStageInfo = dealData.lead?.deal_stage_history?.filter(
    (stage) => stage.isCurrentActive
  );
  const currentStageDate = currentStageInfo
    ? currentStageInfo[0]?.start_time
    : '';
  const currentStageType = currentStageInfo
    ? currentStageInfo[0]?.stage.stage_type
    : '';

  const onSaveWonDate = async (key: keyof AddDealFormFieldsType) => {
    const formObj: AddDealFormFieldsType = { [key]: getValues(`${key}`) };
    if (key === 'won_date' && dealId) {
      const DealFormData = new FormData();
      DealFormData.append('old_start_date', currentStageDate as string);
      DealFormData.append('start_date', formObj.won_date as string);
      DealFormData.append(
        'currentStageType',
        currentStageType === 'Win' ? 'Won date' : 'Lost date'
      );
      const data = await updateDealStageByDealIDAPI({
        id: dealId,
        data: DealFormData,
      });
      if (data && !isError && IsDealDetailsLoad) {
        setShowMainLoader(false);
        dispatch(
          setLoadDetails({
            loadModuleDetails: {
              ...IsDealDetailsLoad,
              deals: true,
            },
          })
        );
      }
    }
  };

  const openCloseAccordion = (accType: string) => {
    setAccordion({ ...accordion, [accType]: !accordion[accType] });
  };

  const onSave = async (key: keyof AddDealFormFieldsType) => {
    if (!errors[key]) {
      const formObj: AddDealFormFieldsType = { [key]: getValues(`${key}`) };
      if (key === 'deal_value') {
        const updatedDealValue = getValues('deal_value')
          ?.match(/(\d+)(\.\d+)?/g)
          ?.join('');
        formObj.deal_value = updatedDealValue;
      }

      if (key === 'probability') {
        const updatedProbability = getValues('probability')
          ?.match(/(\d+)(\.\d+)?/g)
          ?.join('');
        formObj.probability = updatedProbability;
      }

      const TempDealFormData = generateDealFormData(
        formObj,
        'edit',
        dealData.lead.related_contacts
      );

      const DealFormData = new FormData();
      DealFormData.set(key, TempDealFormData.get(key) || '');
      DealFormData.append('is_deal', 'true');
      if (key === 'deal_stage_id') {
        DealFormData.set(
          'pipeline_id',
          String(dealData?.lead?.pipeline_id) || ''
        );
      }

      if (
        stageLostIds.includes(Number(formObj.deal_stage_id || 0)) &&
        Number(dealData?.lead?.deal_stage_id || 0) !==
          Number(formObj?.deal_stage_id || 0)
      ) {
        setOpenDealLostModal({
          formData: formObj,
          isOpen: true,
        });
      } else {
        const data = await updateLeadByIdAPI({
          id: dealId || 0,
          data: DealFormData,
          params: { toast: false },
        });

        if ('data' in data && !('error' in data) && IsDealDetailsLoad) {
          setShowMainLoader(false);
          dispatch(
            setLoadDetails({
              loadModuleDetails: {
                ...IsDealDetailsLoad,
                deals: true,
              },
            })
          );
        }
      }
    }
  };

  const updateDealForLostDeal = async (deal_stage_id: number) => {
    const DealFormData = new FormData();

    DealFormData.append('is_deal', 'true');
    DealFormData.set('pipeline_id', String(dealData?.lead?.pipeline_id) || '');
    DealFormData.set('deal_stage_id', String(deal_stage_id));

    const data = await updateLeadByIdAPI({
      id: dealId || 0,
      data: DealFormData,
      params: { toast: false },
    });

    if ('data' in data && !('error' in data) && IsDealDetailsLoad) {
      setShowMainLoader(false);
      dispatch(
        setLoadDetails({
          loadModuleDetails: {
            ...IsDealDetailsLoad,
            deals: true,
          },
        })
      );
    }
  };

  const onCancel = () => setIsEditing(undefined);

  const closeDealLostModal = () => {
    setOpenDealLostModal({
      ...openDealLostModal,
      isOpen: false,
    });
  };

  return (
    <>
      {isLoading && isShowMainLoader ? (
        <InformationSkeleton infoCount={8} isDescription />
      ) : (
        <div className="contantTab__wrapper__new">
          <div className="deal__info mb-[30px]">
            <div
              className="section__header"
              onClick={() => openCloseAccordion('lead')}
            >
              <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_32px)] pr-[10px]">
                Deal Information
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
                          onCancel={onCancel}
                          setIsEditing={() => setIsEditing('lead_owner_id')}
                          isEditing={isEditing === 'lead_owner_id'}
                          isLoading={isLoading || isUpdateLoading}
                          onSave={() => onSave('lead_owner_id')}
                          editComponent={formObject?.information?.lead_owner_id}
                          disabled={!updateDealPermission}
                          isSaveButtonDisable={false}
                          buttonRef={buttonRef}
                        >
                          <InfoWrapper
                            isCustomLabelHide={!updateDealPermission}
                            field={dealInfoComponents?.dealOwner}
                          />
                        </Editable>
                      </pre>
                    </div>
                    <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                      <p className="ipInfo__View__Label">Status</p>
                      <pre className="ipInfo__View__Value whitespace-normal">
                        <Editable
                          setIsEditing={() => setIsEditing('lead_status_id')}
                          isEditing={isEditing === 'lead_status_id'}
                          isLoading={isLoading || isUpdateLoading}
                          onSave={() => onSave('lead_status_id')}
                          onCancel={onCancel}
                          editComponent={formObject.information.lead_status_id}
                          disabled={!updateDealPermission}
                          isSaveButtonDisable={false}
                          buttonRef={buttonRef}
                        >
                          <InfoWrapper
                            isCustomLabelHide={!updateDealPermission}
                            field={dealInfoComponents.dealStatus}
                          />
                        </Editable>
                      </pre>
                    </div>

                    <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                      <p className="ipInfo__View__Label">Name</p>
                      <pre className="ipInfo__View__Value whitespace-normal">
                        <Editable
                          setIsEditing={() => setIsEditing('name')}
                          isEditing={isEditing === 'name'}
                          isLoading={isLoading || isUpdateLoading}
                          onSave={() => onSave('name')}
                          onCancel={onCancel}
                          editComponent={formObject.information.name}
                          disabled={!updateDealPermission}
                          isSaveButtonDisable={false}
                          buttonRef={buttonRef}
                        >
                          <InfoWrapper
                            isCustomLabelHide={!updateDealPermission}
                            field={dealInfoComponents.dealName}
                          />
                        </Editable>
                      </pre>
                    </div>

                    <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                      <p className="ipInfo__View__Label">Value</p>
                      <pre className="ipInfo__View__Value whitespace-normal !text-[#24BD64]">
                        <Editable
                          setIsEditing={() => setIsEditing('deal_value')}
                          isEditing={isEditing === 'deal_value'}
                          isLoading={isLoading || isUpdateLoading}
                          onSave={() => onSave('deal_value')}
                          onCancel={onCancel}
                          editComponent={formObject.information.deal_value}
                          disabled={!updateDealPermission}
                          isSaveButtonDisable={
                            Number(dealData?.lead?.deal_value || 0) ===
                            Number(watch('deal_value') || 0)
                          }
                          buttonRef={buttonRef}
                        >
                          <InfoWrapper
                            isCustomLabelHide={!updateDealPermission}
                            field={dealInfoComponents.dealValue}
                          />
                        </Editable>
                      </pre>
                    </div>

                    <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                      <p className="ipInfo__View__Label">Source</p>
                      <pre className="ipInfo__View__Value whitespace-normal">
                        <Editable
                          setIsEditing={() => setIsEditing('lead_source')}
                          isEditing={isEditing === 'lead_source'}
                          isLoading={isLoading || isUpdateLoading}
                          onSave={() => onSave('lead_source')}
                          onCancel={onCancel}
                          editComponent={formObject?.information?.lead_source}
                          disabled={!updateDealPermission}
                          isSaveButtonDisable={getSaveButtonDisabled(
                            dealData?.lead?.lead_source?.id,
                            useWatchData.lead_source
                          )}
                          buttonRef={buttonRef}
                        >
                          <InfoWrapper
                            isCustomLabelHide={!updateDealPermission}
                            field={dealInfoComponents?.dealSource}
                          />
                        </Editable>
                      </pre>
                    </div>

                    <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                      <p className="ipInfo__View__Label">Stage</p>
                      <pre className="ipInfo__View__Value whitespace-normal">
                        <Editable
                          setIsEditing={() => setIsEditing('deal_stage_id')}
                          isEditing={isEditing === 'deal_stage_id'}
                          isLoading={isLoading || isUpdateLoading}
                          onSave={() => onSave('deal_stage_id')}
                          onCancel={onCancel}
                          editComponent={formObject?.information?.deal_stage_id}
                          disabled={!updateDealPermission}
                          buttonRef={buttonRef}
                        >
                          <InfoWrapper
                            isCustomLabelHide={!updateDealPermission}
                            field={dealInfoComponents.dealStage}
                          />
                        </Editable>
                      </pre>
                    </div>
                    <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                      <p className="ipInfo__View__Label">Score</p>
                      <pre className="ipInfo__View__Value whitespace-normal">
                        <Editable
                          setIsEditing={() => setIsEditing('lead_score')}
                          isEditing={isEditing === 'lead_score'}
                          isLoading={isLoading || isUpdateLoading}
                          onSave={() => onSave('lead_score')}
                          onCancel={onCancel}
                          editComponent={formObject.information.deal_score}
                          disabled={!updateDealPermission}
                          isSaveButtonDisable={
                            Number(dealData?.lead?.lead_score || 0) ===
                            Number(watch('lead_score') || 0)
                          }
                          buttonRef={buttonRef}
                        >
                          <InfoWrapper
                            isCustomLabelHide={!updateDealPermission}
                            field={dealInfoComponents.dealScore}
                          />
                        </Editable>
                      </pre>
                    </div>
                    <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                      <p className="ipInfo__View__Label">Closing Date</p>
                      <pre className="ipInfo__View__Value whitespace-normal">
                        <Editable
                          setIsEditing={() => setIsEditing('closing_date')}
                          isEditing={isEditing === 'closing_date'}
                          isLoading={isLoading || isUpdateLoading}
                          onSave={() => onSave('closing_date')}
                          onCancel={onCancel}
                          editComponent={formObject?.information?.closing_date}
                          disabled={!updateDealPermission}
                          isSaveButtonDisable={getSaveButtonDisabled(
                            dealData?.lead?.closing_date,
                            useWatchData.closing_date
                          )}
                          buttonRef={buttonRef}
                        >
                          <InfoWrapper
                            isCustomLabelHide={!updateDealPermission}
                            field={dealInfoComponents.closingDate}
                          />
                        </Editable>
                      </pre>
                    </div>
                    <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                      <p className="ipInfo__View__Label">Probability</p>
                      <pre className="ipInfo__View__Value whitespace-normal">
                        <Editable
                          setIsEditing={() => setIsEditing('probability')}
                          isEditing={isEditing === 'probability'}
                          isLoading={isLoading || isUpdateLoading}
                          onSave={() => onSave('probability')}
                          onCancel={onCancel}
                          editComponent={formObject?.information?.probability}
                          disabled={!updateDealPermission}
                          isSaveButtonDisable={getSaveButtonDisabled(
                            dealData?.lead?.probability,
                            watch('probability') === '0 %'
                              ? dealData?.lead?.probability
                              : useWatchData.probability
                          )}
                          buttonRef={buttonRef}
                        >
                          <InfoWrapper
                            isCustomLabelHide={!updateDealPermission}
                            field={dealInfoComponents.probability}
                          />
                        </Editable>
                      </pre>
                    </div>
                    <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
                      <p className="ipInfo__View__Label">
                        {currentStageType === 'Win'
                          ? 'Won'
                          : currentStageType === 'Lost'
                          ? 'Lost'
                          : 'Won/Lost'}{' '}
                        Date
                      </p>
                      {currentStageType === 'Win' ||
                      currentStageType === 'Lost' ? (
                        <pre className="ipInfo__View__Value whitespace-normal">
                          <Editable
                            setIsEditing={() => setIsEditing('won_date')}
                            isEditing={isEditing === 'won_date'}
                            isLoading={isLoading || isUpdateLoading}
                            onSave={() => onSaveWonDate('won_date')}
                            onCancel={onCancel}
                            editComponent={formObject?.information?.won_date}
                            disabled={!updateDealPermission}
                            buttonRef={buttonRef}
                          >
                            <InfoWrapper
                              field={
                                <DateFormat
                                  format="EEEE, d MMM yyyy"
                                  date={currentStageDate}
                                />
                              }
                            />
                          </Editable>
                        </pre>
                      ) : (
                        <span className="ipInfo__View__Value whitespace-normal">
                          -
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {scheduleActivityData?.start_date ? (
            <StayInTouchReminder
              activityName={dealData.lead.name}
              info={scheduleActivityData}
              setIsStayInTouchOpen={setIsStayInTouchOpen}
              model_record_id={dealId}
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
              <div className="details__page__description border border-[#CCCCCC]/50 rounded-[12px] p-[24px] 3xl:p-[15px]">
                <div className="flex flex-wrap">
                  <div className="ipInfo__ViewBox !w-full">
                    <pre className="ipInfo__View__Value !w-full 3xl:!pl-0">
                      <Editable
                        setIsEditing={() => setIsEditing('description')}
                        isEditing={isEditing === 'description'}
                        isLoading={isLoading || isUpdateLoading}
                        onSave={() => onSave('description')}
                        onCancel={onCancel}
                        editComponent={formObject.descriptionInfo.description}
                        disabled={!updateDealPermission}
                      >
                        <InfoWrapper
                          isCustomLabelHide={!updateDealPermission}
                          field={dealInfoComponents.description}
                        />
                      </Editable>
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
          {readContactPermission &&
            (dealData?.lead?.related_contacts?.filter(
              (obj) => obj.contact !== null
            )?.length || 0) > 0 && (
              <div className="dealDetails__rc">
                <RelatedContacts
                  contacts={
                    dealData.lead.related_contacts?.map((val) => ({
                      contact: val?.contact,
                      job_role: val?.job_role || undefined,
                    })) as RelatedContact[]
                  }
                  accordion={accordion}
                  openCloseAccordion={openCloseAccordion}
                />
              </div>
            )}

          {dealData?.lead?.related_account && (
            <div className="leadDetails__relatedContact">
              <RelatedAccounts
                accounts={[
                  {
                    account_id: dealData?.lead?.related_account?.id || 0,
                    job_role: '',
                    account: dealData?.lead?.related_account,
                  },
                ]}
                accordion={accordion}
                openCloseAccordion={openCloseAccordion}
              />
            </div>
          )}

          <FollowersSection
            accordion={accordion}
            followers={dealData.lead?.lead_followers}
            count={dealData.lead?.total_followers}
            openCloseAccordion={openCloseAccordion}
            module_name={ModuleNames.DEAL}
            entityId={dealId || 0}
          />
        </div>
      )}
      {openDealLostModal.isOpen && (
        <AddDealLostModal
          isOpen={openDealLostModal.isOpen}
          closeModal={closeDealLostModal}
          id={dealId}
          stageId={dealData?.lead?.deal_stage_id}
          onAdd={() => {
            if (openDealLostModal?.formData?.deal_stage_id) {
              updateDealForLostDeal(openDealLostModal?.formData?.deal_stage_id);
            }
          }}
          isEditPage
        />
      )}
    </>
  );
};

export default DealInfo;
