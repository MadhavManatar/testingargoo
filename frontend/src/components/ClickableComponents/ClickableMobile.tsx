// ** components **
import Icon from 'components/Icon';
import ZoomPhoneAccountRequiredModal from 'components/Modal/ZoomPhoneAccountRequiredModal';
import useZoomPhoneAccountRequired from 'pages/Dashboard/hooks/useZoomPhoneAccountRequired';
import { useState } from 'react';

// ** others **
import { formatPhoneNumber } from 'utils/util';

interface PropsTypes {
  number: string;
  isIconOnly?: boolean;
  isIconVisible?: boolean;
  rootClassName?: string;
  iconClassName?: string;
  textClassName?: string;
}
const ClickableMobile = (props: PropsTypes) => {
  const {
    number,
    isIconVisible,
    rootClassName,
    iconClassName,
    textClassName,
    isIconOnly,
  } = props;

  const { isDefaultCall, isEnableZoomCall } = useZoomPhoneAccountRequired();
  const [zoomAlertModal, setZoomAlertModal] = useState<boolean>(false);

  return (
    <>
      <a
        ref={(ref) =>
          ref?.addEventListener('click', (e) => e.stopPropagation())
        }
        className={`${
          rootClassName || ''
        } inline-flex flex-wrap items-center text-[14px] text-black__TextColor600 hover:text-primaryColor font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis max-w-full hover:underline`}
        href={
          isEnableZoomCall
            ? `zoomphonecall:${number}`
            : isDefaultCall
            ? `tel:${number}`
            : `#!`
        }
        {...(!isEnableZoomCall && !isDefaultCall
          ? {
              onClick: () => {
                setZoomAlertModal(true);
              },
            }
          : {})}
      >
        {isIconVisible ? (
          <Icon iconType="phoneFilled" className={iconClassName || ''} />
        ) : null}

        {!isIconOnly ? (
          <span
            className={
              textClassName ||
              'whitespace-pre overflow-hidden text-ellipsis inline-block max-w-full'
            }
          >
            {formatPhoneNumber(number)}
          </span>
        ) : null}
      </a>
      {zoomAlertModal && (
        <ZoomPhoneAccountRequiredModal
          isOpen={zoomAlertModal}
          closeModal={() => setZoomAlertModal(false)}
          phoneNumber={number}
        />
      )}
    </>
  );
};

export default ClickableMobile;
