// ** Import Packages **
import Tippy from '@tippyjs/react';
import Icon from 'components/Icon';
import _ from 'lodash';
// ** Type **
import { columnsDataInterface } from 'components/ColumnViewListDropDown';

interface propsDataType {
  column: columnsDataInterface;
  columns: columnsDataInterface[];
  index: number;
  onHandleUpdateColumns: (columns: columnsDataInterface[]) => void;
  disabled?: boolean;
  setIsWrapTxtUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

const useShowHeaderColumn = () => {
  const showHeaderList = (props: propsDataType) => {
    const {
      column,
      columns,
      index,
      onHandleUpdateColumns,
      disabled,
      setIsWrapTxtUpdate,
    } = props;
    let showTippy = false;
    const clientWidth = document.querySelector(`#nameId${index}`)?.clientWidth;
    const scrollWidth = document.querySelector(`#nameId${index}`)?.scrollWidth;

    if (clientWidth && scrollWidth) {
      showTippy = scrollWidth > clientWidth;
    }

    return (
      <>
        {showTippy ? (
          <Tippy zIndex={9999} content={column.displayName}>
            <div className="pin-unpin-header inline-flex items-center max-w-full relative">
              <h3
                className="name whitespace-pre overflow-hidden text-ellipsis"
                id={`nameId${index}`}
              >
                {column.displayName}
              </h3>
              {column?.is_pin && (
                <button
                  onClick={() =>
                    onHandleUpdateColumns(
                      columns?.map((item) => {
                        if (item?.fieldName === column.fieldName) {
                          return {
                            ...item,
                            is_pin: !item.is_pin,
                          };
                        }
                        return item;
                      })
                    )
                  }
                >
                  <Icon iconType="unpinFilledIcon" />
                </button>
              )}
              <Tippy
                className="tippy__dropdown"
                trigger="click"
                hideOnClick
                theme="light"
                content={
                  <div>
                    <ul className="tippy__dropdown__ul">
                      <div
                        key={window.crypto.randomUUID()}
                        className="item"
                        onClick={() =>
                          onHandleUpdateColumns(
                            columns?.map((item) => {
                              if (item?.fieldName === column.fieldName) {
                                return {
                                  ...item,
                                  is_pin: !item.is_pin,
                                };
                              }
                              return item;
                            })
                          )
                        }
                      >
                        <div className="item__link">
                          <div className="i__Icon">
                            {column?.is_pin ? (
                              <Icon iconType="unpinFilledIcon" />
                            ) : (
                              <Icon iconType="pinFilledIcon" />
                            )}
                          </div>
                          <span className="item__text">
                            {column?.is_pin ? 'Unpin column' : 'Pin column'}
                          </span>
                        </div>
                      </div>
                      <div
                        key={window.crypto.randomUUID()}
                        className="item"
                        onClick={() => {
                          onHandleUpdateColumns(
                            columns?.map((item) => {
                              if (item?.fieldName === column.fieldName) {
                                return {
                                  ...item,
                                  is_wrap: !item.is_wrap,
                                };
                              }
                              return item;
                            })
                          );
                          setIsWrapTxtUpdate(true);
                        }}
                      >
                        <div className="item__link">
                          <div className="i__Icon">
                            {column?.is_wrap ? (
                              <Icon iconType="unWrapIcon" />
                            ) : (
                              <Icon iconType="wrapIcon" />
                            )}
                          </div>
                          <span className="item__text">
                            {column?.is_wrap ? 'Unwrap text' : 'Wrap text'}
                          </span>
                        </div>
                      </div>
                    </ul>
                  </div>
                }
                placement="bottom-start"
              >
                <button
                  ref={(ref) => {
                    if (!ref) return;
                    ref.onclick = (e) => {
                      e.stopPropagation();
                    };
                  }}
                  className={`${'i__Button secondary__Btn ag__grid__toggle__btn ml-[10px]'}`}
                  disabled={disabled}
                >
                  <Icon iconType="toggle3dotsIcon" />
                </button>
              </Tippy>
            </div>
          </Tippy>
        ) : (
          <div className="pin-unpin-header inline-flex items-center max-w-full relative">
            <h3
              className="name whitespace-pre overflow-hidden"
              id={`nameId${index}`}
            >
              {column.displayName}
            </h3>
            {column?.is_pin && (
              <button
                onClick={() =>
                  onHandleUpdateColumns(
                    columns?.map((item) => {
                      if (item?.fieldName === column.fieldName) {
                        return {
                          ...item,
                          is_pin: !item.is_pin,
                        };
                      }
                      return item;
                    })
                  )
                }
              >
                <Icon iconType="unpinFilledIcon" />
              </button>
            )}
            <Tippy
              className="tippy__dropdown"
              trigger="click"
              hideOnClick
              theme="light"
              content={
                <div>
                  <ul className="tippy__dropdown__ul">
                    <div
                      key={window.crypto.randomUUID()}
                      className="item"
                      onClick={() =>
                        onHandleUpdateColumns(
                          columns?.map((item) => {
                            if (item?.fieldName === column.fieldName) {
                              return {
                                ...item,
                                is_pin: !item.is_pin,
                              };
                            }
                            return item;
                          })
                        )
                      }
                    >
                      <div className="item__link">
                        <div className="i__Icon">
                          {column?.is_pin ? (
                            <Icon iconType="unpinFilledIcon" />
                          ) : (
                            <Icon iconType="pinFilledIcon" />
                          )}
                        </div>
                        <span className="item__text">
                          {column?.is_pin ? 'Unpin column' : 'Pin column'}
                        </span>
                      </div>
                    </div>
                    <div
                      key={window.crypto.randomUUID()}
                      className="item"
                      onClick={() => {
                        onHandleUpdateColumns(
                          columns?.map((item) => {
                            if (item?.fieldName === column.fieldName) {
                              return {
                                ...item,
                                is_wrap: !item.is_wrap,
                              };
                            }
                            return item;
                          })
                        );
                        setIsWrapTxtUpdate(true);
                      }}
                    >
                      <div className="item__link">
                        <div className="i__Icon">
                          {column?.is_wrap ? (
                            <Icon iconType="unWrapIcon" />
                          ) : (
                            <Icon iconType="wrapIcon" />
                          )}
                        </div>
                        <span className="item__text">
                          {column?.is_wrap ? 'Unwrap text' : 'Wrap text'}
                        </span>
                      </div>
                    </div>
                  </ul>
                </div>
              }
              placement="bottom-start"
            >
              <button
                ref={(ref) => {
                  if (!ref) return;
                  ref.onclick = (e) => {
                    e.stopPropagation();
                  };
                }}
                className={`${'i__Button secondary__Btn ag__grid__toggle__btn ml-[10px]'}`}
                disabled={disabled}
              >
                <Icon iconType="toggle3dotsIcon" />
              </button>
            </Tippy>
          </div>
        )}
      </>
    );
  };

  const calculateDynamicWidth = (
    columns: columnsDataInterface[],
    column: columnsDataInterface
    // reset?: boolean
  ) => {
    let widthParams = {};
    const totalColumnWidth = columns.reduce((sum, prevColumn) => {
      return (
        sum + (typeof prevColumn.width === 'number' ? prevColumn.width : 0)
      );
    }, 0);

    const totalColumnWidthNotIncludeLast = _.cloneDeep(columns)
      .splice(0, columns.length - 1)
      .reduce((sum, prevColumn) => {
        return (
          sum + (typeof prevColumn.width === 'number' ? prevColumn.width : 0)
        );
      }, 0);

    let columnWidth = column?.width;

    const is_last_columns = _.last(columns) === column;

    const screenWidth =
      document?.querySelector('.ag-center-cols-viewport')?.clientWidth || 0;

    if (is_last_columns) {
      if (screenWidth > totalColumnWidth) {
        columnWidth = screenWidth - totalColumnWidthNotIncludeLast;
      }
    }

    widthParams = {
      width: columnWidth,
    };

    return { widthParams };
  };
  return { showHeaderList, calculateDynamicWidth };
};

export default useShowHeaderColumn;
