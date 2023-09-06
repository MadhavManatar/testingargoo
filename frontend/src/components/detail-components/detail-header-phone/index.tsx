import { IconTypeJson } from 'indexDB/indexdb.type';
import IconAnimation from 'components/IconAnimation';
import { useState } from 'react';
import useZoomPhoneAccountRequired from 'pages/Dashboard/hooks/useZoomPhoneAccountRequired';
import ZoomPhoneAccountRequiredModal from 'components/Modal/ZoomPhoneAccountRequiredModal';

type phoneProps = {
  type: string | undefined;
  number: string | undefined;
};

const DetailHeaderPhone = (props: phoneProps) => {
  const { number } = props;

  const [zoomAlertModal, setZoomAlertModal] = useState<boolean>(false);

  const { isDefaultCall, isEnableZoomCall } = useZoomPhoneAccountRequired();

  return (
    <>
      <a
        href={
          isEnableZoomCall
            ? `zoomphonecall:${number}`
            : isDefaultCall
            ? `tel:${number}`
            : `#!`
        }
        className={
          !number
            ? 'opacity-60 pointer-events-none link__wrapper'
            : 'link__wrapper'
        }
        {...(!isEnableZoomCall && !isDefaultCall
          ? {
              onClick: (e) => {
                e.stopPropagation();
                setZoomAlertModal(true);
              },
            }
          : {})}
      >
        <IconAnimation
          iconType="phoneFilled"
          animationIconType={IconTypeJson.Phone}
          className="socian__ani__icon__wrapper"
        />
      </a>
      {zoomAlertModal && (
        <ZoomPhoneAccountRequiredModal
          isOpen={zoomAlertModal}
          closeModal={() => setZoomAlertModal(false)}
          phoneNumber={number ?? ''}
        />
      )}
    </>
  );
};

export default DetailHeaderPhone;
