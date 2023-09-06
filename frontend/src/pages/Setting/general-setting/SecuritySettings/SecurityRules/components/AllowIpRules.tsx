import Button from 'components/Button';
import FormField from 'components/FormField';
import Modal from 'components/Modal';
import { format } from 'date-fns-tz';
import { useRef } from 'react';
import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormClearErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { ORG_IP_TYPES, RuleTypes } from '../types';
import Icon from 'components/Icon';
import AlertModal from 'components/Modal/AlertModal';

interface Props {
  org_ips: {
    new: ORG_IP_TYPES[];
    updated: (ORG_IP_TYPES & { id: number })[];
    deleted: number[];
    old_org_ips?: {
      id: number;
      ip: string;
      start_time: string;
      end_time: string;
    }[];
  };
  setIsOpen: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      name: null | string;
    }>
  >;
  setValue: UseFormSetValue<RuleTypes>;
  control: Control<RuleTypes, any>;
  register: UseFormRegister<RuleTypes>;
  errors: FieldErrors<RuleTypes>;
  isOpen: {
    show: boolean;
    name: null | string;
  };
  clearErrors: UseFormClearErrors<RuleTypes>;
  submitLoading: boolean;
  getValues: UseFormGetValues<RuleTypes>;
  updateSetting: (
    value: number | boolean | string | null,
    name: keyof RuleTypes
  ) => Promise<void>;
}

