// ** Import Packages **
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

// ** Redux **
import { RootState } from 'redux/store';

// ** Hook **
import useAuth from 'hooks/useAuth';

// ** Type **
import { RequiresAuthProps } from '../types/requiresAuth.types';

// ** Constant **
import { PUBLIC_NAVIGATION } from 'constant/navigation.constant';

const RequiresAuth = ({ children, module, type }: RequiresAuthProps) => {
  // ** Hooks **
  const location = useLocation();
  const authData = useSelector((state: RootState) => state.auth);

  // ** Custom Hooks **
  const { hasAuthorized } = useAuth();
  const userHasPermission = hasAuthorized([{ module, type }]);

  const { organizationUUID, isAuthenticated, user } = authData;
  const isVerified = !!user?.verified;

  // ** Not Logged In **
  if (!isAuthenticated || !organizationUUID || !isVerified) {
    return <Navigate to={PUBLIC_NAVIGATION.login} state={{ from: location }} />;
  }

  // ** Not Authorized **
  if (module && type && !userHasPermission) {
    return <Navigate to={PUBLIC_NAVIGATION.notAuthorized} />;
  }

  return children;
};

export default RequiresAuth;
