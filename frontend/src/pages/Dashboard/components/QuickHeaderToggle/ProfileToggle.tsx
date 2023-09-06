
// ** Import Packages **
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ** Components **
import Button from 'components/Button';
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import Icon from 'components/Icon';
import Image from 'components/Image';

// ** Redux **
import { getCurrentUser, setOrganizationUUID } from 'redux/slices/authSlice';

// ** Constants **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Types **
import useAuth from 'hooks/useAuth';
import { useToggleDropdown } from 'hooks/useToggleDropdown';
import { useSwitchOrganizationApi } from './services/organization.services';


const ProfileToggle = () => {
  const { logout } = useAuth();
  const user = useSelector(getCurrentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { dropdownRef, isDropdownOpen, toggleDropdown } = useToggleDropdown();

  // ** custom hooks **
  const { getSwitchOrganizationAPI } = useSwitchOrganizationApi();


  const switchOrganization = async (oId: string) => {
    const { data, error } = await getSwitchOrganizationAPI();

    if (data && !error) {
      dispatch(setOrganizationUUID(oId));
      window.location.reload();
      window.location.href = PRIVATE_NAVIGATION.dashboard.view;
    }
  };

  return (
    <div
      className="topH__profile__wrapper ml-[15px] relative flex items-center"
      ref={dropdownRef}
    >
      <button
        onClick={toggleDropdown}
        className="profile w-[40px] h-[40px] rounded-[8px] shadow-[0px_4px_4px_#dee2e64d] cursor-pointer"
      >
        <Image
          imgPath={user?.profile_image || ''}
          first_name={user?.first_name || ''}
          last_name={user?.last_name || ''}
          serverPath
          color={user?.initial_color || ''}
        />
      </button>
      {isDropdownOpen && (
        <div className="absolute top-[100%] right-0 z-[5] pt-[10px]">
          <div className="profile__card w-[345px] max-w-[290px] shadow-[0px_3px_17px_#0000001a] rounded-[10px] bg-ipWhite__bgColor">
            <div className="profile__box p-[20px] flex flex-wrap sm:p-[15px]">
              <div className="img__wrapper w-[70px] h-[70px] rounded-[15px] overflow-hidden sm:w-[50px] sm:h-[50px] sm:rounded-[10px]">
                <Image
                  imgPath={user?.profile_image || ''}
                  first_name={user?.first_name || ''}
                  last_name={user?.last_name || ''}
                  serverPath
                  color={user?.initial_color || ''}
                />
              </div>
              <div className="right w-[calc(100%_-_72px)] pl-[15px] sm:w-[calc(100%_-_52px)]">
                <h3 className="text-[16px] font-biotif__Medium text-ipBlack__textColor leading-[19px]">
                  {user?.full_name}
                </h3>
                {user?.email ? <ClickableEmail mail={user?.email} /> : null}

                <div>
                  <Button
                    className="primary__Btn profile__btn mt-[10px] py-[6px] px-[13px] text-[14px] font-biotif__Regular"
                    onClick={() =>
                      navigate(
                        PRIVATE_NAVIGATION.settings.generalSettings
                          .personalSettings.view
                      )
                    }
                  >
                    <Icon iconType="profileFilledBlueIcon" />
                    Profile
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center flex-wrap px-[20px] pb-[5px] mt-[-7px]">
              <span className="label inline-block text-[16px] font-biotif__Medium text-ipBlack__textColor mb-[4px]">
                Current Account :
              </span>
              <span className="value text-[14px] font-biotif__Medium text-black__TextColor500 mb-[4px] ml-[5px] relative top-[-1px]">
                {user?.organization?.organization?.name}
              </span>
            </div>
            {user?.user_organizations?.length &&
              user.user_organizations.length > 1 && (
                <div className="switch__account py-[15px] px-[20px] relative">
                  <span className="absolute top-0 left-0 w-full h-full bg-primaryColor opacity-50" />
                  <h4 className="text-[16px] font-biotif__Medium text-ipBlack__textColor mb-[5px] relative z-[2]">
                    Switch Account
                  </h4>
                  {user?.user_organizations
                    ?.filter(
                      (obj) =>
                        obj.organization_id !==
                        user.organization?.organization_id
                    )
                    .map((obj, index) => (
                      <div
                        className="relative z-[2]"
                        key={`${obj.organization_id}_${index}`}
                      >
                        <div className="block w-full cursor-pointer text-[14px] font-biotif__Medium text-black__TextColor500 duration-500 hover:text-primaryColorSD hover:underline">
                          <div
                            onClick={() => {
                              switchOrganization(obj.organization.uuid);
                            }}
                            className="inline-block cursor-pointer"
                          >
                            {obj.organization.name}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}

            <div className="footer__btn flex items-center justify-end py-[16px] px-[20px]">
              <button
                className="text-[14px] font-biotif__Regular text-black__TextColor500 duration-500 hover:text-primaryColor mr-[25px]"
                onClick={() => navigate(PRIVATE_NAVIGATION.settings.view)}
              >
                Setting
              </button>
              <button
                className="text-[14px] font-biotif__Regular text-black__TextColor500 duration-500 hover:text-primaryColor"
                onClick={() => {
                  logout()
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileToggle;
