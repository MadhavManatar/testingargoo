// ** Import Packages **
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

// ** Components **
import TagModalForQuickCard from 'components/detail-components/AssignTags/TagModalForQuickCard';
import AddAttachmentModal from 'components/detail-components/Attachment/components/AddAttachmentModal';
import { DetailHeaderEmail } from 'components/detail-components/detail-header-email';
import AddActivityModal from 'pages/Activity/components/Modal/AddActivityModal';
import AuthGuard from 'pages/auth/components/AuthGuard';
import AddNoteModal from '../Timeline/components/AddNoteModal';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** Constants **
import {
  ActivityPermissions,
  BasicPermissionTypes,
  ModuleNames,
  TagPermissions,
} from 'constant/permissions.constant';
import { ModalType } from '../constant';

// ** Types **
import { EntityModalState } from '../types';

// ** Helper **
import DetailHeaderPhone from 'components/detail-components/detail-header-phone';
import DetailHeaderNote from 'components/detail-components/detail-header-note';
import DetailHeaderAttachment from 'components/detail-components/detail-header-attachment';
import DetailHeaderTag from 'components/detail-components/detail-header-tag';
import DetailHeaderActivity from 'components/detail-components/detail-header-activity';
import {
  entityDataType,
  relatedEntityDataType,
} from 'pages/Activity/types/activity.types';
import DetailHeaderDealWonLost from 'components/detail-components/detail-header-deal-won-lost';
import DetailHeaderConvertLead from 'components/detail-components/detail-header-convert-lead';
import DetailHeaderLaunchActivity from 'components/detail-components/detail-header-launch-activity';
import DetailHeaderStartOrStopActivity from 'components/detail-components/detail-header-start-or-stop-activity';
import DetailHeaderCompleteOrOpenActivity from 'components/detail-components/detail-header-complete-or-open-activity';

// ** Declare here [Reason]: get props missing error. **
type quickLookCardModalType = {
  modelName: ModuleNames;
  modelRecordId: number;
  close?: () => void;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
  extraInfo?: {
    email?: string;
    phone?: string;
    phoneType?: string;
  };
  activityEntityData?: entityDataType;
  relatedEntityData?: relatedEntityDataType;
  handleDealWonLost?: () => void;
  launchActivity?: () => void;
  hideActivity?: boolean;
  hideEmail?: boolean;
  hidePhone?: boolean;
  startOrStopActivity?: {
    label: string;
    action: () => void;
  };
  completeOrOpenActivity?: {
    label: string;
    action: () => void;
  };
};

