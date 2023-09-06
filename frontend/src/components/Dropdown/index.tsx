import Tippy from '@tippyjs/react';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Instance, Placement } from 'tippy.js';

const defaultTippyProps = {
  theme: 'light',
};

type Props = {
  children: React.ReactElement<any>;
  content: ({
    close,
    isOpen,
    setIsOpen,
  }: {
    close: () => void;
    isOpen?: boolean;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactElement<any>;
  hideOnClick?: boolean;
  interactive?: boolean;
  placement?: Placement;
  className?: string;
  zIndex?: number;
  appendTo?: Element | 'parent' | ((ref: Element) => Element);
  dynamicTippyProps?: {
    delay: number;
    duration: number;
    animation: boolean;
  };
  dependentClose?: boolean;
  customOnClick?: (e: {
    isEnabled: boolean;
    isVisible: boolean;
    isDestroyed: boolean;
    isMounted: boolean;
    isShown: boolean;
  }) => void;
};

const Dropdown = forwardRef((props: Props, ref) => {
  const {
    children,
    content,
    hideOnClick = true,
    interactive = false,
    placement = 'bottom-start',
    className = '',
    appendTo,
    dynamicTippyProps,
    dependentClose = false,
    zIndex = 5,
    customOnClick,
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const instanceRef = useRef<Instance>();
  useEffect(() => {
    if (hideOnClick) {
      document.addEventListener('mousedown', onClick, true);
      return () => {
        document.removeEventListener('mousedown', onClick, true);
      };
    }
  });

  useImperativeHandle(
    ref,
    () => ({
      open: isOpen,
    }),
    [isOpen]
  );

  const onClick = (event: any) => {
    if (instanceRef.current) {
      const { popper, reference, state } = instanceRef.current;

      if (
        !popper.contains(event.target) &&
        !reference.contains(event.target) &&
        !(state.isVisible && reference.contains(event.target))
      ) {
        close();
      }
    }
  };

  const open = () => {
    if (instanceRef.current) {
      const { state } = instanceRef.current;
      customOnClick?.(state);
      if (!state.isVisible) {
        setIsOpen(true);
      } else {
        close();
      }
    }
  };

  const close = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!dependentClose) {
      close();
    }
  }, [dependentClose]);

  const tippyContent = content({ close, isOpen, setIsOpen });

  // useEffect(() => {
  //   if (isOpen) {
  //     const element = document.querySelectorAll('.tippy__timePicker');
  //     element.forEach((elem) => {
  //       elem.parentElement?.classList.add('tippy__timePicker__root');
  //     });
  //     document.body.classList.add('timePicker__open');
  //   } else {
  //     const oldElement = document.querySelectorAll('.tippy__timePicker');
  //     oldElement.forEach((elem) => {
  //       elem.parentElement?.classList.remove('tippy__timePicker__root');
  //     });
  //     document.body.classList.remove('timePicker__open');
  //   }
  // }, [isOpen]);

  return (
    <Tippy
      className={`tippy__dropdown ${className}`}
      {...defaultTippyProps}
      {...dynamicTippyProps}
      onCreate={(instance) => {
        instanceRef.current = instance;
      }}
      interactive={interactive}
      visible={isOpen}
      content={tippyContent}
      placement={placement}
      appendTo={appendTo}
      zIndex={zIndex}
    >
      {React.cloneElement(children, { onClick: open })}
    </Tippy>
  );
});

export default Dropdown;
