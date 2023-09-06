// ** Import Packages **
import { useEffect, useState } from 'react';

// ** Hooks **
import useWindowDimensions from './useWindowDimensions';

// ** Types **
import { PaginationParams } from 'components/TableInfiniteScroll';

interface Props {
  getData: (params: PaginationParams) => Promise<{
    rowData: Array<any>;
    rowCount: number;
  }>;
  searchData: {
    searchText: string;
    searchFields: string;
  };
}

const useInfiniteScrollInfo = ({ getData, searchData }: Props) => {
  const { width } = useWindowDimensions();
  const isMobileView = width < 576;

  // ** states **
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>();
  const [perPage, setPerPage] = useState<{
    page: number;
    hasMore: boolean;
  }>({ hasMore: true, page: 1 });
  const [items, setItems]: any = useState<Array<any>>([]);
  const [onlyOnceApiFlag, setOnlyOnceApiFlag] = useState<boolean>(true);

  useEffect(() => {
    if (isMobileView && onlyOnceApiFlag) {
      setOnlyOnceApiFlag(false);
      fetchData();
    }
  }, [isMobileView]);

  useEffect(() => {
    if (totalCount === 0 && isMobileView) {
      fetchData();
    }
    if (isMobileView && (totalCount as number) > items.length) {
      fetchData();
    }
  }, [perPage]);

  useEffect(() => {
    if (searchData.searchFields.length > 0) {
      setPerPage({ ...perPage, page: 1 });
      setItems([]);
    }
  }, [searchData]);

  const fetchData = async () => {
    setLoading(true);
    const { rowData, rowCount } = await getData({
      page: perPage.page,
      limit: 10,
      searchFields: searchData?.searchFields || '',
      searchText: searchData?.searchText || '',
    });
    setLoading(false);
    setTotalCount(rowCount);
    if (rowData.length && rowCount > 0) {
      if (perPage.page === 1) {
        setItems([...rowData]);
      } else {
        const concatItems = await items.concat([...rowData]);
        setItems([...concatItems]);
      }
    }
  };
  return { loading, perPage, items, setPerPage, setItems, fetchData };
};

export default useInfiniteScrollInfo;
