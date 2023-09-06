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
  useUpdateHierarchyBlockMutation,
} from 'redux/api/hierarchyBlockApi';
import { User } from '../../User/types/user.types';
import Icon from 'components/Icon';
import UserModalForAccountBlock from '../Modals/UserModalForAccountBlock';
import { NodeProps } from 'reactflow';
import { isExpandable } from '../helper';

type Props = {
  data: BlockDataType;
  id: string;
  onNodeClick: (id: NodeProps['id']) => void;
};

type AddPermissionFormFieldType = {
  title: string;
  description: string;
  managed_by: number | null;
};

type Detail = {
  id: number;
  title: string;
  description: string;
  manager: User;
  managed_by: number;
};

const PermissionBlock = (props: Props) => {
  const { data, id, onNodeClick } = props;

  // ** Hooks **
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
  } = useForm<AddPermissionFormFieldType>({
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
  const [updateHierarchy, { isLoading: updateLoading }] =
    useUpdateHierarchyBlockMutation();

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
        },
      });
    }
  }, [data?.id]);

  useEffect(() => {
    if (blockData) {
      reset(blockData);
      setDetail(blockData);
    }
  }, [blockData]);

  const handleKeyDown = () => {
    if (buttonRef?.current) {
      buttonRef.current?.click();
    }
  };

  const onSave = (key: keyof AddPermissionFormFieldType) => {
    return handleSubmit(async (formValues) => {
      const values = {
        [key]: formValues[`${key}`],
      };
      const updateData = await updateHierarchy({
        id: data?.id,
        data: values,
      });
      if ('data' in updateData && !('error' in updateData)) {
        setIsEditing(undefined);
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
        <div className="header__details !bg-[#D1E4F1]">
          <InlineEditable
            onCancel={() => setIsEditing(undefined)}
            setIsEditing={() => setIsEditing('title')}
            isEditing={isEditing === 'title'}
            isLoading={updateLoading}
            onSave={onSave('title')}
            editComponent={
              <FormField<AddPermissionFormFieldType>
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
                  <FormField<AddPermissionFormFieldType>
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
                imgPath={detail?.manager?.profile_image || ''}
                first_name={detail?.manager?.first_name || ''}
                last_name={detail?.manager?.last_name || ''}
                serverPath
                color="#1776BA"
              />
            </div>
            <div className="user__name__wrapper">
              <span className="name" onClick={() => setOpenUserModal(true)}>
                {`${detail?.manager?.first_name || ''} ${
                  detail?.manager?.last_name || ''
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
            {isExpandable(data) !== 'NOTHING_TO_EXPAND' && (
              <div className="center__wrapper absolute top-[calc(50%_+_2px)] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <button
                  className={`down__btn ${
                    isExpandable(data) === 'CLICK_TO_COLLAPSE'
                      ? ''
                      : '-rotate-180'
                  }`}
                  onClick={() => onNodeClick(id)}
                >
                  .
                </button>
              </div>
            )}
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
          handleOnChange={(value: number) => setValue('managed_by', value)}
          watchUser={watch('managed_by')}
          onSubmit={onSave('managed_by')}
        />
      ) : null}
    </>
  );
};

export default PermissionBlock;
