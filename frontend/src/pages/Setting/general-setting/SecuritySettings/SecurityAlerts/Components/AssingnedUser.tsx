import DropDownBox from 'components/ColumnManageModal/components/DropDownBox';
import { useGetUserOptions } from 'pages/Setting/user-setting/User/hooks/useUserService';
import { useEffect } from 'react';

const AssignedUser = () => {
  const { options: userData, getUserOptions } = useGetUserOptions({});

  useEffect(() => {
    getUserOptions();
  }, []);

  // const onSelectUser = (userId: number) => {
  //   const createAlertSetting = 'asdfadsf';
  // };

  return (
    <>
      <div className="px-[10px] w-1/4 sm:w-full float-right">
        <DropDownBox
          wrapperClass="mb-0"
          placeholder="Select User"
          type="select"
          name="select_user"
          labelClass="if__label__blue"
          menuPosition="fixed"
          menuPlacement="auto"
          options={userData}
          // onChange={(val) => onSelectUser(val)}
        />
      </div>
    </>
  );
};

export default AssignedUser;
