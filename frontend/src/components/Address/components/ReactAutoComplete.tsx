import { REACT_APP_GOOGLE_MAP_API_KEY } from 'config';
import ReactGoogleAutocomplete from 'react-google-autocomplete';
import { Control, Controller, FieldError } from 'react-hook-form';
import { AddressFormFields } from '../types/address.types';
import { useEffect, useRef } from 'react';

interface Props {
  labelName: string;
  optionsTypes: string[];
  optionsFields: string[];
  handlePageSelected: (placeData: {
    place: any;
    fieldName: string;
  }) => Promise<string>;
  placeHolder: string;
  defaultValue?: string[];
  name: keyof AddressFormFields;
  control: Control<AddressFormFields, any>;
  error?: FieldError | undefined;
  isClearAddress?: boolean;
  handleClearAll?: () => void;
}

const ReactAutoComplete = (props: Props) => {
  const {
    defaultValue,
    handlePageSelected,
    labelName,
    optionsFields,
    optionsTypes,
    placeHolder,
    name,
    control,
    error,
    isClearAddress,
    handleClearAll,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.autocomplete = 'new-password';
      }
    }, 1000);
  }, [inputRef.current]);

  return (
    <div className="mx-[-10px] flex flex-wrap field__box__wrapper">
      <div className="w-1/2 px-[10px] sm:w-full field__box">
        <div className="form__Group undefined">
          <div className="flex justify-between">
            <label className="if__label if__label__blue">{labelName}</label>
            {isClearAddress ? (
              <span
                className="cursor-pointer inline-block text-[14px] font-biotif__Medium text-primaryColor hover:underline"
                onClick={() => {
                  if (inputRef.current) {
                    inputRef.current.value = '';
                  }
                  handleClearAll?.();
                }}
              >
                Clear Address
              </span>
            ) : null}
          </div>

          <div className="">
            <Controller
              name={name}
              control={control}
              defaultValue=""
              render={({ field: { onChange, value } }) => {
                if (inputRef.current) {
                  inputRef.current.value = value as string;
                }
                return (
                  <ReactGoogleAutocomplete
                    apiKey={REACT_APP_GOOGLE_MAP_API_KEY}
                    className="ip__input undefined"
                    options={{
                      types: optionsTypes,
                      fields: optionsFields,
                    }}
                    ref={inputRef}
                    placeholder={placeHolder}
                    libraries={['places']}
                    defaultValue={defaultValue}
                    onPlaceSelected={async (place) => {
                      const val = await handlePageSelected({
                        place,
                        fieldName: name,
                      });
                      if (inputRef.current) {
                        onChange(val);
                      }
                    }}
                  />
                );
              }}
            />
          </div>
          {error && <p className="ip__Error">{error.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default ReactAutoComplete;
