import { agGridSelectedProps } from "components/TableInfiniteScroll";

export type LeadStatusFieldType = {
  name: string;
  color: string;
};


export type AddLeadStatusModalPropsType = {
  isOpen: boolean;
  closeModal: () => void;
  onAdd: () => void;
  id?: number | null;
  changeColor: boolean;
  setLeadStatus?: React.Dispatch<React.SetStateAction<agGridSelectedProps>>;
};