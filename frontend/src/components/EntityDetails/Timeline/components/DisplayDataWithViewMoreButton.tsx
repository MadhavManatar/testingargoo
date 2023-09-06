type Props = {
  value: string;
};

const DisplayDataWithViewMoreButton = (props: Props) => {
  const { value } = props;
  return <>{value.length > 50 && <button type="button">...</button>}</>;
};

export default DisplayDataWithViewMoreButton;
