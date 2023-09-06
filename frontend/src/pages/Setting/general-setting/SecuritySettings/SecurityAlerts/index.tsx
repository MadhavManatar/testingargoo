import { yupResolver } from '@hookform/resolvers/yup';
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import { BREAD_CRUMB } from 'constant';
import { SETTING_SIDEBAR } from 'constant/setting.sidebar.constant';
import _ from 'lodash';
import SettingLayout from 'pages/Setting/components/SettingLayout';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import {
  useLazyGetOrganizationAlertsQuery,
  useUpdateOrganizationAlertsMutation,
} from 'redux/api/orgAlertsApi';
import { checkInputIsNumber } from 'utils/util';
import AssignedUser from './Components/AssingnedUser';
import { SecurityAlertsTypes } from './types';
import { alertsSchema } from './validation-schema/alerts.schema';

const initialState = {
  location_alert: false,
  invite_alert: false,
  failed_login_alert: false,
  reset_pass_alert: false,
  del_pipeline_stage: false,
  del_contact_alert: false,
  del_account_alert: false,
  del_deals_alert: false,
  del_contact_count: 1,
  del_account_count: 1,
  del_deals_count: 1,
};

const SecurityAlerts = () => {
  // ** states **
  const [isOpen, setIsOpen] = useState(false);

  const formMethods = useForm({
    defaultValues: initialState,
    mode: 'onChange',
    resolver: yupResolver(alertsSchema),
  });
  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    clearErrors,
  } = formMethods;

  const [getOrganizationAlerts, { currentData, isLoading }] =
    useLazyGetOrganizationAlertsQuery();
  const [updateOrganizationAlerts, { isLoading: isUpdateLoading }] =
    useUpdateOrganizationAlertsMutation();

  useEffect(() => {
    getOrganizationAlerts({});
  }, []);

  useEffect(() => {
    if (currentData) {
      reset(_.pick(currentData, Object.keys(initialState)));
    }
  }, [currentData]);

  const closeModal = () => {
    reset(_.pick(currentData, Object.keys(initialState)));
    setIsOpen(false);
    clearErrors();
  };

  const onSubmit = handleSubmit(async (value) => {
    const updateResponse = await updateOrganizationAlerts({ data: value });
    if ('data' in updateResponse || 'error' in updateResponse) {
      if ('data' in updateResponse) {
        reset(_.pick(updateResponse.data, Object.keys(initialState)));
        setIsOpen(false);
      }
    }
  });

  const onChangeHandler = async (
    key: keyof SecurityAlertsTypes,
    value: boolean
  ) => {
    if (!errors[key]) {
      const formObj: SecurityAlertsTypes = { [key]: value };
      const updateResponse = await updateOrganizationAlerts({ data: formObj });
      if ('data' in updateResponse && !('error' in updateResponse)) {
        setIsOpen(false);
      }
    }
  };

  return (
    <SettingLayout
      title="Security Settings"
      breadCrumbPath={
        BREAD_CRUMB.settings.generalSettings.securitySettings.Alerts
      }
      sideBarLinks={SETTING_SIDEBAR.securitySettings}
    >
      <div className="mb-[20px] pb-2 border-b border-whiteScreen__BorderColor">
        <h3 className="text-[18px] font-biotif__Medium text-black mb-[5px]">
          Security alerts
        </h3>
        <p className="text-[16px] font-biotif__Regular text-black/50">
          You can track all security alert.
        </p>
      </div>
      <FormProvider {...formMethods}>
        <form>
          <div className="mb-[20px] pb-2 border-b border-whiteScreen__BorderColor">
            <div className="mb-[20px]">
              <h3 className="text-[16px] font-biotif__Medium text-black mb-[5px]">
                Account access alerts
              </h3>
            </div>
            <div>
              <div className="flex">
                <div className="w-2/6 text-right mr-3">
                  <span className="text-[16px] text-black mb-[5px]">
                    Send alert notification
                  </span>
                </div>
                <div>
                  <FormField
                    type="checkbox"
                    name="location_alert"
                    // checked={currentData?.location_alert}
                    register={register}
                    onChange={(e) =>
                      onChangeHandler(
                        'location_alert',
                        (e.target as any).checked
                      )
                    }
                    label="User login from new location"
                  />
                  <FormField
                    type="checkbox"
                    name="invite_alert"
                    // checked={currentData?.invite_alert}
                    register={register}
                    onChange={(e) =>
                      onChangeHandler('invite_alert', (e.target as any).checked)
                    }
                    label="Invited New User"
                  />
                  <FormField
                    type="checkbox"
                    name="failed_login_alert"
                    // checked={currentData?.failed_login_alert}
                    register={register}
                    onChange={(e) =>
                      onChangeHandler(
                        'failed_login_alert',
                        (e.target as any).checked
                      )
                    }
                    label="User has 3 failed login attempts in a row"
                  />
                  <FormField
                    type="checkbox"
                    name="reset_pass_alert"
                    // checked={currentData?.reset_pass_alert}
                    register={register}
                    onChange={(e) =>
                      onChangeHandler(
                        'reset_pass_alert',
                        (e.target as any).checked
                      )
                    }
                    label="User requested for password reset"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mb-[20px] pb-2 border-b border-whiteScreen__BorderColor">
            <div className="mb-[20px] flex justify-between">
              <h3 className="text-[16px] font-biotif__Medium text-black mb-[5px]">
                Data leakage and loss
              </h3>
              <span
                onClick={() => setIsOpen(true)}
                className="flex items-center cursor-pointer"
              >
                <Icon
                  className="w-[26px] h-[26px] rounded-[2px] p-[3px] top-[-2px] border-[1px] border-whiteScreen__BorderColor duration-500 cursor-pointer mr-2"
                  iconType="editFilled"
                />{' '}
                Edit Counts
              </span>
            </div>
            <div>
              <div className="flex">
                <div className="w-2/6 text-right mr-3">
                  <span className="text-[16px] text-black mb-[5px]">
                    Send alert notification
                  </span>
                </div>
                <div>
                  <FormField
                    type="checkbox"
                    name="del_pipeline_stage"
                    register={register}
                    // checked={currentData?.del_pipeline_stage}
                    onChange={(e) =>
                      onChangeHandler(
                        'del_pipeline_stage',
                        (e.target as any).checked
                      )
                    }
                    label="User deletes pipelines or stages"
                  />
                  <FormField
                    type="checkbox"
                    name="del_contact_alert"
                    register={register}
                    // checked={currentData?.del_contact_alert}
                    onChange={(e) =>
                      onChangeHandler(
                        'del_contact_alert',
                        (e.target as any).checked
                      )
                    }
                    label={`Delete ${
                      watch('del_contact_count') || 0
                    } or more contacts`}
                  />
                  <FormField
                    type="checkbox"
                    name="del_account_alert"
                    // checked={currentData?.del_account_alert}
                    register={register}
                    onChange={(e) =>
                      onChangeHandler(
                        'del_account_alert',
                        (e.target as any).checked
                      )
                    }
                    label={`Delete ${
                      watch('del_account_count') || 0
                    } or more account`}
                  />
                  <FormField
                    type="checkbox"
                    name="del_deals_alert"
                    // checked={currentData?.del_deals_alert}
                    register={register}
                    onChange={(e) =>
                      onChangeHandler(
                        'del_deals_alert',
                        (e.target as any).checked
                      )
                    }
                    label={`Delete ${
                      watch('del_deals_count') || 0
                    } or more deals`}
                  />
                </div>
              </div>
            </div>
          </div>
          <Modal
            title="Edit Counts"
            visible={isOpen}
            onClose={closeModal}
            onCancel={closeModal}
            submitLoading={isUpdateLoading || isLoading}
            onSubmit={() => onSubmit()}
          >
            <FormField
              label="Contact Count"
              placeholder="00"
              name="del_contact_count"
              type="text"
              fieldLimit={15}
              onKeyDown={checkInputIsNumber}
              register={register}
              error={errors?.del_contact_count}
            />
            <FormField
              label="Account Count"
              placeholder="00"
              name="del_account_count"
              type="text"
              fieldLimit={15}
              onKeyDown={checkInputIsNumber}
              register={register}
              error={errors?.del_account_count}
            />
            <FormField
              label="Deal Count"
              placeholder="00"
              name="del_deals_count"
              type="text"
              fieldLimit={15}
              onKeyDown={checkInputIsNumber}
              register={register}
              error={errors?.del_deals_count}
            />
          </Modal>
        </form>
      </FormProvider>
      <AssignedUser />
    </SettingLayout>
  );
};

export default SecurityAlerts;
