// ** external packages **
import { UseFormSetValue, useFormContext, useWatch } from 'react-hook-form';
import { useEffect } from 'react';

// ** components **
import FormField from 'components/FormField';
import { isSingleValue } from 'components/FormField/helper';
import StateOptionComponent from './components/StateOptionComponent';
import SingleValueComponent from 'pages/Contact/components/SingleValueComponent';
import AddressField from './components/AddressField';
import ReactAutoComplete from './components/ReactAutoComplete';
import CountryOptionComponent from './components/CountryOptionComponent';

// ** types **
import { AddressFormFields } from './types/address.types';
import { AddContactFormFieldsType } from 'pages/Contact/types/contacts.types';
import { AddAccountFormFieldsType } from 'pages/Account/types/account.types';
import { Option } from 'components/FormField/types/formField.types';

// ** services **
import {
  useGetCountriesOption,
  useGetStatesOption,
  useHandleDataSelected,
} from './hooks/useAddressService';
import { useLazyGetTimezoneQuery } from 'redux/api/timezoneApi';

interface Props {
  setContactValue?: UseFormSetValue<AddContactFormFieldsType> | undefined;
  setDefaultTimezone?: React.Dispatch<React.SetStateAction<Option>>;
  setTimezoneLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  setAccountValue?: UseFormSetValue<AddAccountFormFieldsType>;
  setAddressOptions:
    | React.Dispatch<
        React.SetStateAction<{
          state: Option;
          country: Option;
        }>
      >
    | undefined;
  addressOptions?: {
    state: Option;
    country: Option;
  };
}

