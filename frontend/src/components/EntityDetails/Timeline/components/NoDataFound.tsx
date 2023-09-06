const NoDataFound = () => {
    return (
        <div className="no__data__wrapper flex flex-wrap justify-center bg-[#fbfbfb] rounded-[10px] px-[15px] border border-[#CCCCCC]/50">
            <div className="w-[300px] max-w-full">
                <img
                    className="image"
                    src="/images/no-data-image.png"
                    alt="NO DATA FOUND"
                />
                <h2 className="title">No Result Found</h2>
                <p className="text text-center">
                    We couldn't find what you searched for, <br />
                    try searching again.
                </p>
            </div>
        </div>
    )
}

export default NoDataFound