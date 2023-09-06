// ** Import Packages **
import { addMinutes, format } from 'date-fns';
import { useEffect, useState } from 'react';
import {
  Control,
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormResetField,
  UseFormSetError,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

// ** Components **
import FormField from 'components/FormField';
import Modal from 'components/Modal';
import CustomScheduled from './CustomScheduled';

// ** Type **
import { bulkMailChildModalType } from 'pages/Contact/types/contacts.types';
import { EmailComposerFieldType } from 'pages/Email/types/email.type';

// ** Constants **
import { SCHEDULE_TIME } from 'constant';

// ** Util **
import { dateToMilliseconds } from 'utils/util';

interface Props {
  isOpen: boolean;
  setValue: UseFormSetValue<EmailComposerFieldType>;
  setError: UseFormSetError<EmailComposerFieldType>;
  watch: UseFormWatch<EmailComposerFieldType>;
  resetField: UseFormResetField<EmailComposerFieldType>;
  clearErrors: UseFormClearErrors<EmailComposerFieldType>;
  errors: FieldErrors<EmailComposerFieldType>;
  onSubmit: () => void;
  closeModal: () => void;
  isLoading: boolean;
  control: Control<EmailComposerFieldType>;
  register: UseFormRegister<EmailComposerFieldType>;
  setOpenModal?: React.Dispatch<React.SetStateAction<bulkMailChildModalType>>;
  editEmail?: {
    emailId: number;
    conversionId: number;
    schedule_time: string;
  };
  editScheduleTime?: Date;
  scheduledMailName: string;
  setScheduledMailName: React.Dispatch<React.SetStateAction<string>>;
}

const ScheduleMailModal = (props: Props) => {
  const {
    isOpen,
    clearErrors,
    closeModal,
    setValue,
    onSubmit,
    setError,
    isLoading,
    control,
    register,
    watch,
    errors,
    resetField,
    setOpenModal,
    editEmail,
    editScheduleTime,
    scheduledMailName,
    setScheduledMailName,
  } = props;
  const [isCustomDate, setIsCustomDate] = useState(false);

  useEffect(() => {
    return () => {
      resetField('schedule_time');
      resetField('schedule_date');
      resetField('scheduled_after', undefined);
    };
  }, []);

  const onClose = () => {
    closeModal();
    setValue('scheduled_after', undefined);
  };
  return isOpen ? (
    <Modal
      modalWrapperClass="schedule__send__modal"
      title="Schedule Send"
      visible={isOpen}
      onCancel={onClose}
      onClose={onClose}
      width={isCustomDate ? '490px' : '436px'}
      submitLoading={isLoading}
      submitBtnDisabled={
        !watch('scheduled_after') || Boolean(Object.keys(errors).length)
      }
      submitButtonText={
        editEmail?.emailId ? 'Edit Schedule Send' : 'Schedule Send'
      }
      onSubmit={() => {
        const scheduleTime = watch('scheduled_after');
        if (scheduleTime && scheduleTime < 240000) {
          setError('schedule_time', {
            message: `Please scheduled on ${format(
              addMinutes(new Date(), 5),
              'hh:mm aa'
            )} or later`,
          });
        } else if (setOpenModal) {
          setOpenModal({ confirmationModal: true, scheduleModal: false });
        } else {
          onSubmit();
        }
      }}
    >
      <form onSubmit={onSubmit}>
        {isCustomDate ? (
          <CustomScheduled
            editScheduleTime={editScheduleTime}
            clearErrors={clearErrors}
            setError={setError}
            setValue={setValue}
            control={control}
            register={register}
            watch={watch}
            errors={errors}
          />
        ) : (
          <>
            <h3 className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[15px]">
              Schedule Send after
            </h3>
            <div className="schedule__send__checkbox">
              {SCHEDULE_TIME.map((schedule, index) => (
                <div
                  key={index}
                  className="flex flex-wrap items-center justify-between mb-[8px]"
                >
                  <FormField
                    wrapperClass="mb-[5px] pr-[10px]"
                    type="checkbox"
                    name={schedule.name}
                    onChange={() => {
                      setScheduledMailName(schedule.name);
                      setValue(
                        'scheduled_after',
                        dateToMilliseconds({ endDate: schedule.value })
                      );
                    }}
                    value={dateToMilliseconds({ endDate: schedule.value })}
                    checked={schedule.name === scheduledMailName}
                    label={schedule.title}
                  />
                  {schedule.subTitle && (
                    <span className="inline-block text-[16px] font-biotif__Regular text-light__TextColor mb-[5px]">
                      {schedule.subTitle}
                    </span>
                  )}
                </div>
              ))}
              <div className="ip__Checkbox primary__field relative">
                <input
                  type="checkbox"
                  className="ip__Radio"
                  onChange={(event) =>
                    event?.target && setIsCustomDate(event.target.checked)
                  }
                />
                <label className="rc__Label">Custom Date & Time</label>
              </div>
            </div>
          </>
        )}
      </form>
    </Modal>
  ) : (
    <></>
  );
};

export default ScheduleMailModal;
