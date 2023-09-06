// ** Import Packages **
import Tippy from '@tippyjs/react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ** Components **
import { TableActionButton } from 'components/Button/TableActionButton';
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import AssignTagModal from 'components/detail-components/AssignTags/AssignTagModal';
import AssignTagsList from 'components/detail-components/AssignTags/AssignTagsList';
import AddAttachmentModal from 'components/detail-components/Attachment/components/AddAttachmentModal';
import { DetailHeaderEmail } from 'components/detail-components/detail-header-email';
import Dropdown from 'components/Dropdown';
import EntityCard from 'components/EntityDetails/QuickLookCard/EntityCard';
import AddNoteModal from 'components/EntityDetails/Timeline/components/AddNoteModal';
import Icon from 'components/Icon';
import Image from 'components/Image';
import AuthGuard from 'pages/auth/components/AuthGuard';
import DetailHeaderPhone from 'components/detail-components/detail-header-phone';
import DetailHeaderNote from 'components/detail-components/detail-header-note';
import DetailHeaderAttachment from 'components/detail-components/detail-header-attachment';
import DetailHeaderTag from 'components/detail-components/detail-header-tag';
import DetailHeaderActivity from 'components/detail-components/detail-header-activity';

// ** Redux **
import { setLoadTimeLines } from 'redux/slices/commonSlice';

// ** Hook **
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Types **
import { tag } from 'components/detail-components/AssignTags/types/assignTags.type';
import {
  AssignTagsProps,
  DetailHeaderProps,
} from 'components/EntityDetails/types';

// ** Constants **
import { ModalType, MODULE_ICON } from 'components/EntityDetails/constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { ModuleNames, TagPermissions } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';

// ** Util **
import { setUrlParams } from 'utils/util';

// ** Helper **
import {
  useAssignTagMutation,
  useLazyGetAssignedTagByModelRecordIdQuery,
} from 'redux/api/tagApi';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';

