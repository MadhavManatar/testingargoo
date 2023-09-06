// ** Import Packages **
import { Link } from 'react-router-dom';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import AuthGuard from 'pages/auth/components/AuthGuard';

// ** Hooks **
import usePermission from 'hooks/usePermission';
import useWindowDimensions from 'hooks/useWindowDimensions';

// ** Constant **
import { BREAD_CRUMB } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Util **
import { isAdministrator } from 'utils/is';

const PersonalSettings = () => {
  const currentVersion = localStorage.getItem('version');

  const {
    readLeadPermission,
    readDealPermission,
    readContactPermission,
    readAccountPermission,
    readActivityPermission,
    readUserPermission,
    readProfilePermission,
    readDepartmentPermission,
  } = usePermission();
  const { isMobileView } = useWindowDimensions();

  return (
    <div>
      <Breadcrumbs path={BREAD_CRUMB.setting} />
      <div className="page__ActionHeader">
        <Button className="px-[22px] smaller">Edit layout</Button>
      </div>
      <div className="settingLists flex flex-wrap mx-[-10px]">
        <div className="setting__BoxWrapper px-[10px] w-1/5 mb-[20px] 4xl:w-1/4 3xl:w-1/3 xl:w-1/2 sm:w-full">
          <div className="setting__Box">
            <div className="setting__Header">
              <h5 className="setting__Title">General Settings</h5>
            </div>
            <div className="setting__Body">
              <ul className="setting__OrderList">
                <li className="setting__Item">
                  <Link
                    to={
                      PRIVATE_NAVIGATION.settings.generalSettings
                        .personalSettings.view
                    }
                  >
                    Personal Settings
                  </Link>
                </li>
                <li className="setting__Item">
                  <Link
                    to={
                      PRIVATE_NAVIGATION.settings.generalSettings
                        .securitySettings.view
                    }
                  >
                    Security Settings
                  </Link>
                </li>
                <li className="setting__Item">
                  <Link
                    to={
                      PRIVATE_NAVIGATION.settings.generalSettings.companyDetails
                        .view
                    }
                  >
                    Company Details
                  </Link>
                </li>
                <li className="setting__Item">
                  <Link
                    to={
                      isMobileView
                        ? PRIVATE_NAVIGATION.settings.generalSettings
                            .commonControls.commonControl.view
                        : isAdministrator()
                        ? PRIVATE_NAVIGATION.settings.generalSettings
                            .commonControls.tagControl.view
                        : PRIVATE_NAVIGATION.settings.generalSettings
                            .commonControls.restoreTime.view
                    }
                  >
                    Common Controls
                  </Link>
                </li>
                <li className="setting__Item">
                  <Link
                    to={
                      PRIVATE_NAVIGATION.settings.generalSettings.notifications
                        .notification.view
                    }
                  >
                    Notification
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {readUserPermission || readProfilePermission ? (
          <div className="setting__BoxWrapper px-[10px] w-1/5 mb-[20px] 4xl:w-1/4 3xl:w-1/3 xl:w-1/2 sm:w-full">
            <div className="setting__Box">
              <div className="setting__Header">
                <h5 className="setting__Title">Users and Control</h5>
              </div>
              <div className="setting__Body">
                <ul className="setting__OrderList">
                  <AuthGuard isAccessible={readUserPermission}>
                    <li className="setting__Item">
                      <Link to={PRIVATE_NAVIGATION.settings.user.view}>
                        User
                      </Link>
                    </li>
                  </AuthGuard>
                  <AuthGuard isAccessible={readProfilePermission}>
                    <li className="setting__Item">
                      <Link
                        to={
                          PRIVATE_NAVIGATION.settings.profileAndPermissions.view
                        }
                      >
                        Profile and Permissions
                      </Link>
                    </li>
                  </AuthGuard>
                  <AuthGuard isAccessible={readUserPermission}>
                    <li className="setting__Item">
                      <Link to={PRIVATE_NAVIGATION.settings.hierarchy.view}>
                        Hierarchy
                      </Link>
                    </li>
                  </AuthGuard>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <></> 
        )}

        <AuthGuard isAccessible={readDepartmentPermission}>
          <div className="setting__BoxWrapper px-[10px] w-1/5 mb-[20px] 4xl:w-1/4 3xl:w-1/3 xl:w-1/2 sm:w-full">
            <div className="setting__Box">
              <div className="setting__Header">
                <h5 className="setting__Title">Department and Control</h5>
              </div>
              <div className="setting__Body">
                <ul className="setting__OrderList">
                  <AuthGuard isAccessible={readDepartmentPermission}>
                    <li className="setting__Item">


                      {/* <Link to={PRIVATE_NAVIGATION.settings.department.view}>
                        Department
                      </Link> */}

                      <Link to={PRIVATE_NAVIGATION.settings.orgDepartment.view}>
                        Department
                      </Link>
                    </li>
                  </AuthGuard>
                </ul>
              </div>
            </div>
          </div>
        </AuthGuard>

        {readLeadPermission ||
        readDealPermission ||
        readContactPermission ||
        readAccountPermission ||
        readActivityPermission ? (
          <div className="setting__BoxWrapper px-[10px] w-1/5 mb-[20px] 4xl:w-1/4 3xl:w-1/3 xl:w-1/2 sm:w-full">
            <div className="setting__Box">
              <div className="setting__Header">
                <h5 className="setting__Title">Module Setting</h5>
              </div>
              <div className="setting__Body">
                <ul className="setting__OrderList">
                  <AuthGuard isAccessible={readLeadPermission}>
                    <li className="setting__Item">
                      <Link
                        to={
                          isMobileView
                            ? PRIVATE_NAVIGATION.settings.moduleSetting.lead
                                .leadSetting.view
                            : PRIVATE_NAVIGATION.settings.moduleSetting.lead
                                .tempStatus.view
                        }
                      >
                        Lead
                      </Link>
                    </li>
                  </AuthGuard>
                  <AuthGuard isAccessible={readDealPermission}>
                    <li className="setting__Item">
                      <Link
                        to={
                          isMobileView
                            ? PRIVATE_NAVIGATION.settings.moduleSetting.deal
                                .dealSetting.view
                            : PRIVATE_NAVIGATION.settings.moduleSetting.deal
                                .generalSetting.view
                        }
                      >
                        Deal
                      </Link>
                    </li>
                  </AuthGuard>
                  <AuthGuard isAccessible={readActivityPermission}>
                    <li className="setting__Item">
                      <Link
                        to={
                          isMobileView
                            ? PRIVATE_NAVIGATION.settings.moduleSetting.activity
                                .activitySetting.view
                            : PRIVATE_NAVIGATION.settings.moduleSetting.activity
                                .timeSet.view
                        }
                      >
                        Activity
                      </Link>
                    </li>
                  </AuthGuard>
                  <AuthGuard isAccessible={readContactPermission}>
                    <li className="setting__Item">
                      <Link
                        to={
                          isMobileView
                            ? PRIVATE_NAVIGATION.settings.moduleSetting.contact
                                .contactSetting.view
                            : PRIVATE_NAVIGATION.settings.moduleSetting.contact
                                .role.view
                        }
                      >
                        Contact
                      </Link>
                    </li>
                  </AuthGuard>
                  <AuthGuard isAccessible={readAccountPermission}>
                    <li className="setting__Item">
                      <Link
                        to={
                          isMobileView
                            ? PRIVATE_NAVIGATION.settings.moduleSetting.account
                                .setting.view
                            : PRIVATE_NAVIGATION.settings.moduleSetting.account
                                .ParentAccount.view
                        }
                      >
                        Account
                      </Link>
                    </li>
                  </AuthGuard>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="setting__BoxWrapper px-[10px] w-1/5 mb-[20px] 4xl:w-1/4 3xl:w-1/3 xl:w-1/2 sm:w-full">
          <div className="setting__Box">
            <div className="setting__Header">
              <h5 className="setting__Title">Email Setting</h5>
            </div>
            <div className="setting__Body">
              <ul className="setting__OrderList">
                <li className="setting__Item">
                  <Link
                    to={
                      isMobileView
                        ? PRIVATE_NAVIGATION.settings.emailSetting.emailSetting
                            .view
                        : PRIVATE_NAVIGATION.settings.emailSetting.connect.view
                    }
                  >
                    Email Setting
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="text-[16px] font-biotif__Regular fixed bottom-[20px] right-[20px] bg-[#eee] py-[10px] px-[20px] rounded-[10px] shadow-[0px_0px_15px_#d5d5d5] border border-[#dbdbdb] bg-primaryColor text-white">
        {currentVersion}
      </div>
    </div>
  );
};

export default PersonalSettings;
