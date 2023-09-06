// ** Import Packages **
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// ** Redux **
import { getAuth, getCurrentUser } from 'redux/slices/authSlice';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

interface Props {
  children: JSX.Element;
}

const RequiresUnAuth = ({ children }: Props) => {
  // ** Hooks **
  const { organizationUUID, isAuthenticated } = useSelector(getAuth);
  const user = useSelector(getCurrentUser);
  const isUserVerified: boolean = !!user && user.verified;
  if (isAuthenticated && isUserVerified && organizationUUID) {
    return <Navigate to={PRIVATE_NAVIGATION.dashboard.view} />;
  }

  return children;
};

export default RequiresUnAuth;
