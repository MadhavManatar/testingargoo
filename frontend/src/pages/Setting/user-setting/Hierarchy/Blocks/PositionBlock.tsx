import { BlockDataType } from '../NodeTypes/WorkflowNode';
import Image from 'components/Image';
import { useForm } from 'react-hook-form';
import FormField from 'components/FormField';
import InlineEditable from '../InlineEditing';
import { useEffect, useRef, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { hierarchyAccountSchema } from '../validation-schema/hierarchy.schema';
import {
  useLazyGetHierarchyBlockByIdQuery,
  useUpdateHierarchyBlockForUserPositionMutation,
} from 'redux/api/hierarchyBlockApi';
import { User } from '../../User/types/user.types';
import UserModalForAccountBlock from '../Modals/UserModalForAccountBlock';
import Icon from 'components/Icon';

type Props = {
  data: BlockDataType;
  id: string;
};

type AddPositionFormFieldType = {
  title: string;
  description: string;
  position_user_id: number | null;
};

type Detail = {
  id: number;
  title: string;
  description: string;
  position_user: {
    id: number;
    user: User;
  };
};

const PositionBlock = (props: Props) => {
  const { data } = props;

  // ** Hooks **
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<AddPositionFormFieldType>({
    resolver: yupResolver(hierarchyAccountSchema),
  });

  // ** State **
  const [isEditing, setIsEditing] = useState<keyof any>();
  const [detail, setDetail] = useState<Detail>();
  const [openUserModal, setOpenUserModal] = useState(false);

  // ** Ref **
  const buttonRef = useRef<HTMLButtonElement>(null);
  const divRefForInputField = useRef<HTMLDivElement>(null);

  // ** APIS **
  const [getHierarchyBlockById, { currentData: blockData }] =
    useLazyGetHierarchyBlockByIdQuery();
  const [updateHierarchyForUserPosition, { isLoading: updateLoading }] =
    useUpdateHierarchyBlockForUserPositionMutation();

  useEffect(() => {
    if (isEditing) {
      divRefForInputField?.current
        ?.querySelector(isEditing === 'description' ? 'textarea' : 'input')
        ?.focus();
    }
  }, [isEditing]);

  useEffect(() => {
    if (data?.id) {
      getHierarchyBlockById({
        id: data.id,
        params: {
          'include[manager][select]': 'id,first_name,last_name,profile_image',
          'include[position_user][select]': 'id',
          'include[position_user][include][user][select]':
            'id,first_name,last_name,profile_image',
        },
      });
    }
  }, [data?.id]);

  useEffect(() => {
    if (blockData) {
      const { description, position_user, title } = blockData;

      reset({
        description,
        position_user_id: position_user?.user?.id,
        title,
      });
      setDetail(blockData);
    }
  }, [blockData]);

  const handleKeyDown = () => {
    if (buttonRef?.current) {
      buttonRef.current?.click();
    }
  };

  const onSave = (key: keyof AddPositionFormFieldType) => {
    return handleSubmit(async (formValues) => {
      const values = {
        [key]: formValues[`${key}`],
      };
      const updateData = await updateHierarchyForUserPosition({
        id: data?.id,
        data: values,
      });
      if ('data' in updateData && !('error' in updateData)) {
        setIsEditing(undefined);
        setOpenUserModal(false);
      }
      return false;
    });
  };

  return (
    <>
      <div
        className="hierarchy__box__new"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleKeyDown();
          }
        }}
      >
        <div className="header__details !bg-[#F4EED6]">
          <InlineEditable
            onCancel={() => setIsEditing(undefined)}
            setIsEditing={() => setIsEditing('title')}
            isEditing={isEditing === 'title'}
            isLoading={updateLoading}
            onSave={onSave('title')}
            editComponent={
              <FormField<AddPositionFormFieldType>
                type="text"
                name="title"
                labelClass="if__label__blue"
                placeholder="Enter title"
                register={register}
                error={errors.title}
                fieldLimit={50}
              />
            }
            disabled={false}
            isSaveButtonDisable={false}
            buttonRef={buttonRef}
            divRefForInputField={divRefForInputField}
          >
            <span>{detail?.title}</span>
          </InlineEditable>
          <button className="toggle__btn">
            <Icon iconType="toggle3dotsIcon" />
          </button>
        </div>
        <div className="body__wrapper relative">
          <div className="mt-[10px]">
            <div className="field__wrapper mb-[10px]">
              <InlineEditable
                onCancel={() => setIsEditing(undefined)}
                setIsEditing={() => setIsEditing('description')}
                isEditing={isEditing === 'description'}
                isLoading={updateLoading}
                onSave={onSave('description')}
                editComponent={
                  <FormField<AddPositionFormFieldType>
                    type="textarea"
                    name="description"
                    labelClass="if__label__blue"
                    placeholder="Enter Description"
                    register={register}
                    error={errors.description}
                    fieldLimit={500}
                  />
                }
                disabled={false}
                isSaveButtonDisable={false}
                buttonRef={buttonRef}
                divRefForInputField={divRefForInputField}
              >
                {detail?.description || (
                  <span className="inline-block w-full py-[10px] px-[15px] bg-btnGrayColor rounded-[8px]">
                    + Add Description
                  </span>
                )}
              </InlineEditable>
            </div>
          </div>
          <div className="profile__box">
            <div className="img__wrapper">
              <Image
                imgPath={detail?.position_user?.user?.profile_image || ''}
                first_name={detail?.position_user?.user?.first_name || ''}
                last_name={detail?.position_user?.user?.last_name || ''}
                serverPath
                color="#C8A951"
              />
            </div>
            <div className="user__name__wrapper">
              <span className="name" onClick={() => setOpenUserModal(true)}>
                {`${detail?.position_user?.user?.first_name || ''} ${
                  detail?.position_user?.user?.last_name || ''
                }`}
              </span>
            </div>
          </div>
        </div>
        <div className="footer__wrapper relative flex items-center justify-between py-[12px] px-[12px] pt-[19px]">
          <div className="left__wrapper flex items-center">
            <button className="role__permission__btn">
              <Icon iconType="rolePremissionIcon" />
            </button>
            <button className="setting__btn">
              <Icon iconType="settingFilled" />
            </button>
          </div>
          <div className="center__wrapper absolute top-[calc(50%_+_2px)] left-[50%] translate-x-[-50%] translate-y-[-50%]">
            <button className="down__btn">.</button>
          </div>
          <div className="right__wrapper flex items-center">
            <button className="left__btn">.</button>
            <button className="move__btn">
              <Icon iconType="moveShareIcon" />
            </button>
            <button className="right__btn">.</button>
          </div>
        </div>
      </div>

      {openUserModal ? (
        <UserModalForAccountBlock
          isOpen={openUserModal}
          close={() => setOpenUserModal(false)}
          handleOnChange={(value: number) =>
            setValue('position_user_id', value)
          }
          watchUser={watch('position_user_id')}
          onSubmit={onSave('position_user_id')}
        />
      ) : null}
    </>
  );
};

export default PositionBlock;
