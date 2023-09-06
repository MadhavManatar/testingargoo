import EmailRowsSkeleton from './EmailRowsSkeleton';

const EmailListSkeleton = () => {
  return (
    <div className="email__page__skeleton__loader">
      <div className="flex flex-wrap justify-between mb-[15px] lg:hidden">
        <div className="inline-flex items-center">
          <div className="skeletonBox w-[80px] mr-[10px]" />
          <div className="skeletonBox w-[100px] h-[32px] rounded-[6px] mr-[10px]" />
          <div className="skeletonBox w-[160px]" />
        </div>
        <div className="inline-flex items-center">
          <div className="skeletonBox w-[80px] h-[32px] rounded-[6px] mr-[10px]" />
          <div className="skeletonBox w-[160px] h-[32px] rounded-[6px]" />
        </div>
      </div>
      <div className="emailInbox__header__2 flex flex-wrap items-center lg:hidden mb-[10px]">
        <div className="emailInbox__tabs__wrapper inline-flex w-[calc(100%_-_142px)] mr-[10px] px-[10px] py-[8px] bg-ipGray__transparentBG rounded-[12px] lg:px-[12px] sm:w-full sm:mr-0">
          <div className="emailInbox__tabs whitespace-pre overflow-x-auto flex items-center">
            <div className="skeletonBox w-[100px] h-[32px] rounded-[6px] mr-[12px]" />
            <div className="skeletonBox w-[100px] mr-[12px]" />
            <div className="skeletonBox w-[100px] mr-[12px]" />
            <div className="skeletonBox w-[100px] mr-[12px]" />
            <div className="skeletonBox w-[100px] mr-[12px]" />
          </div>
        </div>
        <div className="skeletonBox w-[130px] h-[48px] rounded-[6px]" />
      </div>
      <div className="skeletonBox w-[160px] max-w-full hidden mb-[13px] lg:block" />
      <div className="hidden mb-[10px] lg:flex lg:items-center lg:justify-between">
        <div className="skeletonBox w-[32px] h-[32px] rounded-[6px]" />
        <div className="w-[calc(100%_-_35px)] flex items-center justify-end">
          <div className="skeletonBox w-[250px] max-w-[calc(100%_-_70px)] h-[32px] rounded-[6px] mr-[10px]" />
          <div className="skeletonBox w-[32px] h-[32px] rounded-[6px]" />
        </div>
      </div>
      <EmailRowsSkeleton />
    </div>
  );
};

export default EmailListSkeleton;