const DetailHeader = (props: DetailHeaderProps) => {
  const { id, headerInfo, setModal, modal, closeModal, contactData } = props;

  // ** Hooks ** //
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // ** states **
  const [isLinkDocument, setIsLinkDocument] = useState(false);
  const [assignedTags, setAssignedTags] = useState<AssignTagsProps>({
    list: [],
    total: 0,
  });

  // ** Custom hooks **
  const {
    updateContactPermission,
    createNotePermission,
    createDocumentPermission,
    createActivityPermission,
    tagForContactPermission,
  } = usePermission();
  const { isMobileView } = useWindowDimensions();

  // ** APIS ** //
  const [assignTag] = useAssignTagMutation();
  const [getAssignedTagByModelRecordId] =
    useLazyGetAssignedTagByModelRecordIdQuery();

  useEffect(() => {
    getAssignedTags();
  }, []);

  const getAssignedTags = async () => {
    const { data: result, error } = await getAssignedTagByModelRecordId(
      {
        modelName: TagPermissions.CONTACT,
        id,
        params: {
          limit: 100,
          select: 'tag',
          'q[model_name]': ModuleNames.CONTACT,
          sort: 'id',
        },
      },
      true
    );
    if (result && !error) {
      setAssignedTags({ list: result?.rows, total: result?.count });
    }
  };

  const deleteAssignedTag = async (deleteId: number, tagDetail?: tag) => {
    const filteredArray = assignedTags.list.filter((obj) => {
      return obj.tag.id !== tagDetail?.id && obj.tag.name !== tagDetail?.name;
    });
    setAssignedTags({ list: filteredArray, total: filteredArray.length });
    const data = await assignTag({
      id,
      data: {
        modelName: ModuleNames.CONTACT,
        tags: { deletedTagIds: [deleteId] },
        message: ToastMsg.common.deleteTag,
      },
    });
    if (!('error' in data)) {
      dispatch(setLoadTimeLines({ timeline: true }));
    } else {
      getAssignedTags();
    }
  };

  const openModal = (modalName: ModalType) => {
    setModal((prev) => ({ ...prev, [modalName]: { open: true } }));
  };
  
  const primaryAccount = contactData?.contact?.related_accounts?.find(
    (val) => val.is_primary
  );

  const redirectToAddActivity = () => {
    if (isMobileView) {
      const entityData = {
        id: contactData?.contact?.id,
        name: contactData?.contact?.name || '',
        type: ModuleNames.CONTACT,
      };
      const relatedEntityData = {
        ...(contactData?.contact?.related_accounts?.[0]?.account.id && {
          account: {
            id: contactData?.contact?.related_accounts?.[0]?.account.id,
            name: contactData?.contact?.related_accounts?.[0]?.account.name,
          },
        }),
      };
      navigate(PRIVATE_NAVIGATION.activities.AddActivityMobileView, {
        state: { entityData, relatedEntityData },
      });
    } else {
      openModal(ModalType.ACTIVITY);
    }
  };


  const account_name = primaryAccount?.account?.name;

  const account_job_role = primaryAccount?.job_role;

  const accountPrimaryEmail = (primaryAccount?.account?.emails || [])?.filter(
    (val: { is_primary: boolean }) => val.is_primary
  )?.[0]?.value;

  const accountPrimaryPhone = (primaryAccount?.account?.phones || [])?.filter(
    (val: { is_primary: boolean }) => val.is_primary
  )?.[0];

  const primaryAccountAddress = {
    address1: primaryAccount?.account?.address1 || '',
    address2: primaryAccount?.account?.address2 || '',
    state: primaryAccount?.account?.state?.state_code || '',
    city: primaryAccount?.account?.city?.name || '',
    country: primaryAccount?.account?.country?.name || '',
    zip: primaryAccount?.account?.zip || '',
  };

  const checkPrimaryContactAddressLength = Object.values(
    primaryAccountAddress
  ).find((element) => element);

  const accountCard = useCallback(
    (accountCardProps: {
      close: () => void;
      setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      isOpen?: boolean;
    }) => {
      const { close, setIsOpen, isOpen } = accountCardProps;

      return (
        <>
          {primaryAccount?.account?.name &&
            Boolean(primaryAccount?.account_id) && (
              <EntityCard
                modelName={ModuleNames.ACCOUNT}
                {...(!!checkPrimaryContactAddressLength && {
                  address: primaryAccountAddress,
                })}
                id={primaryAccount?.account_id as number}
                name={primaryAccount.account?.name}
                email={accountPrimaryEmail}
                phone={accountPrimaryPhone?.value?.toString()}
                phoneType={accountPrimaryPhone?.phoneType || ''}
                {...{ close, setIsOpen, isOpen }}
              />
            )}
        </>
      );
    },
    [primaryAccount]
  );

  return (
    <>
      {isMobileView ? (
        <div className="details__page__topHeader__M contact__details__page__topHeader__M border-b border-b-[#CCCCCC]/50 pb-[12px] mb-[17px] hidden sm:block">
          <div className="flex justify-between items-center mb-[20px]">
            <div className="details__mobile__act__type flex flex-wrap items-center w-[calc(100%_-_70px)] pr-[10px]">
              {contactData?.contact?.contact_image ? (
                <Image
                  imgClassName="w-[60px] h-[60px] p-[8px] rounded-[10px] object-cover object-center"
                  imgPath={contactData?.contact?.contact_image || ''}
                  serverPath
                />
              ) : (
                <Icon
                  className="w-[60px] h-[60px] p-[8px] rounded-[10px] bg-primaryColor"
                  iconType={MODULE_ICON[headerInfo.module].icon}
                />
              )}
              <p className="text-[16px] font-biotif__Medium text-[#2E3234] w-[calc(100%_-_45px)] pl-[7px] whitespace-pre overflow-hidden text-ellipsis">
                {headerInfo.module}
              </p>
            </div>
            <AuthGuard isAccessible={updateContactPermission}>
              <div className="action__btns__mobile inline-flex items-center">
                <button type="button" className="editACT__btn__M">
                  <Icon
                    onClick={() =>
                      navigate(
                        setUrlParams(PRIVATE_NAVIGATION.contacts.edit, id)
                      )
                    }
                    className="!w-[32px] !h-[32px] p-[4px] rounded-[6px] bg-parentBgWhite__grayBtnBG duration-500 hover:bg-primaryColor"
                    iconType="editPencilFilledIcon"
                  />
                </button>
                <button className="details__page__toggleBtn__M ml-[5px]">
                  <Icon
                    className="!w-[32px] !h-[32px] p-[8px] rounded-[6px] duration-500 hover:bg-[#E6E6E6]"
                    iconType="toggle3dotsIcon"
                  />
                </button>
              </div>
            </AuthGuard>
          </div>
          <div className="flex flex-wrap">
            {headerInfo.title1 && (
              <h3 className="text-[#2E3234] text-[18px] font-biotif__Medium mr-[10px] mb-[3px]">
                {headerInfo.title1}
              </h3>
            )}
            {assignedTags?.list.length > 0 && (
              <div className="badge__wrapper mb-[12px] text-primaryColor">
                <AssignTagsList
                  setAssignedTags={setAssignedTags}
                  editTagsPermission={tagForContactPermission}
                  assignedTags={assignedTags}
                  deleteAssignedTag={deleteAssignedTag}
                  setModal={() => openModal(ModalType.TAG)}
                />
              </div>
            )}
          </div>

          {headerInfo.title2 && (
            <h5 className="text-[#2E3234] text-[16px] leading-[18px] font-biotif__Regular mb-[5px]">
              {headerInfo.title2} ddf
            </h5>
          )}

          <div className="flex flex-wrap designation__wrapper">
            <span className="text-[16px] text-[#2E3234] font-biotif__Regular relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor before:hidden">
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
                  {account_name}
                </button>
              </Dropdown>
              {/* {contact_jobRole ? `, ${contact_jobRole}` : ''} */}
            </span>
          </div>

          <div className="contact__details mt-[0px]">
            {headerInfo?.phone && (
              <div className="leading-normal">
                <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
                  <ClickableMobile number={headerInfo.phone} />
                </p>
              </div>
            )}
            {headerInfo?.email && (
              <div className="leading-normal">
                <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
                  {headerInfo.email && (
                    <ClickableEmail
                      mail={headerInfo.email}
                      modelName={ModuleNames.CONTACT}
                      modelRecordId={id}
                    />
                  )}
                </p>
              </div>
            )}
            <div className="leading-normal">{headerInfo.title3}</div>
          </div>

          <div className="buttons__wrapper socialBtns__wrapper inline-flex flex-wrap items-center mt-[14px]">
            <DetailHeaderEmail email={headerInfo.email} />
            <DetailHeaderPhone
              type={headerInfo?.phoneType || ''}
              number={headerInfo?.phone?.toString()}
            />
            <AuthGuard isAccessible={createNotePermission}>
              <Tippy zIndex={5} content="Notes">
                <button
                  className="inline-block mr-[8px] mb-[8px]"
                  onClick={() => openModal(ModalType.NOTE)}
                >
                  <Icon
                    className="i__Icon highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[6px]"
                    iconType="mobileMenuFilled"
                  />
                </button>
              </Tippy>
            </AuthGuard>
            <AuthGuard isAccessible={createDocumentPermission}>
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
                    className="i__Icon highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[6px]"
                    iconType="attachmentFilledIcon"
                  />
                }
                buttonClassName="inline-block mr-[8px] mb-[8px]"
                tippyMessage="Documents"
              />
            </AuthGuard>
            <AuthGuard isAccessible={tagForContactPermission}>
              <Tippy zIndex={5} content="Tags">
                <button
                  className="inline-block mr-[8px] mb-[8px]"
                  onClick={() => openModal(ModalType.TAG)}
                >
                  <Icon
                    className="i__Icon highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[6px]"
                    iconType="offerTagsFilledIcon"
                  />
                </button>
              </Tippy>
            </AuthGuard>
            <AuthGuard isAccessible={createActivityPermission}>
              <Tippy zIndex={5} content="Activity">
                <button
                  className="inline-block mr-[8px] mb-[8px]"
                  onClick={() => redirectToAddActivity()}
                >
                  <Icon
                    className="i__Icon highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[6px]"
                    iconType="activitiesFilledBlackIcon"
                  />
                </button>
              </Tippy>
            </AuthGuard>
          </div>
        </div>
      ) : (
        <div className="activityInner__topHeader__box flex flex-wrap border border-whiteScreen__BorderColor rounded-[12px] p-[20px] pb-[10px] mb-[20px] sm:hidden">
          <div className="activityType flex flex-wrap content-center justify-center pr-[20px] w-[92px] relative before:content-[''] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:w-[1px] before:h-[calc(100%_-_26px)] before:bg-whiteScreen__BorderColor">
            {contactData?.contact?.contact_image ? (
              <Image
                imgClassName="w-[60px] h-[60px] p-[8px] rounded-[10px] object-cover object-center"
                imgPath={contactData?.contact?.contact_image || ''}
                serverPath
              />
            ) : (
              <IconAnimation
                iconType="phoneFilled"
                animationIconType={IconTypeJson.Contact}
                className="!w-[60px] !h-[60px] !p-[8px] rounded-[10px] !bg-primaryColor"
              />
            )}
            <p className="text-[16px] text-black__TextColor800 font-biotif__Medium text-center w-full mt-[10px] break-words">
              {headerInfo.module}
            </p>
          </div>

          <div className="right w-[calc(100%_-_93px)] pl-[20px] flex flex-wrap justify-between">
            <div className="main__details w-1/2 pr-[20px]">
              <div className="flex flex-wrap">
                {headerInfo.title1 && (
                  <h3 className="text-black__TextColor800 text-[20px] leading-[26px] font-biotif__Medium mr-[15px] mb-[3px]">
                    {headerInfo.title1}
                  </h3>
                )}
                {assignedTags?.list.length > 0 && (
                  <div className="badge__wrapper mb-[10px] text-primaryColor">
                    <AssignTagsList
                      setAssignedTags={setAssignedTags}
                      editTagsPermission={tagForContactPermission}
                      assignedTags={assignedTags}
                      deleteAssignedTag={deleteAssignedTag}
                      setModal={() => openModal(ModalType.TAG)}
                    />
                  </div>
                )}
              </div>

              {account_name || headerInfo.title2 ? (
                <div className="flex flex-wrap designation__wrapper">
                  <span className="text-[16px] text-black__TextColor800 font-biotif__Regular relative pr-[10px] mr-[10px] mb-[6px] before:absolute before:top-[50%] before:translate-y-[-50%] before:right-0 before:h-[calc(100%_-_4px)] before:w-[1px] before:bg-whiteScreen__BorderColor before:hidden">
                    {account_name ? (
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
                          {account_name}
                        </button>
                      </Dropdown>
                    ) : null}
                    {account_job_role
                      ? `, ${account_job_role}`
                      : headerInfo.title2}
                  </span>
                </div>
              ) : null}

              <div className="contact__details mt-[0px]">
                {(headerInfo.phone || headerInfo.email) && (
                  <>
                    {headerInfo?.phone && (
                      <div className="leading-normal">
                        <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
                          <ClickableMobile number={headerInfo.phone || ''} />
                        </p>
                      </div>
                    )}

                    {headerInfo.email && (
                      <div className="leading-normal">
                        <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
                          <ClickableEmail
                            mail={headerInfo.email}
                            modelName={ModuleNames.CONTACT}
                            modelRecordId={id}
                          />
                        </p>
                      </div>
                    )}
                  </>
                )}
                <div className="leading-normal">{headerInfo.title3}</div>
              </div>
            </div>
          </div>

          <div className="activity__topHeader__footer mt-[24px] pt-[20px] border-t border-whiteScreen__BorderColor w-full flex flex-wrap items-center">
            <div className="buttons__wrapper socialBtns__wrapper inline-flex flex-wrap items-center">
              <DetailHeaderEmail
                email={headerInfo.email}
                modelName={ModuleNames.CONTACT}
                modelRecordId={id}
              />
              <DetailHeaderPhone
                type={headerInfo?.phoneType}
                number={headerInfo?.phone}
              />
              <AuthGuard isAccessible={createNotePermission}>
                <DetailHeaderNote setOpenModal={openModal} />
              </AuthGuard>
              <AuthGuard isAccessible={createDocumentPermission}>
                <DetailHeaderAttachment
                  setOpenModal={openModal}
                  setIsLinkDocument={setIsLinkDocument}
                />
              </AuthGuard>
              <AuthGuard isAccessible={tagForContactPermission}>
                <DetailHeaderTag setOpenModal={openModal} />
              </AuthGuard>
              <AuthGuard isAccessible={createActivityPermission}>
                <DetailHeaderActivity setOpenModal={openModal} />
              </AuthGuard>
              <button className="mr-[20px] mb-[10px] sm:mr-[13px] hidden">
                <Icon
                  className="highlighted !w-[36px] !h-[36px] p-[7px] !rounded-[8px]"
                  iconType="toggle3dotsIcon"
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {modal.NOTE?.open && (
        <AddNoteModal
          isOpen={modal.NOTE.open}
          closeModal={() => closeModal(ModalType.NOTE)}
          modelName={ModuleNames.CONTACT}
          modelRecordId={id}
        />
      )}
      {modal.ATTACHMENT?.open && (
        <AddAttachmentModal
          isOpen={modal.ATTACHMENT.open}
          closeModal={() => closeModal(ModalType.ATTACHMENT)}
          modelName={ModuleNames.CONTACT}
          modelRecordId={id}
          isLink={isLinkDocument}
        />
      )}

      {modal.TAG?.open && (
        <AssignTagModal
          modelRecordId={id}
          isOpen={modal.TAG.open}
          assignedTags={assignedTags}
          setAssignedTags={setAssignedTags}
          modelName={ModuleNames.CONTACT}
          getAssignedTags={getAssignedTags}
          deleteAssignedTag={deleteAssignedTag}
          editTagsPermission={tagForContactPermission}
          closeModal={() => closeModal(ModalType.TAG)}
        />
      )}
    </>
  );
};

export default DetailHeader;
