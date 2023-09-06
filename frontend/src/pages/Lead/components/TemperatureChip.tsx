// ======================================================
import Badge from 'components/Badge';

const TemperatureChip = ({
  status,
  bgColor,
}: {
  status?: string;
  bgColor?: string;
}) => {
  function renderChip(val?: string) {
    if (bgColor) {
      return <Badge text={status} bgColor={bgColor} />;
    }
    if (val) {
      return <Badge text={status} />;
    }
    return <span>-</span>;
  }
  return <div className="badge__wrapper">{renderChip(status)}</div>;
};

export default TemperatureChip;
