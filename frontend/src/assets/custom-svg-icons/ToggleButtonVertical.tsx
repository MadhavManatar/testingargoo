const ToggleButtonVertical = ({
  fill,
  stroke,
}: {
  fill?: string;
  stroke?: string;
}) => {
  return (
    <svg width="5" height="21" viewBox="0 0 5 21" fill={fill || stroke}>
      <circle cx="2.5" cy="2.5" r="2.5" />
      <circle cx="2.5" cy="10.5" r="2.5" />
      <circle cx="2.5" cy="18.5" r="2.5" />
    </svg>
  );
};

export default ToggleButtonVertical;
