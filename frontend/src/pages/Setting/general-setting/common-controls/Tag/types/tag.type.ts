export type TagFormFieldsType = {
  id: number;
  name: string;
  color: string;
  created_by: string;
  creator: { first_name: string; last_name: string };
};

export type TagDetails = TagFormFieldsType;

export type TagFormValueType = {
  name: string;
  color: string;
};

export type tagResponse = {
  create?: boolean;
  id: number;
  tag: {
    id: number;
    name: string;
    color: string;
  };
};
