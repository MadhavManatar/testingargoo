// ** types **
import { AddSnippetFieldType } from '../types/snippetText.types';

const generateSnippetFormData = (formVal: AddSnippetFieldType) => {
  const SnippetFormData = new FormData();
  Object.keys(formVal).forEach((val) => {
    const key = val as keyof typeof formVal;
    if (formVal[key] !== undefined) {
      SnippetFormData.append(val, formVal[key]?.toString()?.trim() || '');
    }
  });
  if (formVal.category) {
    SnippetFormData.set(
      'category',
      JSON.stringify(filterCategoryData(formVal.category))
    );
  }
  return SnippetFormData;
};

export const filterCategoryData = (category?: string | number) => {
  const categoryObj: {
    old?: number;
    new?: { name: string };
  } = {};
  if (category) {
    if (Number.isSafeInteger(category)) {
      categoryObj.old = category as number;
    } else if (typeof category === 'string') {
      categoryObj.new = { name: category };
    }
    return categoryObj;
  }
  return null;
};

export default generateSnippetFormData;
