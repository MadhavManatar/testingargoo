// ** Import Packages **
import _ from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// ** Redux **
import {
  getCurrentUser,
  getHierarchyUsers,
  setHierarchyUsers,
  setReportTo,
  UserInterface,
} from 'redux/slices/authSlice';

// ** Types **
import {
  AsyncSelectGetOptions,
  Option,
} from 'components/FormField/types/formField.types';
import { User, UserResponse } from '../types/user.types';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Other **
import { isAdministrator } from 'utils/is';
import {
  useLazyGetAllUserQuery,
  useLazyGetDescendantsUserQuery,
  useLazyGetHierarchyUserQuery,
  useLazyGetUserByIdQuery,
} from 'redux/api/userApi';

export const useGetUsers = () => {
  // ** state **
  const [users, setUsers] = useState<User[]>([]);

  // ** APIS **
  const [getUsersAPI, { isLoading, isError }] = useLazyGetAllUserQuery();
  const getUsers = async (q: { [key: string]: any }) => {
    const data = await getUsersAPI({ params: { ...q } }, true);
    if ('data' in data && _.isArray(data.data?.rows)) {
      if (q?.page === 1) {
        setUsers([...data.data.rows]);
      } else {
        setUsers([...users, ...data.data.rows]);
      }
    }
  };

  return { getUsers, users, isLoading, isError, setUsers };
};

export const useGetUserDetails = (userId: number | null) => {
  // ** hooks **
  const navigate = useNavigate();

  // ** states **
  const [currentUser, setCurrentUser] = useState<UserResponse>({
    id: null,
    verified: false,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    city: '',
    state: {
      id: 0,
      name: '',
      state_code: '',
    },
    mobile: '',
    country: {
      id: 0,
      name: '',
      iso3: '',
      iso2: '',
    },
    address1: '',
    address2: '',
    zip: '',
    birth_date: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    profile_image: '',
    role: '',
    fax: '',
    website: '',
    timezone: '',
    userOrganization: { id: null, name: '' },
    roles: [],
    added_by_user: { id: null, first_name: '', last_name: '', full_name: '' },
    user_signature: '',
  });

  // ** APIS **
  const [getUserByIdAPI, { isLoading: isUserLoading, currentData }] =
    useLazyGetUserByIdQuery();

  const getUserDetail = async (id: number) => {
    const data = await getUserByIdAPI(
      {
        id,
        params: {
          'include[organizations]': 'all',
          'include[added_by_user][required]': false,
          'include[roles]': 'id,name',
          'include[state]': 'id,name,state_code',
          'include[country]': 'id,name,iso3,iso2',
        },
      },
      true
    );
    if (data) {
      setCurrentUser({
        ...currentUser,
        ...data.data,
        userOrganization: data?.data?.UserOrganization?.[0]?.organization,
        UserPlatform: data?.data?.UserPlatform?.[0]?.platform,
        UserProfile: data?.data?.UserProfile?.[0]?.profile,
      });
    }
  };

  useEffect(() => {
    if (userId) {
      getUserDetail(userId);
    } else {
      navigate(PRIVATE_NAVIGATION.settings.user.view);
    }
  }, []);

  useEffect(() => {
    if (currentData) {
      setCurrentUser(currentData);
    }
  }, [currentData]);

  return { currentUser, isUserLoading };
};

export const useGetUserOrDescendantUserOptions = ({
  module,
  type,
  searchFields,
}: {
  module: string;
  type: string;
  searchFields?: string;
}) => {
  const currentUser = useSelector(getCurrentUser);

  // ** APIS **
  const [getDescendantUsersAPI, { isLoading: isDescendantUsersLoading }] =
    useLazyGetDescendantsUserQuery();
  const [getUsersAPI, { isLoading: isUsersLoading }] = useLazyGetAllUserQuery();

  const userOrDescendantUserOptions: AsyncSelectGetOptions = async (option) => {
    let responseObj;

    if (isAdministrator()) {
      responseObj = await getUsersAPI(
        {
          params: {
            limit: 100,
            searchText: option?.search,
            page: option?.page,
            searchFields: searchFields || 'first_name,last_name,email',
          },
        },
        true
      );
    } else {
      responseObj = await getDescendantUsersAPI(
        {
          params: {
            userId: currentUser?.id,
            module,
            type,
          },
        },
        true
      );
    }
    const data = responseObj;
    if ('data' in data) {
      const Options = data.data.rows.map(
        (val: { first_name: string; last_name: string; id: number }) => {
          return {
            label: `${val.first_name} ${val.last_name}`,
            value: val.id,
          };
        }
      );
      return {
        option: Options,
        count: data.data.count,
      };
    }
  };
  return {
    userOrDescendantUserOptions,
    isDescendantUsersLoading,
    isUsersLoading,
  };
};

