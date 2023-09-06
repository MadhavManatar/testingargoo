// ** Import Packages **
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

// ** Redux **
import { setLoadDetails } from 'redux/slices/commonSlice';
import {
  QuickEntry,
  SetQuickPopupAction,
  getQuickPopup,
  setQuickPopup,
} from 'redux/slices/quickPopupDefaultSlice';
import store from 'redux/store';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import DuplicateFieldWarningModal from 'components/Modal/DuplicateFieldWarningModal/DuplicateFieldWarningModal';
import RouteChangeConformationModal from 'components/Modal/RouteChangeConformationModal';
import EditContactSkeleton from '../skeleton/EditContactSkeleton';
import ContactForm from './ContactForm';

// ** Types **
import { DuplicateFieldModalType } from 'components/Modal/DuplicateFieldWarningModal/types/index.types';
import { AddContactFormFieldsType } from '../types/contacts.types';

// ** Services **
import { useGetContactDetails } from '../hooks/useContactService';

// ** Schema **
import { contactSchema } from '../validation-schema/contacts.schema';

// ** Constant **
import {
  ALLOWED_MIME_TYPES,
  BREAD_CRUMB,
  NAME_BADGE_COLOR_COMBINATIONS,
} from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

//  ** Others **
import { convertNumberOrNull, setUrlParams } from 'utils/util';
import {
  generateContactFormData,
  setRelatedAccount,
  setRelatedContact,
} from '../helper/contacts.helper';
import {
  useAddContactMutation,
  useUpdateContactMutation,
} from 'redux/api/contactApi';

interface Props {
  contactId?: number | null | undefined;
  onAdd?: (data?: any) => void;
  closeModal?: () => void;
  isQuickModal?: boolean;
  modalName?: string;
}

