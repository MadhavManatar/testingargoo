export type ActivityResultFieldType = {
  activity_types: number[];
  activity_type: {
    id: number | null;
    name: string | undefined;
  };
  result: string;
  isMemo: boolean;
  is_universal: boolean;
};
