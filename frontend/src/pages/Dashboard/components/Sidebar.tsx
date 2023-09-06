// ** Import Packages **
import Tippy from '@tippyjs/react';
import { Ref, useEffect, useState } from 'react';

// ** Images **
import SiteLogo from 'assets/images/siteLogo.png';
import SmackDab from 'assets/images/Smackdab.png';

// ** redux **
import { useDispatch, useSelector } from 'react-redux';
import { setVersionNumber } from 'redux/slices/authSlice';
import {
  getSidebarIsCollapse,
  setSidebarIsCollapse,
} from 'redux/slices/commonSlice';

// ** components **
import Icon from 'components/Icon';
import IconAnimation from 'components/IconAnimation';
import SidebarMenuItem from 'pages/Dashboard/components/SidebarMenuItem';

// ** hooks **
import useAuth from 'hooks/useAuth';

// ** services **
import { useLazyGetProductVersionQuery } from 'redux/api/commonApi';

// ** Type **
import { IconTypeJson } from 'indexDB/indexdb.type';

// ** others **
import { IS_CACHING_ACTIVE } from 'constant';
import { BasicPermissionTypes } from 'constant/permissions.constant';
import { SIDE_BAR } from 'constant/sideBar.constant';

interface Props {
  sidebarRef: Ref<HTMLDivElement>;
}

