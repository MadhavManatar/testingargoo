export enum EmailTemplateVisibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export type CreateEmailTemplateFormFieldType = {
  template_name?: string;
  subject?: string;
  description?: string;
  visibility?: EmailTemplateVisibility;
  attachments?: {
    path: string;
    filename: string;
    contentType: string;
  }[];
};

export type EmailTemplate = {
  visibility?: EmailTemplateVisibility;
  id: number;
  template_name?: string;
  subject?: string;
  description?: string;
  created_at: Date;
  created_by?: number
};

