// ** external packages **
import Tippy from '@tippyjs/react';
import React from 'react';

type TableActionButtonProps = {
  filedArray: { label: string; onClick: () => void; Icon?: JSX.Element }[];
  disabled?: boolean;
};

export const StreamActionButton = (props: TableActionButtonProps) => {
  const { filedArray, disabled = false } = props;
  return (
    <>
      {!disabled && (
        <Tippy
          className="tippy__dropdown"
          trigger="click"
          hideOnClick
          theme="light"
          content={
            <div>
              <ul className="tippy__dropdown__ul">
                {React.Children.toArray(
                  filedArray.map((val) => {
                    return (
                      <>
                        <div
                          key={window.crypto.randomUUID()}
                          className="item"
                          onClick={val.onClick}
                        >
                          <div className="item__link">
                            <div className="i__Icon hidden">
                              <svg
                                width="28"
                                height="28"
                                viewBox="0 0 28 28"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M19.4476 2.33374C23.4155 2.33374 25.6555 4.58424 25.6671 8.55207V19.4487C25.6671 23.4154 23.4155 25.6671 19.4476 25.6671H8.55213C4.5843 25.6671 2.3338 23.4154 2.3338 19.4487V8.55207C2.3338 4.58424 4.5843 2.33374 8.55213 2.33374H19.4476ZM14.5838 7.15207C14.256 6.95374 13.8593 6.95374 13.5455 7.15207C13.2293 7.34924 13.0555 7.71207 13.0893 8.07374V19.9621C13.1488 20.4637 13.5676 20.8371 14.0576 20.8371C14.5605 20.8371 14.9793 20.4637 15.026 19.9621V8.07374C15.0726 7.71207 14.8988 7.34924 14.5838 7.15207ZM9.13547 10.9787C8.82047 10.7804 8.42263 10.7804 8.1088 10.9787C7.79263 11.1771 7.6188 11.5376 7.6538 11.9004V19.9621C7.6993 20.4637 8.1193 20.8371 8.62097 20.8371C9.1238 20.8371 9.54263 20.4637 9.5893 19.9621V11.9004C9.62547 11.5376 9.4493 11.1771 9.13547 10.9787ZM19.9376 15.2137C19.6238 15.0154 19.2271 15.0154 18.9005 15.2137C18.5843 15.4121 18.4105 15.7609 18.4571 16.1354V19.9621C18.5038 20.4637 18.9226 20.8371 19.4255 20.8371C19.9155 20.8371 20.3343 20.4637 20.3938 19.9621V16.1354C20.4276 15.7609 20.2538 15.4121 19.9376 15.2137Z"
                                  fill="#1776BA"
                                />
                              </svg>
                            </div>
                            <span className="item__text">{val.label}</span>
                          </div>
                        </div>
                      </>
                    );
                  })
                )}
              </ul>
            </div>
          }
          placement="bottom-start"
        >
          <span
            className="toggle__btn ml-[7px] py-[9px] px-[6px] duration-300 rounded-[4px] hover:bg-btnGrayColor"
            ref={(ref) => {
              if (!ref) return;
              ref.onclick = (e) => {
                e.stopPropagation();
              };
            }}
          >
            <svg
              width="18"
              height="5"
              viewBox="0 0 18 5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="16"
                cy="2.5"
                r="2"
                transform="rotate(90 16 2.5)"
                fill="#7467B7"
              />
              <circle
                cx="9"
                cy="2.5"
                r="2"
                transform="rotate(90 9 2.5)"
                fill="#7467B7"
              />
              <circle
                cx="2"
                cy="2.5"
                r="2"
                transform="rotate(90 2 2.5)"
                fill="#7467B7"
              />
            </svg>
          </span>
        </Tippy>
      )}
    </>
  );
};
