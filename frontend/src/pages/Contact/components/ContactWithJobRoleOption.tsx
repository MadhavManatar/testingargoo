/* eslint-disable no-underscore-dangle */
import { Option } from 'components/FormField/types/formField.types';
import { components, GroupBase, OptionProps } from 'react-select';

const ContactWithJobRoleOption = ({
  data,
  ...optionProps
}: OptionProps<Option, boolean, GroupBase<Option>>) => {
  return (
    <components.Option data={data} {...optionProps}>
      <div>
        <div className="leading-[20px] whitespace-pre overflow-hidden text-ellipsis text-ipBlack__textColor mb-[2px]">
          {data.__isNew__
            ? `Create "${data.value}"`
            : data?.label?.split(',')?.[0] || ''}
        </div>
        {data?.job_role && (
          <div className="text-[14px] leading-[20px] font-biotif__Regular text-black__TextColor400 relative">
            {data?.job_role}
          </div>
        )}
        {data?.email && (
          <div className="text-[14px] leading-[20px] font-biotif__Regular text-black__TextColor400 relative">
            {data?.email}
          </div>
        )}
      </div>
    </components.Option>
  );
};

export default ContactWithJobRoleOption;
