/* eslint-disable no-underscore-dangle */
import { Option } from 'components/FormField/types/formField.types';
import Icon from 'components/Icon';
import { components, GroupBase, OptionProps } from 'react-select';

const GuestContactOption = ({
  data,
  ...optionProps
}: OptionProps<Option, boolean, GroupBase<Option>>) => {
  return (
    <components.Option data={data} {...optionProps}>
      <div className="flex items-center guests__list__row">
        <Icon
          className="shrink-0 mr-[6px] p-0 w-[18px] h-[18px] relative top-[-1px]"
          iconType="userProfileFilledIcon"
        />
        <span className="inline-block whitespace-pre overflow-hidden text-ellipsis text-ipBlack__textColor text-[14px]">
          {(data?.text && data?.text?.trim()) || ''}
          {!data?.text && data?.value
            ? `${(data?.value as string).trim()}`
            : ''}
        </span>
      </div>
    </components.Option>
  );
};

export default GuestContactOption;
