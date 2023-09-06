// ** Components **
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import Image from 'components/Image';
import { moduleTypeKeys } from 'pages/Dashboard/components/constant/followers.constant';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser, UserInterface } from 'redux/slices/authSlice';
import {
  setAppendFollower,
  getAppendFollower,
} from 'redux/slices/followerSlice';

// ** Type **
import {
  FollowersSectionPropsType,
  FollowerTypes,
} from './types/follower.types';
import useFollowFollowing from './useFollowFollowing';

const FollowersSection = (props: FollowersSectionPropsType) => {
  const {
    accordion,
    openCloseAccordion,
    count: totalFollowers,
    followers: data,
    module_name,
    entityId,
  } = props;

  // ** hook **
  const dispatch = useDispatch();
  const selectFollower = useSelector(getAppendFollower);
  const currentUser = useSelector(getCurrentUser);

  // ** custom hook **
  const {
    followUnFollowEntity,
    followingEntities,
    leads,
    deals,
    accounts,
    contacts,
    activities,
  } = useFollowFollowing({ entityId, moduleName: module_name });

  const [count, setCount] = useState(totalFollowers || 0);
  const [followers, setFollowers] = useState<FollowerTypes[]>(data || []);

  useMemo(() => {
    if (leads || deals || accounts || contacts || activities) {
      const currentUserFollowing = [
        ...(followingEntities[module_name as keyof typeof followingEntities] ||
          []),
      ]?.find(
        (item) =>
          (
            item?.[
              moduleTypeKeys[
                module_name as keyof typeof moduleTypeKeys
              ] as keyof typeof item
            ] as { id: number }
          )?.id === entityId
      );
      if (currentUserFollowing === undefined) {
        const filteredFollower = followers?.filter(
          (item) => item.follower_id !== currentUser?.id
        );
        setFollowers(filteredFollower);
        setCount(filteredFollower.length);
      }
    }
  }, [leads || deals || accounts || contacts || activities]);

  useEffect(() => {
    if (selectFollower && selectFollower !== null) {
      if (selectFollower.action === 'remove') {
        const FilterFollowerList = followers?.filter(
          (follower) => follower.follower_id !== selectFollower?.follower_id
        );
        setFollowers(FilterFollowerList);
        setCount(
          Number(FilterFollowerList?.length) > 0
            ? Number(FilterFollowerList?.length) - 1
            : 0
        );
      }
      if (selectFollower.action === 'add') {
        const { follower, follower_id } = selectFollower;
        const FilterFollowerList = followers?.filter(
          (item) => item.follower_id !== selectFollower?.follower_id
        );
        setFollowers([
          ...FilterFollowerList,
          { follower, follower_id } as unknown as FollowerTypes,
        ]);
        setCount(Number(FilterFollowerList?.length) + 1);
      }
      dispatch(setAppendFollower(null));
    }
  }, [selectFollower]);

  return (
    <div className="followers__listing mb-[30px] sm:mb-[30px]">
      {followers.length > 0 && (
        <>
          <div
            className="flex flex-wrap items-center bg-[#ECF2F6] rounded-[12px] py-[10px] px-[24px] pr-[10px] mb-[15px] 3xl:pl-[15px] cursor-pointer"
            onClick={() => openCloseAccordion('followers')}
          >
            <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_32px)] pr-[10px]">
              Followers ({count})
            </span>
            <button
              className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[""] before:absolute before:top-[12px] before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-black before:border-b-[2px] before:border-b-black ${
                accordion?.followers
                  ? 'before:rotate-[135deg] before:top-[12px]'
                  : 'before:-rotate-45 before:top-[7px]'
              } `}
            >
              .
            </button>
          </div>
          {accordion?.followers && (
            <div className="border border-[#CCCCCC]/50 rounded-[12px] p-[24px] pb-[4px] 3xl:p-[15px] 3xl:pb-0 sm:p-0 sm:border-0">
              <div className="flex flex-wrap mx-[-10px] 3xl:mx-[-7px]">
                {followers?.map((follower, index) => {
                  if (follower.follower) {
                    const {
                      full_name,
                      first_name,
                      last_name,
                      email,
                      phone,
                      profile_image,
                      user_roles,
                      id: user_id,
                    } = follower.follower;

                    return (
                      <div
                        key={`${index}_follower_section_list_${follower}`}
                        className="follower__card w-1/4 px-[10px] mb-[20px] 3xl:w-1/3 3xl:px-[7px] 3xl:mb-[15px] xl:w-1/2 sm:w-full sm:mb-[10px] sm:last:mb-0"
                      >
                        <div className="inner__wrapper relative flex flex-wrap items-start h-full border border-[#CCCCCC]/50 rounded-[10px] p-[14px] px-[14px]">
                          <div className="img__wrapper w-[40px] h-[40px]">
                            <Image
                              imgPath={profile_image}
                              first_name={first_name}
                              last_name={last_name}
                              imgClassName="w-full h-full object-cover object-center rounded-full"
                              serverPath
                            />
                          </div>
                          <div className="right__details w-[calc(100%_-_40px)] pl-[10px]">
                            <h3 className="text-[16px] leading-[20px] font-biotif__Medium text-[#2E3234] pr-[74px] mb-[5px]">
                              {full_name}
                            </h3>
                            <h5 className="text-[14px] leading-[18px] font-biotif__Medium text-[#2E3234] pr-[74px] mb-[5px]">
                              {user_roles &&
                                user_roles[0] &&
                                user_roles[0].role?.name}
                            </h5>
                            <div className="w-full leading-[16px] mb-[3px]">
                              <ClickableEmail mail={email} />
                            </div>
                            <div className="w-full leading-[16px]">
                              <ClickableMobile number={phone} />
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              followUnFollowEntity(
                                follower.follower as UserInterface,
                                currentUser?.id === user_id,
                                entityId
                              )
                            }
                            className="follower__tags text-[#467CA7] text-[12px] font-biotif__Regular border border-[#CCCCCC]/50 rounded-[6px] pt-[2px] pb-[1px] px-[9px] absolute top-[13px] right-[12px]"
                          >
                            Unfollow
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return <></>;
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FollowersSection;
