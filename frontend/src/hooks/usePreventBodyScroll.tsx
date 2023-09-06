// =================== import packages ==================
import React, { useEffect } from 'react';

const preventDefault = (ev: Event) => {
  if (ev.preventDefault) {
    ev.preventDefault();
  }
  ev.returnValue = false;
};

const enableBodyScroll = () => {
  if (document) document.removeEventListener('wheel', preventDefault, false);
};
const disableBodyScroll = () => {
  if (document)
    document.addEventListener('wheel', preventDefault, {
      passive: false,
    });
};

function usePreventBodyScroll() {
  const [hidden, setHidden] = React.useState(false);

  useEffect(() => {
    if (hidden) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }

    return enableBodyScroll;
  }, [hidden]);

  const disableScroll = React.useCallback(() => setHidden(true), []);
  const enableScroll = React.useCallback(() => setHidden(false), []);
  return { disableScroll, enableScroll };
}

export default usePreventBodyScroll;