type userOptionsProps = {
  limit?: number;
};

export const useGetUserOptions = (props: userOptionsProps) => {
  const { limit } = props;

  const [options, setOptions] = useState<Option[]>([]);

  const [getUsersAPI, { isLoading: isUsersLoading }] = useLazyGetAllUserQuery();

  const getUserOptions: AsyncSelectGetOptions = async (option) => {
    const data = await getUsersAPI(
      {
        params: {
          limit: limit || 100,
          searchText: option?.search,
          page: option?.page,
          searchFields: 'first_name,last_name',
        },
      },
      true
    );

    if ('data' in data) {
      const Options = data.data.rows.map(
        (val: { first_name: string; last_name: string; id: number }) => {
          return {
            label: `${val.first_name} ${val.last_name}`,
            value: val.id,
          };
        }
      );
      setOptions(Options);
      return {
        option: Options,
        count: data.data.count,
      };
    }
  };
  return {
    options,
    getUserOptions,
    isUsersLoading,
  };
};

export const useGetReportsToOptions = (userId?: number | null) => {
  // ** APIS **
  const [getUsersAPI, { isLoading: isReportOptionsLoading }] =
    useLazyGetAllUserQuery();
  const getReportsToOptions: AsyncSelectGetOptions = async (option) => {
    const data = await getUsersAPI(
      {
        params: {
          ...(userId && { 'q[id][notIn]': `${userId}` }),
          limit: 100,
          searchText: option?.search,
          page: option?.page,
          searchFields: 'first_name,last_name,email',
        },
      },
      true
    );
    if ('data' in data) {
      const tempOption = data.data.rows
        .filter(
          (val: { report_to: number | undefined }) =>
            val.report_to !== userId || userId === null
        )
        .map(
          (val: {
            first_name?: string;
            last_name?: string;
            id: number;
            email: string;
          }) => ({
            label: `${val.first_name} ${val.last_name}`,
            value: val.id,
            selected: data.data.length === 1,
          })
        );

      return {
        option: tempOption,
        count: data.data.count,
      };
    }
  };

  return { getReportsToOptions, isReportOptionsLoading };
};

export const useGetReportsUser = () => {
  // ** APIS **
  const [getUsersAPI] = useLazyGetAllUserQuery();
  const [getDescendantUsersAPI] = useLazyGetDescendantsUserQuery();
  const dispatch = useDispatch();
  const userOrDescendantUserOptions = async (userData: UserInterface,dispatchCall = true) => {
    let responseObj: {
      data?: any;
      error?: any;
    };
    if (userData?.user_roles?.[0].role?.name === 'Administrator') {
      responseObj = await getUsersAPI(
        {
          params: {
            limit: 100000,
            page: 1,
            select:
              'id,first_name,last_name,full_name,email,phone,profile_image',
            'include[user_roles][select]': 'id,role_id',
            'include[user_roles][include][role][select]': 'id,name',
          },
        },
        true
      );
    } else {
      responseObj = await getDescendantUsersAPI(
        {
          params: {
            userId: userData?.id,
            module: 'leads',
            type: 'create',
          },
        },
        true
      );
    }
    const data = responseObj;

    if ('data' in data) {
      if(dispatchCall){
        dispatch(setHierarchyUsers({ hierarchyUsers: data.data.rows }));
      }
      const returnData = data.data;
      const Options = data.data.rows
        .filter((val: User) => val.id !== userData.id)
        .map((val: { first_name: string; last_name: string; id: number }) => {
          return {
            label: `${val.first_name} ${val.last_name}`,
            value: val.id,
          };
        });
      const reportTo = { option: Options, count: data.data.count };
      if(dispatchCall){
        dispatch(setReportTo({ reportTo }));
      }
      return {
        returnData,
      };
    }
  };
  return {
    userOrDescendantUserOptions,
  };
};

