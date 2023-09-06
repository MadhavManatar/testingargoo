// ** external packages **
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

// ** components **
import Address from 'components/Address';
import Button from 'components/Button';
import FileUpload from 'components/FileUpload';
import DiscardConfirmationModal from 'components/Modal/DiscardConfirmationModal';
import CompanyBasicDetails from 'pages/Setting/general-setting/CompanyDetails/components/CompanyBasicDetails';

// ** types **
import { CompanySettingsFormFields } from 'pages/Setting/general-setting/CompanyDetails/types/company-settings.types';
import { Option } from 'components/FormField/types/formField.types';

// ** others **
import { ALLOWED_MIME_TYPES } from 'constant';
import { companySettingsSchema } from 'pages/Setting/general-setting/CompanyDetails/validation-schema/company-settings.schema';
import { useNavigate } from 'react-router-dom';
import { isInt } from 'utils/util';

interface Props {
  submitForm: (data: CompanySettingsFormFields) => void;
  initialValue: CompanySettingsFormFields;
  cancelForm: () => void;
  isLoading: boolean;
}

const CompanyDetailsForm = ({
  submitForm,
  initialValue,
  cancelForm,
  isLoading,
}: Props) => {
  // ** Hooks **
  const navigate = useNavigate();

  // ** state **
  const [companyLogo, setCompanyLogo] = useState<string | File>();
  const [addressOptions, setAddressOptions] = useState<{
    state: Option;
    country: Option;
  }>({
    country: {
      label: 'United States',
      value: 233,
    },
    state: {
      label: 'FL',
      value: 1436,
    },
  });

  // ** custom hooks **
  const formMethods = useForm<CompanySettingsFormFields>({
    resolver: yupResolver(companySettingsSchema),
  });

  // ** states **
  const [openDiscardModal, setOpenDiscardModal] = useState<boolean>(false);

  const {
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, dirtyFields },
  } = formMethods;

  useEffect(() => {
    const {
      address1,
      address2,
      city,
      county,
      country_id,
      email,
      mobile,
      name,
      organization_category,
      organization_logo,
      phone,
      state_id,
      website,
      zip,
      country,
      state,
    } = initialValue;

    const state_code = isInt(Number(state?.state_code))
      ? `${country?.iso2 || ''}-${state?.state_code}`
      : state?.state_code || '';

    setAddressOptions({
      country: {
        label: country?.name || 'United States',
        value: country?.id || 233,
      },
      state: {
        label: state_code || 'FL',
        value: state?.id || 1436,
      },
    });

    reset({
      address1: address1 || '',
      address2: address2 || '',
      city,
      country_id,
      state_id,
      county: county || '',
      email: email || '',
      mobile: mobile || '',
      name: name || '',
      organization_category: organization_category || '',
      organization_logo: organization_logo || '',
      phone: phone || '',
      website: website || '',
      zip: zip || '',
    });
  }, [initialValue]);

  useEffect(() => {
    if (initialValue?.organization_logo)
      setCompanyLogo(initialValue?.organization_logo);
  }, [initialValue.organization_logo]);

  const onCancelForm = () => {
    const isDirtyFields = Object.values(dirtyFields);
    if (isDirtyFields.length) {
      setOpenDiscardModal(true);
    } else {
      navigate(-1);
    }
  };

  const onFileSelect: React.ChangeEventHandler<HTMLInputElement> | undefined = (
    e
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file && ALLOWED_MIME_TYPES.includes(file.type)) {
      if (file.size < 10 * 1024 * 1024) {
        clearErrors('organization_logo');
        setCompanyLogo(file);
      } else {
        setError('organization_logo', {
          type: 'custom',
          message: 'Please upload image less than 2MB',
        });
      }
    } else {
      setError('organization_logo', {
        type: 'custom',
        message: 'Only PNG,JPEG,JPG are allowed',
      });
    }
  };

  const onSubmit = handleSubmit((value) =>
    submitForm({ ...value, organization_logo: companyLogo })
  );

  const close = () => {
    reset();
    cancelForm();
  };

  return (
    <>
      {' '}
      <div className="fixed__wrapper__CompanySettings">
        <div className="upload__File">
          <FileUpload
            error={errors.organization_logo}
            setFileObjectCb={setCompanyLogo}
            image={companyLogo}
            onFileChange={onFileSelect}
            fileUploadText="Upload Company Logo"
          />
        </div>

        <FormProvider {...formMethods}>
          <form onSubmit={onSubmit}>
            {/* Basic Detail */}
            <CompanyBasicDetails />

            <div className="companyDetails__address__fields mb-[30px] md:mb-[20px]">
              <Address
                setAddressOptions={setAddressOptions}
                addressOptions={addressOptions}
              />
            </div>
            <div className="flex flex-wrap action__fixed__btn__CompanySettings">
              <Button
                className="cancel__btn secondary__Btn mr-[7px] min-w-[120px] sm:min-w-[calc(50%_-_7px)]"
                onClick={onCancelForm}
              >
                Cancel
              </Button>
              <Button
                className="save__btn primary__Btn min-w-[120px] py-[11px] ml-[7px] sm:min-w-[calc(50%_-_7px)]"
                type="submit"
                isLoading={isLoading}
              >
                Save
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
      {openDiscardModal ? (
        <DiscardConfirmationModal
          discardActivity={close}
          isOpen={openDiscardModal}
          closeModal={() => setOpenDiscardModal(false)}
        />
      ) : null}
    </>
  );
};

export default CompanyDetailsForm;
