// ** Import Packages **
import { useEffect, useState } from 'react';

// ** Component **
import Icon from 'components/Icon';

export interface propsType {
  url: string;
}
interface ImageData {
  title: string;
  images: string[];
  url: string;
  duration: number;
  description: string;
  domain: string;
}
const LinkPreview = (props: propsType) => {
  const { url } = props;
  const [data, setData] = useState<ImageData>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://jsonlink.io/api/extract?url=${url}`
        );

        const jsonData = await response.json();

        setData(jsonData);
        setIsLoading(false);
      } catch (errors) {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  if (isLoading) {
    return <div>{url}</div>;
  }

  return (
    <div className="link__preview w-[900px] max-w-full shadow-[inset_-2px_-3px_8px_#0000001a] border-[1px] border-[#e3e3e3] rounded-[12px] overflow-hidden">
      <div className="flex w-full items-start">
        {data?.images?.length && data?.images?.length > 0 ? (
          <div className="img__wrapper w-[250px] shrink-0 max-w-[30%] h-[129px]">
            <div className="h-full p-[15px] flex items-center justify-center relative">
              <img
                className="block max-w-full max-h-full object-contain"
                src={data?.images?.[0] || 'https://icons8.com/icon/1349/domain'}
                alt=""
              />
            </div>
          </div>
        ) : (
          <div className="img__wrapper w-[250px] shrink-0 max-w-[30%] h-[129px]">
            <div className="h-full p-[15px] flex items-center justify-center relative">
              <img
                className="block max-w-full max-h-full object-contain"
                src="https://icons8.com/icon/1349/domain"
                alt=""
              />
              <Icon
                className="w-[100px] h-[100px] max-w-full max-h-full p-[18px] opacity-30"
                iconType="imageIconFilledBlack"
              />
            </div>
          </div>
        )}
        <div className="right__details p-[15px] w-[calc(100%_-_30%)]">
          {data?.title && (
            <h3 className="title text-[18px] font-biotif__SemiBold text-black leading-[24px] ellipsis__2">
              {data?.title}
            </h3>
          )}
          {data?.url && (
            <p className="text mt-[7px] text-[16px] text-primaryColor cursor-pointer font-biotif__Regular ellipsis__2 leading-[22px] hover:underline">
              {data?.url}
            </p>
          )}
        </div>
      </div>
      {data?.description && (
        <div className="description__wrapper pb-[10px] px-[20px]">
          <p className="text text-[16px] font-biotif__Regular text-gray-500 ellipsis__2">
            {data?.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default LinkPreview;
