import { yupResolver } from '@hookform/resolvers/yup';
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import AlertModal from 'components/Modal/AlertModal';
import { BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import { ChangeEvent, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  useLazyGetOrganizationSettingQuery,
  useUpdateOrganizationSettingMutation,
} from 'redux/api/organizationSettingsApi';
import AllowIpRules from './components/AllowIpRules';
import PasswordRules from './components/PasswordRules';
import { RuleTypes } from './types';
import { rulesSchema } from './validation-schema/rules.schema';

const initialState = {
  p_num_required: false,
  p_special_required: false,
  p_upper_lower: false,
  pass_expire: null,
  pass_length: '',
  pass_reuse: 1,
  twoFA_status: false,
  org_ips: {
    new: [],
    updated: [],
    deleted: [],
    old_org_ips: [],
  },
};

const confirmDisableMsg = {
  twoFA_status: 'Two-Factor Authentication',
  p_num_required: 'Password at least one number',
  p_special_required: 'Password at least one special character',
  p_upper_lower: 'Password both lowercase and uppercase letters',
};

const SecurityRules = () => {
  // ** states **
  const formMethods = useForm<RuleTypes>({
    defaultValues: initialState,
    mode: 'onChange',
    resolver: yupResolver(rulesSchema),
  });
  const {
    reset,
    control,
    setValue,
    // handleSubmit,
    register,
    watch,
    getValues,
    formState: { errors },
    clearErrors,
  } = formMethods;

  const [isOpen, setIsOpen] = useState<{
    show: boolean;
    name: null | string;
    fieldName?: keyof RuleTypes;
  }>({ show: false, name: null });

  const [getOrganizationSetting] = useLazyGetOrganizationSettingQuery();
  const [updateOrganizationSetting, { isLoading }] =
    useUpdateOrganizationSettingMutation();

  useEffect(() => {
    getRulesSetting();
  }, []);

  const getRulesSetting = async () => {
    const { data, error } = await getOrganizationSetting({
      params: {
        'include[org_ips][select]': 'id,ip,start_time,end_time',
      },
    });
    if (!error && data) {
      const {
        p_num_required,
        p_special_required,
        p_upper_lower,
        pass_expire,
        pass_length,
        pass_reuse,
        twoFA_status,
        org_ips,
      } = data;

      reset({
        p_num_required,
        p_special_required,
        p_upper_lower,
        pass_length,
        pass_expire: pass_expire || 0,
        pass_reuse,
        twoFA_status,
        org_ips: {
          old_org_ips: org_ips,
        },
      });
    }
  };

  const updateSetting = async (
    value: number | boolean | string | null,
    name: keyof RuleTypes
  ) => {
    const bodyData = {
      [name]: value,
      pass_length: getValues('pass_length'),
    };
    const updateResponse = await updateOrganizationSetting({ data: bodyData });
    if ('data' in updateResponse || 'error' in updateResponse) {
      setIsOpen({ show: false, name: null });
      if ('data' in updateResponse && updateResponse.data[name] !== undefined) {
        let fieldValue = updateResponse.data[name];
        if (name === 'pass_expire' && fieldValue === null) fieldValue = 0;
        if (name === 'org_ips') {
          fieldValue = { old_org_ips: updateResponse.data.org_ips };
        }
        return setValue(name, fieldValue);
      }
    }
  };

  const onChangeHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = event.target;
    const { checked } = event?.target as HTMLInputElement;
    if (type !== 'checkbox') {
      if (name === 'pass_length') {
        const pass_length =
          Number(value) <= 8 ? '8' : Number(value) >= 16 ? '16' : value;
        setValue('pass_length', pass_length);
        clearErrors('pass_length');
      } else setValue(name as keyof RuleTypes, value);
    }

    if (type === 'checkbox' && checked === false) {
      setIsOpen({
        show: true,
        fieldName: name as keyof RuleTypes,
        name: confirmDisableMsg[name as keyof typeof confirmDisableMsg],
      });
    } else {
      return updateSetting(
        type !== 'checkbox' ? value : checked,
        name as keyof RuleTypes
      );
    }
  };

  return (
    <SettingLayout
      title="Security Settings"
      breadCrumbPath={
        BREAD_CRUMB.settings.generalSettings.securitySettings.rules
      }
      sideBarLinks={SETTING_SIDEBAR.securitySettings}
    >
      <div className="mb-[20px] pb-2 border-b border-whiteScreen__BorderColor">
        <h3 className="text-[18px] font-biotif__Medium text-black mb-[5px]">
          Security Rules
        </h3>
        <p className="text-[16px] font-biotif__Regular text-black/50">
          Enforce security rules on all users of Smackdab
        </p>
      </div>
      <FormProvider {...formMethods}>
        <form>
          <div className="mb-[20px] pb-2 border-b border-whiteScreen__BorderColor">
            <div className="mb-[20px]">
              <h3 className="text-[16px] font-biotif__Medium text-black mb-[5px]">
                Two-Factor Authentication
              </h3>
            </div>
            <div className="flex flex-wrap items-center">
              <FormField
                wrapperClass="toggleSwitch mb-0"
                type="checkbox"
                name="twoFA_status"
                register={register}
                checked={watch('twoFA_status')}
                onChange={onChangeHandler}
                disabled={isLoading}
              />
              <span className="text-[16px] font-biotif__Medium text-ip__black__text__color ml-[12px]">
                Enforce Two-Factor Authentication
              </span>
            </div>
          </div>
          <PasswordRules
            register={register}
            errors={errors}
            watch={watch}
            onChangeHandler={onChangeHandler}
            isLoading={isLoading}
            updateSetting={updateSetting}
          />
          <AllowIpRules
            org_ips={watch('org_ips')}
            setValue={setValue}
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            control={control}
            register={register}
            errors={errors}
            submitLoading={isLoading}
            clearErrors={clearErrors}
            getValues={getValues}
            updateSetting={updateSetting}
          />
        </form>
      </FormProvider>
      <AlertModal
        visible={
          isOpen.show &&
          isOpen.name !== 'org_ips' &&
          isOpen.name !== 'org_ip_alert'
        }
        onClose={() => setIsOpen({ show: false, name: null })}
        onCancel={() => setIsOpen({ show: false, name: null })}
        onSubmit={() => {
          if (isOpen.fieldName) {
            const fieldValue = getValues(isOpen.fieldName);
            if (fieldValue !== undefined)
              updateSetting(!fieldValue, isOpen.fieldName);
          }
        }}
        width="800px"
        submitButtonText="Yes"
        cancelButtonText="No"
        submitButtonClass="bg-ip__SuccessGreen"
        customIcon={<Icon className="w-full h-full" iconType="alertIcon" />}
      >
        <h5 className="confirmation__title">
          Are you sure you want to disable {isOpen.name || ''}
        </h5>
      </AlertModal>
    </SettingLayout>
  );
};

export default SecurityRules;