export const useReportUserUpdate = () => {
  const dispatch = useDispatch();
  const reportToUsers = useSelector(getHierarchyUsers);

  const reportToUsersRef = useRef<UserInterface[]>(reportToUsers || []);
  reportToUsersRef.current = reportToUsers || [];

  const addReportUser = (user: UserInterface) => {
    return dispatch(
      setHierarchyUsers({
        hierarchyUsers: [
          ...reportToUsersRef.current.filter((item) => item?.id !== user?.id),
          user,
        ],
      })
    );
  };

  const removeReportUser = (userId: number | number[]) => {
    const reportUsers = reportToUsers?.filter(
      (user) =>
        user.id &&
        ![...(Array.isArray(userId) ? userId : [+userId])].includes(user.id)
    );
    return dispatch(setHierarchyUsers({ hierarchyUsers: reportUsers }));
  };
  return { addReportUser, removeReportUser };
};

interface HierarchyProps {
  id: number;
  report_to: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  active?: boolean;
  edit?: boolean;
  preview?: boolean;
  no_of_child: number;
  profile_image?: string;
  profile_name: string;
}

// preview :- view mode of node
// edit :- edit detail of node
// active : for current active Hierarchy

export const useHierarchyUsers = () => {
  const [hierarchyUsers, setHierarchyUsersState] = useState<HierarchyProps[][]>(
    []
  );
  // ================= APIS ====================
  const [getHierarchyUsersAPI, { isLoading, isError }] =
    useLazyGetHierarchyUserQuery();

  const getHierarchyUsersFunc = async (id: number, index?: number) => {
    let tempHierarchyUsers = [...hierarchyUsers];

    if (index || index === 0) {
      // remove edit & preview from previous node
      if (tempHierarchyUsers[index - 1]) {
        tempHierarchyUsers[index - 1] = [...tempHierarchyUsers[index - 1]].map(
          (obj) =>
            obj.preview === true ? { ...obj, edit: false, preview: false } : obj
        );
      }
      // add preview mode only,because of this is first node
      if (index === 0) {
        tempHierarchyUsers[index] = [...tempHierarchyUsers[index]].map((obj) =>
          obj.id === id
            ? { ...obj, active: true, edit: false, preview: true }
            : obj
        );
      } else {
        // add edit & preview for current node
        tempHierarchyUsers[index] = [...tempHierarchyUsers[index]].map((obj) =>
          obj.id === id
            ? { ...obj, active: true, edit: true, preview: true }
            : { ...obj, active: false }
        );
      }

      if (tempHierarchyUsers[index + 1]) {
        tempHierarchyUsers[index + 1] = [...tempHierarchyUsers[index + 1]].map(
          (obj) => ({ ...obj, edit: false, preview: false, active: false })
        );
      }

      // this for current node and +1 more node and other nodes remove
      tempHierarchyUsers = [...tempHierarchyUsers.splice(0, index + 1)];
    }

    const { data, error } = await getHierarchyUsersAPI(
      {
        params: {
          select: 'first_name,last_name,report_to,phone,email,profile_image',
          depth_level: 1,
          userId: id,
        },
      },
      true
    );

    let tempData: HierarchyProps[][] = [];
    if (data) {
      tempData = [...Object.values(data)] as HierarchyProps[][];
    }

    tempData = tempData.map((array) => {
      return array.map((obj) => ({ ...obj, active: true }));
    });
    // if data fetch data not first time then current node remove,because of duplicate
    if (index || index === 0) {
      tempData = tempData.splice(1);
    } else {
      tempData[0] = tempData[0].map((obj) => ({
        ...obj,
        preview: true,
        active: true,
        edit: false,
      }));
    }

    if (!error && Object.values(tempData)) {
      setHierarchyUsersState([...tempHierarchyUsers, ...tempData]);
    }
  };

  return {
    getHierarchyUsers: getHierarchyUsersFunc,
    isLoading,
    isError,
    hierarchyUsers,
  };
};
