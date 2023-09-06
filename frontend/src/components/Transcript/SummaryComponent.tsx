interface Props {
  summary: string | null;
}

const SummaryComponent = ({ summary }: Props) => {
  return (
    <div className="text-[16px] font-biotif__Medium text-sdNormal__textColor leading-normal h-[calc(100vh_-_240px)] overflow-y-auto p-[20px] ip__FancyScroll">
      {summary}
    </div>
  );
};

export default SummaryComponent;