const Address = ({
  setContactValue,
  setDefaultTimezone,
  setTimezoneLoading,
  setAccountValue,
  setAddressOptions,
  addressOptions,
}: Props) => {
  // ** hooks **
  const methods = useFormContext<AddressFormFields>();
  const {
    setValue,
    control,
    register,
    formState: { errors },
    watch,
  } = methods;

  // ** custom hooks **
  const useWatchData = useWatch({
    control,
  });

  const { address1, zip } = useWatchData;
  const watchCountry = useWatchData.country_id;
  const watchState = useWatchData.state_id;

  // ** APIS **
  const [getTimeZoneAPI] = useLazyGetTimezoneQuery();

  const getTimeZoneByLatLng = async ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => {
    if (latitude && longitude) {
      setTimezoneLoading?.(true);
      const data = await getTimeZoneAPI(
        {
          params: {
            latitude,
            longitude,
          },
        },
        true
      );

      setTimezoneLoading?.(false);

      if ('data' in data) {
        setContactValue?.('timezone', data?.data.zoneName);
        setAccountValue?.('timezone', data?.data.zoneName);
        setDefaultTimezone?.({
          label: data?.data.zoneName,
          value: data?.data.zoneName,
        });
      }
    }
  };

  const { handlePageSelected } = useHandleDataSelected({
    setValue,
    getTimeZoneByLatLng,
    setAddressOptions,
  });

  const { getCountries, isLoading: isCountriesLoading } =
    useGetCountriesOption();
  const { getStates, isLoading: isStatesLoading } = useGetStatesOption({
    watchCountry,
  });

  useEffect(() => {
    setValue('country_id', (addressOptions?.country?.value as number) || null);
    setValue('state_id', (addressOptions?.state?.value as number) || null);
  }, [addressOptions]);

  return (
    <>
      <AddressField
        setValue={setValue}
        address1={address1}
        control={control}
        handlePageSelected={handlePageSelected}
      />

      <div
        key={`${watchCountry}-${watchState}`}
        className="mx-[-10px] flex flex-wrap field__box__wrapper country__select__box"
      >
        <div className="w-1/2 px-[10px] sm:w-full field__box ">
          <FormField<AddressFormFields>
            key={watch('country_id')}
            label="Country"
            placeholder="Select Country"
            type="asyncSelect"
            name="country_id"
            labelClass="if__label__blue"
            control={control}
            isLoading={isCountriesLoading}
            getOptions={getCountries}
            isInputValuePrevent
            menuPlacement="auto"
            menuPosition="fixed"
            defaultOptions={[
              addressOptions?.country
                ? addressOptions?.country
                : {
                    label: '',
                    value: '',
                  },
            ]}
            OptionComponent={CountryOptionComponent}
            singleValueComponent={SingleValueComponent}
            getOnChange={(e) => {
              if (isSingleValue(e)) {
                setAddressOptions?.({
                  country: {
                    label: e?.label || '',
                    value: e?.value || 0,
                  },
                  state: {
                    label: '',
                    value: '',
                  },
                });
                setValue('state_id', null);
                getTimeZoneByLatLng({
                  latitude: e?.extraLabel?.split(',')?.[0]
                    ? Number(e?.extraLabel?.split(',')?.[0])
                    : 0,
                  longitude: e?.extraLabel?.split(',')?.[1]
                    ? Number(e?.extraLabel?.split(',')?.[1])
                    : 0,
                });
              }
            }}
            serveSideSearch
            isClearable
          />{' '}
        </div>
        <div className="w-1/2 px-[10px] sm:w-full field__box">
          <FormField<AddressFormFields>
            id="state_id"
            key={watch('state_id')}
            label="State"
            placeholder="Select State"
            type="asyncSelect"
            name="state_id"
            labelClass="if__label__blue"
            isLoading={isStatesLoading}
            control={control}
            getOptions={getStates}
            menuPlacement="auto"
            menuPosition="fixed"
            defaultOptions={[
              addressOptions?.state
                ? addressOptions?.state
                : {
                    label: '',
                    value: '',
                  },
            ]}
            OptionComponent={StateOptionComponent}
            singleValueComponent={SingleValueComponent}
            getOnChange={(e) => {
              if (isSingleValue(e)) {
                setAddressOptions?.((prev) => ({
                  ...prev,
                  state: {
                    label: e?.label || '',
                    value: e?.value || '',
                  },
                }));
                getTimeZoneByLatLng({
                  latitude: e?.extraLabel?.split(',')?.[0]
                    ? Number(e?.extraLabel?.split(',')?.[0])
                    : 0,
                  longitude: e?.extraLabel?.split(',')?.[1]
                    ? Number(e?.extraLabel?.split(',')?.[1])
                    : 0,
                });
              }
            }}
            serveSideSearch
            isClearable
          />{' '}
        </div>
      </div>
      <div className="mx-[-10px] flex flex-wrap field__box__wrapper">
        <div className="w-1/2 px-[10px] sm:w-full field__box">
          <FormField<AddressFormFields>
            type="text"
            name="city"
            label="City"
            autoComplete="new-password"
            labelClass="if__label__blue"
            placeholder="Enter Your City Name"
            register={register}
            fieldLimit={60}
          />
        </div>

        <div className="w-1/2 px-[10px] sm:w-full field__box zipCode__wrapper">
          <FormField<AddressFormFields>
            type="text"
            name="county"
            label="County"
            autoComplete="new-password"
            labelClass="if__label__blue"
            placeholder="Enter Your County Name"
            register={register}
            fieldLimit={60}
          />
        </div>
      </div>

      <div className="mx-[-10px] flex flex-wrap field__box__wrapper">
        <div className="w-1/2 px-[10px] sm:w-full field__box zipCode__wrapper">
          <ReactAutoComplete
            handlePageSelected={handlePageSelected}
            labelName="Zip Code"
            optionsFields={[
              'address_components',
              'formatted_address',
              'geometry',
              'name',
            ]}
            control={control}
            name="zip"
            defaultValue={[zip || '']}
            optionsTypes={['postal_code']}
            placeHolder="Enter Your Zip Code"
            error={errors.zip}
          />
        </div>
      </div>
    </>
  );
};

export default Address;
