export interface GeneralSetting {
  created_at: string;
  created_by: number;
  deleted_at?: string;
  id: number;
  key: string;
  model_name: string;
  model_record_id: number;
  organization_id: number;
  related_model_id?: number;
  related_model_name?: string;
  updated_at?: string;
  updated_by: number;
  value: string;
}
