// ** external packages **
import { yupResolver } from '@hookform/resolvers/yup';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

// ** components **
import Button from 'components/Button';
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import Image from 'components/Image';
import DepartmentFormSkeleton from '../skeletons/DepartmentFormSkeleton';

//  ** use-services **
import { useGetUsers } from 'pages/Setting/user-setting/User/hooks/useUserService';

// ** services **
import { useGetDepartmentDetails } from '../hooks/useDepartmentService';


// ** types **
import { User } from '../../../user-setting/User/types/user.types';
import { AddDepartmentFormFields } from '../types/department.types';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { DepartMentSchemaError } from 'constant/formErrorMessage.constant';
import RouteChangeConformationModal from 'components/Modal/RouteChangeConformationModal';

// ** Apis **
import { useAddDepartmentMutation,useUpdateDepartmentMutation } from 'redux/api/departmentApi';

const departmentSchema = yup.object({
  name: yup.string().required(DepartMentSchemaError.name),
  departmentAdmin: yup.object().shape({
    id: yup.number().required(DepartMentSchemaError.departmentAdmin),
  }),
});

type Props = {
  departmentId: number | null;
  selectedMembers: User[];
  dirty: boolean;
  setSelectedMembers: React.Dispatch<React.SetStateAction<User[]>>;
  setAddMemberModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const AddDepartmentForm = (props: Props) => {
  const {
    departmentId,
    setSelectedMembers,
    selectedMembers,
    setAddMemberModalOpen,
    setLoading,
    dirty,
  } = props;

  // ** Hooks **
  const {
    register,
    reset,
    setValue,
    watch,
    clearErrors,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm<AddDepartmentFormFields>({
    resolver: yupResolver(departmentSchema),
  });
  const navigate = useNavigate();
  // ** States **
  const [search, setSearch] = useState<string>('');
  const [customIsDirty, setCustomIsDirty] = useState<boolean>(true);

  const { users, getUsers } = useGetUsers();
  
  // ** Custom Apis **
  const [addDepartmentAPI,{ isLoading: isAddDepartmentLoading }] = useAddDepartmentMutation();
  const [ updateDepartmentByIdAPI,{ isLoading: isUpdateDepartmentLoading }] =
  useUpdateDepartmentMutation();

  const { isLoading: loadingDepartMentDetail } = useGetDepartmentDetails({
    departmentId,
    setValue,
    reset,
    setSelectedMembers,
    selectedMembers,
  });

  //  ** initialize **
  const departmentAdmin = watch('departmentAdmin');
  useEffect(() => {
    getUsers({
      page: 1,
      select: 'id,first_name,last_name,profile_image',
      searchFields: 'username,first_name,last_name',
      searchText: `${search}`,
      'include[UserProfile][select]': 'profile[id,name]',
    });
  }, [search]);

  useEffect(() => {
    setLoading(loadingDepartMentDetail);
  }, [loadingDepartMentDetail]);
  useEffect(() => {
    setIsActive(false);
  }, [departmentAdmin]);

  const onSubmit = async (values: AddDepartmentFormFields) => {
    // we are set setCustomIsDirty to false cause after submit DirtyField value is always true
    setCustomIsDirty(false);
    const finalData = {
      name: values.name,
      description: values.description,
      users: [...selectedMembers.map((member) => member.id)],
      admin_id: values.departmentAdmin.id,
    };

    let data;
    if (departmentId) {
      data = await updateDepartmentByIdAPI({id:departmentId,data:finalData});
    } else {
      data = await addDepartmentAPI({data:finalData});
    }
    if(data) {
      navigate(PRIVATE_NAVIGATION.settings.department.view);
    }   
  };

  let userList = _.uniqBy([...selectedMembers, ...users], 'id');
  if (search) {
    userList = users;
  }

  const [isActive, setIsActive] = useState(false);
  const handleClickMe = () => {
    setIsActive((current) => !current);
  };
  const onCancel = () => {
    navigate(PRIVATE_NAVIGATION.settings.department.view);
  };

  return (
    <>
      {loadingDepartMentDetail ? (
        <DepartmentFormSkeleton />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField<AddDepartmentFormFields>
            required
            type="text"
            name="name"
            label="Department Name"
            labelClass="if__label__blue"
            register={register}
            error={errors.name}
            placeholder="Enter Department Name"
          />
          <label className="if__label if__label__blue">
            Department Admin <span className="text-ip__Red">*</span>
          </label>
          <div className="mb-[20px]">
            <div className="py-[12px] px-[13px] bg-formField__BGColor rounded-[6px] department__admin__select__box">
              <div
                onClick={handleClickMe}
                className={isActive ? 'department__admin__active' : ''}
              >
                <h4 className="department__admin__header cursor-pointer font-biotif__Regular text-[16px] text-dark__TextColor relative before:absolute before:top-[calc(50%_-_2px)] before:translate-y-[-50%] before:right-0 before:border-[2px] before:border-ip__black__text__color before:w-[8px] before:h-[8px] before:border-r-0 before:border-t-0 before:rotate-[-45deg]">
                  {departmentAdmin?.first_name || departmentAdmin?.last_name
                    ? `${departmentAdmin.first_name} ${departmentAdmin.last_name}`
                    : 'Select Admin'}
                </h4>
              </div>
              <div className="department__admin__body">
                <div className="">
                  <FormField<AddDepartmentFormFields>
                    type="text"
                    name="searchAdmin"
                    label=""
                    labelClass="if__label__blue"
                    placeholder="Search Members..."
                    icon="searchStrokeIcon"
                    onChange={_.debounce((e) => setSearch(e.target.value), 500)}
                  />
                </div>
                <div className="members__wrapper">
                  {userList.map((user: User, i: number) => (
                    <div
                      key={i}
                      className="members__box flex flex-wrap relative border-b border-whiteScreen__BorderColor py-[10px] my-0 cursor-pointer"
                      onClick={() => {
                        setValue('departmentAdmin', user);
                        clearErrors('departmentAdmin');
                      }}
                    >
                      <div className="member__img inline-flex items-center">
                        <Image
                          imgClassName="w-[34px] h-[34px] object-cover object-center rounded-full"
                          first_name={user.first_name || ''}
                          last_name={user.last_name || ''}
                          imgPath={user.profile_image || ''}
                          serverPath
                        />
                      </div>
                      <div className="member__details w-[calc(100%_-_35px)] pl-[12px]">
                        <h3 className="member__title text-[14px] font-biotif__Medium text-dark__TextColor leading-normal">
                          {user.username
                            ? user.username
                            : `${user.first_name} ${user.last_name}`}
                        </h3>
                        <p className="text text-[14px] font-biotif__Regular text-light__TextColor leading-normal">
                          {user.UserProfile?.[0].profile.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {errors.departmentAdmin && (
              <p className="ip__Error">{errors.departmentAdmin?.id?.message}</p>
            )}
          </div>
          <FormField<AddDepartmentFormFields>
            type="textarea"
            name="description"
            register={register}
            label="Description"
            labelClass="if__label__blue"
            error={errors.description}
            placeholder="Enter Department Details"
            fieldLimit={500}
          />
          <div>
            <label className="if__label if__label__blue">Add Member</label>
            <div className="add__member__box bg-formField__BGColor rounded-[10px] p-[15px] flex flex-wrap items-center">
              <div className="left flex items-center flex-wrap w-[calc(100%_-_147px)] pr-[15px] 4xl:w-full 4xl:pr-0 4xl:mb-[10px] xl:w-[calc(100%_-_147px)] sm:w-full">
                <div className="icon__wrapper">
                  <Icon
                    className="w-[38px] h-[38px] bg-ip__white__text__color rounded-[10px] p-[7px]"
                    iconType="profileFilledBlueIcon"
                  />
                </div>
                <div className="details__wrapper w-[calc(100%_-_39px)] pl-[14px]">
                  <h3 className="title text-[14px] text-ip__black__text__color font-biotif__Regular">
                    Recipients
                  </h3>
                  <p className="text text-[12px] text-light__TextColor font-biotif__Regular">
                    Select whom you need to add in this department
                  </p>
                </div>
              </div>
              <Button
                className="smaller primary__Btn px-[20px] !py-[8px] 4xl:w-full xl:w-auto sm:w-full"
                icon="plusFilled"
                onClick={() => {
                  setAddMemberModalOpen(true);
                }}
              >
                Add Member
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap action__fixed__btn__department">
            <Button
              className="cancel__btn secondary__Btn mr-[7px] min-w-[120px] sm:min-w-[calc(50%_-_7px)]"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              className="save__btn primary__Btn min-w-[120px] py-[11px] ml-[7px] sm:min-w-[calc(50%_-_7px)]"
              type="submit"
              isLoading={isAddDepartmentLoading || isUpdateDepartmentLoading}
            >
              {departmentId ? 'Update' : 'Save'}
            </Button>
          </div>
        </form>
      )}
      <RouteChangeConformationModal
        isDirtyCondition={
          (dirty || Object.values(dirtyFields)?.length > 0) && customIsDirty
        }
      />
    </>
  );
};

export default AddDepartmentForm;
