// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

// ** Components **
import Modal from 'components/Modal';
import { agGridSelectedProps } from 'components/TableInfiniteScroll';
import DiscardConfirmationModal from '../../../../../../components/Modal/DiscardConfirmationModal';
import ActivityTypeFormSkeleton from '../skeletons/ActivityTypeFormSkeleton';
import ActivityTypeForm from './ActivityTypeForm';

// ** Types **
import {
  ActivityTypeFieldType,
  ActivityTypeResponseType,
} from '../types/activity-type.types';

// ** Schema **
import { ActivityTypeSchema } from '../validation-schema/activityType.schema';

// ** Constant **
import { ALLOWED_MIME_TYPES } from 'constant';

// ** Other **
import generateActivityTypeFormData, {
  getDefaultActivityResult,
} from '../helper/activityType.helper';
import {
  getTimelineStateObjFilterState,
  setTimelineStateObjFilter,
} from 'redux/slices/timelineFilterSlice';
import {
  useAddActivityTypeMutation,
  useLazyGetActivityTypeByIdQuery,
  useUpdateActivityTypeMutation,
} from 'redux/api/activityTypeApi';
import { ACTIVITY_TYPE_MAIL_STATUS } from 'constant/activity.constant';

interface AddActivityTypeModalPropsTypes {
  isOpen?: boolean;
  closeModal: () => void;
  id?: number | null;
  onAdd: () => void;
  setActivityTypeInfo?: React.Dispatch<
    React.SetStateAction<agGridSelectedProps>
  >;
}

