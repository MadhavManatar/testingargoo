import Tippy from '@tippyjs/react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ** Components **
import { TableActionButton } from 'components/Button/TableActionButton';
import DateFormat from 'components/DateFormat';
import Dropdown from 'components/Dropdown';
import EntityCard from 'components/EntityDetails/QuickLookCard/EntityCard';
import StayInTouch from 'components/EntityDetails/StayInTouch';
import { scheduleActivityResponse } from 'components/EntityDetails/StayInTouch/types/stay-in-touch.type';
import { AssignTagsProps, HeaderInfo } from 'components/EntityDetails/types';
import Icon from 'components/Icon';
import { DetailHeaderEmail } from 'components/detail-components/detail-header-email';
import DealStageArrowHeaderSkeleton from 'pages/Deal/skeletons/DealStageArrowHeaderSkeleton';
import AuthGuard from 'pages/auth/components/AuthGuard';
import AddDealWonLostModal from '../AddDealWonLostModal';
import AddDealLostModal from './AddDealLostModal';

// ** Redux **
import { setLoadTimeLines } from 'redux/slices/commonSlice';

// ** Hook & Service **
import { useDealStages } from 'pages/Deal/hooks/useDealStages';

// ** Types **
import { ContactBasicForRelated } from 'pages/Contact/types/contacts.types';
import { DealDetailsType } from 'pages/Deal/types/deals.types';

// ** Constants **
import { ModalType } from 'components/EntityDetails/constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import {
  ActivityPermissions,
  BasicPermissionTypes,
  ModuleNames,
  POLYMORPHIC_MODELS,
  TagPermissions,
} from 'constant/permissions.constant';

// ** Util **
import { setUrlParams, usCurrencyFormat } from 'utils/util';

// ** Helper **
import { useUpdateDealStageMutation } from 'redux/api/dealStageHistoryApi';
import DetailHeaderPhone from 'components/detail-components/detail-header-phone';

interface DealDetailMobileHeaderInterface {
  dealId: number;
  dealDetails: DealDetailsType;
  setReRenderOnStage: React.Dispatch<React.SetStateAction<boolean>>;
  reRenderOnStage: boolean;
  assignedTags: AssignTagsProps;
  deleteAssignedTag: (deleteId: number) => Promise<void>;
  editTagsPermission: boolean;
  headerInfo: HeaderInfo;
  primaryContact: ContactBasicForRelated | undefined;
  openModal: (EmailModalType: ModalType) => void;
  setIsLinkDocument: React.Dispatch<React.SetStateAction<boolean>>;
  closingDateColor: string | undefined;
  getScheduleActivity: (id: number) => Promise<void>;
  isScheduleActivityLoading: boolean;
  isStayInTouchOpen: boolean;
  setIsStayInTouchOpen: React.Dispatch<React.SetStateAction<boolean>>;
  scheduleActivityData: scheduleActivityResponse;
  job_role: string | undefined;
}