const QuickLookCardModal = (props: quickLookCardModalType) => {
  const {
    setIsOpen,
    close,
    modelName,
    modelRecordId,
    relatedEntityData,
    extraInfo,
    activityEntityData,
    handleDealWonLost,
    launchActivity,
    hideActivity = false,
    hideEmail = false,
    hidePhone = false,
    completeOrOpenActivity,
    startOrStopActivity,
  } = props;

  const [isLinkDocument, setIsLinkDocument] = useState(false);
  const [modal, setModal] = useState<EntityModalState>({
    [ModalType.TAG]: { open: false },
    [ModalType.NOTE]: { open: false },
    [ModalType.ATTACHMENT]: { open: false },
    [ModalType.ACTIVITY]: { open: false },
  });
  const [permissionType, setPermissionType] = useState<{
    tagPermission?: boolean;
    activityPermission?:
      | BasicPermissionTypes
      | TagPermissions
      | ActivityPermissions;
  }>();

  const {
    tagForLeadPermission,
    tagForContactPermission,
    tagForDealPermission,
    tagForAccountPermission,
    tagForActivityPermission,
  } = usePermission();

  useEffect(() => {
    switch (modelName) {
      case ModuleNames.DEAL:
        setPermissionType({
          activityPermission: ActivityPermissions.DEAL,
          tagPermission: tagForDealPermission,
        });
        break;
      case ModuleNames.LEAD:
        setPermissionType({
          activityPermission: ActivityPermissions.LEAD,
          tagPermission: tagForLeadPermission,
        });
        break;
      case ModuleNames.ACCOUNT:
        setPermissionType({
          activityPermission: ActivityPermissions.ACCOUNT,
          tagPermission: tagForAccountPermission,
        });
        break;
      case ModuleNames.CONTACT:
        setPermissionType({
          activityPermission: ActivityPermissions.CONTACT,
          tagPermission: tagForContactPermission,
        });
        break;
      case ModuleNames.ACTIVITY:
        setPermissionType({
          activityPermission: ActivityPermissions.ACTIVITY,
          tagPermission: tagForActivityPermission,
        });
        break;
      default:
        break;
    }
  }, [modelName]);

  const setOpenModal = (modalName: ModalType) => {
    close?.();
    setModal((prev) => ({ ...prev, [modalName]: { open: true } }));
  };

  const closeModal = () => {
    setModal({
      [ModalType.TAG]: { open: false },
      [ModalType.NOTE]: { open: false },
      [ModalType.ATTACHMENT]: { open: false },
      [ModalType.ACTIVITY]: { open: false },
    });
    setIsOpen?.(true);
  };

  return (
    <>
      <div className="socialBtns__wrapper w-full inline-flex flex-wrap items-center border-t border-t-whiteScreen__BorderColor pt-[15px]">
        {!hideEmail && (
          <DetailHeaderEmail
            // anchorClassName="!mr-0"
            modelName={modelName}
            email={extraInfo?.email}
            customClose={() => close?.()}
            modelRecordId={modelRecordId}
            customOpen={() => setIsOpen?.(true)}
          />
        )}

        {!hidePhone && (
          <DetailHeaderPhone
            type={extraInfo?.phoneType}
            number={extraInfo?.phone}
          />
        )}

        <AuthGuard
          permissions={[
            { module: ModuleNames.NOTE, type: BasicPermissionTypes.CREATE },
          ]}
        >
          <DetailHeaderNote setOpenModal={setOpenModal} />
        </AuthGuard>

        <AuthGuard
          permissions={[
            {
              module: ModuleNames.ATTACHMENT,
              type: BasicPermissionTypes.CREATE,
            },
          ]}
        >
          <DetailHeaderAttachment
            setOpenModal={setOpenModal}
            setIsLinkDocument={setIsLinkDocument}
          />
        </AuthGuard>

        <AuthGuard isAccessible={permissionType?.tagPermission}>
          <DetailHeaderTag setOpenModal={setOpenModal} />
        </AuthGuard>

        <AuthGuard
          isAccessible={!hideActivity}
          permissions={[
            {
              module: ModuleNames.ACTIVITY,
              type: permissionType?.activityPermission,
            },
          ]}
        >
          <DetailHeaderActivity setOpenModal={setOpenModal} />
        </AuthGuard>

        <AuthGuard
          isAccessible={modelName === ModuleNames.DEAL}
          permissions={[
            {
              module: ModuleNames.DEAL,
              type: BasicPermissionTypes?.UPDATE,
            },
          ]}
        >
          <DetailHeaderDealWonLost {...{ handleDealWonLost }} />
        </AuthGuard>

        <AuthGuard
          isAccessible={modelName === ModuleNames.LEAD}
          permissions={[
            {
              module: ModuleNames.LEAD,
              type: BasicPermissionTypes?.UPDATE,
            },
          ]}
        >
          <DetailHeaderConvertLead {...{ modelRecordId }} />
        </AuthGuard>

        <AuthGuard
          isAccessible={!!launchActivity && modelName === ModuleNames.ACTIVITY}
          permissions={[
            {
              module: ModuleNames.ACTIVITY,
              type: BasicPermissionTypes?.READ,
            },
          ]}
        >
          <DetailHeaderLaunchActivity {...{ launchActivity }} />
        </AuthGuard>

        <AuthGuard
          isAccessible={
            !!startOrStopActivity && modelName === ModuleNames.ACTIVITY
          }
          permissions={[
            {
              module: ModuleNames.ACTIVITY,
              type: BasicPermissionTypes?.READ,
            },
          ]}
        >
          <DetailHeaderStartOrStopActivity {...{ startOrStopActivity }} />
        </AuthGuard>

        <AuthGuard
          isAccessible={
            !!completeOrOpenActivity && modelName === ModuleNames.ACTIVITY
          }
          permissions={[
            {
              module: ModuleNames.ACTIVITY,
              type: BasicPermissionTypes?.READ,
            },
          ]}
        >
          <DetailHeaderCompleteOrOpenActivity {...{ completeOrOpenActivity }} />
        </AuthGuard>
      </div>
      {modal?.NOTE?.open && (
        <AuthGuard
          permissions={[
            { module: ModuleNames.NOTE, type: BasicPermissionTypes.CREATE },
          ]}
        >
          <AddNoteModal
            isOpen={modal.NOTE.open}
            closeModal={closeModal}
            modelName={modelName}
            modelRecordId={modelRecordId}
          />
        </AuthGuard>
      )}
      {modal?.ATTACHMENT?.open && (
        <AuthGuard
          permissions={[
            {
              module: ModuleNames.ATTACHMENT,
              type: BasicPermissionTypes.CREATE,
            },
          ]}
        >
          <AddAttachmentModal
            isOpen={modal.ATTACHMENT.open}
            closeModal={closeModal}
            modelName={modelName}
            modelRecordId={modelRecordId}
            isLink={isLinkDocument}
          />
        </AuthGuard>
      )}
      {modal?.TAG?.open && (
        <TagModalForQuickCard
          isOpen={modal.TAG.open}
          closeModal={closeModal}
          editTagsPermission={permissionType?.tagPermission}
          modelRecordId={modelRecordId}
          modelName={modelName}
        />
      )}
      {modal?.ACTIVITY?.open && !hideActivity && (
        <AuthGuard
          permissions={[
            { module: ModuleNames.ACTIVITY, type: BasicPermissionTypes.CREATE },
          ]}
        >
          <AddActivityModal
            isOpen={modal.ACTIVITY.open}
            closeModal={closeModal}
            entityData={activityEntityData}
            relatedEntityData={{
              ...(relatedEntityData?.account?.id && {
                account: {
                  id: relatedEntityData?.account?.id,
                  name: relatedEntityData?.account?.name,
                },
              }),
              ...(relatedEntityData?.contact?.id && {
                contact: {
                  id: relatedEntityData?.contact?.id,
                  name: relatedEntityData?.contact?.name,
                },
              }),
            }}
          />
        </AuthGuard>
      )}
    </>
  );
};

export default QuickLookCardModal;
