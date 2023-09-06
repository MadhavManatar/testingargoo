// ** external packages **
import { Fragment } from 'react';
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
} from 'react-hook-form';

// ** components **
import FormField from 'components/FormField';

// ** types **
import {
  AddDealLostReasonFormFieldsType,
  DealLostReasonFieldType,
  DealLostReasonFormObject,
} from '../types/lostReason.types';

//  ** constants **

interface DealLostReasonFormProps {
  control: Control<AddDealLostReasonFormFieldsType>;
  errors: FieldErrors<AddDealLostReasonFormFieldsType>;
  register: UseFormRegister<AddDealLostReasonFormFieldsType>;
  reset: UseFormReset<AddDealLostReasonFormFieldsType>;
  setValue: UseFormSetValue<AddDealLostReasonFormFieldsType>;
  displayField?: DealLostReasonFieldType;
}
const DealLostReasonForm = (formProps: DealLostReasonFormProps) => {
  const { errors, register, displayField, control } = formProps;

  const formObject: DealLostReasonFormObject = {
    information: {
      reason: (
        <div className="px-[10px] w-full sm:w-full">
          <FormField<AddDealLostReasonFormFieldsType>
            required
            type="text"
            name="reason"
            label="Reason"
            labelClass="if__label__blue"
            placeholder="Enter Reason"
            register={register}
            error={errors?.reason}
            control={control}
          />
        </div>
      ),
    },
  };

  const renderFieldArray = (value: keyof typeof formObject) => {
    const tempDisplay = displayField?.[value] || [];
    const temp = formObject[value];
    return Object.keys(temp).filter(
      (el) =>
        !displayField?.[value] || tempDisplay.includes(el as keyof typeof temp)
    );
  };

  const renderField = (value: keyof typeof formObject) => {
    const temp = formObject[value];
    return (
      <>
        {renderFieldArray(value).map((el, index) => {
          if (el as keyof typeof temp) {
            return (
              <Fragment key={index}>{temp[el as keyof typeof temp]} </Fragment>
            );
          }
          return <></>;
        })}
      </>
    );
  };

  return (
    <>
      {renderFieldArray('information').length ? (
        <div className="">
          <div className="mx-[-10px] flex flex-wrap">
            {renderField('information')}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default DealLostReasonForm;
