import { ICellRendererParams } from 'ag-grid-community';

type globalCellRendererProps = {
  cellValue: string | JSX.Element;
  params?: ICellRendererParams;
  label: string;
  isMobileView?: boolean;
  onRowClickNavigateLink?: string;
  isLoading?: boolean;
};

const TableCellRenderer = (props: globalCellRendererProps) => {
  const {
    cellValue,
    params,
    label,
    isMobileView = false,
    onRowClickNavigateLink = '',
    isLoading,
  } = props;
  const conditionalSpan = () => {
    return typeof cellValue === 'object' ? (
      cellValue
    ) : (
      <span className="value block w-full text-[14px] leading-[18px] font-biotif__Medium text-black">
        {cellValue || ''}
      </span>
    );
  };

  return isLoading === false || params?.data !== undefined ? (
    typeof isMobileView === 'boolean' && isMobileView ? (
      <div className="ag__ib__row flex flex-wrap mb-[20px] items-center">
        <label className="text block w-full text-[14px] leading-[18px] font-biotif__Medium text-primaryColor mb-[5px]">
          {label}:
        </label>
        <span className="value block w-full text-[14px] leading-[18px] font-biotif__Medium text-black">
          {conditionalSpan()}
        </span>
      </div>
    ) : onRowClickNavigateLink ? (
      <>
        <div className="m__label w-full hidden sm:block">{label}</div>
        <div className="cell__value__wrapper">
          {typeof cellValue === 'object' ? (
            cellValue
          ) : (
              <p className="value">{cellValue || ''}</p>
          )}
        </div>
      </>
    ) : (
      <>
        <div className="m__label w-full hidden sm:block">{label}</div>
        <div className="cell__value__wrapper">
          {typeof cellValue === 'object' ? (
            cellValue
          ) : (
            <p className="value">{cellValue || ''}</p>
          )}
        </div>
      </>
    )
  ) : (
    <>
      <span className="skeletonBox" />
    </>
  );
};

export default TableCellRenderer;
