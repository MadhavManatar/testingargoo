// ** external packages **
import { Fragment, useEffect, useState } from 'react';

// ** components **
import Icon from 'components/Icon';
import Button from 'components/Button';
import EditPermissionModal from './EditPermissionModal';
import PermissionSkeleton from '../skeletons/PermissionSkeleton';
import PermissionSidebarSkeleton from '../skeletons/PermissionSidebarSkeleton';

// ** types **
import {
  Permission,
  PermissionObj,
  Status,
} from 'pages/Setting/user-setting/ProfilePermissions/types/profile-permissions.types';

// **  others **
import { modifyPermissionData } from '../helper';

interface Props {
  getPermissionsLoading?: boolean;
  savePermissionsLoading?: boolean;
  permissionsData: PermissionObj[];
  setPermissionData: (data: PermissionObj[]) => void;
  savePermissions: () => void;
  goBack?: () => void;
}

const Permissions = (props: Props) => {
  const {
    getPermissionsLoading = false,
    savePermissionsLoading = false,
    permissionsData,
    setPermissionData,
    savePermissions,
    goBack,
  } = props;

  // ================= State ====================
  const [isEdit, setIsEdit] = useState(false);
  const [editModuleId, setEditModuleId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('');

  const currentEditModule = permissionsData.find(
    (module, moduleId) => moduleId === editModuleId
  );

  const changeModuleStatus = (
    event: React.ChangeEvent<HTMLInputElement>,
    moduleName: string
  ) => {
    const newData = [...permissionsData];

    const index = newData.findIndex((obj) => obj.name === moduleName);
    if (event.target.checked) {
      newData[index] = {
        ...newData[index],
        permissions: newData[index].permissions.map((p) => ({
          ...p,
          status: Status.ACTIVE,
        })),
      };
    } else {
      newData[index] = {
        ...newData[index],
        permissions: newData[index].permissions.map((p) => ({
          ...p,
          status: Status.INACTIVE,
        })),
      };
    }

    setPermissionData(newData);
  };

  const editPermission = (id: number) => {
    setEditModuleId(id);
    setIsEdit(true);
  };

  const updatePermission = (permissions: Permission[]) => {
    if (editModuleId !== null) {
      const newData = [...permissionsData];
      newData[editModuleId].permissions = permissions;
      setPermissionData(newData);
    }
    setIsEdit(false);
  };

  useEffect(() => {
    const permissionWrapper = document.getElementById('permissions__wrapper');
    permissionWrapper?.addEventListener('scroll', navHighlighter);

    function navHighlighter() {
      const scrollY = permissionWrapper?.scrollTop || 0;
      const parentHeight = permissionWrapper?.clientHeight || 0;
      const sections = permissionWrapper?.querySelectorAll(
        '.permissionBody__wp'
      );
      sections?.forEach((current: any) => {
        const sectionHeight = current?.offsetHeight;
        const sectionTop = current?.offsetTop;
        const sectionId = current?.getAttribute('id');

        // eslint-disable-next-line no-unsafe-optional-chaining
        if (
          sectionTop < scrollY + parentHeight &&
          sectionTop + sectionHeight > scrollY &&
          document
        ) {
          document
            ?.querySelectorAll(`.ip__V__TabsList li`)
            ?.forEach((element: Element) => {
              const elementId = element?.getAttribute('id');
              if (elementId === `link-${sectionId}`) {
                document
                  ?.querySelector(`.ip__V__TabsList li[id*=link-${sectionId}]`)
                  ?.classList.add('active');
              } else {
                document
                  ?.querySelector(`.ip__V__TabsList li[id*=${elementId}]`)
                  ?.classList.remove('active');
              }
            });
        }
      });
    }
  }, []);

  // here modify data for listing data section wise
  const permissionSectionObj = modifyPermissionData(permissionsData);

  return (
    <>
      <div className="border border-whiteScreen__BorderColor rounded-[12px] overflow-hidden xl:rounded-none xl:border-0 xl:mt-[-15px]">
        <h3 className="setting__FieldTitle mb-0 py-[20px] px-[30px] border-b border-b-whiteScreen__BorderColor 3xl:py-[12px] 3xl:px-[15px] 3xl:text-[18px] xl:py-0 xl:px-0 xl:text-[22px] xl:border-b-0 xl:hidden">
          Permission Settings
        </h3>
        <div className="ip__V__TabsWrapper">
          <div className="ip__V__Tabs h-[calc(100dvh_-_244px)] overflow-y-auto ip__FancyScroll 3xl:h-[calc(100dvh_-_225px)] xl:h-auto sm:hidden">
            {getPermissionsLoading ? (
              <PermissionSidebarSkeleton />
            ) : (
              <ul className="ip__V__TabsList">
                {Object.keys(permissionSectionObj).map(
                  (parentKey, parentIndex) => {
                    return (
                      <Fragment key={parentIndex}>
                        <h3 className="title__for__button text-[16px] text-ip__black__text__color font-biotif__SemiBold px-[15px] mb-[8px] mt-[18px]">
                          {parentKey}
                        </h3>
                        {Object.keys(permissionSectionObj[parentKey]).map(
                          (childKey, childIndex) => (
                            <li
                              className={`ip__V__TabsItems ${(parentIndex === 0 &&
                                childIndex === 0 &&
                                activeTab === '') ||
                                activeTab ===
                                `link-p-section-${parentIndex}-${childIndex}`
                                ? 'active'
                                : ''
                                } `}
                              id={`link-p-section-${parentIndex}-${childIndex}`}
                              key={`${parentIndex}_${childIndex}`}
                            >
                              <button
                                className="ip__V__TabsLink"
                                onClick={() => {
                                  setActiveTab(
                                    `link-p-section-${parentIndex}-${childIndex}`
                                  );
                                }}
                              >
                                {childKey}
                              </button>
                            </li>
                          )
                        )}
                      </Fragment>
                    );
                  }
                )}
              </ul>
            )}
          </div>

          {/* mobile-view-tabs-new-design */}
          <div className="w-full hidden">
            <h2 className="settingPage__title__mobile text-[18px] font-biotif__Medium text-black w-full mb-[15px] whitespace-pre overflow-hidden text-ellipsis">
              Module Permission
            </h2>
            <div className="settingM__tabs__new w-full ip__hideScrollbar overflow-y-auto max-h-[calc(100dvh_-_155px)]">
              <button className='items bg-white relative border border-[#CCCCCC]/50 rounded-[10px] text-[18px] text-primaryColor font-biotif__Medium leading-[24px] py-[15px] px-[16px] pr-[38px] w-full mb-[10px] text-left duration-500 before:content-[""] before:absolute before:top-[50%] before:right-[16px] before:translate-y-[-50%] before:-rotate-45 before:w-[10px] before:h-[10px] before:border-b-[2px] before:border-b-primaryColor before:border-r-[2px] before:border-r-primaryColor hover:border-primaryColor hover:bg-primaryColor hover:text-white hover:before:border-b-white hover:before:border-r-white'>
                <span className="text inline-block">Basic</span>
              </button>
              <button className='items bg-white relative border border-[#CCCCCC]/50 rounded-[10px] text-[18px] text-primaryColor font-biotif__Medium leading-[24px] py-[15px] px-[16px] pr-[38px] w-full mb-[10px] text-left duration-500 before:content-[""] before:absolute before:top-[50%] before:right-[16px] before:translate-y-[-50%] before:-rotate-45 before:w-[10px] before:h-[10px] before:border-b-[2px] before:border-b-primaryColor before:border-r-[2px] before:border-r-primaryColor hover:border-primaryColor hover:bg-primaryColor hover:text-white hover:before:border-b-white hover:before:border-r-white'>
                <span className="text inline-block">Others</span>
              </button>
            </div>
          </div>
          {/* mobile-view-tabs-new-design-end */}

          <div className="ip__V__ContentWrapper">
            <div className="ip__V__Content h-[calc(100dvh_-_244px)] 3xl:h-[calc(100dvh_-_225px)] xl:h-auto">
              <div className="inner__scroll__wrapper h-full overflow-x-hidden overflow-y-auto">
                <div
                  className="setting__FixedWrapper__Permission ip__hideScrollbar h-[calc(100dvh_-_370px)] 3xl:h-[calc(100dvh_-_344px)] overflow-y-auto pb-0 xl:h-[calc(100dvh_-_275px)] sm:border sm:border-[#CCCCCC]/50 sm:rounded-[12px] sm:p-[12px] sm:h-[calc(100dvh_-_170px)] sm:overflow-y-auto sm:ip__hideScrollbar"
                  id="permissions__wrapper"
                >
                  {getPermissionsLoading ? (
                    <PermissionSkeleton />
                  ) : (
                    Object.values(permissionSectionObj).map(
                      (value, parentIndex) =>
                        Object.keys(value).map((key, childIndex) => (
                          <div
                            key={`${parentIndex}_${childIndex}`}
                            className="permissionBody__wp"
                            id={`p-section-${parentIndex}-${childIndex}`}
                          >
                            <h3 className="setting__FieldTitle lg:mb-[8px]">
                              {key}
                            </h3>
                            <div className="permissionBody">
                              {value[key].map((module, moduleId) => (
                                <div key={moduleId} className="permission__Row">
                                  <div className="permission__TD permission__LB">
                                    <h4 className="permission__Label">
                                      {module.name === 'attachments'
                                        ? 'documents'
                                        : module.name}
                                    </h4>
                                    <div className="form__Group">
                                      <div className="ip__Checkbox">
                                        <input
                                          id={`${moduleId}`}
                                          name={`checkbox-${moduleId}`}
                                          type="checkbox"
                                          checked={module.permissions.some(
                                            (per) =>
                                              per.status === Status.ACTIVE
                                          )}
                                          onChange={($event) => {
                                            changeModuleStatus(
                                              $event,
                                              module.name
                                            );
                                          }}
                                        />
                                        <label className="rc__Label">
                                          {module.name}
                                        </label>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="permission__TD permissionEnableList">
                                    <ul className="permission__ELUL">
                                      {module.permissions.map(
                                        (permission, idx) => {
                                          return (
                                            <li
                                              key={idx}
                                              className="permission__ELItem"
                                            >
                                              <span
                                                style={{
                                                  color:
                                                    permission.status ===
                                                      'ACTIVE'
                                                      ? 'var(--ip__SuccessGreen)'
                                                      : 'var(--light__TextColor)',
                                                }}
                                              >
                                                {permission.name}
                                              </span>
                                            </li>
                                          );
                                        }
                                      )}
                                    </ul>
                                    <div className="permission__ELUL__dropdown">
                                      <ul className="permission__ELUL">
                                        {module.permissions.map(
                                          (permission, idx) => (
                                            <li
                                              key={idx}
                                              className="permission__ELItem"
                                            >
                                              <span
                                                style={{
                                                  color:
                                                    permission.status ===
                                                      'ACTIVE'
                                                      ? 'text-ip__SuccessGreen'
                                                      : 'text-disableLight__TextColor',
                                                }}
                                              >
                                                {permission.name}
                                              </span>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="permission__TD permissionEdit">
                                    <button
                                      className="edit__Button"
                                      onClick={() =>
                                        editPermission(
                                          permissionsData.findIndex(
                                            (obj) => obj.name === module.name
                                          )
                                        )
                                      }
                                    >
                                      <Icon iconType="permissionEditFilled" />
                                      Edit
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                    )
                  )}
                </div>
                <div className="settingAction__fixedBtn__Permission flex items-center">
                  <Button
                    className="cancel__btn secondary__Btn mr-[7px] min-w-[120px] sm:min-w-[calc(50%_-_7px)]"
                    onClick={goBack}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="save__btn primary__Btn min-w-[120px] ml-[7px] sm:min-w-[calc(50%_-_7px)]"
                    onClick={savePermissions}
                    isLoading={savePermissionsLoading}
                    isDisabled={getPermissionsLoading || savePermissionsLoading}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEdit && currentEditModule && (
        <EditPermissionModal
          isOpen={isEdit}
          closeModal={() => setIsEdit(false)}
          permissions={currentEditModule.permissions}
          onUpdatePermission={updatePermission}
        />
      )}
    </>
  );
};

export default Permissions;
