// ** import Packages **
import { FieldErrors, UseFormRegister } from 'react-hook-form';

// ** Components **
import FormField from 'components/FormField';

// ** types **
import { phoneTypeFieldType } from '../types/phone-type.types';

// ** others **

interface PhoneTypeFormProps {
  errors: FieldErrors<phoneTypeFieldType>;
  register: UseFormRegister<phoneTypeFieldType>;
  isSystem?: boolean;
}

function PhoneTypeForm(props: PhoneTypeFormProps) {
  const { errors, register, isSystem } = props;

  return (
    <>
      <FormField<phoneTypeFieldType>
        required
        disabled={!!isSystem}
        placeholder="Pick a Phone type like 'Value Proportion'"
        type="text"
        label="Phone Type name"
        labelClass="if__label__blue"
        name="name"
        error={errors?.name}
        register={register}
        fieldLimit={25}
      />
    </>
  );
}

export default PhoneTypeForm;
