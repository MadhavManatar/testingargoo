import { Option } from 'components/FormField/types/formField.types';
import ReactSelect, { ActionMeta, OnChangeValue } from 'react-select';

interface PropsTypes {
  options: Option[];
  selectedValue: Option;
  className?: string;
  onChange: (
    newValue: OnChangeValue<Option, boolean>,
    actionMeta: ActionMeta<Option>
  ) => void;
  isMulti?: boolean;
}

const CustomDropDown = (props: PropsTypes) => {
  const {
    options,
    selectedValue,
    className,
    onChange,
    isMulti = false,
  } = props;
  return (
    <div className="ip__Select">
      <ReactSelect
        classNamePrefix="ip__select__dynamic"
        isMulti={isMulti}
        value={selectedValue}
        options={options}
        onChange={onChange}
        className={className}
        defaultValue={options[0]}
      />
    </div>
  );
};

export default CustomDropDown;
