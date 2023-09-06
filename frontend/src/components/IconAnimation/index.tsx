import Tippy from '@tippyjs/react';
import Icon, { IconTypes } from 'components/Icon';
import { IconTypeJson } from 'indexDB/indexdb.type';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  getAnimationIconjson,
  getIconAnimationSetting,
} from 'redux/slices/commonSlice';

type animationIconType = {
  iconType: IconTypes;
  animationIconType: IconTypeJson;
  className?: string;
  iconClassName?: string;
  textLabel?: string;
  textLabelClassName?: string;
  tippyDisplay?: boolean;
};

const IconAnimation = (props: animationIconType) => {
  const {
    iconType,
    animationIconType,
    className,
    textLabel,
    textLabelClassName,
    iconClassName,
    tippyDisplay,
  } = props;
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  useEffect(() => {
    lottieRef?.current?.pause();
  }, []);

  // Icon From Redux
  const iconEnable = useSelector(getIconAnimationSetting);
  const allIconFromRedux = useSelector(getAnimationIconjson);
  const iconJson = allIconFromRedux?.[animationIconType];

  // Icon From IndexDb
  // const { iconJson, iconJsonLoading } = animationIconJson(animationIconType);
  // if (iconJsonLoading) {
  //   return <></>;
  // }

  return (
    <>
      {iconEnable && iconJson && iconJson !== 'null' ? (
        <>
          <button
            onMouseEnter={() => {
              lottieRef.current?.goToAndPlay(1);
            }}
            onMouseLeave={() => {
              lottieRef.current?.goToAndStop(1);
            }}
            className={`animated__icon__btn ${className} flex`}
          >
            <div className={`${iconClassName}`}>
              <Lottie
                style={{ width: '100%', height: '100%' }}
                loop={false}
                autoplay={false}
                animationData={JSON.parse(iconJson)}
                lottieRef={lottieRef}
              />
            </div>
            {tippyDisplay && textLabel ? (
              <Tippy zIndex={9} hideOnClick placement="top" content={textLabel}>
                <span className={` ${textLabelClassName} `}>
                  {textLabel.substring(0, 8)}...
                </span>
              </Tippy>
            ) : (
              <span className={` ${textLabelClassName} `}>{textLabel}</span>
            )}
          </button>
        </>
      ) : (
        <>
          <div className={`${iconClassName}`}>
            <Icon
              iconType={iconType}
              className={` ${className} !rounded-[8px] cursor-pointer solidIcon`}
            />
          </div>
          {tippyDisplay && textLabel ? (
            <Tippy zIndex={9} hideOnClick placement="top" content={textLabel}>
              <span className={` ${textLabelClassName} `}>
                {textLabel.substring(0, 8)}...
              </span>
            </Tippy>
          ) : (
            <span className={` ${textLabelClassName} `}>{textLabel}</span>
          )}
        </>
      )}
    </>
  );
};
export default IconAnimation;
