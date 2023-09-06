// ** Import Packages **
import { Fragment } from 'react';

// ** Components **
import { CardInfiniteScrollSkeleton } from 'components/EntityDetails/Timeline/skeletons/CardInfiniteScrollSkeleton';
import InfiniteScroll from 'components/InfiniteScroll';
import { ColDef } from 'ag-grid-community';

type PageType = {
  page: number;
  hasMore: boolean;
  totalRow?: number;
};
export interface MobileViewProps {
  perPage: PageType;
  items: Array<any>;
  columnData: ColDef[];
  isLoading: boolean;
  setPerPage: (props: any) => void;
}

const CardInfiniteScroll = (props: MobileViewProps) => {
  const { items, perPage, isLoading, setPerPage, columnData } = props;

  return (
    <div
      className="mobile_infiniteScroll_hWrapper overflow-y-auto ip__FancyScroll sm:h-auto hidden sm:block"
      id="mobile_infiniteScroll"
    >
      <InfiniteScroll
        hasMore={perPage.hasMore}
        next={() =>
          perPage.hasMore &&
          setPerPage((prev: { page: number }) => ({
            ...prev,
            page: prev.page + 1,
          }))
        }
        isLoading={isLoading}
        Loader={<CardInfiniteScrollSkeleton />}
        scrollableTarget="mobile_infiniteScroll"
      >
        <div className={`ag__grid__infinite__scroll__mobile hidden sm:block ${items.length > 0 ? '' : 'no__data'}`}>
          {items.length > 0 ? (
            items.map((data: any) => {
              const params = { data: { ...data } };
              return (
                <div
                  key={data.created_at + data.id}
                  className="agGrid__infinite__box border border-[#CCCCCC]/50 rounded-[12px] p-[15px] mb-[15px] relative"
                >
                  {columnData.map((column) => {
                    return (
                      <Fragment key={window.self.crypto.randomUUID()}>
                        {column.cellRenderer(params, true)}
                      </Fragment>
                    );
                  })}
                </div>
              );
            })
          ) : (
            <div className="no__data__wrapper">
              <img
                className="image"
                src="/images/no-data-image.png"
                alt="NO DATA FOUND"
              />
              <h2 className="title">No Result Found</h2>
              <p className="text">
                We couldn't find what you searched for, <br/>try searching again.
              </p>
            </div>
          )}
        </div>
      </InfiniteScroll>
    </div>
  );
};
export default CardInfiniteScroll;
