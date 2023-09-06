import { agGridSelectedProps } from 'components/TableInfiniteScroll';
import { Dispatch, SetStateAction } from 'react';

export type LeadDealSourceFieldType = {
  name: string;
};

export type AddLeadDealSourceModalPropsType = {
  isOpen: boolean;
  closeModal: () => void;
  onAdd: () => void;
  id?: number | null;
  setSourceInfo?: React.Dispatch<React.SetStateAction<agGridSelectedProps>>;
};

export type UseLeadDealSourceColumnsPropsType = {
  setIsOpen: Dispatch<
    SetStateAction<{ edit: boolean; add: boolean; id?: null | number }>
  >;
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  disabled?: boolean;
  isLoading?: boolean;
  isSelectionDisabled?: boolean;
  openDeleteModal: () => void;
};
