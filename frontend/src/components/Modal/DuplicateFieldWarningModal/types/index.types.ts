import { ModuleNames } from 'constant/permissions.constant';

export interface DuplicateFieldModalType {
  isOpen: boolean;
  data: {
    value: string;
    moduleName: ModuleNames | string;
    recordName: string;
    field: string;
  } | null;
}

export interface DuplicateFieldWarningModalPropsType
  extends DuplicateFieldModalType {
  closeModal: () => void;
}
