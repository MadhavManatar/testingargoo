import { Dispatch, SetStateAction } from "react";

export type UseAllTrashColumnsPropsType = {
    selectionRef?: any;
    setSelectionList?: any;
    setIsCheckAll?: any;
    isCheckAll?: boolean;
    getAllLoading?: boolean;
    isCheckAllRef?: any;
    disabled?: any;
    isSelectionDisabled?: boolean;
    openDeleteAllModal?: (id?:number) => void;
    restoreData:(id?:number) => void;
    actionBtnState?:boolean;
    setActionBtnState?:Dispatch<SetStateAction<boolean>>
  };