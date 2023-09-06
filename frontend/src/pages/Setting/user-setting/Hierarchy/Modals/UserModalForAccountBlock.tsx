import Modal from 'components/Modal';
import { useGetUsers } from '../../User/hooks/useUserService';
import NoDataFound from 'components/EntityDetails/Timeline/components/NoDataFound';
import { useEffect } from 'react';

interface Props {
  isOpen: true;
  close: () => void;
  watchUser: number | null;
  onSubmit: () => void;
  handleOnChange: (value: number) => void;
}

const UserModalForAccountBlock = (props: Props) => {
  const { isOpen, close, watchUser, handleOnChange, onSubmit } = props;

  const { users, isLoading, getUsers } = useGetUsers();

  useEffect(() => {
    getUsers({
      page: 1,
      select: 'id,first_name,last_name,profile_image',
      limit: 10000,
    });
  }, []);

  return (
    <>
      <Modal
        title="Add User"
        visible={isOpen}
        onClose={() => close()}
        onCancel={() => close()}
        submitButtonText="Save"
        onSubmit={() => onSubmit()}
        width="437px"
        saveButtonText="Save"
        submitLoading={isLoading}
        saveButtonDisabled={false}
        modalWrapperClass="hierarchy-add-user-modal ip__Modal__Wrapper__new"
      >
        {users ? (
          <div className="filter-accordian-body">
            <div className="flex items-start">
              {users?.length === 0 ? (
                <>
                  <NoDataFound />
                </>
              ) : (
                <>
                  <div className="custom__round__radio__btn flex flex-wrap justify-between">
                    {users?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="ip__Radio w-[calc(50%_-_8px)] mb-[7px] last:mb-0"
                        >
                          <input
                            id={item?.id.toString()}
                            type="radio"
                            onChange={(e) => {
                              handleOnChange(Number(e?.target?.value));
                            }}
                            checked={item?.id === watchUser}
                            value={item?.id}
                          />
                          <span className="rc__Label">{item?.first_name}</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
};

export default UserModalForAccountBlock;
