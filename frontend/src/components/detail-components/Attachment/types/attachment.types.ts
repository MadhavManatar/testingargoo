import { Dispatch, SetStateAction } from 'react';
import {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetError,
} from 'react-hook-form';

export type AttachmentFieldType = {
  link: string;
  files: File[];
};

export type attachmentResponse = {
  doc_details: any;
  created_at: string;
  creator: {
    id: number;
    first_name: string;
    last_name: string;
  };
  mimeType: string;
  size: number;
  original_name: string;
  url: string;
  type: string;
  id: number;
};

export type AddAttachmentModalProps = {
  isOpen: boolean;
  isLink?: boolean;
  modelName: string;
  modelRecordId: number;
  closeModal: () => void;
};

export type AttachmentFileTypeProps = {
  mimeType: string;
  onClickView: () => void;
  attach: attachmentResponse;
};

export type AttachmentFormProps = {
  errors: FieldErrors<AttachmentFieldType>;
  register: UseFormRegister<AttachmentFieldType>;
  setError: UseFormSetError<AttachmentFieldType>;
  clearErrors: UseFormClearErrors<AttachmentFieldType>;
  setAttachments: Dispatch<SetStateAction<File[]>>;
  attachment: File[];
  isLink: boolean;
  isLoading: boolean;
};

export type DeleteAttachmentModalProps = {
  isOpen: boolean;
  deleteAttachment: () => void;
  closeModal: () => void;
  isLoading: boolean;
};
