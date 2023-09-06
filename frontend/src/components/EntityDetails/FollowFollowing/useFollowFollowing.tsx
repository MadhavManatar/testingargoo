// ** Import Packages **
import { useDispatch, useSelector } from 'react-redux';
import {
  getFollowingEntities,
  getFollowingEntityCount,
  setAppendFollower,
  setFollowingEntities,
  setFollowingEntityCount,
} from 'redux/slices/followerSlice';
import { getCurrentUser, UserInterface } from 'redux/slices/authSlice';

// ** Types **
import { AccountDetails } from 'pages/Account/types/account.types';
import { ActivityResponseType } from 'pages/Activity/types/activity.types';
import { ContactDetails } from 'pages/Contact/types/contacts.types';
import { DealDetailsType } from 'pages/Deal/types/deals.types';
import { LeadDetailsType } from 'pages/Lead/types/lead.type';

// ** Services **
import {
  useAddFollowEntityAPI,
  useGetFollowingEntitiesAPI,
} from 'services/followEntity.service';

// ** Constant **
import { ModuleNames } from 'constant/permissions.constant';
import {
  moduleTypeKeys,
  module_followers,
} from 'pages/Dashboard/components/constant/followers.constant';

export const moduleIdType = {
  leads: 'lead_followers',
  deals: 'deal_followers',
  contacts: 'contact_followers',
  accounts: 'account_followers',
  activities: 'activity_followers',
};

const followCountKeys = {
  leads: 'lead_followers_count',
  deals: 'deal_followers_count',
  accounts: 'account_followers_count',
  contacts: 'contact_followers_count',
  activities: 'activity_followers_count',
};

type UseFollowFollowing = {
  entityData?:
    | LeadDetailsType
    | DealDetailsType
    | ContactDetails
    | AccountDetails
    | ActivityResponseType;
  entityId?: number;
  moduleName?: ModuleNames;
  setCurrentFollowing?: React.Dispatch<React.SetStateAction<boolean>>;
};

