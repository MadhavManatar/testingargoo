export type snippetTabType = 'snippet' | 'category';

export const SNIPPET_TABS: { label: string; value: snippetTabType }[] = [
  { label: 'Snippet Settings', value: 'snippet' },
  { label: 'Snippet Categories', value: 'category' },
];

export type snippetTabsPropsType = {
  isModelTabs?: boolean;
  changeTab?: (module: snippetTabType) => void;
  setTab?: snippetTabType;
};

export type SnippetModalType = {
  list?: { id: number; type: string; title: string; snippet: string }[] | [];
};

export type SnippetListPropsType = {
  snippetModal?: SnippetModalType;
};