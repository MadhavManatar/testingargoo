// ** Hooks **
import useAuth from 'hooks/useAuth';

// ** Types **
import {
  AuthGuardProps,
  permissionOperatorEnum,
} from '../types/authGuard.types';

const AuthGuard = ({
  permissions,
  isAccessible,
  operator = permissionOperatorEnum.AND,
  children,
}: AuthGuardProps) => {
  // ** Custom Hooks **
  const { hasAuthorized } = useAuth();
  if (typeof isAccessible === 'boolean') {
    return isAccessible ? children : <></>;
  }
  if (permissions) {
    const hasPermission = hasAuthorized(permissions, operator);
    return hasPermission ? children : <></>;
  }
  return <></>;
};

export default AuthGuard;
