import Button from 'components/Button';
import {
  columnViewInterface,
  sortByType,
} from 'components/ColumnViewListDropDown';
import Icon from 'components/Icon';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';

interface Props {
  columnViewsData: columnViewInterface[];
  setColumnViewData: React.Dispatch<
    React.SetStateAction<columnViewInterface[]>
  >;
  SelectedColumnViewData: columnViewInterface;
  onHandleChangeColumnView: (item: columnViewInterface) => void;
  onHandleClearSelectedData: () => void;
}

const ViewList = ({
  columnViewsData,
  setColumnViewData,
  SelectedColumnViewData,
  onHandleChangeColumnView,
  onHandleClearSelectedData,
}: Props) => {
  // ** states **
  const [sortBy, setSortBy] = useState<sortByType>('asc');
  const [viewSearchText, setViewSearchText] = useState<string>('');
  const [views, setViews] = useState<columnViewInterface[]>(columnViewsData);

  useEffect(() => {
    setViews(columnViewsData);
  }, [columnViewsData]);

  useEffect(() => {
    setColumnViewData(
      _.orderBy(columnViewsData, (item) => item?.name?.toLowerCase(), sortBy)
    );
  }, [sortBy]);

  const onHandleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewSearchText(e?.target?.value);
    if (e?.target?.value && e?.target?.value !== '') {
      setViews(
        columnViewsData?.filter(
          (column) =>
            column.name
              .toLocaleLowerCase()
              .includes(e?.target?.value.toLocaleLowerCase()) === true
        )
      );
    } else {
      setViews(columnViewsData);
    }
  };
  return (
    <div className="first__column px-[20px] pt-[15px] w-[251px] border-r-[1px] border-r-whiteScreenBorderColor">
      <h3 className="text-darkTextColorSD text-[16px] font-biotif__Regular mb-[7px]">
        All Views
      </h3>
      <div className="flex items-center">
        <div className="form__Group searchField__small !mb-0 w-[calc(100%_-_40px)]">
          <div className="ipel__wrapper ip__form__hasIcon">
            <input
              className="ip__input"
              type="text"
              name="search"
              placeholder="Search"
              value={viewSearchText || ''}
              onChange={onHandleSearchChange}
              autoComplete="off"
            />
            <Icon className="" iconType="searchStrokeIcon" />
          </div>
        </div>
        <button
          onClick={() => setSortBy(sortBy === 'asc' ? 'desc' : 'asc')}
          className="w-[34px] h-[34px] relative rounded-[6px] ml-[6px] bg-formElementBG group duration-300 hover:bg-primaryColorSD"
        >
          <span className="letter absolute top-[4px] left-[9px] text-[11px] text-sdNormal__textColor font-biotif__Regular group-hover:text-[#ffffff]">
            A
          </span>
          <span className="letter absolute top-[16px] left-[9px] text-[11px] text-sdNormal__textColor font-biotif__Regular group-hover:text-[#ffffff]">
            Z
          </span>
          <span className="w-[1px] h-[17px] bg-sdNormal__textColor absolute right-[10px] top-[9px] before:content-[''] before:absolute before:top-0 before:left-[-2px] before:w-[5px] before:h-[5px] before:border-l-[1px] before:border-b-[1px] before:border-l-sdNormal__textColor before:border-b-sdNormal__textColor before:rotate-[135deg] after:content-[''] after:absolute after:bottom-0 after:left-[-2px] after:w-[5px] after:h-[5px] after:border-l-[1px] after:border-b-[1px] after:border-l-sdNormal__textColor after:border-b-sdNormal__textColor after:-rotate-45 group-hover:bg-[#ffffff] group-hover:before:border-l-[#ffffff] group-hover:before:border-b-[#ffffff] group-hover:after:border-l-[#ffffff] group-hover:after:border-b-[#ffffff]" />
        </button>
      </div>
      <div className="mb-[10px] pt-[11px] pb-[10px] h-[calc(100dvh_-_310px)] overflow-y-auto ip__hideScrollbar">
        {views?.length ? (
          React.Children.toArray(
            views?.map((item: columnViewInterface, index: number) => (
              <>
                <div
                  key={index}
                  className={`list__item mb-[4px] last:mb-0 group cursor-pointer px-[15px] pl-[8px] 
                          py-[9px] relative flex items-center rounded-[6px] 
                          duration-300 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-[6px] before:bg-primaryColorSD before:opacity-0 before:duration-300 hover:before:opacity-20 ${
                            SelectedColumnViewData?.id === item?.id
                              ? 'active'
                              : ''
                          }`}
                  onClick={() => onHandleChangeColumnView(item)}
                >
                  {item.visibility === 'private' ? (
                    <>
                      <IconAnimation
                        iconType="privateIcon"
                        animationIconType={IconTypeJson.Private}
                        textLabel={item?.name}
                        iconClassName="icon__wrapper w-[24px] h-[24px] p-[1px] shrink-0 mr-[5px] relative top-[-3px]"
                        textLabelClassName="text relative z-[2] text-[14px] font-biotif__Medium 
                          text-darkTextColorSD inline-block whitespace-pre overflow-hidden 
                          text-ellipsis duration-300 group-hover:text-primaryColorSD pr-[10px]"
                      />
                    </>
                  ) : (
                    <>
                      <IconAnimation
                        iconType="publicIcon"
                        animationIconType={IconTypeJson.Public}
                        textLabel={item?.name}
                        iconClassName="icon__wrapper w-[24px] h-[24px] p-[1px] shrink-0 mr-[5px] relative top-[-3px]"
                        textLabelClassName="text relative z-[2] text-[14px] font-biotif__Medium 
                          text-darkTextColorSD inline-block whitespace-pre overflow-hidden 
                          text-ellipsis duration-300 group-hover:text-primaryColorSD pr-[10px]"
                      />
                    </>
                  )}
                  <span
                    className="arrow__btn z-[2] shrink-0 absolute top-[50%] 
                          translate-y-[-50%] right-[13px] rotate-[-135deg] 
                          inline-block w-[8px] h-[8px] border-l-[2px] 
                          border-l-grayIconDarkColor border-b-[2px] border-b-grayIconDarkColor 
                          group-hover:border-l-[2px] group-hover:border-l-primaryColorSD 
                          group-hover:border-b-[2px] group-hover:border-b-primaryColorSD"
                  />
                </div>
              </>
            ))
          )
        ) : (
          <div className="no__data__wrapper">
            <img
              className="image"
              src="/images/no-data-image.png"
              alt="NO DATA FOUND"
            />
            <h2 className="title">No Result Found</h2>
            <p className="text">
              We couldn't find what you searched for, <br />
              try searching again.
            </p>
          </div>
        )}
      </div>
      <div className="">
        <Button
          className="primary__Btn text-[14px] py-[12px] w-full"
          onClick={onHandleClearSelectedData}
        >
          New Custom View
        </Button>
      </div>
    </div>
  );
};

export default ViewList;
