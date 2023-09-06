import { components, MultiValueGenericProps } from 'react-select';

const MultiValueComponent = (props: MultiValueGenericProps) => {
  const labelArray = props?.data?.label.split(',');

  return (
    <components.MultiValueLabel {...props}>
      {props?.data?.label && (
        <div className="">
          {labelArray.length > 1 ? labelArray[1] : labelArray[0]}
        </div>
      )}
    </components.MultiValueLabel>
  );
};

export default MultiValueComponent;
