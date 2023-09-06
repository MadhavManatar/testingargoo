// ** import packages **
import { useEffect, useState } from 'react';
// ** components **
import NameBadge from 'components/Badge/NameBadge';
import Icon from 'components/Icon';

// ** others **
import { srcFilePath } from 'utils/util';
import { getPresignedImageUrl } from 'services/wasabi.service';

interface Props {
  imgPath?: string | File | null;
  imgClassName?: string;
  noImgIconWrapperClass?: string;
  serverPath?: boolean;
  first_name?: string;
  last_name?: string;
  disableLoader?: boolean;
  color?: string;
}

const Image = (props: Props) => {
  const {
    imgPath = '',
    imgClassName = '',
    noImgIconWrapperClass = '',
    serverPath = false,
    disableLoader = false,
    first_name,
    last_name,
    color,
  } = props;

  // ** States **
  const [fetchError, setFetchError] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageURL, setImageURL] = useState<string | File>('');

  useEffect(() => {
    if (!isMounted) setIsMounted(true);
  }, []);

  useEffect(() => {
    if (imgPath && typeof imgPath === 'string' && serverPath) {
      loadServerImage(imgPath);
    } else {
      setImageURL(imgPath || '');
    }
  }, [imgPath, serverPath]);

  const loadServerImage = async (path: string) => {
    /*  */

    setIsLoading(true);
    const result = await getPresignedImageUrl(path);
    setIsLoading(false);

    setImageURL(result || '');
  };

  const imgComponent = () => {
    return (
      <>
        {imageURL ? (
          <img
            className={`img__element ${
              !isImageLoaded ? 'hidden' : 'block'
            } ${imgClassName}`}
            src={srcFilePath(imageURL, serverPath)}
            alt=""
            onLoad={() => setIsImageLoaded(true)}
            onError={() => {
              setFetchError(true);
              setIsImageLoaded(true);
            }}
          />
        ) : (
          <>
            {noImgIconWrapperClass && (
              <div className={`no__img__icon ${noImgIconWrapperClass}`}>
                <Icon
                  iconType="profileFilledBlueIcon"
                  className="w-full h-full grayscale"
                />
              </div>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <>
      {fetchError ? (
        <Icon
          className="w-full h-full"
          iconType="imageIconFilledPrimaryColor"
        />
      ) : (
        (isLoading || (!disableLoader && !isImageLoaded && imageURL)) && (
          <div className="flex items-center justify-center img__loader">
            <div className="i__ButtonLoader i__ButtonLoader__ForLight !m-0 !top-0" />
          </div>
        )
      )}

      {isMounted && !fetchError && !isLoading && (
        <>
          {!imageURL && (first_name || last_name) ? (
            <NameBadge
              first_name={first_name}
              last_name={last_name}
              color={color}
            />
          ) : (
            imgComponent()
          )}
        </>
      )}
    </>
  );
};

export default Image;
