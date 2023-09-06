/* eslint-disable no-underscore-dangle */
import { Option } from 'components/FormField/types/formField.types';
import { components, GroupBase, OptionProps } from 'react-select';

const StateOptionComponent = ({
  data,
  ...optionProps
}: OptionProps<Option, boolean, GroupBase<Option>>) => {
  return (
    <components.Option data={data} {...optionProps}>
      <div>
        <div className="leading-[20px] whitespace-pre overflow-hidden text-ellipsis">
          {(data?.label || '')?.split(',')?.[1]}
        </div>
      </div>
    </components.Option>
  );
};

export default StateOptionComponent;
