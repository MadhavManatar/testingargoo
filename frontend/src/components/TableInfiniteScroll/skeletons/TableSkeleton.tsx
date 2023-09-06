interface Props {
  noOfRows: number;
  noOfColumns: number;
}

const TableSkeleton = (props: Props) => {
  const { noOfColumns, noOfRows } = props;
  return (
    <>
      <div className="ag-grid-skeleton-table w-full">
        {[...Array(noOfRows)].map((_) => (
          <div
            key={window.self.crypto.randomUUID()}
            className="ag-grid-skeleton-row w-full shadow-[5px_10px_20px_#dee2e64d] flex items-center mb-[15px] rounded-[12px]"
          >
            {[...Array(noOfColumns)].map((__) => (
              <div
                key={window.self.crypto.randomUUID()}
                style={{ width: `${100 / noOfColumns}%` }}
                className="ag-grid-skeleton-column h-[50px] px-[10px] flex items-center"
              >
                {/* <span className="skeletonBox w-full" /> */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default TableSkeleton;