const AddEditContact = (props: Props) => {
  // ** Hooks **
  const navigate = useNavigate();
  const location = useLocation();
  const isEditContactRoute = location.pathname.includes('contacts/edit/');
  let { contactId: id } = props;
  const { onAdd, closeModal, isQuickModal, modalName } = props;
  // ** hooks **
  if (!id && isEditContactRoute && !isQuickModal) {
    const { id: conId } = useParams();
    id = convertNumberOrNull(conId);
  }
  // const params = useParams();
  // const id = convertNumberOrNull(params.id);
  const [searchParams] = useSearchParams();
  const queryPopup = searchParams?.get('quickPopup');
  const [isDuplicateAccount, setIsDuplicateAccount] =
    useState<DuplicateFieldModalType>({
      isOpen: false,
      data: null,
    });

  // ** APIS **
  const [addContactAPI, { isLoading: addLoading }] = useAddContactMutation();

  const [updateContactAPI, { isLoading }] = useUpdateContactMutation();

  // ** Store **
  const dispatch = useDispatch();
  const selectorQuick = useSelector(getQuickPopup);
  const { auth } = store.getState();
  const { user } = auth;

  // ** states ** //
  const [duplicateMailModal, setDuplicateMailModal] =
    useState<DuplicateFieldModalType>({
      isOpen: false,
      data: null,
    });
  const [customIsDirty, setCustomIsDirty] = useState<boolean>(true);
  const [openEmailModal, setOpenEmailModal] = useState<{
    isOpen: boolean;
    email_val: string;
    indexVal?: number;
    contactValues?: AddContactFormFieldsType;
  }>({
    email_val: '',
    isOpen: false,
  });
  const [profileImg, setProfileImg] = useState<string | File>('');
  const [timezoneLoading, setTimezoneLoading] = useState(false);
  const { contactData, isLoading: isContactLoading } = useGetContactDetails({
    id,
  });

  const {
    contact_owner_id,
    name,
    emails,
    phones,
    related_accounts,
    department,
    birth_date,
    skype,
    address1,
    address2,
    city,
    country,
    state,
    zip,
    description,
    timezone,
    job_role,
    twitter,
    contact_image,
    reporting_to_contact,
    county,
  } = contactData.contact;

  const formMethods = useForm<AddContactFormFieldsType>({
    defaultValues: {
      contact_owner_id,
      name,
      emails,
      phones,
      related_accounts,
      department,
      birth_date,
      skype,
      address1,
      address2,
      city,
      country_id: country?.id,
      state_id: state?.id,
      zip,
      description,
      timezone,
      job_role,
      twitter,
      contact_image,
    },
    mode: 'onChange',
    resolver: yupResolver(contactSchema),
  });

  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    clearErrors,
    setError,
  } = formMethods;

  // ** Custom Hooks **
  const [isDisableKeyDownEvent, setDisableKeyDownEvent] =
    useState<boolean>(false);

  // ** Default Value ** //
  let accountId: number | string = '';
  let contactId: number | string = '';
  let jobRole: string | undefined = '';

  if (selectorQuick && queryPopup) {
    accountId = Number(selectorQuick.account?.id) || '';
    contactId = Number(selectorQuick.contact?.id) || '';
    jobRole = selectorQuick?.contact?.jobRole || '';
  }

  useEffect(() => {
    if ((id && contactData?.contact?.id) || id === undefined) {
      const related_account = contactData?.contact?.related_accounts?.[0] || [];
      // ** Store Contact in the Redux for quick Popup default Value
      const state_data: SetQuickPopupAction = {
        entity: QuickEntry.CONTACT,
        data: {
          id: contactData?.contact.id,
          name: contactData?.contact.name,
          jobRole: related_account?.job_role || contactData?.contact.job_role,
        },
      };
      dispatch(setQuickPopup(state_data));
      // ** Store Account in the Redux for quick Popup default Value
      const state_data_account: SetQuickPopupAction = {
        entity: QuickEntry.ACCOUNT,
        data: {
          id: related_account?.account?.id,
          name: related_account?.account?.name,
          jobRole: related_account?.job_role,
        },
      };
      dispatch(setQuickPopup(state_data_account));
      // ** Store Lead in the Redux for quick Popup default Value
      const state_data_lead: SetQuickPopupAction = {
        entity: QuickEntry.LEAD,
        data: {
          id: '',
          name: '',
          jobRole: '',
        },
      };
      dispatch(setQuickPopup(state_data_lead));
      // ** Store Deal in the Redux for quick Popup default Value
      const state_data_deal: SetQuickPopupAction = {
        entity: QuickEntry.DEAL,
        data: {
          id: '',
          name: '',
          jobRole: '',
        },
      };
      dispatch(setQuickPopup(state_data_deal));

      reset({
        contact_owner_id: contact_owner_id || user?.id || undefined,
        name: name || '',
        emails:
          emails && emails.length > 0
            ? emails.map((val) => {
                return {
                  ...val,
                  value: val.value,
                  is_from_edit: true,
                };
              })
            : [{ is_primary: true, value: '' }] || '',
        phones:
          phones.length > 0
            ? (phones || []).map((item) => {
                return {
                  is_primary: item.is_primary,
                  phoneType: item?.phoneType || null,
                  value: item.value,
                };
              })
            : [{ is_primary: true, phoneType: null, value: '' }] || '',
        related_accounts: (contactData.contact.related_accounts || []).length
          ? setRelatedAccount(contactData.contact)
          : [{ job_role: '', account_id: accountId || '', is_primary: true }],
        department: department || '',
        reporting_to: reporting_to_contact ? `${reporting_to_contact.id}` : '',
        birth_date: birth_date || '',
        skype: skype || '',
        address1: address1 || '',
        address2: address2 || '',
        country_id: country?.id || 233,
        city,
        state_id: country?.id ? state?.id || 0 : 1436,
        zip: zip || '',
        timezone: timezone || 'America/New_York' || '',
        description: description || '',
        job_role: job_role || '',
        twitter: twitter || '',
        contact_image: contact_image || '',
        county,
        related_contacts: setRelatedContact(
          contactData.contact || [{ job_role: jobRole, contact_id: contactId }]
        ),
      });
    }
  }, [contactData]);

  const onFileSelect: React.ChangeEventHandler<HTMLInputElement> | undefined = (
    e
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file && ALLOWED_MIME_TYPES.includes(file.type)) {
      if (file.size < 10 * 1024 * 1024) {
        clearErrors('contact_image');
        setProfileImg(file);
      } else {
        setError('contact_image', {
          type: 'custom',
          message: 'Please upload image less than 10MB',
        });
      }
    } else {
      setError('contact_image', {
        type: 'custom',
        message: 'Only PNG,JPEG,JPG are allowed',
      });
    }
  };

  const onCancelForm = () => {
    navigate(-1);
  };

  const onSubmit = handleSubmit(async (values) => {
    // we are set setCustomIsDirty to false cause after submit DirtyField value is always true
    setCustomIsDirty(false);

    if (id) {
      const primaryEmail = (values.emails || []).find(
        (item) => item.is_primary
      )?.value;
      const initialEmailVal = (emails || []).find(
        (item) => item.is_primary
      )?.value;

      if (!primaryEmail && initialEmailVal) {
        setOpenEmailModal({
          email_val: initialEmailVal || '',
          isOpen: true,
          indexVal: 0,
          contactValues: values,
        });
      } else {
        updateContact({ ...values, contact_image: profileImg });
      }
    } else {
      const contactFormData = generateContactFormData({
        ...values,
        contact_image: profileImg,
        initial_color: NAME_BADGE_COLOR_COMBINATIONS[
            Math.floor(Math.random() * NAME_BADGE_COLOR_COMBINATIONS.length)
          ]?.Color,
      });
      const data = await addContactAPI({ data: contactFormData });
      if ('data' in data && !('error' in data)) {
        if (closeModal) {
          closeModal();
          if (onAdd) {
            onAdd(data);
          }
        } else {
          navigate(
            setUrlParams(PRIVATE_NAVIGATION.contacts.detailPage, data.data.id)
          );
        }
      }
    }
  });

  const reloadModalDetails = () => {
    dispatch(
      setLoadDetails({
        loadModuleDetails: {
          leads: modalName === 'leads',
          accounts: modalName === 'accounts',
          contacts: modalName === 'contacts',
          deals: modalName === 'deals',
          activity: modalName === 'activities',
        },
      })
    );
  };

  const updateContact = async (values: AddContactFormFieldsType) => {
    const contactFormData = generateContactFormData(
      values,
      'edit',
      contactData.contact
    );

    const data = await updateContactAPI({
      id: id || 0,
      data: contactFormData,
      params: { toast: false },
    });

    if ('data' in data && !('error' in data)) {
      if (closeModal) {
        reloadModalDetails();
        closeModal();
        if (onAdd) {
          onAdd(data);
        }
      } else {
        navigate(
          setUrlParams(
            PRIVATE_NAVIGATION.contacts.detailPage,
            data?.data[1][0].id
          )
        );
      }
    }
  };

  const onCloseWarningModal = () => {
    setDuplicateMailModal({ isOpen: false, data: null });
    if (duplicateMailModal?.data?.field === 'name') {
      setValue('name', '');
    }

    if (
      duplicateMailModal?.data?.field === 'email' &&
      setValue &&
      emails.length
    ) {
      const filteredMail = emails?.map((mail) => ({
        ...mail,
        value: mail.value === duplicateMailModal?.data?.value ? '' : mail.value,
      }));
      setValue('emails', filteredMail);
    }
  };

  return (
    <>
      <>
        <Breadcrumbs
          path={id ? BREAD_CRUMB.editContact : BREAD_CRUMB.addContact}
        />

        <div>
          {isContactLoading || (!contactData?.contact?.id && id) ? (
            <EditContactSkeleton />
          ) : (
            <div className="ipTabsWrapper">
              <div className="ipTabs">
                <div className="ipTabsContantWrapper">
                  <div className="fixed__wrapper__contactEdit ip__FancyScroll">
                    <FormProvider {...formMethods}>
                      <form
                        {...(isDisableKeyDownEvent && {
                          onKeyDown: (event) => {
                            event.preventDefault();
                          },
                        })}
                      >
                        <ContactForm
                          editFormFlag
                          watch={watch}
                          errors={errors}
                          control={control}
                          register={register}
                          setValue={setValue}
                          profileImg={profileImg}
                          onFileSelect={onFileSelect}
                          setProfileImg={setProfileImg}
                          updateContact={updateContact}
                          openEmailModal={openEmailModal}
                          timezoneLoading={timezoneLoading}
                          contactData={contactData?.contact}
                          setOpenEmailModal={setOpenEmailModal}
                          setTimezoneLoading={setTimezoneLoading}
                          setDisableKeyDownEvent={setDisableKeyDownEvent}
                          isDuplicateAccount={isDuplicateAccount}
                          setIsDuplicateAccount={setIsDuplicateAccount}
                        />
                      </form>
                    </FormProvider>
                  </div>
                  <div className="action__fixed__btn__contactEdit flex flex-wrap">
                    <Button
                      className="cancel__btn secondary__Btn mr-[7px] min-w-[120px] sm:min-w-[calc(50%_-_7px)]"
                      onClick={() => {
                        if (closeModal) {
                          closeModal();
                        } else {
                          onCancelForm();
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={onSubmit}
                      className="save__btn primary__Btn min-w-[120px] py-[11px] ml-[7px] sm:min-w-[calc(50%_-_7px)]"
                      type="button"
                      isLoading={isLoading || addLoading}
                      isDisabled={timezoneLoading}
                    >
                      {id ? 'Update' : 'Create'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>

      <RouteChangeConformationModal
        isDirtyCondition={
          Object.values(dirtyFields)?.length > 0 && customIsDirty
        }
      />
      {duplicateMailModal.isOpen && (
        <DuplicateFieldWarningModal
          isOpen
          data={duplicateMailModal.data}
          closeModal={() => onCloseWarningModal()}
        />
      )}
    </>
  );
};

export default AddEditContact;
