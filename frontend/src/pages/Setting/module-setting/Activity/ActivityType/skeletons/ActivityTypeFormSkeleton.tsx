import React from 'react';

const ActivityTypeFormSkeleton = () => {
  return (
    <>
      <div className="mb-[30px] sm:mb-[25px]">
        <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
        <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
      </div>
      <div className="mb-[30px] sm:mb-[25px]">
        <span className="skeletonBox w-[150px] max-w-full mb-[10px]" />
        <span className="skeletonBox w-full h-[44px] rounded-[8px]" />
      </div>
      <div className="icon__libraryBox__wrapper">
        <span className="skeletonBox w-[250px] max-w-full mb-[15px]" />
        <div className="flex flex-wrap justify-between mx-[-10px] after:content-[''] after:flex-auto">
          {React.Children.toArray(
            Array(25)
              .fill(0)
              .map((_val, index) => (
                <div className='px-[10px]'>
                  <div
                    className="skeletonBox w-[46px] h-[46px] rounded-[10px] mb-[20px]"
                    key={index}
                  />
                </div>
              ))
          )}
        </div>
      </div>
    </>
  );
};

export default ActivityTypeFormSkeleton;
