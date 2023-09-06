// ** Imports **
import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSelector } from 'react-redux';

// ** redux **
import {
  getCurrentUser,
  getHierarchyUsers,
  UserInterface,
} from 'redux/slices/authSlice';

// ** Components **
import Button from 'components/Button';
import Icon from 'components/Icon';
import Image from 'components/Image';

// ** types **

// ** services **
import { useGetReportsUser } from 'pages/Setting/user-setting/User/hooks/useUserService';
import useFollowFollowing, {
  moduleIdType,
} from 'components/EntityDetails/FollowFollowing/useFollowFollowing';

// ** Constants **
import { ModuleNames } from 'constant/permissions.constant';
import { getAppendFollower } from 'redux/slices/followerSlice';

type Props = {
  entityData: any;
  entityId: number;
  moduleName: ModuleNames;
};

const FollowUnFollow = (props: Props) => {
  const { entityData, entityId, moduleName } = props;
  const searchRef = useRef<HTMLInputElement>(null);

  // ** redux **
  const currentUser = useSelector(getCurrentUser);
  const userHierarchy = useSelector(getHierarchyUsers);
  const appendEntity = useSelector(getAppendFollower);

  // ** states **
  const [isOpen, setIsOpen] = useState(false);
  const [isFollowing, setCurrentFollowing] = useState<boolean>(
    entityData?.is_following === 1
  );
  const [filteredUsers, setFilteredUsers] = useState<UserInterface[]>();
  const [refreshUser, setRefreshUser] = useState(Math.random());

  // ** hook **
  const followRef = useRef<HTMLDivElement>(null);

  // ** custom hook **
  const { userOrDescendantUserOptions } = useGetReportsUser();
  const { followUnFollowEntity } = useFollowFollowing({
    entityData,
    entityId,
    moduleName,
    setCurrentFollowing,
  });

  useEffect(() => {
    if (currentUser && userHierarchy === undefined) {
      userOrDescendantUserOptions(currentUser);
    }
  }, []);

  useMemo(() => {
    if (entityData?.is_following !== undefined) {
      setCurrentFollowing(entityData?.is_following === 1);
    }
  }, [entityData?.is_following]);

  const searchUserModalHandel = () => {
    setFilteredUsers(undefined);
    setIsOpen(!isOpen);
    if (searchRef.current) return (searchRef.current.value = '');
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      followRef.current &&
      !followRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isFollowing) {
      if (appendEntity?.follower_id === currentUser?.id) {
        return setCurrentFollowing(false);
      }
    }
    if (appendEntity?.action === 'remove') {
      const entities =
        entityData[
          moduleIdType[
            moduleName as keyof typeof moduleIdType
          ] as keyof typeof entityData
        ];
      entityData[
        moduleIdType[
          moduleName as keyof typeof moduleIdType
        ] as keyof typeof entityData
      ] = entities?.filter((item: { follower_id: number }) => {
        return item.follower_id !== appendEntity.follower_id;
      });
      return setRefreshUser(Math.random());
    }
  }, [appendEntity]);

  useLayoutEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const searchUsers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const search = (
      event as unknown as { target: { value: string } }
    ).target.value?.toLocaleLowerCase();
    return setFilteredUsers(
      userHierarchy?.filter(
        (item) =>
          item.id !== currentUser?.id &&
          search !== '' &&
          item.full_name?.toLocaleLowerCase()?.indexOf(search) !== -1
      )
    );
  };

  const checkUserExistInFollowing = (user: UserInterface) => {
    const entities =
      entityData?.lead_followers ||
      entityData?.deal_followers ||
      entityData?.account_followers ||
      entityData?.contact_followers ||
      entityData?.activity_followers;
    return entities?.find((item: { follower_id: number }) => {
      return item.follower_id === user.id;
    });
  };
  return (
    <div className="inline-block relative z-[4]" ref={followRef}>
      <Button
        onClick={searchUserModalHandel}
        className={`mr-[10px] ${
          isFollowing ? 'bg-ip__SuccessGreen' : 'bg-[#E6E6E6]'
        } py-[4px] px-[17px] ${
          isFollowing ? 'text-white' : 'text-black'
        } text-[14px] font-biotif__Medium rounded-[6px] h-[32px] mb-[10px] hover:text-white`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </Button>
      <div
        className={`follow__dropdown__wrapper absolute top-[calc(100%_-_5px)] right-[10px] pt-[1px] z-[3] ${
          isOpen ? '' : 'hidden'
        }`}
      >
        <div className="inner__wrapper p-[16px] rounded-[10px] shadow-[0px_2px_14px_#0000001a] w-[320px] max-w-full bg-white">
          <div className="flex flex-wrap justify-between mb-[8px]">
            <span className="text-[16px] font-biotif__Medium text-[#2E3234] inline-block">
              Follow
            </span>
            <span
              onClick={() =>
                currentUser &&
                currentUser.id &&
                followUnFollowEntity(currentUser, isFollowing, undefined)
              }
              className="inline-block cursor-pointer text-[14px] text-primaryColor font-biotif__SemiBold underline hover:text-primaryColor__hoverDark"
            >
              {isFollowing ? 'Remove me' : 'Add me'}
            </span>
          </div>
          <p className="text-[14px] font-biotif__Regular text-black/50 mb-[10px]">
            Followers who have been added will receive notifications when this
            record is updated.
          </p>
          <div className="form__Group w-full mb-0">
            <div className="ip__form__hasIcon">
              <input
                placeholder="Search"
                type="search"
                ref={searchRef}
                onChange={(e) => searchUsers(e)}
                className="ip__input rounded-[10px]"
              />
              <Icon iconType="searchStrokeIcon" />
            </div>
          </div>
          <div className="relative before:content-[''] border:top-0 before:left-0 before:w-full before:h-[1px] before:bg-black/10 before:absolute">
            <div
              className="followers__list mx-[-16px] mt-[10px] max-h-[300px] overflow-y-auto ip__FancyScroll py-[10px] pb-0"
              key={`${refreshUser}`}
            >
              {filteredUsers?.length
                ? filteredUsers?.map((user: UserInterface, index: number) => {
                    const isFollowingEntity = checkUserExistInFollowing(user);

                    return (
                      <div
                        onClick={() =>
                          !isFollowingEntity &&
                          user.id &&
                          followUnFollowEntity(
                            user,
                            !isFollowingEntity,
                            undefined
                          )
                        }
                        className="follower__item flex items-center px-[12px] py-[7px] relative cursor-pointer"
                        key={`${index}_followers_search`}
                      >
                        <div className="profile w-[40px] h-[40px]">
                          <Image
                            imgClassName="w-full h-full object-cover object-center rounded-full"
                            imgPath={user?.profile_image}
                            first_name={user?.first_name}
                            last_name={user?.last_name}
                            serverPath
                          />
                        </div>
                        <div className="flex items-center w-[calc(100%_-_40px)] pl-[12px]">
                          <h3 className="name w-[calc(100%_-_28px)] text-[14px] leading-[18px] font-biotif__Medium text-[#2E3234] ellipsis__2 pr-[10px]">
                            {user?.full_name ||
                              `${user?.first_name} ${user?.last_name}`}
                          </h3>
                          {isFollowingEntity && (
                            <Icon
                              onClick={() =>
                                user?.id &&
                                followUnFollowEntity(
                                  user,
                                  !isFollowingEntity,
                                  undefined
                                )
                              }
                              className="delete__btn cursor-pointer w-[27px] h-[27px] p-[6px] bg-ipRed__transparentBG rounded-[4px] hover:bg-ip__Red"
                              iconType="deleteFilled"
                            />
                          )}
                        </div>
                      </div>
                    );
                  })
                : filteredUsers !== undefined && (
                    <div className="text-center">
                      <span className="text-slate-300">no user found</span>
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUnFollow;