const DealDetailMobileHeader = (props: DealDetailMobileHeaderInterface) => {
  const {
    dealId,
    dealDetails,
    setReRenderOnStage,
    reRenderOnStage,
    assignedTags,
    deleteAssignedTag,
    editTagsPermission,
    headerInfo,
    primaryContact,
    openModal,
    setIsLinkDocument,
    closingDateColor,
    getScheduleActivity,
    isScheduleActivityLoading,
    isStayInTouchOpen,
    scheduleActivityData,
    setIsStayInTouchOpen,
    job_role,
  } = props;

  const { closing_date, related_account } = dealDetails;

  const navigate = useNavigate();
  const {
    currentActiveStage,
    dealStageArray,
    getDealStagesWithAge,
    lostStageId,
    setCurrentActiveStage,
    dealStageLoading,
  } = useDealStages({ dealId: dealDetails?.id });

  const [updateDealStageAPI] = useUpdateDealStageMutation();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState<{
    open: boolean;
    stageType: string;
  }>({
    open: false,
    stageType: '',
  });

  const [openDealLostModal, setOpenDealLostModal] = useState<boolean>(false);
  const [currentStageId, setCurrentStageId] = useState<number>();

  useEffect(() => {
    if (dealDetails?.id || reRenderOnStage) {
      getDealStagesWithAge();
    }
  }, [dealDetails?.id, reRenderOnStage]);

  const openDealWonLostModal = (type: 'Won' | 'Lost') => {
    setIsOpen({ open: true, stageType: type });
  };

  const closeDealWonLostModal = () => {
    setIsOpen({ open: false, stageType: '' });
  };

  const onClickUpdateDeal = (data: {
    id: number;
    stage: string;
    age: string;
  }) => {
    if (data.id !== currentActiveStage?.id) {
      if (lostStageId.includes(data.id)) {
        setOpenDealLostModal(true);
        setCurrentStageId(data.id);
      } else {
        updateDealStage(data.id);
        const stageDetails = {
          id: data.id,
          value: data.stage,
          age: data.age,
        };
        setCurrentActiveStage(stageDetails);
      }
    }
  };

  const updateDealStage = async (stage_id: number) => {
    const DealFormData = new FormData();
    DealFormData.append('stage_id', stage_id.toString());
    DealFormData.append('is_deal', 'true');
    DealFormData.append('deal_id', dealDetails.id?.toString() || '');
    const data = await updateDealStageAPI({ data: DealFormData });
    if (data) {
      setReRenderOnStage(true);
      dispatch(setLoadTimeLines({ timeline: true }));
    }
  };

  const closeDealLostModal = (data?: string) => {
    setOpenDealLostModal(false);
    if (data === 'success') {
      const stageDetails2 = {
        id: currentStageId as number,
        value: '',
        age: '',
      };
      setCurrentActiveStage(stageDetails2);
    }
  };

  const stageList = (close: () => void) => {
    return (
      <ul className="tippy__dropdown__ul">
        {(dealStageArray || []).map((item) => {
          return (
            <li className="item" key={item.id}>
              <div
                onClick={() => {
                  onClickUpdateDeal({
                    id: item.id,
                    stage: item.value,
                    age: item.age,
                  });
                  close();
                }}
                className="item__link"
              >
                <div className="item__text"> {item.label}</div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  const currentActiveStageIndex =
    dealStageArray.findIndex((val) => val.id === currentActiveStage?.id) + 1;

  const redirectToAddActivity = () => {
    const entityData = {
      id: dealDetails?.id,
      name: dealDetails?.name || '',
      type: ModuleNames.DEAL,
    };
    const relatedEntityData = {
      ...(dealDetails?.related_contacts?.[0]?.contact?.id && {
        contact: {
          id: dealDetails?.related_contacts[0]?.contact?.id,
          name: dealDetails?.related_contacts[0]?.contact?.name,
        },
      }),
      ...(dealDetails?.related_account?.id && {
        account: {
          id: dealDetails?.related_account?.id,
          name: dealDetails?.related_account?.name,
        },
      }),
    };
    navigate(PRIVATE_NAVIGATION.activities.AddActivityMobileView, {
      state: {
        entityData,
        relatedEntityData,
      },
    });
  };
  const contactCard = useCallback(
    (accountCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const {
        close,
        setIsOpen: dropdownSetIsOpen,
        isOpen: isParentOpen,
      } = accountCardProps;
      const contactPrimaryEmail = (primaryContact?.emails || [])?.filter(
        (val) => val.is_primary
      )?.[0]?.value;
      const accountPrimaryPhone = (primaryContact?.phones || [])?.filter(
        (val) => val.is_primary
      )?.[0];
      const address = {
        address1: primaryContact?.address1 || '',
        address2: primaryContact?.address2 || '',
        state: primaryContact?.state?.state_code || '',
        city: primaryContact?.city || '',
        country: primaryContact?.country?.name || '',
        zip: primaryContact?.zip || '',
      };

      const checkAddressLength = Object.values(address).find(
        (element) => element
      );

      return (
        <>
          {primaryContact?.name && Boolean(primaryContact?.id) && (
            <EntityCard
              modelName={ModuleNames.CONTACT}
              id={primaryContact?.id}
              name={primaryContact?.name}
              email={contactPrimaryEmail}
              phone={accountPrimaryPhone?.value?.toString()}
              phoneType={accountPrimaryPhone?.phoneType || ''}
              {...(!!checkAddressLength && { address })}
              {...{
                close,
                setIsOpen: dropdownSetIsOpen,
                isOpen: isParentOpen,
              }}
            />
          )}
        </>
      );
    },
    [primaryContact]
  );

  const accountCard = useCallback(
    (accountCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const {
        close,
        setIsOpen: dropdownSetIsOpen,
        isOpen: isParentOpen,
      } = accountCardProps;
      const accountPrimaryEmail = (related_account?.emails || [])?.filter(
        (val) => val.isPrimary
      )?.[0]?.value;
      const accountPrimaryPhone = (related_account?.phones || [])?.filter(
        (val) => val.isPrimary
      )?.[0];

      const address = {
        address1: related_account?.address1 || '',
        address2: related_account?.address2 || '',
        state: related_account?.state?.state_code || '',
        city: related_account?.city || '',
        country: related_account?.country?.name || '',
        zip: related_account?.zip || '',
      };

      const checkAddressLength = Object.values(address).find(
        (element) => element
      );

      return (
        <>
          {related_account?.name && Boolean(related_account?.id) && (
            <EntityCard
              modelName={ModuleNames.ACCOUNT}
              id={related_account?.id as number}
              name={related_account?.name}
              email={accountPrimaryEmail}
              phone={accountPrimaryPhone?.value?.toString()}
              phoneType={accountPrimaryPhone?.phoneType || ''}
              {...(!!checkAddressLength && { address })}
              {...{ close, setIsOpen: dropdownSetIsOpen, isOpen: isParentOpen }}
            />
          )}
        </>
      );
    },
    [related_account]
  );

  return (
    <>
      {dealStageLoading ? (
        <DealStageArrowHeaderSkeleton />
      ) : (
        <>
          <div className="details__page__topHeader__M contact__details__page__topHeader__M border-b border-b-[#CCCCCC]/50 pb-[8px] mb-[17px] hidden sm:block">
            <div className="flex justify-between items-center mb-[20px]">
              <div className="details__mobile__act__type flex flex-wrap items-center w-[calc(100%_-_148px)] pr-[10px]">
                <Icon
                  className="bg-primaryColor rounded-[8px] w-[43px] h-[43px] !p-[7px]"
                  iconType="phoneFilled"
                />
                <p className="text-[16px] font-biotif__Medium text-[#2E3234] w-[calc(100%_-_45px)] pl-[7px] whitespace-pre overflow-hidden text-ellipsis">
                  Deal
                </p>
              </div>
              <div className="action__btns__mobile inline-flex items-center">
                <button
                  onClick={() => {
                    navigate(
                      setUrlParams(PRIVATE_NAVIGATION.deals.edit, dealId)
                    );
                  }}
                  type="button"
                  className="editACT__btn__M"
                >
                  <Icon
                    className="!w-[32px] !h-[32px] p-[4px] rounded-[6px] bg-[#E6E6E6] duration-500 hover:bg-primaryColor"
                    iconType="editPencilFilledIcon"
                  />
                </button>
                <button
                  onClick={() => openDealWonLostModal('Won')}
                  className="deal__lose__btn ml-[7px]"
                >
                  <Icon
                    className="!w-[32px] !h-[32px] p-[7px] rounded-[6px] duration-500 bg-[#27AE60] hover:bg-ip__SuccessGreen__hoverDark"
                    iconType="dealWonFilledIcon"
                  />
                </button>
                <button
                  onClick={() => openDealWonLostModal('Lost')}
                  className="deal__won__btn ml-[7px]"
                >
                  <Icon
                    className="!w-[32px] !h-[32px] p-[7px] rounded-[6px] duration-500 bg-[#D30E17] hover:bg-ip__Red__hoverDark"
                    iconType="dealLoseFilledIcon"
                  />
                </button>
                <button className="details__page__toggleBtn__M ml-[5px]">
                  <Icon
                    className="!w-[32px] !h-[32px] p-[8px] rounded-[6px] duration-500 hover:bg-[#E6E6E6]"
                    iconType="toggle3dotsIcon"
                  />
                </button>
              </div>
            </div>
            <div className="deal__stage__M bg-[#27AE60]/10 rounded-[10px] p-[14px] mb-[20px]">
              {currentActiveStage?.value ? (
                <div className="flex flex-wrap items-center justify-between mb-[5px]">
                  <h3 className="text-[16px] font-biotif__Medium text-black whitespace-pre overflow-hidden text-ellipsis max-w-[calc(100%_-_163px)] pr-[8px]">
                    {currentActiveStage?.value}
                  </h3>
                  <Dropdown
                    className="tippy__deal__stage"
                    placement="bottom"
                    content={({ close }) => stageList(close)}
                  >
                    <button className="deal__stage__dropdown whitespace-pre overflow-hidden text-ellipsis bg-[#27AE60] py-[4px] px-[10px] pr-[37px] text-white text-[14px] font-biotif__Medium rounded-[6px] h-[32px] duration-500 hover:bg-ip__SuccessGreen__hoverDark relative before:content-[''] before:w-[8px] before:h-[8px] before:border-[2px] before:border-white before:absolute before:top-[10px] before:right-[12px] before:rotate-45 before:!border-t-0 before:!border-l-0 after:content-[''] after:absolute after:top-[8px] after:right-[28px] after:w-[2px] after:h-[14px] after:bg-white/50">
                      <span className="inline-block max-w-[115px] overflow-hidden text-ellipsis">
                        {currentActiveStage?.value || 'Change Stage'}
                      </span>
                    </button>
                  </Dropdown>
                </div>
              ) : (
                <></>
              )}
              {currentActiveStage?.age ? (
                <div className="age__spent flex flex-wrap">
                  <div className="label text-[12px] font-biotif__SemiBold text-[#979899] pr-[5px]">
                    Age Spent:{' '}
                  </div>
                  <div className="value text-[12px] font-biotif__SemiBold text-black">
                    {currentActiveStage?.age}
                  </div>
                </div>
              ) : (
                <></>
              )}

              <div className="progressBar bg-[#24BD64]/30 w-full h-[8px] rounded-[50px] mt-[14px]">
                <div
                  className="h-full bg-[#24BD64] rounded-[50px]"
                  style={{
                    width: `${
                      (currentActiveStageIndex * 100) / dealStageArray.length
                    }%`,
                  }}
                />
              </div>
            </div>
            <div className="flex flex-wrap">
              <h3 className="text-[#2E3234] text-[18px] font-biotif__Medium mr-[10px] mb-[3px]">
                {dealDetails?.name}
              </h3>

              {assignedTags?.list?.length > 0 ? (
                <div className="badge__wrapper mb-[12px] text-primaryColor">
                  {assignedTags?.list.map((item) => {
                    return (
                      <span
                        key={item?.tag?.id}
                        style={{ backgroundColor: item?.tag?.color }}
                        className="badge square__round primary__badge mr-[8px] mb-[5px] py-[3px] px-[8px]"
                      >
                        {item?.tag?.name}
                        <button
                          disabled={!editTagsPermission}
                          onClick={() => deleteAssignedTag(item?.tag?.id)}
                          className="close__btn w-[10px] h-[10px] ml-[6px] relative top-0"
                        >
                          .
                        </button>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <></>
              )}
            </div>
            {related_account?.name ? (
              <Dropdown
                className="quickView__accContact__tippy"
                zIndex={10}
                hideOnClick
                content={accountCard}
              >
                <button
                  type="button"
                  className="hover:text-primaryColorSD cursor-pointer hover:underline"
                >
                  {related_account?.name}
                </button>
              </Dropdown>
            ) : (
              <></>
            )}

            {primaryContact?.name || job_role ? (
              <h5 className="text-[#2E3234] text-[16px] leading-[18px] font-biotif__Regular mb-[5px]">
                <Dropdown
                  className="quickView__accContact__tippy"
                  zIndex={10}
                  hideOnClick
                  content={contactCard}
                >
                  <button
                    type="button"
                    className="hover:text-primaryColorSD cursor-pointer hover:underline"
                  >
                    {primaryContact?.name}
                  </button>
                </Dropdown>
                , {job_role}
              </h5>
            ) : (
              <></>
            )}

            <div className="contact__details mt-[0px]">
              {headerInfo.phone || headerInfo.email ? (
                <>
                  {headerInfo.phone ? (
                    <div className="leading-normal">
                      <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
                        <a
                          className=" inline-flex flex-wrap items-center text-[14px] text-primaryColor font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis max-w-full hover:underline"
                          href={`tel:${headerInfo.phone}`}
                        >
                          {headerInfo.phone}
                        </a>
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}
                  {headerInfo.email ? (
                    <div className="leading-normal">
                      <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
                        <a
                          className=" inline-flex flex-wrap items-center text-[14px] text-primaryColor font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis max-w-full hover:underline"
                          href={`mailto:${headerInfo.email}`}
                        >
                          {headerInfo.email}
                        </a>
                      </p>
                    </div>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <></>
              )}
              <div className="leading-normal">{headerInfo?.title3}</div>
            </div>

            <div className="buttons__wrapper socialBtns__wrapper inline-flex flex-wrap items-center mt-[14px]">
              <DetailHeaderEmail email={headerInfo.email} />
              <DetailHeaderPhone
                type={headerInfo?.phoneType || ''}
                number={headerInfo?.phone?.toString()}
              />
              <AuthGuard
                permissions={[
                  {
                    module: ModuleNames.NOTE,
                    type: BasicPermissionTypes.CREATE,
                  },
                ]}
              >
                <Tippy zIndex={5} content="Notes">
                  <button
                    className="inline-block mr-[20px] mb-[10px] sm:mr-[13px]"
                    onClick={() => openModal(ModalType.NOTE)}
                  >
                    <Icon
                      className="highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[8px]"
                      iconType="mobileMenuFilled"
                    />
                  </button>
                </Tippy>
              </AuthGuard>
              <AuthGuard
                permissions={[
                  {
                    module: ModuleNames.ATTACHMENT,
                    type: BasicPermissionTypes.CREATE,
                  },
                ]}
              >
                <TableActionButton
                  filedArray={[
                    {
                      label: 'Link',
                      onClick: () => {
                        openModal(ModalType.ATTACHMENT);
                        setIsLinkDocument(true);
                      },
                    },
                    {
                      label: 'File',
                      onClick: () => {
                        openModal(ModalType.ATTACHMENT);
                        setIsLinkDocument(false);
                      },
                    },
                  ]}
                  buttonChild={
                    <Icon
                      className="highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[8px]"
                      iconType="attachmentFilledIcon"
                    />
                  }
                  buttonClassName="inline-block mr-[20px] mb-[10px] sm:mr-[13px]"
                  tippyMessage="Documents"
                />
              </AuthGuard>
              <AuthGuard
                permissions={[
                  { module: ModuleNames.TAG, type: TagPermissions.DEAL },
                ]}
              >
                <Tippy zIndex={5} content="Tags">
                  <button
                    className="inline-block mr-[20px] mb-[10px] sm:mr-[13px]"
                    onClick={() => openModal(ModalType.TAG)}
                  >
                    <Icon
                      className="highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[8px]"
                      iconType="offerTagsFilledIcon"
                    />
                  </button>
                </Tippy>
              </AuthGuard>
              <AuthGuard
                permissions={[
                  {
                    module: ModuleNames.ACTIVITY,
                    type: ActivityPermissions.DEAL,
                  },
                ]}
              >
                <Tippy zIndex={5} content="Activity">
                  <button
                    className="inline-block mr-[20px] mb-[10px] sm:mr-[13px]"
                    onClick={() => redirectToAddActivity()}
                  >
                    <Icon
                      className="highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[8px]"
                      iconType="activitiesFilledBlackIcon"
                    />
                  </button>
                </Tippy>
              </AuthGuard>
              <button className="inline-block mr-[8px] mb-[8px]">
                <Icon
                  className="i__Icon highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[6px]"
                  iconType="offerTagsFilledIcon"
                />
              </button>
            </div>

            <div className="flex flex-wrap w-full">
              <div className='inline-flex items-center mr-[12px] pr-[12px] relative before:content-[""] before:absolute before:top-[calc(50%_-_4px)] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[22px] before:bg-whiteScreen__BorderColor'>
                <span className="text-[14px] font-biotif__SemiBold text-light__TextColor whitespace-pre relative top-[2px] mr-[4px] mb-[10px]">
                  Closing Date:
                </span>
                <span
                  className={`text-[14px] font-biotif__SemiBold text-[${
                    closingDateColor || ''
                  }] whitespace-pre relative top-[2px] mb-[10px]`}
                >
                  {closing_date && (
                    <DateFormat format="MMM d, yyyy" date={closing_date} />
                  )}
                </span>
              </div>
              <div className='inline-flex items-center mr-[0px] pr-[0px] relative before:content-[""] before:absolute before:top-[calc(50%_-_4px)] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[28px] before:bg-whiteScreen__BorderColor before:hidden'>
                <span className="text-[14px] font-biotif__SemiBold text-light__TextColor whitespace-pre relative top-[2px] mr-[4px] mb-[10px]">
                  Value:
                </span>
                <span className="text-[14px] font-biotif__SemiBold text-ipBlack__textColor whitespace-pre relative top-[2px] mb-[10px]">
                  {usCurrencyFormat(dealDetails.deal_value || '') || '-'}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap w-full">
              <div className='inline-flex items-center mr-[12px] pr-[12px] relative before:content-[""] before:absolute before:top-[calc(50%_-_4px)] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[22px] before:bg-whiteScreen__BorderColor'>
                <span className="text-[14px] font-biotif__SemiBold text-light__TextColor whitespace-pre relative top-[2px] mr-[4px] mb-[10px]">
                  Age:
                </span>
                <span className="text-[14px] font-biotif__SemiBold text-ipBlack__textColor whitespace-pre relative top-[2px] mb-[10px]">
                  {dealDetails?.total_deal_age}
                </span>
              </div>
              <div className='inline-flex items-center mr-[0px] pr-[0px] relative before:content-[""] before:absolute before:top-[calc(50%_-_4px)] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[28px] before:bg-whiteScreen__BorderColor before:hidden'>
                <span className="text-[14px] font-biotif__SemiBold text-light__TextColor whitespace-pre relative top-[2px] mr-[4px] mb-[10px]">
                  Score:
                </span>
                <span className="text-[14px] font-biotif__SemiBold text-ipBlack__textColor whitespace-pre relative top-[2px] mb-[10px]">
                  {dealDetails?.lead_score}
                </span>
              </div>
            </div>
          </div>
          <div className="details__page__sticky__btns py-[15px] px-[22px] rounded-t-[20px] shadow-[0px_4px_21px_5px_#00000014] fixed bottom-0 left-0 w-full bg-white z-[4] justify-end items-center hidden sm:flex xsm:px-[15px]">
            <button className='i__Button mr-[10px] bg-[#E6E6E6] py-[4px] px-[17px] pr-[37px] text-black text-[14px] font-biotif__Medium rounded-[6px] h-[32px] relative before:content-[""] before:w-[8px] before:h-[8px] before:border-[2px] before:border-black before:absolute before:top-[10px] before:right-[12px] before:rotate-45 before:!border-t-0 before:!border-l-0 after:content-[""] after:absolute after:top-[9px] after:right-[28px] after:w-[1px] after:h-[14px] after:bg-black hover:text-white hover:before:border-white hover:after:bg-white'>
              Follow
            </button>

            <StayInTouch
              model_record_id={dealId}
              model_name={POLYMORPHIC_MODELS.DEAL}
              isStayInTouchOpen={isStayInTouchOpen}
              setIsStayInTouchOpen={setIsStayInTouchOpen}
              scheduleActivityData={scheduleActivityData}
              isScheduleActivityLoading={isScheduleActivityLoading}
              getScheduleActivity={getScheduleActivity}
            />
          </div>
        </>
      )}

      {isOpen.open && (
        <AddDealWonLostModal
          closeModal={closeDealWonLostModal}
          dealWonLostData={{
            entityData: {
              id: dealId,
              name: dealDetails.name || '',
              type: ModuleNames.DEAL,
            },
            stageType: isOpen.stageType,
          }}
          isOpen={isOpen.open}
          onAdd={() => setReRenderOnStage(true)}
        />
      )}
      {openDealLostModal && (
        <AddDealLostModal
          isOpen={openDealLostModal}
          closeModal={closeDealLostModal}
          id={Number(dealDetails.id)}
          stageId={currentStageId}
          onAdd={() => setReRenderOnStage(true)}
        />
      )}
    </>
  );
};

export default DealDetailMobileHeader;
