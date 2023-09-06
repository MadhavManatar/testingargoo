import { agGridSelectedProps } from "components/TableInfiniteScroll";

export type LeadStatusFieldType = {
  name: string;
  color: string;
};

export type AddLeadTemperaturePropsType = {
  isOpen: boolean;
  closeModal: () => void;
  onAdd: () => void;
  id?: number | null;
  changeColor: boolean;
  setLeadTempInfo?: React.Dispatch<React.SetStateAction<agGridSelectedProps>>;
};