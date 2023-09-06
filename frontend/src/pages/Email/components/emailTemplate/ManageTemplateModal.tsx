// ** Import Packages **
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Components **
import Button from 'components/Button';
import DateFormat from 'components/DateFormat';
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import AddEmailTemplateModal from '../emailComposer/AddEmailTemplateModal';
import VisibilityDropDown from './VisibilityDropDown';

// ** types **
import {
  EmailTemplate,
  EmailTemplateVisibility,
} from 'pages/Email/types/emailTemplate.type';

// ** Util **
import { searchItemFromArray } from 'utils/util';
import { useDeleteEmailTemplatesMutation, useLazyGetEmailTemplatesQuery, useUpdateEmailVisibilityMutation } from 'redux/api/emailTemplateApi';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
}

const ManageTemplateModal = (props: Props) => {
  const { closeModal, isOpen } = props;
  const user = useSelector(getCurrentUser);
  // ** states **
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [filteredEmailTemplates, setFilteredEmailTemplates] = useState<
    EmailTemplate[]
  >([]);
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const [openModal, setOpenModal] = useState<{
    delete: boolean;
    id: null | number;
  }>({ delete: false, id: null });
  const [visibility, setVisibility] = useState<EmailTemplateVisibility>();
  const [editTemplateModal, setEditTemplateModal] = useState<{
    visible: boolean;
    id: number | null;
  }>({ visible: false, id: null });

  // ** Custom hooks **
  const [ getEmailTemplatesAPI, {isLoading }] = useLazyGetEmailTemplatesQuery();
  const [ deleteEmailTemplatesAPI, {isLoading: deleteLoading }] =
    useDeleteEmailTemplatesMutation();

  const [ updateEmailTemplateVisibilityAPI ] = useUpdateEmailVisibilityMutation();

  useEffect(() => {
    getEmailTemplates();
  }, []);

  useEffect(() => {
    const searchData = searchItemFromArray(emailTemplates, search);
    setFilteredEmailTemplates(searchData);
  }, [search, emailTemplates]);

  const getEmailTemplates = async () => {
    const { data, error } = await getEmailTemplatesAPI({
      params: {
        'q[or][0][created_by]': `${user?.id}`,
        'q[or][1][visibility]': EmailTemplateVisibility.PUBLIC,
        select: 'id,template_name,visibility,created_at,created_by',
      },
    },true);

    if (!error && _.isArray(data?.rows)) {
      setEmailTemplates(data?.rows);
    }
  };

  const deleteTemplates = async () => {
    const  data = await deleteEmailTemplatesAPI({
      data: { allId: openModal.id ? [openModal.id] : selectedRows },
    });
    if ('data' in data) {
      setEmailTemplates((pre) =>
        pre.filter(
          (obj) =>
            !(openModal.id ? [openModal.id] : selectedRows).includes(obj.id)
        )
      );
      if (!openModal.id) {
        setSelectedRows([]);
      }
      setOpenModal((pre) => ({ ...pre, delete: false, id: null }));
    }
  };

  const handleCheck = ({
    checked,
    id,
    checkedAll,
  }: {
    checked?: boolean;
    id?: number;
    checkedAll?: boolean;
  }) => {
    if (checkedAll === true) {
      const selectedList: number[] = [];
      emailTemplates.forEach((obj) => {
        if (obj.created_by === user?.id) {
          selectedList.push(obj.id);
        }
      });
      setSelectedRows([...selectedList]);
    } else if (checkedAll === false) {
      setSelectedRows([]);
    } else if (checked && id) {
      setSelectedRows((pre) => [...pre, id]);
    } else {
      setSelectedRows((pre) => pre.filter((value) => value !== id));
    }
  };

  const handleVisibility = async (visibilityArgs: EmailTemplateVisibility) => {
    setVisibility(visibilityArgs);

    setEmailTemplates((pre) =>
      pre.map((obj) =>
        selectedRows.includes(obj.id)
          ? { ...obj, visibility: visibilityArgs }
          : { ...obj }
      )
    );
  };

  const onSubmit = async () => {
    if (selectedRows.length) {
      const  error  = await updateEmailTemplateVisibilityAPI(
        {
          data:{
              ids: selectedRows,
              visibility,
            
          }
        }
      );
      if (!error) {
        closeModal();
      }
    }
  };

  return (
    <>
      <Modal
        modalWrapperClass="new__messageEmail__modal"
        onClose={() => closeModal()}
        onCancel={() => closeModal()}
        title="Manage Template"
        onSubmit={onSubmit}
        width="730px"
        cancelButtonText="Close"
        submitButtonText="Save"
        visible={isOpen}
        submitBtnDisabled={selectedRows.length <= 0}
      >
        <div className="form__Group mb-0">
          <div className="flex flex-wrap search__box mb-[25px] sm:mb-[15px]">
            <div className="ip__form__hasIcon w-full">
              <input
                type="text"
                className="ip__input"
                placeholder="Search here..."
                maxLength={50}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Icon className="i__Icon grayscale" iconType="searchStrokeIcon" />
            </div>
            <div className="flex flex-wrap items-center justify-between mt-[10px] w-full">
              <div className="w-[calc(100%_-_102px)] flex flex-wrap items-center sm:w-full sm:justify-between">
                <Button
                  className="primary__Btn rounded-[10px] mr-[12px] mb-[10px] h-[42px] sm:mr-0 sm:w-full"
                  onClick={() =>
                    setEditTemplateModal({ visible: true, id: null })
                  }
                >
                  Add Email Template
                </Button>
                <div className="inline-flex sm:hidden">
                  {selectedRows.length > 0 && (
                    <VisibilityDropDown
                      visibility={visibility}
                      handleVisibility={handleVisibility}
                    />
                  )}
                </div>
              </div>
              <div className="inline-flex sm:w-full mobile__wrapper">
                <div className="hidden sm:block sm:mr-[5px] sm:w-[calc(50%_-_5px)]">
                  {selectedRows.length > 0 && (
                    <VisibilityDropDown
                      visibility={visibility}
                      handleVisibility={handleVisibility}
                    />
                  )}
                </div>
                {selectedRows.length > 0 && (
                  <Button
                    className="delete__Btn rounded-[10px] mb-[10px] sm:ml-[5px] sm:w-[calc(50%_-_5px)]"
                    onClick={() =>
                      setOpenModal((pre) => ({ ...pre, delete: true }))
                    }
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="new__message__listing__table bg-[#ECF2F6] rounded-[10px] p-[15px] pb-[7px]">
            <div className="nmlt__head bg-ipWhite__bgColor rounded-[10px]">
              <div className="nmlt__row flex flex-wrap items-center py-[10px]">
                <div className="nmlt__cell input__cell px-[12px] flex items-center justify-center w-[42px]">
                  <input
                    className="w-[17px] h-[17px] relative top-[-2px] accent-primaryColor"
                    type="checkbox"
                    checked={
                      (selectedRows.length === emailTemplates.length &&
                        emailTemplates.length !== 0) ||
                      (selectedRows.length > 0 &&
                        emailTemplates.filter(
                          (obj) => obj.created_by === user?.id
                        )?.length === selectedRows.length)
                    }
                    onChange={(e) =>
                      handleCheck({ checkedAll: e.target.checked })
                    }
                  />
                </div>
                <div className="nmlt__cell name__cell w-[calc(100%_-_153px)]">
                  <p className="text-[16px] text-ipBlack__textColor font-biotif__Regular">
                    Name
                  </p>
                </div>
                <div className="nmlt__cell time__cell w-[110px] flex items-center pr-[12px] md:pr-0">
                  <p className="text-[16px] text-ipBlack__textColor font-biotif__Regular">
                    Created on
                  </p>
                </div>
              </div>
            </div>
            <div className="nmlt__body pt-[7px]">
              {isLoading ? (
                <>
                  <div className="nmlt__row flex flex-wrap items-center py-[10px] border-b border-b-black/5 pointer-events-auto cursor-pointer">
                    <div className="nmlt__cell input__cell px-[12px] flex items-center justify-center w-[42px]">
                      <div className="skeletonBox w-[17px] h-[17px] rounded-[5px]" />
                    </div>
                    <div className="nmlt__cell name__cell w-[calc(100%_-_153px)] flex flex-wrap items-center pr-[10px] sm:w-[calc(100%_-_126px)]">
                      <div className="skeletonBox w-[90%]" />
                    </div>
                    <div className="nmlt__cell time__cell w-[110px] flex items-center pr-[12px] md:pr-0 sm:w-[82px] sm:justify-between">
                      <div className="skeletonBox w-[calc(100%_-_36px)] mr-[10px]" />
                      <div className="skeletonBox w-[25px] h-[25px] rounded-[5px]" />
                    </div>
                  </div>
                  <div className="nmlt__row flex flex-wrap items-center py-[10px] border-b border-b-black/5 pointer-events-auto cursor-pointer">
                    <div className="nmlt__cell input__cell px-[12px] flex items-center justify-center w-[42px]">
                      <div className="skeletonBox w-[17px] h-[17px] rounded-[5px]" />
                    </div>
                    <div className="nmlt__cell name__cell w-[calc(100%_-_153px)] flex flex-wrap items-center pr-[10px] sm:w-[calc(100%_-_126px)]">
                      <div className="skeletonBox w-[90%]" />
                    </div>
                    <div className="nmlt__cell time__cell w-[110px] flex items-center pr-[12px] md:pr-0 sm:w-[82px] sm:justify-between">
                      <div className="skeletonBox w-[calc(100%_-_36px)] mr-[10px]" />
                      <div className="skeletonBox w-[25px] h-[25px] rounded-[5px]" />
                    </div>
                  </div>
                  <div className="nmlt__row flex flex-wrap items-center py-[10px] border-b border-b-black/5 pointer-events-auto cursor-pointer">
                    <div className="nmlt__cell input__cell px-[12px] flex items-center justify-center w-[42px]">
                      <div className="skeletonBox w-[17px] h-[17px] rounded-[5px]" />
                    </div>
                    <div className="nmlt__cell name__cell w-[calc(100%_-_153px)] flex flex-wrap items-center pr-[10px] sm:w-[calc(100%_-_126px)]">
                      <div className="skeletonBox w-[90%]" />
                    </div>
                    <div className="nmlt__cell time__cell w-[110px] flex items-center pr-[12px] md:pr-0 sm:w-[82px] sm:justify-between">
                      <div className="skeletonBox w-[calc(100%_-_36px)] mr-[10px]" />
                      <div className="skeletonBox w-[25px] h-[25px] rounded-[5px]" />
                    </div>
                  </div>
                  <div className="nmlt__row flex flex-wrap items-center py-[10px] border-b border-b-black/5 pointer-events-auto cursor-pointer">
                    <div className="nmlt__cell input__cell px-[12px] flex items-center justify-center w-[42px]">
                      <div className="skeletonBox w-[17px] h-[17px] rounded-[5px]" />
                    </div>
                    <div className="nmlt__cell name__cell w-[calc(100%_-_153px)] flex flex-wrap items-center pr-[10px] sm:w-[calc(100%_-_126px)]">
                      <div className="skeletonBox w-[90%]" />
                    </div>
                    <div className="nmlt__cell time__cell w-[110px] flex items-center pr-[12px] md:pr-0 sm:w-[82px] sm:justify-between">
                      <div className="skeletonBox w-[calc(100%_-_36px)] mr-[10px]" />
                      <div className="skeletonBox w-[25px] h-[25px] rounded-[5px]" />
                    </div>
                  </div>
                  <div className="nmlt__row flex flex-wrap items-center py-[10px] border-b border-b-black/5 pointer-events-auto cursor-pointer">
                    <div className="nmlt__cell input__cell px-[12px] flex items-center justify-center w-[42px]">
                      <div className="skeletonBox w-[17px] h-[17px] rounded-[5px]" />
                    </div>
                    <div className="nmlt__cell name__cell w-[calc(100%_-_153px)] flex flex-wrap items-center pr-[10px] sm:w-[calc(100%_-_126px)]">
                      <div className="skeletonBox w-[90%]" />
                    </div>
                    <div className="nmlt__cell time__cell w-[110px] flex items-center pr-[12px] md:pr-0 sm:w-[82px] sm:justify-between">
                      <div className="skeletonBox w-[calc(100%_-_36px)] mr-[10px]" />
                      <div className="skeletonBox w-[25px] h-[25px] rounded-[5px]" />
                    </div>
                  </div>
                  <div className="nmlt__row flex flex-wrap items-center py-[10px] border-b border-b-black/5 pointer-events-auto cursor-pointer">
                    <div className="nmlt__cell input__cell px-[12px] flex items-center justify-center w-[42px]">
                      <div className="skeletonBox w-[17px] h-[17px] rounded-[5px]" />
                    </div>
                    <div className="nmlt__cell name__cell w-[calc(100%_-_153px)] flex flex-wrap items-center pr-[10px] sm:w-[calc(100%_-_126px)]">
                      <div className="skeletonBox w-[90%]" />
                    </div>
                    <div className="nmlt__cell time__cell w-[110px] flex items-center pr-[12px] md:pr-0 sm:w-[82px] sm:justify-between">
                      <div className="skeletonBox w-[calc(100%_-_36px)] mr-[10px]" />
                      <div className="skeletonBox w-[25px] h-[25px] rounded-[5px]" />
                    </div>
                  </div>
                  <div className="nmlt__row flex flex-wrap items-center py-[10px] border-b border-b-black/5 pointer-events-auto cursor-pointer">
                    <div className="nmlt__cell input__cell px-[12px] flex items-center justify-center w-[42px]">
                      <div className="skeletonBox w-[17px] h-[17px] rounded-[5px]" />
                    </div>
                    <div className="nmlt__cell name__cell w-[calc(100%_-_153px)] flex flex-wrap items-center pr-[10px] sm:w-[calc(100%_-_126px)]">
                      <div className="skeletonBox w-[90%]" />
                    </div>
                    <div className="nmlt__cell time__cell w-[110px] flex items-center pr-[12px] md:pr-0 sm:w-[82px] sm:justify-between">
                      <div className="skeletonBox w-[calc(100%_-_36px)] mr-[10px]" />
                      <div className="skeletonBox w-[25px] h-[25px] rounded-[5px]" />
                    </div>
                  </div>
                </>
              ) : (
                <></>
              )}
              {filteredEmailTemplates.map((template, key) => {
                const isEditable = template.created_by === user?.id;
                return (
                  <div
                    onClick={() => {
                      if (isEditable) {
                        setEditTemplateModal({
                          visible: true,
                          id: template.id,
                        });
                      }
                    }}
                    className={`nmlt__row flex flex-wrap items-center py-[10px] border-b border-b-black/5 ${
                      isEditable
                        ? 'pointer-events-auto cursor-pointer'
                        : 'pointer-events-none opacity-50'
                    }`}
                    key={key}
                  >
                    <div className="nmlt__cell input__cell px-[12px] flex items-center justify-center w-[42px]">
                      <input
                        className="w-[17px] h-[17px] relative top-[-2px] accent-primaryColor"
                        type="checkbox"
                        onChange={(e) =>
                          handleCheck({
                            checked: e.target.checked,
                            id: template.id,
                          })
                        }
                        onClick={(e) => e.stopPropagation()}
                        checked={selectedRows.includes(template.id)}
                      />
                    </div>
                    <div className="nmlt__cell name__cell w-[calc(100%_-_153px)] flex flex-wrap items-center pr-[10px] sm:w-[calc(100%_-_126px)]">
                      {template.visibility ===
                      EmailTemplateVisibility.PUBLIC ? (
                        <Icon
                          className="lock__icon w-[28px] h-[28px] relative top-[-2px]"
                          iconType="unlockFilledIcon"
                        />
                      ) : (
                        <Icon
                          className="lock__icon w-[28px] h-[28px] relative top-[-2px]"
                          iconType="lockFilledIcon"
                        />
                      )}
                      <p className="w-[calc(100%_-_30px)] pl-[2px] text-[16px] text-ipBlack__textColor font-biotif__Regular whitespace-pre overflow-hidden text-ellipsis">
                        {template.template_name}
                      </p>
                    </div>
                    <div className="nmlt__cell time__cell w-[110px] flex items-center pr-[12px] md:pr-0 sm:w-[82px] sm:justify-between">
                      <div className="time text-[16px] text-ipBlack__textColor font-biotif__Regular pr-[20px] sm:pr-[10px]">
                        <DateFormat date={template.created_at} format="HH:mm" />
                      </div>
                      <Icon
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenModal((pre) => ({
                            ...pre,
                            delete: true,
                            id: template.id,
                          }));
                        }}
                        className="delete__btn"
                        iconType="deleteFilled"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
      {editTemplateModal.visible && (
        <AddEmailTemplateModal
          setEmailTemplates={setEmailTemplates}
          isOpen={editTemplateModal.visible}
          closeModal={() => {
            setEditTemplateModal({ visible: false, id: null });
            setSelectedRows([]);
          }}
          id={editTemplateModal.id}
        />
      )}
      {openModal.delete && (
        <DeleteModal
          closeModal={() =>
            setOpenModal((pre) => ({ ...pre, delete: false, id: null }))
          }
          isOpen={openModal.delete}
          isLoading={deleteLoading}
          deleteOnSubmit={() => deleteTemplates()}
          moduleName={
            selectedRows.length > 1 ? 'these templates' : 'this template'
          }
        />
      )}
    </>
  );
};

export default ManageTemplateModal;
