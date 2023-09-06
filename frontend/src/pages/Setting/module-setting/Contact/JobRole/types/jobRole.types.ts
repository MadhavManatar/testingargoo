import { agGridSelectedProps } from 'components/TableInfiniteScroll';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

export type contactTypeFieldType = {
  name: string;
};

export type AddContactTypeModalProps = {
  isOpen?: boolean;
  closeModal: () => void;
  onAdd?: () => void;
  setContactTypeInfo: React.Dispatch<React.SetStateAction<agGridSelectedProps>>;
};

export type EditContactTypeModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  id?: number | null | undefined;
  onEdit?: () => void;
  setContactTypeInfo?: React.Dispatch<
    React.SetStateAction<agGridSelectedProps>
  >;
};

export type ContactTypeFormProps = {
  errors: FieldErrors<contactTypeFieldType>;
  register: UseFormRegister<contactTypeFieldType>;
};
