import { Option } from 'components/FormField/types/formField.types';
import { components, GroupBase, SingleValueProps } from 'react-select';

const SingleValueComponent = ({
  data,
  ...optionProps
}: SingleValueProps<Option, boolean, GroupBase<Option>>) => {
  const labelArray = data?.label?.split(',');
  return (
    <components.SingleValue data={data} {...optionProps}>
      {labelArray && <div className="">{labelArray?.[0] || ''}</div>}
    </components.SingleValue>
  );
};

export default SingleValueComponent;
