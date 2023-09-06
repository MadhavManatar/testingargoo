// ** Import Packages **

// ** Components **

import Icon from 'components/Icon';
import AddUserModel from './AddStreamUserModal';
import Modal from 'components/Modal';

// ** Form Components **
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { streamSchema } from 'pages/Streams/validation-schema/streams.schema';

// ** Hooks **
import { useEffect, useState } from 'react';
import {
  useAddStreamAPI,
  useEditStreamAPI,
} from 'pages/Streams/hooks/stream.service';

// ** Constants **
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

// ** types ** //
import FormField from 'components/FormField';
import {
  AddStreamModelPropsType,
  UserDataType,
  UserIds,
  streamFormFieldsType,
} from 'pages/Streams/types/stream.type';
import {
  getStreamListViewState,
  setStreamList,
} from 'redux/slices/stream.Slice';
import { useLazyGetUsersQuery } from 'redux/api/userApi';

const AddStreamModel = (props: AddStreamModelPropsType) => {
  // ** Props **
  const {
    streamData,
    setSubmit,
    setEditStream,
    getStreamsData,
    setAddStreamModal,
    addStreamModal,
    setIsEdit,
  } = props;

  // ** Hooks **
  const dispatch = useDispatch();

  const { addStreamAPi, isLoading } = useAddStreamAPI();
  const { editStreamAPI } = useEditStreamAPI();
  const formMethods = useForm<streamFormFieldsType>({
    resolver: yupResolver(streamSchema),
  });
  const getStreamView = useSelector(getStreamListViewState);

  // ** States **
  const [userData, setUserData] = useState<UserDataType>();
  const [userIdArray, pushIdIntoUserArray] = useState<string[]>([]);
  const [streamName, setStreamName] = useState<string>();
  const [getUsersAPI] = useLazyGetUsersQuery();
  const [isSelectUserVisible, setIsSelectUserVisible] =
    useState<boolean>(false);

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = formMethods;

  // ** UseEffect **

  // Get user details
  useEffect(() => {
    getUserList();
  }, []);

  // set Data at edit time

  useEffect(() => {
    if (streamData?.streamUser?.length) {
      setValue('name', streamData?.name);
      pushIdIntoUserArray(
        streamData?.streamUser.map((user) => user?.users?.id.toString())
      );
      setStreamName(streamData?.name);
    }
  }, [streamData?.streamUser]);

  // ** Functions & Event Handler **
  const getUserList = async () => {
    const { data } = await getUsersAPI({
      data: {
        query: {
          limit: 100000,
          page: 1,
          select: 'id,first_name,last_name,full_name',
        },
      },
    });
    setUserData(data);
  };

  const onUserSubmit = () => {
    setIsSelectUserVisible(false);
    onSubmit([{ new: userIdArray || [], old: [], deleted: [] }]);
  };
  const onNameSubmit = handleSubmit(async (value) => {
    setStreamName(value.name);
    setIsSelectUserVisible(true);
  });
  const onSubmit = async (value: UserIds) => {
    let payload;
    if (setIsEdit) setIsEdit(true);
    if (streamData?.id) {
      const oldUserId = streamData?.streamUser.map((user) =>
        user?.users?.id.toString()
      );
      if (streamData?.streamUser?.length && value) {
        const newUserId = value[0]?.new
          ?.slice()
          ?.filter((index) => !oldUserId?.find((val) => val === index))
          ?.map((val: string) => val);
        const deletedUserIds = oldUserId
          ?.slice()
          ?.filter((index) => !value[0]?.new?.find((val) => val === index))
          ?.map((val: string) => val);
        payload = {
          userIds: [
            {
              new: newUserId || [],
              old: oldUserId || [],
              deleted: deletedUserIds || [],
            },
          ],
          name: streamName,
        };
        await editStreamAPI(streamData.id, payload);
      } else {
        await editStreamAPI(streamData.id, value);
      }
      setSubmit(true);
      close();
    } else {
      const { data } = await addStreamAPi({ userIds: value, name: streamName });
      if (data) {

        const streamId = data?.result?.[0]?.stream_id;
        const users: any = [];
        const userId: string[] = [];
        const finalData = _.cloneDeep(getStreamView.sortStream.streamData);
        finalData?.[0]?.streamUser?.forEach((element) => {
          userId.push(element?.user_id?.toString());
          users.push(element.users);
        });

        const streamUser = _.cloneDeep(data.userData);
        streamUser?.forEach((element: any) => {
          const user = userData?.rows.find(
            (item) => item.id === element.user_id
          );
          if (user) {
            element.users = user;
          }
        });

        if (streamId && streamName && streamUser?.length)
          finalData.push({
            name: streamName,
            id: streamId,
            streamUser,
          });

        dispatch(
          setStreamList({
            sortStream: {
              streamData: finalData,
              selectedUserIs: {
                [streamId]: [],
              },
            },
            tab: { label: streamName || '', id: streamId },
            userIds: [finalData?.[0]?.streamUser[0]?.user_id?.toString()],
            userData: {
              rows: users,
              count: users?.length,
            },
          })
        );
        setSubmit(true);
        close();
      }
    }
  };
  const close = () => {
    if (setIsEdit && streamData?.id) setIsEdit(true);
    if (setEditStream) setEditStream(undefined);
    if (setAddStreamModal) setAddStreamModal(false);
    if (getStreamsData) getStreamsData();
  };

  return (
    <>
      <FormProvider {...formMethods}>
        <form>
          <Modal
            title={streamData?.id ? 'Edit Stream' : 'Add Stream'}
            visible={addStreamModal}
            onClose={() => close()}
            onCancel={() => close()}
            submitButtonText="Continue"
            onSubmit={onNameSubmit}
            submitLoading={isLoading}
            width="440px"
            saveButtonText="Save and Mark Done"
            saveButtonDisabled={false}
            modalWrapperClass="ip__Modal__Wrapper__new"
          >
            <div className="new__form__elements__design">
              <FormField<streamFormFieldsType>
                wrapperClass="mb-0"
                required
                type="text"
                name="name"
                isSearchable
                label="Name"
                labelClass="if__label__blue"
                placeholder="Enter Name"
                register={register}
                control={control}
                errors={errors}
                error={errors.name}
                fieldLimit={50}
                autoFocus
              />
            </div>
            <div className="action-btn mr-[4px] hidden">
              <Icon
                iconType="plusFilledBlueIcon"
                onClick={() => setIsSelectUserVisible(true)}
              />
            </div>
          </Modal>
          {isSelectUserVisible && userData ? (
            <>
              <AddUserModel
                isSelectUserVisible={isSelectUserVisible}
                setIsSelectUserVisible={setIsSelectUserVisible}
                onSubmit={onUserSubmit}
                userData={userData}
                pushIdIntoUserArray={pushIdIntoUserArray}
                userIdArray={userIdArray}
                setIsVisible={setAddStreamModal}
              />
            </>
          ) : null}
        </form>
      </FormProvider>
    </>
  );
};
export default AddStreamModel;
