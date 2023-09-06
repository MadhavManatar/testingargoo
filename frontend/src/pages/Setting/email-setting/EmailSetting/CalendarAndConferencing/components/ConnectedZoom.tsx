// ** external packages **
import { useEffect, useState } from 'react';

// ** components **

import Icon from 'components/Icon';

// ** types **
import { TokenProvider, UserToken } from '../../types/userToken.type';
import AlertModal from 'components/Modal/AlertModal';

// ** services **
import { useDeleteUserTokenAPI } from 'services/userToken.service';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser } from 'redux/slices/authSlice';
import { setZoomAccountDetails } from 'redux/slices/commonSlice';

interface PropsInterface {
  usersTokens: UserToken | null;
  getLoggedIUserTokens: () => Promise<void>;
}

const ConnectedZoom = (props: PropsInterface) => {
  const { usersTokens, getLoggedIUserTokens } = props;

  // ** states **
  const [openDeleteModal, setOpenDeleteModal] = useState<{
    delete: boolean;
    id: number | null;
    provider: TokenProvider | null;
    usernames: string | null;
  }>({
    delete: false,
    id: null,
    provider: null,
    usernames: null,
  });

  const currentUser = useSelector(getCurrentUser);
  const organization = currentUser?.organization;

  const dispatch = useDispatch();

  // ** Custom Hooks **

  const { deleteUserTokenByIdAPI, isLoading: deleteLoading } =
    useDeleteUserTokenAPI();

  const closeDeleteModal = () => {
    setOpenDeleteModal({
      delete: false,
      id: null,
      provider: null,
      usernames: null,
    });
  };

  useEffect(() => {
    dispatch(setZoomAccountDetails(usersTokens ?? undefined));
  }, [usersTokens]);

  const deleteUserToken = async () => {
    if (openDeleteModal.id) {
      const { error } = await deleteUserTokenByIdAPI(openDeleteModal.id, {
        params: {
          organization_id: organization?.organization_id,
          user_id: organization?.user_id,
          mail_provider: openDeleteModal.provider,
          email: openDeleteModal.usernames,
        },
      });
      if (!error) {
        dispatch(setZoomAccountDetails(undefined));
        getLoggedIUserTokens();
        closeDeleteModal();
      }
    }
  };

  return (
    <>
      {usersTokens && (
        <div className="">
          <div className="connectedEmail__box mb-[25px]">
            <div className="inner__box">
              <div className="header flex flex-wrap items-center pb-[20px] border-b border-b-whiteScreen__BorderColor">
                <div className="left w-[calc(100%_-_232px)] flex flex-wrap items-center">
                  <img
                    className="inline-block w-[32px] mr-[15px]"
                    src="/images/zoom.svg"
                    alt=""
                  />
                  <h4>Zoom Meeting</h4>
                  <p className="w-[calc(100%_-_48px)] text-[18px] font-biotif__Medium text-mediumDark__TextColor break-words">
                    {usersTokens.token_provider_mail}
                  </p>
                </div>
                <div className="right inline-flex items-center">
                  <button
                    className="delete__btn"
                    onClick={() => {
                      setOpenDeleteModal({
                        delete: true,
                        id: usersTokens.id,
                        provider: usersTokens.token_provider,
                        usernames: usersTokens.token_provider_mail,
                      });
                      localStorage.removeItem('isDefaultCall');
                    }}
                  >
                    <Icon iconType="deleteFilled" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertModal
        title="Remove Provider"
        visible={openDeleteModal.delete}
        onClose={closeDeleteModal}
        onCancel={closeDeleteModal}
        onSubmit={() => deleteUserToken()}
        submitLoading={deleteLoading}
        width="800px"
        submitButtonText="Delete"
        submitButtonClass="delete__Btn"
      >
        <h5 className="confirmation__title">
          Are you sure you want to remove this provider?
        </h5>
      </AlertModal>
    </>
  );
};

export default ConnectedZoom;