const Sidebar = (props: Props) => {
  const { sidebarRef } = props;
  const dispatch = useDispatch();
  const sidebarIsCollapse = useSelector(getSidebarIsCollapse);

  // ================= State ====================
  const [openSubMenu, setOpenSubMenu] = useState('');
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [latestVersion, setLatestVersion] = useState<string>();
  const [currentVersion, setCurrentVersion] = useState<string>();

  // ================= Custom hooks ====================
  const { logout, hasAuthorized } = useAuth();

  const sidebarItems = SIDE_BAR.filter(
    (item) =>
      !item.module ||
      hasAuthorized([{ module: item.module, type: BasicPermissionTypes.READ }])
  );

  // =============== services ======================
  const [getProductVersionAPI] = useLazyGetProductVersionQuery();

  const checkForUpdateVersion = async () => {
    const { data, error } = await getProductVersionAPI({}, IS_CACHING_ACTIVE);

    if (!error && data) {
      const currVersion = localStorage.getItem('version');
      const newVersion = data?.version_number;

      if ((!currVersion || currVersion === undefined) && newVersion) {
        localStorage.setItem('version', newVersion);
        setLatestVersion(newVersion);
        setCurrentVersion(newVersion);
        dispatch(setVersionNumber({ version: newVersion }));
      }

      if (currVersion && newVersion) {
        setLatestVersion(newVersion);
        setCurrentVersion(currVersion);

        if (currVersion !== newVersion) {
          setShowUpdate(true);
        }
      }
    }
  };

  const hardRefreshPage = async () => {
    window.location.reload();
    if (latestVersion) {
      localStorage.setItem('version', latestVersion);
    }
    dispatch(setVersionNumber({ version: latestVersion }));
  };

  const closeVersionUpdate = async () => {
    setShowUpdate(false);
  };

  useEffect(() => {
    checkForUpdateVersion();
  }, []);

  // for the disable scroll when open in mobile screen add class in body
  useEffect(() => {
    const sidebarOpenTarget = document.getElementsByTagName('html');
    if (!sidebarIsCollapse) {
      sidebarOpenTarget[0]?.classList.add('sideMenu__open');
    } else {
      sidebarOpenTarget[0]?.classList.remove('sideMenu__open');
    }
    return () => {
      document.body.classList.remove('sideMenu__open');
    };
  }, [sidebarIsCollapse]);

  const sidebarCollapse = () => {
    dispatch(setSidebarIsCollapse(!sidebarIsCollapse));
  };

  return (
    <>
      <div
        ref={sidebarRef}
        onClick={() => dispatch(setSidebarIsCollapse(!sidebarIsCollapse))}
        className="mobile__menu__overllay fixed top-0 left-0 w-full h-screen bg-[#0009] z-[5] hidden"
      />
      <button
        className="sidebar__CollapseBtn 123 group mobile__btn duration-300 bg-primaryColor hover:bg-primaryColor__hoverDark w-[28px] h-[28px] absolute top-[11px] left-[15px] rounded-full border-[3px] border-white z-[2] px-[2px] py-[3px] md:border-0 md:rounded-[10px] md:p-[9px] md:w-[36px] md:h-[36px] md:left-[15px] md:top-[17px] md:bg-[#c7d9e73d] hidden md:block"
        onClick={() => sidebarCollapse()}
      >
        <Icon
          className="rotate-[90deg] invert w-full h-full md:rotate-[-90deg] md:hidden"
          iconType="signupBackArrowFilled"
        />
        <div className="mobile__btn__img w-full h-full relative">
          <span className="dots inline-block w-[7px] h-[7px] rounded-[2px] bg-[#2E3234] absolute top-0 left-0 group-hover:bg-white" />
          <span className="dots inline-block w-[7px] h-[7px] rounded-[2px] bg-[#2E3234] absolute top-0 right-0 group-hover:bg-white" />
          <span className="dots inline-block w-[7px] h-[7px] rounded-[2px] bg-[#2E3234] absolute bottom-0 left-0 group-hover:bg-white" />
          <span className="dots inline-block w-[7px] h-[7px] rounded-[2px] bg-[#2E3234] absolute bottom-0 right-0 group-hover:bg-white" />
        </div>
      </button>
      <div className="sidebar w-[280px] h-screen bg-[#F4F4F4] fixed top-0 left-0 duration-300 z-[7] xl:w-[250px] md:w-[280px] md:max-w-[calc(100%_-_40px)] md:z-[11] md:duration-[400ms]">
        <button
          className="sidebar__CollapseBtn duration-300 bg-primaryColorSD hover:bg-primaryColorSD w-[28px] h-[28px] absolute top-[23px] right-[-41px] rounded-full border-[3px] border-ipWhite__borderColor z-[2] px-[2px] py-[3px] md:border-0 md:rounded-[8px] md:p-[7px] md:w-[32px] md:h-[32px] md:right-[-47px] md:top-[12px] md:hidden"
          onClick={() => sidebarCollapse()}
        >
          <Icon
            className="rotate-[90deg] w-full h-full md:rotate-[-90deg] md:hidden"
            iconType="signupBackArrowFilled"
            fill="#ffffff"
          />
          {/* <img
            className="mobile__btn__img hidden md:block"
            src="/images/mobile__toggle__btn__img.svg"
            alt=""
          /> */}
        </button>
        <div className="innerWrapper h-full relative pb-[50px]">
          <div className="logoWrapper h-[126px] flex items-center justify-center pt-[30px] pb-[30px] md:h-auto xl:pt-[15px] xl:pb-[15px]">
            {sidebarIsCollapse ? (
              <>
                <div className="logo__Box w-[76px] h-[76px] flex items-center justify-center bg-white rounded-full xl:w-[52px] xl:h-[52px] md:w-[52px] md:h-[52px] md:hidden">
                  <img
                    className="w-[30px] xl:w-[24px] md:w-[22px]"
                    src={SiteLogo}
                    alt=""
                  />
                </div>
                <p className="logo__Text text-[#343434]/70 text-[26px] xl:text-[22px] font-biotif__SemiBold uppercase ml-[15px] md:block">
                  <img src={SmackDab} alt="" />
                </p>
              </>
            ) : (
              <p className="logo__Text text-[#343434]/70 text-[26px] xl:text-[22px] font-biotif__SemiBold uppercase ml-[15px] md:block">
                <img src={SmackDab} alt="" />
              </p>
            )}
          </div>
          <div className="sMenu__Wrapper h-[calc(100dvh_-_200px)] overflow-y-auto ip__hideScrollbar px-[15px] xl:h-[calc(100dvh_-_145px)]">
            {sidebarItems.length > 0 &&
              sidebarItems.map((menuItem) => (
                <SidebarMenuItem
                  key={menuItem.id}
                  {...menuItem}
                  openSubMenu={openSubMenu}
                  setOpenSubMenu={setOpenSubMenu}
                />
              ))}
          </div>
          <div className="hidden">
            {currentVersion && (
              <div className="text-center font-biotif__Medium text-[14px]">
                {`v${currentVersion}`}
              </div>
            )}
          </div>
          <div className="s__Menu__Item logout">
            <Tippy
              content="Log Out"
              disabled={!sidebarIsCollapse}
              placement="right"
            >
              <div className="s__Menu__Item__Link" onClick={() => logout()}>
                <IconAnimation
                  iconType="logoutFilledBlueIcon"
                  animationIconType={IconTypeJson.Logout}
                  textLabel="Log Out"
                  className="s__Menu__Icon !w-[28px] !h-[28px]"
                  textLabelClassName="s__Menu__Text"
                  iconClassName="animated_Icon"
                />
              </div>
            </Tippy>
          </div>
        </div>
      </div>

      {/* version-update */}
      {showUpdate ? (
        <div className="update__version__box bg-[#2E3234] fixed top-[72px] right-[28px] rounded-[12px] py-[15px] px-[60px] z-[6]">
          <Icon
            className="bg-white rounded-full absolute top-[50%] translate-y-[-50%] left-[20px] p-[2px]"
            iconType="resetFilledIcon"
          />
          <div className="inner__wrapper flex items-center">
            <div className="contant pr-[20px]">
              <h5 className="text-[16px] font-biotif__Medium text-[#FFFFFF]">
                Update available
              </h5>
              <p className="text-[#FFFFFF] text-[14px] font-biotif__Medium opacity-60">
                Refresh now to update the <br />
                version to{' '}
                {latestVersion && (
                  <span className="">{`v${latestVersion}`}</span>
                )}
              </p>
            </div>
            {showUpdate ? (
              <button
                className="text-[16px] text-[#FFFFFF] font-biotif__Medium underline"
                onClick={hardRefreshPage}
              >
                Refresh
              </button>
            ) : (
              ''
            )}
          </div>
          <Icon
            className="closeBtn"
            iconType="closeBtnFilled"
            onClick={closeVersionUpdate}
          />
        </div>
      ) : (
        ''
      )}
      {/* version-update-end */}
    </>
  );
};

export default Sidebar;
