import { columnsDataInterface } from 'components/ColumnViewListDropDown';

export interface FilterColumnInterface {
  columnName: string;
  columnType: string;
  value: string;
  type: string;
  includeObj?: Record<string, any>;
  searchKeys?: string[];
  foreignKey?: string;
}

export interface FilterInterface {
  filterType?: 'and' | 'or';
  filter: FilterColumnInterface[];
}

export interface FiltersDataInterface {
  filterType?: 'and' | 'or';
  filter?: FilterInterface[];
}

export interface sortDataInterface {
  column: columnsDataInterface | undefined;
  type: string;
}

export interface selectOptionsInterface {
  value: string;
  label: string;
  type: string;
  model: string;
  searchKeys?: string[];
  includeObj?: Record<string, any>;
  foreignKey?: string;
}

export interface selectedFilterNameInterface {
  isShow: boolean;
  index: number;
  subIndex: number;
  value?: selectOptionsInterface;
}
