import { useEffect, useRef, useState } from 'react';
import { agGridSelectedProps } from 'components/TableInfiniteScroll';

interface Props {
  data: agGridSelectedProps;
}
const useSelectAll = (props: Props) => {
  const { data } = props;
  // ** States
  const [selectionList, setSelectionList] = useState<any>({});
  const [isCheckAll, setIsCheckAll] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);

  // ** Ref
  const isCheckAllRef = useRef(isCheckAll);
  const selectionRef = useRef(selectionList);

  const selectedIdsLength = Object.keys(selectionList).length;

  useEffect(() => {
    if (isCheckAll && data.length) {
      checkAll();
    } else if (isCheckAll === false && data.length === selectedIdsLength) {
      clearSelectAll();
    }
  }, [isCheckAll]);

  useEffect(() => {
    if (data.length) {
      setDisabled(false);
    }
    if (data.length === 0) {
      clearSelectAll();
      setDisabled(true);
    } else if (data.length && isCheckAll) {
      checkAll();
    }
  }, [data.length]);

  useEffect(() => {
    if (selectedIdsLength) {
      document.body.classList.add('ag__grid__show__delete__btn');
    } else {
      document.body.classList.remove('ag__grid__show__delete__btn');
    }

    if (selectedIdsLength !== data.length) {
      isCheckAllRef.current = false;
      setIsCheckAll(false);
    } else if (selectedIdsLength && data.length === selectedIdsLength) {
      isCheckAllRef.current = true;
      setIsCheckAll(true);
    }
  }, [selectionList]);

  const checkAll = () => {
    const list: { [x: number]: any } = {};
    data?.forEach((obj) => {
      list[obj.id] = obj;
    });
    selectionRef.current = data.length ? { ...list } : {};
    setSelectionList(data.length ? { ...list } : {});
  };

  const clearSelectAll = () => {
    setIsCheckAll(false);
    selectionRef.current = {};
    setSelectionList({});
    if (data.length === 0) {
      setDisabled(true);
    }
  };
let selectedIds:number[] = [];
if(Object.hasOwn(selectionList, "id")){
  selectedIds.push(Number(selectionList?.id))
}else{
  selectedIds = Object.keys(selectionList || {}).map((id) => +id);
}

  return {
    clearSelectAll,
    disabled,
    setDisabled,
    selectedIds,
    selectionList,
    setSelectionList,
    isCheckAll,
    setIsCheckAll,
    selectionRef,
    isCheckAllRef,
  };
};

export default useSelectAll;
