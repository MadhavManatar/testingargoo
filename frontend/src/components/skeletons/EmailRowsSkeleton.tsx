const EmailRowsSkeleton = () => {
  return (
    <div className="inboxMail__wrapper sent !h-[calc(100dvh_-_292px)] 3xl:!h-[calc(100dvh_-_335px)] xl:!h-[calc(100dvh_-_320px)] lg:!h-[calc(100dvh_-_178px)] md:!h-[calc(100dvh_-_175px)]">
      {[...Array(20)].map((_, idx) => (
        <div className="inboxMail__row lg:items-start lg:!py-[17px]" key={idx}>
          <div className="inboxMail__cell checkbox__wrapper">
            <div className="skeletonBox w-[18px] h-[18px] rounded-[4px]" />
          </div>
          <div className="inboxMail__cell profile__img">
            <div className="skeletonBox w-[30px] h-[30px] rounded-full" />
          </div>
          <div className="inboxMail__cell subject !w-[345px] lg:!w-full lg:!pr-0 lg:!mb-[12px]">
            <div className="skeletonBox w-full lg:w-[70%]" />
          </div>
          <div className="inboxMail__cell excerpt !h-auto !pr-[20px] lg:!pr-0">
            <div className="skeletonBox w-[700px] max-w-full lg:w-full lg:mb-[8px]" />
            <div className="skeletonBox w-[60%] hidden lg:block" />
          </div>
          <div className="inboxMail__cell time lg:!top-[17px]">
            <div className="skeletonBox w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmailRowsSkeleton;
