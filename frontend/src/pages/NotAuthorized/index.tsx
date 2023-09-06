// ** Import Packages **
import { useNavigate } from 'react-router-dom';

// ** Component **
import Button from 'components/Button';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

const NotAuthorized = () => {
  // ** Hook **
  const navigate = useNavigate();
  return (
    <div className="error404__page min-h-screen flex items-center justify-center px-[15px] py-[50px]">
      <div className="inner__wrapper w-full">
        <img
          className="block w-[700px] max-w-full mx-auto"
          src="/images/error404.png"
          alt=""
        />
        <div className="error404__contant w-[500px] max-w-full mx-auto mt-[20px]">
          <h1 className="title font-biotif__Bold text-ip__black__text__color text-[34px] text-center sm:text-[24px]">
            Not Authorized!
          </h1>
          <p className="text font-biotif__Medium text-light__TextColor text-[18px] text-center sm:text-[16px]">
           You don't have access to this module. Please contact to your administrator.
          </p>
          <div className="flex justify-center mt-[20px]">
            <Button
              className="primary__Btn"
              onClick={() => navigate(PRIVATE_NAVIGATION.dashboard.view)}
            >
              Go To Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotAuthorized;
