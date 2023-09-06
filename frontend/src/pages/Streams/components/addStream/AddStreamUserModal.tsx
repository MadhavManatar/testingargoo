// ** Import Packages **
import {
  ChangeEvent,
  useEffect,
  useState,
  useDeferredValue,
  Children,
} from 'react';

// ** Components **
import Icon from 'components/Icon';
import Modal from 'components/Modal';

// ** Form Components **
import FormField from 'components/FormField';

// ** Hooks **
import { useGetUserOptions } from 'pages/Setting/user-setting/User/hooks/useUserService';

// ** types ** //
import { AddUserType } from 'pages/Streams/types/stream.type';

// ** Other **
import { Option } from 'components/FormField/types/formField.types';
import NoDataFound from 'components/EntityDetails/Timeline/components/NoDataFound';

const AddStreamUserModel = (props: AddUserType) => {
  // ** Props **

  const {
    isSelectUserVisible,
    setIsSelectUserVisible,
    userData,
    isFilleter,
    pushIdIntoUserArray,
    userIdArray,
    onSubmit,
    setIsVisible,
    setIsFilleter,
  } = props;

  // ** States **
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selected, setSelected] = useState<Option[]>();
  const [selectedUser, setSelectedUser] = useState<
    | {
        full_name: string;
        id: string;
      }[]
    | undefined
  >();
  const [searchText, setSearchText] = useState<string>();
  const [error, setError] = useState<string>();
  const [selectUserIds, setSelectedUserIds] = useState<string[]>([]);
  // ** Hooks **
  const { options: userDataRes, getUserOptions } = useGetUserOptions({});

  // ** UseEffect **

  useEffect(() => {
    setSelectedUserIds(userIdArray);
    const filteredArray = userData?.rows?.filter((item) =>
      userIdArray.includes(`${item.id}`)
    );
    setSelectedUser(filteredArray);
  }, []);

  useEffect(() => {
    if (selectUserIds.length && error?.length) setError('');
    const filteredArray = userData?.rows?.filter((item) =>
      selectUserIds.includes(`${item.id}`)
    );
    setSelectedUser(filteredArray);
  }, [selectUserIds]);

  useEffect(() => {
    if (isFilleter === undefined) {
      setSelected(userDataRes);
    }
  }, [userDataRes]);

  useEffect(() => {
    if (isFilleter === undefined) {
      pushIdIntoUserArray(selectUserIds);
    }
  }, [isFilleter, selectUserIds]);

  // ** Functions & Event Handler **
  const close = () => {
    setIsSelectUserVisible(false);
    setSelectedUser([]);
    setSelected([]);
    pushIdIntoUserArray(userIdArray);
    if (setIsVisible) setIsVisible(false);
    if (setIsFilleter) setIsFilleter(false);
  };
  useDeferredValue(searchText);
  const searchUser = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (isFilleter && e.target.value) {
      const results = userData?.rows.filter((item) => {
        const propertyToSearch = item.full_name;
        const searchTermLower = e.target.value?.toLowerCase();
        return propertyToSearch.toLowerCase().includes(searchTermLower);
      });

      setSelected(
        results.map((item) => ({
          label: item.full_name,
          value: item.id,
        }))
      );
    } else if (isFilleter && e.target.value === '') {
      const results = userData?.rows.filter((item) => {
        return item.full_name;
      });

      setSelected(
        results.map((item) => ({
          label: item.full_name,
          value: item.id,
        }))
      );
    }
    if (isFilleter === undefined) {
      getUserOptions({ search: e.target.value });
    }
  };

  const removeUser = (id: number) => {
    const userList = selectUserIds.filter((userId) => userId !== id.toString());
    setIsChecked(false);
    setSelectedUserIds(userList);
  };
  const submit = () => {
    pushIdIntoUserArray(selectUserIds);
    if (!selectUserIds.length) {
      setError('User is required');
    } else {
      setError('');
      if (onSubmit) onSubmit();
    }
  };

  const userFilleterValidation = () => {
    if (!selectUserIds.length) {
      setError('Please select one user');
    } else {
      pushIdIntoUserArray(selectUserIds);
      setError('');
      if (onSubmit) onSubmit();
    }
  };
  return (
    <>
      <Modal
        title={isFilleter ? 'Users' : 'Add User'}
        visible={isSelectUserVisible}
        onClose={() => close()}
        onCancel={() => close()}
        submitButtonText={isFilleter ? 'Apply' : 'Save'}
        onSubmit={isFilleter ? userFilleterValidation : submit}
        width={`${isFilleter === undefined ? '437px' : '567px'}`}
        saveButtonText="Save and Mark Done"
        saveButtonDisabled={false}
        modalWrapperClass="userFilter-modal ip__Modal__Wrapper__new"
      >
        {userData ? (
          <div className="filter-accordian-body">
            <div className="flex items-start">
              <div
                className={`${
                  isFilleter === undefined ? 'w-full pr-0' : 'w-1/2 pr-[25px]'
                }`}
              >
                <div className="ip__form__hasIcon search__box mb-[14px]">
                  <input
                    className="ip__input"
                    placeholder="Search"
                    type="search"
                    onChange={searchUser}
                  />
                  <Icon className="grayscale" iconType="searchStrokeIcon" />
                </div>
                <div
                  className={`${
                    searchText && !selected?.length && userDataRes?.length === 0
                      ? 'hidden'
                      : 'ip__Checkbox border-b-[1px] border-b-[#E5E5E5]'
                  }   `}
                >
                  <input
                    type="checkbox"
                    name="completed"
                    id="completed"
                    hidden={
                      (searchText &&
                        !selected?.length &&
                        userDataRes?.length === 0) ||
                      false
                    }
                    checked={
                      selectUserIds.length === userData.count || isChecked
                    }
                    onChange={(event) => {
                      if ((event.target as HTMLInputElement).checked) {
                        const userIds = userData?.rows?.map((user) =>
                          user.id.toString()
                        );
                        setSelectedUserIds([...userIds]);
                        setIsChecked(true);
                      } else {
                        setSelectedUserIds([]);
                        setIsChecked(false);
                      }
                    }}
                  />
                  <label className="rc__Label ">
                    <span className="custom__checkRadio__tick" />
                    Select All
                  </label>
                </div>
                {searchText &&
                !selected?.length &&
                userDataRes?.length === 0 ? (
                  <>
                    <NoDataFound />
                  </>
                ) : (
                  <>
                    <div className="item__wrapper">
                      <FormField
                        key={JSON.stringify(selectUserIds)}
                        wrapperClass=""
                        type="checkbox"
                        name="users"
                        label="Users"
                        options={
                          selected && selected?.length > 0
                            ? selected?.map((searchUserList: any) => ({
                                label: searchUserList?.label,
                                value: searchUserList?.value,
                                selected: selectUserIds?.includes(
                                  searchUserList?.value?.toString()
                                ),
                              }))
                            : userData?.rows?.map((user) => ({
                                label: user.full_name,
                                value: user.id,
                                selected: selectUserIds?.includes(
                                  user.id?.toString()
                                ),
                              }))
                        }
                        onChange={(event) => {
                          if ((event.target as HTMLInputElement).checked) {
                            setSelectedUserIds((prev) => [
                              ...prev,
                              event.target.value,
                            ]);
                          } else {
                            setSelectedUserIds((prev) =>
                              prev.filter((val) => val !== event.target.value)
                            );
                          }
                          if (
                            selectUserIds.length === userData.count - 1 &&
                            (event.target as HTMLInputElement).checked === true
                          ) {
                            setIsChecked(true);
                          } else {
                            setIsChecked(false);
                          }
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="w-1/2 pl-[25px] empty:hidden">
                {selectedUser && selectedUser.length && isFilleter ? (
                  <>
                    <h4 className="text-[14px] text-[#2E3234] font-biotif__Medium mb-[12px]">
                      Selected User
                    </h4>
                    <>
                      <div className="columns__selection w-full">
                        {Children.toArray(
                          selectedUser?.map((user: any) => {
                            return (
                              <>
                                <div className="columns__selection__box flex items-center rounded-[7px] py-[6px] px-[12px] pr-[5px] border-[1px] border-[#CCCCCC]/70 mb-[10px] last:mb-0">
                                  <p className="text-[14px] font-biotif__Regular text-[#2E3234] whitespace-pre overflow-hidden text-ellipsis w-full pr-[10px]">
                                    {user.full_name}
                                  </p>
                                  <div
                                    className="relative cursor-pointer w-[26px] h-[26px] shrink-0 duration-300 rounded-full before:content-[''] before:w-[11px] before:h-[1px] before:bg-black/50 before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] before:rotate-45 after:content-[''] after:w-[11px] after:h-[1px] after:bg-black/50 after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] after:-rotate-45 hover:bg-[#f0f0f0]"
                                    onClick={() => removeUser(user?.id)}
                                  />
                                </div>
                              </>
                            );
                          })
                        )}
                      </div>
                    </>
                  </>
                ) : null}
              </div>
            </div>
            {error?.length ? <div className="ip__Error">{error}</div> : null}
          </div>
        ) : null}
      </Modal>
    </>
  );
};
export default AddStreamUserModel;
