import _ from 'lodash';
import { FilterColumnInterface } from 'components/ColumnManageModal/types/column.types';

export type ISetInclude = {
  item: FilterColumnInterface;
  modelSelectColumn: Set<string>;
  existingFilterObject: { [key: string]: string | boolean };
};

export const isModifiedColumnType = (fieldName: string) => {
  switch (fieldName) {
    case 'AccountContacts':
      return 'AccountContacts.contact.name';
    default:
      return fieldName;
  }
};

export const associationColumns = Object.freeze([
  'BelongsTo',
  'HasMany',
  'HasOne',
  'BelongsToMany',
]);

export const getFilterKeys = (item: FilterColumnInterface) => {
  // const searchKeys = isAssociated ? item?.searchKeys || [] : [item.columnName];
  // return { searchKeys, isAssociated };

  const isAssociated = associationColumns?.includes(item?.columnType);
  const searchKeys = item?.searchKeys?.length
    ? item?.searchKeys
    : [item.columnName];
  return { searchKeys, isAssociated };
};

export const setIncludeObj = (setIncludeData: ISetInclude) => {
  const { item, modelSelectColumn, existingFilterObject } = setIncludeData;
  if (item?.includeObj) {
    _.forEach(item?.includeObj, (value, key) => {
      // ** when include relation type is belongs to then add column to select attribute
      if (item?.type === 'BelongsTo' && item?.foreignKey) {
        modelSelectColumn.add(item?.foreignKey);
      }
      existingFilterObject[key] = value;
    });
  }
};
