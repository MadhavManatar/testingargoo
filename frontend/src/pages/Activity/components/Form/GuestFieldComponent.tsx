// ** import packages ** //
import { Children, Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormSetError,
  UseFormReset,
  UseFormGetValues,
} from 'react-hook-form';

// ** types  ** //
import {
  activityGuestsType,
  AddActivityFormFields,
  ContactGuestEmailsType,
  ModalProps,
} from 'pages/Activity/types/activity.types';

// ** constant ** //
import FormField from 'components/FormField';
import { Option } from 'components/FormField/types/formField.types';
import { useGetActivityContactGuestsOptions } from 'pages/Activity/hooks/useActivityService';
import GuestContactOption from 'pages/Contact/components/GuestContactOption';
import { isValidEmail } from 'utils/util';
import { TLDs } from 'global-tld-list';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';

type GuestFiledProps = {
  setError: UseFormSetError<AddActivityFormFields>;
  clearErrors: UseFormClearErrors<AddActivityFormFields>;
  errors: FieldErrors<AddActivityFormFields>;
  guestEmails: activityGuestsType[];
  setGuestsEmails: Dispatch<SetStateAction<activityGuestsType[]>>;
  contactGuestEmails: ContactGuestEmailsType;
  setContactGuestsEmails: Dispatch<SetStateAction<ContactGuestEmailsType>>;
  control: Control<AddActivityFormFields, any>;
  openModal?: ModalProps;
  reset: UseFormReset<AddActivityFormFields>;
  getValues: UseFormGetValues<AddActivityFormFields>;
};

export const GuestFieldComponent = (props: GuestFiledProps) => {
  const {
    clearErrors,
    setError,
    errors,
    contactGuestEmails,
    guestEmails,
    setContactGuestsEmails,
    setGuestsEmails,
    openModal,
    control,
    reset,
    getValues,
  } = props;


  const globalEmailTestValidate = (v: string | null | undefined) => {
    const tld = (v || '').split('.').slice(-1)[0];
    const isValidTLDs = TLDs.indexOf(tld) >= 0;

    if (!isValidTLDs) {
      return false;
    }
    return true;
  };

  const validateEmail = (email: string) => {
    return globalEmailTestValidate(email);
  };
  const { getContactGuestsOptions, isGuestContactsLoading } =
    useGetActivityContactGuestsOptions();


  const [refreshGuests, setRefreshGuests] = useState<boolean>(false);

  const autoCompleteChange = (args: Option[]) => {
    if (args && args.length) {
      const data: Option = args[args.length - 1];
      clearErrors('guests');
      if (data?.value && data?.id) {
        setContactGuests(data);
      } else if (!data?.id && data?.value) {
        setGuests(data);
      }
    }
  };

  const setContactGuests = (data: any) => {
    const isExist = contactGuestEmails.find(
      (val) => val.participant_emails[0] === data.email
    );
    if (!isExist) {
      setContactGuestsEmails((prev) => [
        ...prev,
        {
          participant_emails: [data.email],
          participant_id: data.id,
          participant_name: data.name,
          participant_type: 'contact',
        },
      ]);
      clearValue();
    } else {
      clearValue(`${data?.email} has already been added`);
    }
  };

  const clearValue = (msg?: string) => {
    setTimeout(() => {
      setRefreshGuests((prev) => !prev);
      reset({
        ...getValues(),
        guests: [],
      });
      if (msg) {
        setError('guests', {
          message: msg,
          type: 'custom',
        });
      }
    }, 0);
  };

  const setGuests = (data: any) => {
    if (!guestEmails.find((e: activityGuestsType) => e.email === data?.value)) {
      if (validateEmail(data?.value)) {
        setGuestsEmails((prev) => [
          ...prev,
          {
            email: data?.value,
            is_confirm: false,
            meeting_status: 'no',
          },
        ]);
        clearValue();
      } else {
        clearValue('Please enter valid email');
      }
    } else {
      clearValue(`${data?.value} has already been added`);
    }
  };

  useEffect(() => {
    clearValue();
  }, [guestEmails]);

  return (
    <>
      <div className="form__external__wrapper mb-[20px]">
        <label className="if__label if__label__blue flex flex-wrap">
          <IconAnimation
            iconType="userProfileFilledIcon"
            animationIconType={IconTypeJson.Guest}
            className="mr-[5px]"
            iconClassName="icon__wrapper mr-[5px] w-[30px] h-[30px] p-[1px] shrink-0 top-[-3px]"
          />
          Guests
        </label>
        <FormField<AddActivityFormFields>
          key={`${refreshGuests}`}
          id="guests"
          placeholder="Enter Guest Email"
          type="creatableAsyncSelect"
          isMulti
          name="guests"
          serveSideSearch
          control={control}
          getOptions={getContactGuestsOptions}
          isLoading={isGuestContactsLoading}
          menuPosition="absolute"
          defaultOptions={[]}
          getOnChange={(val: any) => autoCompleteChange(val)}
          menuPlacement="auto"
          isClearable={false}
          autoFocus={openModal?.editScroll}
          OptionComponent={GuestContactOption}
          isValidNewOption={isValidEmail}
        />
        {errors.guests && <p className="ip__Error">{errors.guests.message}</p>}
      </div>
      <div className="flex flex-wrap mb-[20px]">
        <div>
          {Children.toArray(
            guestEmails.map((val) => {
              return (
                <div className="badge square__round primary__badge mr-[8px] mb-[6px] lg:text-[12px] lg:px-[12px]">
                  {val.email}
                  <button
                    className="close__btn w-[12px] h-[12px] ml-[5px]"
                    onClick={() =>
                      setGuestsEmails((prev) =>
                        prev.filter((mail) => mail.email !== val.email)
                      )
                    }
                    type="button"
                  >
                    .
                  </button>
                </div>
              );
            })
          )}
        </div>
        {contactGuestEmails.length > 0 &&
          contactGuestEmails.filter((v) => v.participant_emails.length).length >
          0 && (
            <div className="mb-[10px]">
              {Children.toArray(
                contactGuestEmails.map((val) => {
                  return (
                    <div className="badge square__round primary__badge mr-[8px] mb-[6px] lg:text-[12px] lg:px-[12px]">
                      {val.participant_emails[0] || ''}
                      <button
                        className="close__btn w-[12px] h-[12px] ml-[5px]"
                        onClick={() =>
                          setContactGuestsEmails((prev) =>
                            prev.filter(
                              (mail) =>
                                mail.participant_emails[0] !==
                                val.participant_emails[0]
                            )
                          )
                        }
                        type="button"
                      >
                        .
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          )}
      </div>
    </>
  );
};
