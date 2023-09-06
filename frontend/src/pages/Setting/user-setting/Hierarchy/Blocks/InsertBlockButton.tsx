type PropsType = {
  title: string;
  onClick: () => void;
};

const InsertBlockButton = (props: PropsType) => {
  const { title, onClick } = props;
  return (
    <div className="item" onClick={onClick}>
      <div className="flex items-center relative z-[2] cursor-pointer">
        <span className="text whitespace-pre text-[14px] font-biotif__Medium inline-block ml-[2px] text-ipBlack__textColor">
          {title}
        </span>
      </div>
    </div>
  );
};

export default InsertBlockButton;
