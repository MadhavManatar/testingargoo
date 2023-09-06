import { Option } from 'components/FormField/types/formField.types';
import { components, GroupBase, OptionProps } from 'react-select';

const EmailEntityOption = ({
  data,
  ...optionProps
}: OptionProps<Option, boolean, GroupBase<Option>>) => {
  return (
    <components.Option data={data} {...optionProps}>
      <div>
        <div className="leading-[20px] whitespace-pre overflow-hidden text-ellipsis">
          {data?.label || ''}
        </div>
        {data?.extraLabel && (
          <div className="text-[14px] font-biotif__Regular text-light__TextColor relative">
            {data.extraLabel}
          </div>
        )}
      </div>
    </components.Option>
  );
};

export default EmailEntityOption;
