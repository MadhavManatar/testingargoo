import { agGridSelectedProps } from "components/TableInfiniteScroll";

export type phoneTypeFieldType = {
  name: string;
};

export type AddPhoneTypeModalPropsType = {
  isOpen?: boolean;
  closeModal: () => void;
  onAdd?: () => void;
  setPhoneTypeInfo: React.Dispatch<React.SetStateAction<agGridSelectedProps>>;
};

export type EditPhoneTypeModalPropsType = {
  isOpen: boolean;
  closeModal: () => void;
  id?: number | null | undefined;
  onEdit?: () => void;
}