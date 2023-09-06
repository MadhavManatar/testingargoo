// ** Components **
import FormField from 'components/FormField';

// ** Import Types **
import { FieldErrors, UseFormRegister } from 'react-hook-form';

// ** types **
import { LeadDealSourceFieldType } from '../types/lead-deal-source.types';

interface LeadDealSourceFormProps {
  errors: FieldErrors<LeadDealSourceFieldType>;
  register: UseFormRegister<LeadDealSourceFieldType>;
}

function LeadDealSourceForm(props: LeadDealSourceFormProps) {
  const { errors, register } = props;
  return (
    <div className="">
      <FormField
        required
        name="name"
        type="text"
        autoFocus
        fieldLimit={100}
        register={register}
        error={errors?.name}
        placeholder="Enter Source"
        label="Source Name"
        labelClass="if__label__blue"
      />
    </div>
  );
}

export default LeadDealSourceForm;
