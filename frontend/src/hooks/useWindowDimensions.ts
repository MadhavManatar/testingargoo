import { SCREEN_VIEW } from 'constant';
import { useState, useEffect } from 'react';

const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const isMobileView = windowDimensions.width < SCREEN_VIEW.MOBILE;
  const isTabletView = windowDimensions.width < SCREEN_VIEW.TABLET;
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResize = () => {
    setWindowDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };
  return { ...windowDimensions, isMobileView, isTabletView };
};

export default useWindowDimensions;