const AllowIpRules = ({
  org_ips,
  setValue,
  control,
  register,
  errors,
  clearErrors,
  setIsOpen,
  isOpen,
  submitLoading,
  getValues,
  updateSetting,
}: Props) => {
  const { fields: addIP_s } = useFieldArray({
    name: 'org_ips.new',
    control,
  });
  const { fields: updateIP_s } = useFieldArray({
    name: 'org_ips.updated',
    control,
  });
  const fieldIndex = useRef<{
    fieldName: 'org_ips.updated' | 'org_ips.new' | 'org_ips.deleted';
    action: 'ADD' | 'UPDATE' | 'DELETE';
    index: number;
    recordData?: {
      id: number;
      ip: string;
      start_time: string;
      end_time: string;
    };
  }>();

  const fieldArrayHandler = (
    action: 'ADD' | 'UPDATE' | 'DELETE',
    recordData?: {
      id: number;
      ip: string;
      start_time: string;
      end_time: string;
    }
  ) => {
    if (action === 'ADD') {
      fieldIndex.current = {
        fieldName: 'org_ips.new',
        action: 'ADD',
        index: addIP_s.length,
      };
    } else if (action === 'UPDATE') {
      fieldIndex.current = {
        fieldName: 'org_ips.updated',
        action: 'UPDATE',
        index: updateIP_s.length,
        recordData,
      };
      setValue(
        `${fieldIndex.current?.fieldName}.${fieldIndex.current?.index}.id` as any,
        recordData?.id
      );
      setValue(
        `${fieldIndex.current?.fieldName}.${fieldIndex.current?.index}.start_time` as any,
        recordData?.start_time
      );
      setValue(
        `${fieldIndex.current?.fieldName}.${fieldIndex.current?.index}.end_time` as any,
        recordData?.end_time
      );
    } else if (action === 'DELETE') {
      setValue(`org_ips.deleted`, (recordData?.id && [recordData?.id]) || []);
      return setIsOpen({ show: true, name: 'org_ip_alert' });
    }
    return setIsOpen({ show: true, name: 'org_ips' });
  };

  const closeAlertModal = () => {
    setValue('org_ips.deleted', []);
    setIsOpen({ show: false, name: 'org_ip_alert' });
  };

  const closeModal = () => {
    setIsOpen({ show: false, name: 'org_ips' });
    setValue('org_ips.new', []);
    clearErrors();
  };

  const submitIpSetting = async () => {
    const ipRuleSettingValue = await getValues('org_ips');
    delete ipRuleSettingValue?.old_org_ips;
    updateSetting(JSON.stringify(ipRuleSettingValue), 'org_ips');
  };

  return (
    <>
      <div className="mb-[20px] pb-2 border-b border-whiteScreen__BorderColor">
        <div className="mb-[20px]">
          <h3 className="text-[16px] font-biotif__Medium text-black mb-[5px]">
            Allow access only for specific IP addresses
          </h3>
        </div>
        <div className="items-center">
          <div className="mb-4">
            {org_ips?.old_org_ips?.map((item, key) => {
              return (
                <div key={`${key}_ip_rule`} className="flex space-x-4 w-2/3">
                  <span className="w-[140px] text-[16px] font-biotif__Regular text-black/50 bg-[#f5f5f5] inline-block px-[10px] pt-[6px] pb-[4px] mr-[5px] whitespace-pre mb-[5px] last:mr-0">
                    {item?.ip}
                  </span>
                  {item?.start_time && (
                    <span className="w-[110px] text-[16px] font-biotif__Regular text-black/50 bg-[#f5f5f5] inline-block px-[10px] pt-[6px] pb-[4px] mr-[5px] whitespace-pre mb-[5px] last:mr-0">
                      {format(new Date(item?.start_time), 'hh:mm aa')}
                    </span>
                  )}
                  {item?.end_time && (
                    <span className="w-[110px] text-[16px] font-biotif__Regular text-black/50 bg-[#f5f5f5] inline-block px-[10px] pt-[6px] pb-[4px] mr-[5px] whitespace-pre mb-[5px] last:mr-0">
                      {format(new Date(item?.end_time), 'hh:mm aa')}
                    </span>
                  )}
                  <span onClick={() => fieldArrayHandler('DELETE', item)}>
                    <Icon
                      className="w-[32px] h-[32px] rounded-[6px] p-[7px] top-[-2px] border-[1px] border-whiteScreen__BorderColor duration-500 cursor-pointer bg-parentBgWhite__grayBtnBG"
                      iconType="deleteFilled"
                    />
                  </span>
                  <span onClick={() => fieldArrayHandler('UPDATE', item)}>
                    <Icon
                      className="w-[32px] h-[32px] rounded-[6px] p-[7px] top-[-2px] border-[1px] border-whiteScreen__BorderColor duration-500 cursor-pointer bg-parentBgWhite__grayBtnBG"
                      iconType="editFilled"
                    />
                  </span>
                </div>
              );
            })}
          </div>
          <Button
            type="button"
            className="i__Button primary__Btn__SD smaller"
            onClick={() => fieldArrayHandler('ADD')}
          >
            Add
          </Button>
        </div>
      </div>
      {fieldIndex.current && (
        <Modal
          title="Allow IP"
          visible={isOpen.name === 'org_ips' && isOpen.show}
          submitLoading={submitLoading}
          onClose={closeModal}
          onCancel={closeModal}
          submitBtnDisabled={errors.org_ips !== undefined}
          onSubmit={submitIpSetting}
        >
          <FormField<RuleTypes>
            label="IP"
            placeholder="EX. 000.000.00.00"
            name={
              `${fieldIndex.current?.fieldName}.${fieldIndex.current?.index}.ip` as keyof RuleTypes
            }
            type="text"
            register={register}
            fieldLimit={15}
            defaultValue={fieldIndex.current?.recordData?.ip}
            error={
              (errors?.org_ips &&
                ((errors?.org_ips?.new && errors?.org_ips?.new[0]?.ip) ||
                  (errors?.org_ips?.updated &&
                    errors?.org_ips?.updated[0]?.ip))) ||
              {}
            }
          />
          <div className="flex space-x-4">
            <FormField<RuleTypes>
              label="Start Time"
              placeholder="EX. 00:00"
              name={
                `${fieldIndex.current?.fieldName}.${fieldIndex.current?.index}.start_time` as keyof RuleTypes
              }
              type="time"
              register={register}
            />
            <FormField<RuleTypes>
              label="End Time"
              className="z-4"
              placeholder="EX. 00:00"
              name={
                `${fieldIndex.current?.fieldName}.${fieldIndex.current?.index}.end_time` as keyof RuleTypes
              }
              type="time"
              register={register}
              dateFormat={fieldIndex.current?.recordData?.end_time}
            />
          </div>
        </Modal>
      )}
      <AlertModal
        visible={isOpen.name === 'org_ip_alert' && isOpen.show}
        onClose={closeAlertModal}
        onCancel={closeAlertModal}
        onSubmit={submitIpSetting}
        submitLoading={submitLoading}
        width="800px"
        submitButtonText="Yes"
        cancelButtonText="No"
        submitButtonClass="bg-ip__SuccessGreen"
        customIcon={<Icon className="w-full h-full" iconType="alertIcon" />}
      >
        <h5 className="confirmation__title">
          Are you sure you want to remove this IP
        </h5>
      </AlertModal>
    </>
  );
};

export default AllowIpRules;
