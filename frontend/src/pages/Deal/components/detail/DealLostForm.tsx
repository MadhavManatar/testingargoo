// ** external packages **
import { Fragment, useEffect, useState } from 'react';
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';

// ** components **
import FormField from 'components/FormField';

// ** services **

// ** types **
import {
  AddDealLostFormFieldsType,
  DealLostFieldType,
  DealLostFormObject,
} from 'pages/Deal/types/deals.types';
import { useGetReasonsOptions } from 'pages/Deal/hooks/useDealLostReasonService';

interface DealLostReasonFormProps {
  control: Control<AddDealLostFormFieldsType>;
  errors: FieldErrors<AddDealLostFormFieldsType>;
  register: UseFormRegister<AddDealLostFormFieldsType>;
  reset: UseFormReset<AddDealLostFormFieldsType>;
  setValue: UseFormSetValue<AddDealLostFormFieldsType>;
  displayField?: DealLostFieldType;
  watch: UseFormWatch<AddDealLostFormFieldsType>;
  isMemoAllowed: boolean;
}
const DealLostForm = (formProps: DealLostReasonFormProps) => {
  const { register, displayField, control, watch, isMemoAllowed, errors } =
    formProps;

  // ** states **
  const [isOther, setIsOther] = useState<boolean>(false);

  const watchReason = watch('reason');
  useEffect(() => {
    if (watchReason && watchReason === 'other') {
      setIsOther(true);
    } else {
      setIsOther(false);
    }
  }, [watchReason]);

  const { getReasonsOptions, isReasonsLoading } = useGetReasonsOptions();

  const formObject: DealLostFormObject = {
    information: {
      reason: (
        <>
          <div className="w-full">
            <FormField<AddDealLostFormFieldsType>
              required
              id="reason"
              placeholder="Select Reason"
              type="creatableAsyncSelect"
              name="reason"
              error={errors?.reason}
              label="Lost Reason"
              labelClass="if__label__blue"
              aria-placeholder="Select Account"
              control={control}
              getOptions={getReasonsOptions}
              isLoading={isReasonsLoading}
              menuPlacement="bottom"
            />
          </div>
        </>
      ),
      otherReason: (
        <>
          {isOther && (
            <div className="w-full">
              <FormField<AddDealLostFormFieldsType>
                type="text"
                name="otherReason"
                label="Other Reason"
                labelClass="if__label__blue"
                placeholder="Enter Reason"
                register={register}
                control={control}
                fieldLimit={50}
              />
            </div>
          )}
        </>
      ),
      comment: (
        <>
          {isMemoAllowed ? (
            <div className="w-full">
              <FormField<AddDealLostFormFieldsType>
                required
                type="textarea"
                name="comment"
                label="Memo"
                labelClass="if__label__blue"
                placeholder="Enter Reason"
                register={register}
                fieldLimit={500}
                control={control}
                error={errors.comment}
              />
            </div>
          ) : (
            <div className="w-full">
              <FormField<AddDealLostFormFieldsType>
                type="textarea"
                name="comment"
                label="Memo"
                labelClass="if__label__blue"
                placeholder="Enter Reason"
                register={register}
                fieldLimit={500}
                control={control}
              />
            </div>
          )}
        </>
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
    return renderFieldArray(value).map((el, index) => {
      if (el as keyof typeof temp) {
        return (
          <Fragment key={index}>{temp[el as keyof typeof temp]} </Fragment>
        );
      }
      return <></>;
    });
  };

  return renderFieldArray('information').length ? (
    <div className="">
      <div className="mx-[-10px] flex flex-wrap md:mx-0">
        {renderField('information')}
      </div>
    </div>
  ) : (
    <></>
  );
};

export default DealLostForm;
