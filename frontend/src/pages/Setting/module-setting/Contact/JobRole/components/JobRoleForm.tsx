// ** Components **
import FormField from 'components/FormField';

// ** types **
import {
  ContactTypeFormProps,
  contactTypeFieldType,
} from '../types/jobRole.types';

const ContactTypeForm = (props: ContactTypeFormProps) => {
  const { errors, register } = props;

  return (
    <FormField<contactTypeFieldType>
      required
      placeholder="Pick a name like 'Value Proportion'"
      type="text"
      label="Name"
      labelClass="if__label__blue"
      name="name"
      error={errors?.name}
      register={register}
      fieldLimit={25}
    />
  );
};

export default ContactTypeForm;
