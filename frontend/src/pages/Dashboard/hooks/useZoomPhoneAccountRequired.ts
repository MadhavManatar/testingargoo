import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getZoomAccountDetails } from 'redux/slices/commonSlice';

const useZoomPhoneAccountRequired = () => {
  // ** Redux Store **
  const zoomAccount = useSelector(getZoomAccountDetails);

  const [isEnableZoomCall, setEnableZoomCall] = useState<boolean>(true);
  const isDefaultCall = !!localStorage.getItem('isDefaultCall');

  useEffect(() => {
    if (!zoomAccount) {
      setEnableZoomCall(false);
    }
    if (zoomAccount) {
      setEnableZoomCall(true);
    }
  }, [zoomAccount]);

  return { isEnableZoomCall, isDefaultCall };
};

export default useZoomPhoneAccountRequired;
