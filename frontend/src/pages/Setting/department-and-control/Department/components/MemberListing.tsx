// ======================== Types =======================
import Icon from 'components/Icon';
import Image from 'components/Image';
import { User } from '../../../user-setting/User/types/user.types';
import MemberListingSkeleton from '../skeletons/MemberListingSkeleton';

interface Props {
  selectedMembers: User[];
  setSelectedMembers: React.Dispatch<React.SetStateAction<User[]>>;
  loading: boolean;
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
}

const MemberListing = (props: Props) => {
  const { selectedMembers, setSelectedMembers, loading, setDirty } = props;

  const removeUser = (id: number) => {
    setDirty(true);
    if (selectedMembers.length === 1) {
      setDirty(false);
    }
    setSelectedMembers(selectedMembers.filter((member) => member.id !== id));
  };

  return (
    <div className="department__right w-[calc(100%_-_520px)] pl-[30px] 4xl:w-[calc(100%_-_320px)] xl:pl-0 xl:w-full xl:mt-[30px]">
      {loading ? (
        <MemberListingSkeleton />
      ) : (
        <>
          <label className="if__label">Selected Members</label>
          <div className="bg-ipGray__transparentBG p-[20px] rounded-[12px] overflow-x-auto ip__hideScrollbar department__table__wrapper sm:p-[13px]">
            {selectedMembers.length === 0 ? (
              <div className="no__member__selected bg-ip__white__text__color rounded-[12px] py-[30px] px-[15px] min-h-[150px] flex items-center justify-center">
                <div className="inner__wrapper w-[350px] max-w-full">
                  <div className="flex justify-center mb-[10px]">
                    <Icon
                      className="!w-[60px] !h-[60px] highlighted p-[8px]"
                      iconType="accountFilledBlueIcon"
                    />
                  </div>
                  <p className="text-[20px] font-biotif__Medium text-ipBlack__textColor text-center leading-[24px]">
                    You have not selected any member please select member
                  </p>
                </div>
              </div>
            ) : (
              <div className="department__table min-w-[500px]">
                <div className="department__header pb-[10px] sm:pb-0">
                  <div className="department__header__row flex flex-wrap">
                    <div className="member__name w-[calc(70%_-_40px)] text-[16px] font-biotif__SemiBold text-ip__black__text__color px-[15px] pl-0">
                      Member Name
                    </div>
                    <div className="member__role w-[calc(30%_-_40px)] text-[16px] font-biotif__SemiBold text-ip__black__text__color px-[15px]">
                      Role
                    </div>
                    <div className="member__action w-[80px] text-[16px] font-biotif__SemiBold text-ip__black__text__color px-[15px]">
                      Action
                    </div>
                  </div>
                </div>
                <div className="department__body">
                  {selectedMembers &&
                    selectedMembers.map((member: User, i: number) => (
                      <div
                        key={i}
                        className="department__body__row flex flex-wrap py-[10px] border-b border-whiteScreen__BorderColor"
                      >
                        <div className="member__name w-[calc(70%_-_40px)] flex items-center px-[15px] pl-0">
                          <div className="flex flex-wrap items-center w-full">
                            <Image
                              imgClassName="w-[34px] h-[34px] object-cover object-center rounded-full"
                              first_name={member.first_name || ''}
                              last_name={member.last_name || ''}
                              imgPath={member.profile_image || ''}
                              serverPath
                            />
                            <div className="member__text w-[calc(100%_-_42px)] pl-[10px] text-[14px] font-biotif__Medium text-dark__TextColor">
                              {`${member.first_name} ${member.last_name}`}
                            </div>
                          </div>
                        </div>
                        <div className="member__role w-[calc(30%_-_40px)] flex items-center px-[15px] text-[14px] font-biotif__Regular text-light__TextColor">
                          {member.UserProfile?.[0].profile.name}
                        </div>
                        <div className="member__action w-[80px] flex items-center px-[15px] text-[14px] font-biotif__Medium text-ip__Red hover:text-ip__Red__hoverDark">
                          <a
                            className="cursor-pointer"
                            onClick={() => removeUser(member.id)}
                          >
                            Remove
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MemberListing;
