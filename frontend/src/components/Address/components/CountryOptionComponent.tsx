import { Option } from 'components/FormField/types/formField.types';
import { components, GroupBase, OptionProps } from 'react-select';

const CountryOptionComponent = ({
  data,
  ...optionProps
}: OptionProps<Option, boolean, GroupBase<Option>>) => {
  return (
    <components.Option data={data} {...optionProps}>
      <div>
        {data.value === 233 ? (
          <div className="leading-[20px] whitespace-pre text-ellipsis relative before:content-[''] before:absolute before:bottom-[-7px] before:left-[50%] before:translate-x-[-50%] before:w-[calc(100%_+_25px)] before:h-[1px] before:bg-whiteScreen__BorderColor">
            {(data?.label || '')?.split(',')?.[0]}
          </div>
        ) : (
          <div className="leading-[20px] whitespace-pre overflow-hidden text-ellipsis">
            {(data?.label || '')?.split(',')?.[0]}
          </div>
        )}
      </div>
    </components.Option>
  );
};

export default CountryOptionComponent;
