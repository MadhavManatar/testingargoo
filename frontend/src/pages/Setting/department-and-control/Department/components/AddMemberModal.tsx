// ** Import Packages **
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// ** Components **
import FormField from 'components/FormField';
import Image from 'components/Image';
import Modal from 'components/Modal';

// ** Types **
import { User } from '../../../user-setting/User/types/user.types';
import { AddMemberFormFields } from '../types/department.types';

//  ** Use-Services **
import { useGetUsers } from 'pages/Setting/user-setting/User/hooks/useUserService';

interface Props {
  isOpen: boolean;
  selectedMembers: User[];
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedMembers: React.Dispatch<React.SetStateAction<User[]>>;
  close: () => void;
}
const AddMemberModal = (props: Props) => {
  const { close, isOpen, selectedMembers, setSelectedMembers, setDirty } =
    props;

  // ** Hooks **
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddMemberFormFields>({
    defaultValues: { memberListType: 'all_members' },
  });
  // ** States **
  const [search, setSearch] = useState<string>('');

  // ** Custom Hooks **
  const { users: members, getUsers } = useGetUsers();

  useEffect(() => {
    getUsers({
      page: 1,
      select: 'id,first_name,last_name',
      searchFields: 'username,first_name,last_name',
      searchText: `${search}`,
      'include[UserProfile][select]': 'profile[id,name]',
    });
  }, [search]);

  const onSubmit = () => {
    setDirty(true);
    close();
  };

  const changeModuleStatus = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    memberId: number
  ) => {
    if ((event.target as HTMLInputElement).checked) {
      const findMember = members.find((obj) => obj.id === memberId);
      if (findMember) setSelectedMembers([...selectedMembers, findMember]);
    } else {
      setSelectedMembers(selectedMembers.filter((obj) => obj.id !== memberId));
    }
  };

  // here put condition for member listing data
  const membersList =
    watch('memberListType') === 'all_members'
      ? search
        ? members
        : _.uniqBy([...members, ...selectedMembers], 'id')
      : selectedMembers;
  return (
    <Modal
      title="Add Members"
      visible={isOpen}
      onClose={close}
      onCancel={close}
      onSubmit={handleSubmit(onSubmit)}
      width="520px"
      submitButtonText="Add Members"
    >
      <FormField<AddMemberFormFields>
        wrapperClass="full__Radio__Button add__members__radio__group department__add__member"
        type="radio"
        name="memberListType"
        label=""
        options={[
          { label: 'All Members', value: 'all_members', checked: true },
          { label: 'Selected Members', value: 'selected_members' },
        ]}
        register={register}
        error={errors.memberListType}
      />

      <div className="">
        <FormField<AddMemberFormFields>
          wrapperClass="transparent__formField mb-[7px]"
          type="text"
          name="searchMember"
          label="Choose Who Can Access This Department"
          placeholder="Search Members..."
          icon="searchStrokeIcon"
          onChange={_.debounce((e) => setSearch(e.target.value), 500)}
        />
      </div>
      <div className="members__wrapper">
        {membersList.map((member: User, index: number) => {
          return (
            <div
              key={index}
              className="members__box flex flex-wrap relative border-b border-whiteScreen__BorderColor py-[10px] my-0 pr-[40px]"
            >
              <div className="member__img inline-flex items-center">
                <Image
                  imgClassName="w-[34px] h-[34px] object-cover object-center rounded-full"
                  first_name={member.first_name || ''}
                  last_name={member.last_name || ''}
                  imgPath={member.profile_image || ''}
                  serverPath
                />
              </div>
              <div className="member__details w-[calc(100%_-_35px)] pl-[12px]">
                <h3 className="member__title text-[14px] font-biotif__Medium text-dark__TextColor leading-normal">
                  {`${member.first_name} ${member.last_name}`}
                </h3>
                <p className="text text-[14px] font-biotif__Regular text-light__TextColor leading-normal">
                  {member.UserProfile?.[0].profile.name}
                </p>
              </div>
              <FormField<AddMemberFormFields>
                wrapperClass="mb-0 absolute top-[calc(50%_-_1px)] translate-y-[-50%] right-0"
                type="checkbox"
                register={register}
                error={errors.member}
                checked={
                  !!selectedMembers.find((m) => {
                    return m.id === member.id;
                  })
                }
                onChange={(event: any) => {
                  changeModuleStatus(event, member.id);
                }}
                name="member"
                label="member"
                value={member.id}
              />
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default AddMemberModal;
