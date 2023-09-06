import { attachmentResponse } from 'components/detail-components/Attachment/types/attachment.types';

export type NoteFieldType = {
  is_pinned: boolean;
  title: string;
  is_default: boolean;
  description: string;
  userIds?: [number];
  files: File[];
  __isNew__: boolean;
};
export type UserDropDownType = {
  title: string;
  description?: string;
  files: File[];
};

export type NoteResponse = {
  attachments: attachmentResponse[];
  id: number;
  is_drafted: boolean;
  title: string;
  description: string;
  modifier: {
    profile_image?: string;
    first_name: string;
    last_name: string;
    id: number;
  };

  timeline_data: [
    {
      is_pinned: boolean;
    }
  ];
  user_mention_data?: [
    {
      note_user: {
        full_name: string;
        id: number;
      };
    }
  ];
  created_at: string;
};

export type NoteResponseFileType = {
  doc_details?: {
    url: string;
    mimeType: string;
    id: number;
    original_name: string;
  };
  url: string;
  mimeType: string;
  id: number;
  original_name: string;
};
