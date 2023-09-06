const NodataFoundComp = () => {
  return (
    <div className="inboxMail__wrapper archive">
      <div className="no__data__wrapper flex flex-wrap justify-center w-[450px] max-w-full mx-auto">
        <img
          className="image"
          src="images/email__modual__no__data.svg"
          alt=""
        />
        <h2 className="title w-full text-center !mt-[5px]">No Result Found</h2>
        <p className="text w-full text-center">
          We couldn't find what you searched for, <br/>try searching again.
        </p>
      </div>
    </div>
  );
};

export default NodataFoundComp;
