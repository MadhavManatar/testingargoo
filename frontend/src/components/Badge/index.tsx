interface Props {
  type?:
    | 'primaryDark'
    | 'secondaryDark'
    | 'successDark'
    | 'dangerDark'
    | 'warningDark'
    | 'infoDark'
    | 'lightDark'
    | 'dark';
  text?: string;
  bgColor?: string;
}

const Badge = (props: Props) => {
  const { type = 'primaryDark', text, bgColor } = props;
  return (
    <span
      style={{ ...(bgColor && { backgroundColor: bgColor }) }}
      className={`badge badge__${type}`}
    >
      {text}
    </span>
  );
};

export default Badge;
