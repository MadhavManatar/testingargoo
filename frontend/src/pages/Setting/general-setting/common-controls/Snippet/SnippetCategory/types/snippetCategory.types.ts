export type AddSnippetCategoryFieldType = {
  name: string;
};

export type SnippetCategoryResponseType = {
  id: number;
  name: string;
  is_system: boolean;
  creator: { username: string; first_name: string; last_name: string };
};

export type AddSnippetCategoryModalPropsTypes = {
  isOpen?: boolean;
  closeModal: () => void;
  id?: number | null;
  onAdd?: () => void;
};

export type UseSnippetCategoryColumnsPropsTypes = {
  openEditSnippetModal: (id: number) => void;
  selectionRef?: any;
  setSelectionList?: any;
  setIsCheckAll?: any;
  disabled?: any;
  isCheckAll?: boolean;
  isCheckAllRef?: any;
  isSelectionDisabled?: boolean;
  openDeleteSnippetModal: () => void;
};
