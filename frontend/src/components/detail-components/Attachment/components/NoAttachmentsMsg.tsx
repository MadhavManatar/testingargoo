const NoAttachmentsMsg = () => {
  return (
    <div className="rounded-[12px] min-h-[200px] flex flex-wrap items-center justify-center py-[20px] px-[20px] bg-ipGray__transparentBG">
      <div className="inner__wrapper">
        <div className="flex flex-wrap items-center justify-center w-full mb-[12px]">
          <img
            className="inline-block w-[70px]"
            src="/images/no-attachment-data-img.png"
            alt=""
          />
        </div>
        <p className="text-[20px] text-ip__black__text__color font-biotif__Medium">
          No Documents!
        </p>
      </div>
    </div>
  );
};

export const NoAttachmentsAccessMsg = () => {
  return (
    <div className="rounded-[12px] min-h-[200px] flex flex-wrap items-center justify-center py-[20px] px-[20px] bg-ipGray__transparentBG">
      <div className="inner__wrapper">
        <div className="flex flex-wrap items-center justify-center w-full mb-[12px]">
          <p className="text-[20px] text-ip__black__text__color font-biotif__Medium">
            Not Authorized!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoAttachmentsMsg;
