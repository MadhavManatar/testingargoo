const ProfileSkeleton = () => {
  return (
    <>
      <div className="w-[1080px] max-w-full">
        <span className="skeletonBox w-[660px] max-w-full mb-[10px]" />
        <span className="skeletonBox w-[500px] max-w-full mb-[30px]" />
        <div className="w-[660px] max-w-full">
          <div className="mb-[30px] sm:mb-[20px]">
            <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
            <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
          </div>
          <div className="mb-[30px] sm:mb-[20px]">
            <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
            <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
          </div>
          <div className="mb-[30px] sm:mb-[10px]">
            <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
            <span className="skeletonBox w-full h-[200px] rounded-[8px]" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSkeleton;