const useFollowFollowing = ({
  entityData,
  entityId,
  moduleName,
  setCurrentFollowing,
}: UseFollowFollowing) => {
  // ** Hooks **
  const dispatch = useDispatch();
  const selectFollowingEntities = useSelector(getFollowingEntities);
  const followingEntitiesCount = useSelector(getFollowingEntityCount);
  type SelectFollowingEntities = keyof typeof selectFollowingEntities;
  const currentUser = useSelector(getCurrentUser);

  // ** custom hooks **
  const { addFollowEntityAPI } = useAddFollowEntityAPI();
  const { getFollowingEntitiesAPI } = useGetFollowingEntitiesAPI();

  const fetchFollowingEntities = async () => {
    const { data, error } = await getFollowingEntitiesAPI({
      query: module_followers,
    });
    if (!error && data) {
      const {
        lead_followers: leads,
        deal_followers: deals,
        contact_followers: contacts,
        account_followers: accounts,
        activity_followers: activities,
      } = data;
      dispatch(
        setFollowingEntities({ leads, deals, accounts, contacts, activities })
      );
    }
  };

  const followUnFollowEntity = async (
    user: UserInterface,
    isUserFollowing?: boolean,
    entity_id: number | undefined = entityId
  ) => {
    if (entity_id && moduleName) {
      entityId = entity_id;
      const isFollowingUser =
        currentUser?.id !== user?.id ? !isUserFollowing : isUserFollowing;
      const { data, error } = await addFollowEntityAPI(
        entity_id,
        moduleName,
        isFollowingUser ? 'un-follow' : 'follow',
        { follower_ids: [user?.id] }
      );
      if (!error && data) {
        const appendObj = {
          follower: user,
          follower_id: user?.id || 0,
        };

        const module =
          moduleIdType[
            (moduleName === ModuleNames.DEAL
              ? ModuleNames.LEAD
              : moduleName) as keyof typeof moduleIdType
          ];
        let entityFollowers = [
          ...((entityData &&
            (entityData[module as keyof typeof entityData] as any)) ||
            []),
        ];
        if (currentUser?.id === user?.id) {
          dispatch(
            setAppendFollower({
              action: isUserFollowing ? 'remove' : 'add',
              ...appendObj,
            })
          );
          followingStoreRefresh({
            action: isUserFollowing ? 'remove' : 'add',
            ...(!isUserFollowing ? { addData: data } : {}),
          });
          return (
            (setCurrentFollowing && setCurrentFollowing(!isUserFollowing)) ||
            data
          );
        }
        if (isFollowingUser) {
          dispatch(setAppendFollower({ action: 'remove', ...appendObj }));
          entityFollowers = entityFollowers?.filter(
            (item: { follower_id: number | undefined }) =>
              item?.follower_id !== user.id
          );
          return entityData && ((entityData as any)[module] = entityFollowers);
        }
        entityFollowers?.push(appendObj);
        dispatch(setAppendFollower({ action: 'add', ...appendObj }));
        return entityData && ((entityData as any)[module] = entityFollowers);
      }
    }
  };

  const followingStoreRefresh = ({
    action,
    addData,
  }: {
    action: 'add' | 'remove';
    addData?: { id: number | number[] };
  }) => {
    if (
      selectFollowingEntities[moduleName as SelectFollowingEntities] ||
      selectFollowingEntities[moduleName as SelectFollowingEntities] === null
    ) {
      if (action === 'add' && addData) {
        const addEntity = {
          id: addData?.id,
          [moduleTypeKeys[moduleName as keyof typeof moduleTypeKeys]]: {
            id: entityId,
            [moduleName !== ModuleNames.ACTIVITY ? 'topic' : 'name']: (
              entityData as { name: string }
            )?.name,
          },
        };
        dispatch(
          setFollowingEntities({
            ...selectFollowingEntities,
            [moduleName as SelectFollowingEntities]: [
              addEntity,
              ...(selectFollowingEntities[
                moduleName as SelectFollowingEntities
              ] || []),
            ],
          })
        );
        const moduleEntityCount =
          followingEntitiesCount[
            followCountKeys[
              moduleName as unknown as keyof typeof followCountKeys
            ] as keyof typeof followingEntitiesCount
          ];
        return dispatch(
          setFollowingEntityCount({
            ...followingEntitiesCount,
            totalFollowing: Number(followingEntitiesCount?.totalFollowing) + 1,
            [followCountKeys[
              moduleName as unknown as keyof typeof followCountKeys
            ]]:
              moduleEntityCount || moduleEntityCount === 0
                ? moduleEntityCount + 1
                : 0,
          })
        );
      }
      const removeEntity = [
        ...(selectFollowingEntities[moduleName as SelectFollowingEntities] ||
          []),
      ]?.filter((item) => {
        const itemId = (
          item[
            moduleTypeKeys[
              moduleName as keyof typeof moduleTypeKeys
            ] as keyof typeof item
          ] as { id: number }
        )?.id;
        if (addData && addData?.id) {
          if (Array.isArray(addData?.id)) return !addData?.id.includes(itemId);
          return addData?.id !== itemId;
        }
        return entityId !== itemId;
      });
      dispatch(
        setFollowingEntities({
          ...selectFollowingEntities,
          [moduleName as SelectFollowingEntities]: removeEntity,
        })
      );

      const entityLength: number = Array.isArray(addData?.id)
        ? addData?.id?.length || 1
        : 1;
      const moduleEntityCount =
        followingEntitiesCount[
          followCountKeys[
            moduleName as unknown as keyof typeof followCountKeys
          ] as keyof typeof followingEntitiesCount
        ];

      return dispatch(
        setFollowingEntityCount({
          ...followingEntitiesCount,
          totalFollowing:
            Number(followingEntitiesCount?.totalFollowing) - entityLength,
          [followCountKeys[
            moduleName as unknown as keyof typeof followCountKeys
          ]]: moduleEntityCount ? moduleEntityCount - 1 : 0,
        })
      );
    }
    return null;
  };

  return {
    ...selectFollowingEntities,
    followingEntities: selectFollowingEntities,
    followingStoreRefresh,
    followUnFollowEntity,
    fetchFollowingEntities,
  };
};

export default useFollowFollowing;
