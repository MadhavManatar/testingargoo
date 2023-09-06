// ** Import Packages **
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { useSelector } from 'react-redux';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Components **
import Button from 'components/Button';
import Dropdown from 'components/Dropdown';
import Icon from 'components/Icon';
import AddEmailTemplateModal from '../emailComposer/AddEmailTemplateModal';
import ManageTemplateModal from '../emailTemplate/ManageTemplateModal';

// ** Services **
// import { useGetEmailTemplatesAPI } from 'pages/Email/services/emailTemplate.service';

// ** Hook **
import { useSetTemplateValueInEmailComposeById } from 'pages/Email/hooks/useMailTemplateHelper';

// ** Types **
import {
  EmailComposerFieldType,
  UploadResponseInMail,
} from 'pages/Email/types/email.type';
import {
  EmailTemplate,
  EmailTemplateVisibility,
} from 'pages/Email/types/emailTemplate.type';
// ** Other **
import { searchItemFromArray } from 'utils/util';
import { useLazyGetEmailTemplatesQuery } from 'redux/api/emailTemplateApi';

interface Props {
  setValue: UseFormSetValue<EmailComposerFieldType>;
  setUploadFileData: React.Dispatch<
    React.SetStateAction<UploadResponseInMail[]>
  >;
  setRunSetFieldValueScript?: React.Dispatch<React.SetStateAction<number>>;
}

export const ChooseTemplate = (props: Props) => {
  const { setValue, setUploadFileData, setRunSetFieldValueScript } = props;
  const user = useSelector(getCurrentUser);

  // ** states **
  const [search, setSearch] = useState('');
  const [manageTemplateModalOpen, setManageTemplateModalOpen] = useState(false);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [filteredEmailTemplates, setFilteredEmailTemplates] = useState<
    EmailTemplate[]
  >([]);
  const [editTemplateModal, setEditTemplateModal] = useState<{
    visible: boolean;
    id: number | null;
  }>({ visible: false, id: null });

  // ** Custom hooks **
  const [getEmailTemplatesAPI, { isLoading }] = useLazyGetEmailTemplatesQuery();

  // use this hook for set value edit time
  const { setTemplateValueInEmailComposeById } =
    useSetTemplateValueInEmailComposeById({
      setValue,
      setUploadFileData,
      setRunSetFieldValueScript,
    });

  useEffect(() => {
    getEmailTemplates();
  }, [manageTemplateModalOpen]);

  useEffect(() => {
    const searchData = searchItemFromArray(emailTemplates, search);
    setFilteredEmailTemplates(searchData);
  }, [search, emailTemplates]);

  const getEmailTemplates = async () => {
    const { data, error } = await getEmailTemplatesAPI(
      {
        params: {
          'q[or][0][created_by]': `${user?.id}`,
          'q[or][1][visibility]': EmailTemplateVisibility.PUBLIC,
          select: 'id,template_name,visibility,created_at,created_by',
        },
      },
      true
    );

    if (!error && _.isArray(data?.rows)) {
      setEmailTemplates(data?.rows);
      setFilteredEmailTemplates(data?.rows);
    }
  };

  const setTemplateOnClick = (templateId: number, close: { (): void }) => {
    close();
    setTemplateValueInEmailComposeById(templateId);
  };

  return (
    <>
      <Dropdown
        className="compose__mail__select__tippy emailTemplateCH__tippy"
        zIndex={10}
        content={({ close }) => (
          <div>
            <div className="ip__form__hasIcon">
              <input
                className="ip__input"
                placeholder="Search or Enter"
                onChange={(e) => setSearch(e.target.value)}
              />
              <Icon iconType="searchStrokeIcon" />
            </div>
            <div className="tippy__dropdown__ul min-w-0 py-0">
              {isLoading ? (
                <h1>Loading...</h1>
              ) : (
                filteredEmailTemplates.map((template, key) => {
                  const isEditable = template.created_by === user?.id;
                  return (
                    <div
                      className="item flex flex-wrap items-center !px-0 border-b border-b-black/[0.06] before:hidden"
                      key={key}
                    >
                      {template.visibility ===
                      EmailTemplateVisibility.PRIVATE ? (
                        <Icon
                          className="lock__icon w-[28px] h-[43px] cursor-pointer"
                          iconType="lockFilledIcon"
                          onClick={() => setTemplateOnClick(template.id, close)}
                        />
                      ) : (
                        <Icon
                          className="lock__icon w-[28px] h-[43px] cursor-pointer"
                          iconType="unlockFilledIcon"
                          onClick={() => setTemplateOnClick(template.id, close)}
                        />
                      )}

                      <span
                        onClick={() => setTemplateOnClick(template.id, close)}
                        className="text cursor-pointer h-[43px] text-[14px] inline-block leading-[43px] whitespace-pre overflow-hidden text-ellipsis text-ipBlack__textColor font-biotif__Medium whitespace-pre block w-[calc(100%_-_55px)] pl-[3px] pr-[7px]"
                      >
                        {template.template_name}
                      </span>
                      <Icon
                        onClick={() => {
                          if (isEditable) {
                            close();
                            setEditTemplateModal({
                              visible: true,
                              id: template.id,
                            });
                          }
                        }}
                        className={`edit__icon duration-500 hover:bg-ip__Grey__hoverDark rounded-[6px] p-[5px] w-[26px] h-[26px] relative top-[-1px] ${
                          isEditable
                            ? 'pointer-events-auto cursor-pointer'
                            : 'pointer-events-none opacity-50 cursor-not-allowed'
                        }`}
                        iconType="editFilled"
                      />
                    </div>
                  );
                })
              )}
            </div>
            <div className="flex items-center justify-center pt-[10px] sm:mb-[10px]">
              <Button
                className="primary__Btn"
                onClick={() => {
                  close();
                  setTimeout(() => {
                    setManageTemplateModalOpen(true);
                  }, 100);
                }}
              >
                Manage Email Template
              </Button>
            </div>
          </div>
        )}
      >
        <button
          className="compose__mail__select__dBtn mr-[10px] mb-[6px]"
          type="button"
        >
          Choose Template
        </button>
      </Dropdown>
      {manageTemplateModalOpen && (
        <ManageTemplateModal
          isOpen={manageTemplateModalOpen}
          closeModal={() => setManageTemplateModalOpen(false)}
        />
      )}
      {editTemplateModal.visible && (
        <AddEmailTemplateModal
          setEmailTemplates={setEmailTemplates}
          isOpen={editTemplateModal.visible}
          closeModal={() => setEditTemplateModal({ visible: false, id: null })}
          id={editTemplateModal.id}
        />
      )}
    </>
  );
};