const AddActivityTypeModal = (props: AddActivityTypeModalPropsTypes) => {
  const { closeModal, isOpen, onAdd, id, setActivityTypeInfo } = props;

  // ** hooks **//
  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
    setError,
    clearErrors,
    control,
    setValue,
  } = useForm<ActivityTypeFieldType>({
    resolver: yupResolver(ActivityTypeSchema),
  });
  const dispatch = useDispatch();
  const filterStateObj = useSelector(getTimelineStateObjFilterState);
  // ** States **
  const [iconImage, setIconImage] = useState<string | File>('');
  const [iconImageName, setIconImageName] = useState<string>('');
  const [iconType, setIconType] = useState<string>('');
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);
  const [editTimeActivityTypeData, setEditTimeActivityData] =
    useState<ActivityTypeResponseType>();

  // ** API **
  const [addActivityType, { isLoading: addActivityTypeLoading }] =
    useAddActivityTypeMutation();
  const [updateActivityTypeByIdAPI, { isLoading: updateActivityTypeLoading }] =
    useUpdateActivityTypeMutation();
  const [getActivityTypeByIdAPI, { isLoading: getActivityTypeLoading }] =
    useLazyGetActivityTypeByIdQuery();

  useEffect(() => {
    if (isOpen) {
      reset({
        email_status: ACTIVITY_TYPE_MAIL_STATUS.DISABLED,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (id) {
      getActivityType(id);
    }
  }, [id]);

  const getActivityType = async (typeId: number) => {
    const { data, error } = await getActivityTypeByIdAPI(
      {
        id: typeId,
        params: {
          'include[parent_type][select]': 'id,name',
          'include[types_results][include][activity_result][select]':
            'id,result',
          'include[activity_type_email_setting]': 'id,email_status',
        },
      },
      true
    );
    if (data && !error) {
      const activityResult = getDefaultActivityResult(data);
      setEditTimeActivityData({ ...data, activity_result: activityResult });
      if (data.icon_type === 'Default') {
        setIconType(data.icon);
      }
      if (data.icon_type === 'Custom') {
        setIconImage(data.icon);
      }
      reset({
        name: data?.name,
        parent_type: data?.parent_type_id || null,
        color: data?.color,
        is_system: !!(data?.is_system || data?.is_default),
        activity_result: { value: activityResult?.id, isCreatable: false },
        email_status: data?.activity_type_email_setting?.email_status,
      });
    }
  };

  const onFileSelect: React.ChangeEventHandler<HTMLInputElement> | undefined = (
    e
  ) => {
    const file = e.target.files?.[0];

    e.target.value = '';
    if (file && ALLOWED_MIME_TYPES.includes(file.type)) {
      if (file.size < 10 * 1024 * 1024) {
        clearErrors('icon');
        setIconImageName(file.name);
        setIconImage(file);
        setIconType('');
      } else {
        setError('icon', {
          type: 'custom',
          message: 'Please upload image less than 2MB',
        });
      }
    } else {
      setError('icon', {
        type: 'custom',
        message: 'Only PNG,JPEG,JPG are allowed',
      });
    }
  };

  const onSubmit = handleSubmit(async (value) => {
    if (setActivityTypeInfo) setActivityTypeInfo([]);
    if (iconType || iconImage) {
      clearErrors('icon');
      if (id) {
        updateActivityType(id, {
          ...value,
          icon: iconType || iconImage,
          icon_type: iconType ? 'Default' : 'Custom',
        });
      } else {
        addActivityPipeline({
          ...value,
          icon: iconType || iconImage,
          icon_type: iconType ? 'Default' : 'Custom',
        });
      }
    } else {
      setError('icon', {
        type: 'custom',
        message: 'Please select any icon or upload your custom image',
      });
    }
  });

  const addActivityPipeline = async (formVal: ActivityTypeFieldType) => {
    const activityTypeFormData = generateActivityTypeFormData(formVal);
    const data = await addActivityType({
      data: activityTypeFormData,
    });

    if ('data' in data && data.data) {
      // **begin: for timeline filter select all functionality ** //
      if (
        filterStateObj?.selectAllForActivityType?.[data.data?.parent_type_id]
          ?.isSelect
      ) {
        dispatch(
          setTimelineStateObjFilter({
            all_items: {
              ...filterStateObj,
              activityTypeIds: [
                ...filterStateObj.activityTypeIds,
                data.data.id,
              ],
            },
          })
        );
      }
      // **end: for timeline filter select all functionality ** //

      close();
      onAdd();
    }
  };

  const updateActivityType = async (
    typeId: number,
    formVal: ActivityTypeFieldType
  ) => {
    const activityTypeFormData = generateActivityTypeFormData(formVal);

    const data = await updateActivityTypeByIdAPI({
      id: typeId,
      data: activityTypeFormData,
    });
    if ('data' in data && data.data) {
      close();
      onAdd();
    }
  };

  const onCancelForm = () => {
    const isDirtyFields = Object.values(dirtyFields);
    if (isDirtyFields.length) {
      setOpenDiscardModal(true);
    } else {
      close();
    }
  };
  const close = () => {
    reset();
    closeModal();
  };

  return isOpen ? (
    <Modal
      title={`${id ? 'Update' : 'New'} Activity Type`}
      visible={isOpen}
      onClose={onCancelForm}
      onCancel={onCancelForm}
      onSubmit={onSubmit}
      submitButtonText={id ? 'Update' : 'Add'}
      submitLoading={updateActivityTypeLoading || addActivityTypeLoading}
      width="728px"
      contentClass="add__pipeline__modal"
    >
      {getActivityTypeLoading ? (
        <ActivityTypeFormSkeleton />
      ) : (
        <form onSubmit={onSubmit}>
          <ActivityTypeForm
            errors={errors}
            control={control}
            setValue={setValue}
            register={register}
            iconType={iconType}
            iconImage={iconImage}
            setIconType={setIconType}
            setIconImage={setIconImage}
            onFileSelect={onFileSelect}
            iconImageName={iconImageName}
            setIconImageName={setIconImageName}
            ActivityTypeData={editTimeActivityTypeData}
          />
        </form>
      )}
      {openDiscardModal ? (
        <DiscardConfirmationModal
          discardActivity={close}
          isOpen={openDiscardModal}
          closeModal={() => setOpenDiscardModal(false)}
        />
      ) : null}
    </Modal>
  ) : (
    <></>
  );
};

export default AddActivityTypeModal;
