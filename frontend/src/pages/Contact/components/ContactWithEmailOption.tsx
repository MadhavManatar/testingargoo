/* eslint-disable no-underscore-dangle */
import { Option } from 'components/FormField/types/formField.types';
import { components, GroupBase, OptionProps } from 'react-select';

const ContactWithEmailOption = ({
  data,
  ...optionProps
}: OptionProps<Option, boolean, GroupBase<Option>>) => {
  return (
    <components.Option data={data} {...optionProps}>
      <div>
        <div className="leading-[20px] whitespace-pre overflow-hidden text-ellipsis">
          {data.__isNew__ ? data.value : data?.label.split(',')[0] || ''}
        </div>
        {data.email && (
          <div className="text-[14px] font-biotif__Regular text-light__TextColor relative">
            {data.email}
          </div>
        )}
      </div>
    </components.Option>
  );
};

export default ContactWithEmailOption;
