// ** Import Packages **
import { Dispatch } from 'react';

// ** Constants **
import { MODULE } from 'constant';
import {
  ActivityPermissions,
  ModuleNames,
  TagPermissions,
} from 'constant/permissions.constant';
import { ModalType } from '../constant';

// ** Types **
import { ActivityResponseType } from 'pages/Activity/types/activity.types';
import { ContactResponseType } from 'pages/Contact/types/contacts.types';
import { tagResponse } from 'pages/Setting/general-setting/common-controls/Tag/types/tag.type';

export type EntityModalState = {
  [ModalType.TAG]?: { id?: number; open: boolean };
  [ModalType.NOTE]?: { id?: number; open: boolean };
  [ModalType.EDIT_NOTE]?: { id?: number; open: boolean };
  [ModalType.DELETE_NOTE]?: { id?: number; open: boolean };
  [ModalType.ATTACHMENT]?: { id?: number; open: boolean };
  [ModalType.ACTIVITY]?: { id?: number; open: boolean };
  [ModalType.EDIT_ACTIVITY]?: { id?: number; open: boolean };
  [ModalType.CONVERT_LEAD]?: { id?: number; open: boolean };
  [ModalType.DOCUMENT]?: { id?: number; open: boolean };
  [ModalType.DOCUMENT_DELETE]?: { id?: number; open: boolean };
};

export type HeaderInfo = {
  email?: string;
  phone?: string;
  phoneType?: string;
  tagPermission?: TagPermissions;
  activityPermission?: ActivityPermissions;
  title1?: string | JSX.Element;
  title2?: string | JSX.Element;
  title3?: string | JSX.Element;
  title4?: string | JSX.Element;
  module: MODULE;
};

export type DetailHeaderProps = {
  id: number;
  headerInfo: HeaderInfo;
  setModal: Dispatch<React.SetStateAction<EntityModalState>>;
  closeModal: (EmailModalType: ModalType) => void;
  modal: EntityModalState;
  contactData: ContactResponseType;
};

export type AssignTagsProps = {
  total: number;
  list: tagResponse[];
};

export interface SetterProps {
  step?: ActivityResponseType;
  // navigate:NavigateFunction is not imported that's why any assigned
  navigate?: any;
}

export interface SetNavigationProps extends SetterProps {
  url: string;
  id: number | undefined;
}

export type NextStepProps = {
  id: number;
  moduleName: ModuleNames;
};
