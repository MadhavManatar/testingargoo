// =================== import packages ==================
import React, { useState } from 'react';
import { Path, UseFormRegister, FieldValues } from 'react-hook-form';
// ======================================================
import Icon from 'components/Icon';
import type { IconTypes } from 'components/Icon';

type PasswordProps<T extends FieldValues> = {
  register: UseFormRegister<T> | undefined;
  name: Path<T>;
  icon?: IconTypes;
  iconClass?: string;
  className?: string;
  disabled: boolean;
};

const PasswordInput = <T extends Record<string, unknown>>(
  props: PasswordProps<T>
) => {
  const {
    name,
    className,
    icon,
    iconClass,
    register,
    disabled = false,
    ...rest
  } = props;

  // ================= State ====================
  const [showPass, setShowPass] = useState(true);
  const inputType = showPass ? 'password' : 'text';

  return (
    <>
      <input
        disabled={disabled}
        {...rest}
        className={className}
        type={inputType}
        {...(register && register(name))}
      />
      {icon && (
        <Icon
          className={iconClass}
          iconType={icon}
          onClick={() => setShowPass(!showPass)}
        />
      )}
    </>
  );
};

export default PasswordInput;
