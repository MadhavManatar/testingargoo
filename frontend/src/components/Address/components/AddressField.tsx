import { AddressFormFields } from '../types/address.types';
import { Control, UseFormSetValue } from 'react-hook-form';

import ReactAutoComplete from './ReactAutoComplete';

interface Props {
  setValue: UseFormSetValue<AddressFormFields>;

  address1: string | undefined;
  control: Control<AddressFormFields, any>;
  handlePageSelected: (placeData: {
    place: any;
    fieldName: string;
  }) => Promise<string>;
}

const AddressField = (props: Props) => {
  const { setValue, address1, control, handlePageSelected } = props;

  const labelName = 'Address Line 1';
  const optionsTypes: string[] = [];
  const optionsFields = [
    'address_components',
    'formatted_address',
    'geometry',
    'name',
  ];
  const placeHolder = 'Enter Your Address Line 1';
  const defaultValue = address1 ? [address1] : [''];

  const handleClearAll = () => {
    setValue('address1', '');
    setValue('city', '');
    setValue('country_id', null);
    setValue('state_id', null);
    setValue('zip', '');
    setValue('county', '');
  };

  return (
    <ReactAutoComplete
      labelName={labelName}
      name="address1"
      optionsTypes={optionsTypes}
      optionsFields={optionsFields}
      handlePageSelected={handlePageSelected}
      placeHolder={placeHolder}
      defaultValue={defaultValue}
      control={control}
      isClearAddress
      handleClearAll={handleClearAll}
    />
  );
};

export default AddressField;
