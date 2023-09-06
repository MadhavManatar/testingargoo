import Icon, { IconTypes } from 'components/Icon';
import { SVGAttributes } from 'react';

export interface ButtonProps extends SVGAttributes<SVGElement> {
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
  className?: string;
  icon?: IconTypes;
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: React.MouseEventHandler;
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

const Button = (props: ButtonProps) => {
  const {
    type = 'button',
    children = <></>,
    className = '',
    icon,
    isLoading,
    isDisabled,
    onClick,
    buttonRef,
    ...rest
  } = props;
  return (
    <button
      type={type}
      className={`i__Button ${className}`}
      disabled={isDisabled || isLoading}
      onClick={onClick}
      ref={buttonRef}
    >
      {isLoading && <div className="i__ButtonLoader" />}
      {icon && <Icon iconType={icon} {...rest} />}
      {children}
    </button>
  );
};

export default Button;
