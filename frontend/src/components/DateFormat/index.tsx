// ** import packages **
import { format as Format } from 'date-fns-tz';
import { useSelector } from 'react-redux';

// ** redux **
import { getCurrentUserDateFormat } from 'redux/slices/authSlice';

interface Props {
  date: string | Date;
  format?: string;
}

export const DateFormat = (props: Props) => {
  const { date, format } = props;

  // ** hooks **
  const dateFormat: string =
    format || useSelector(getCurrentUserDateFormat) || 'MM/dd/yyyy';

  const renderDate = () => {
    if (dateFormat) {
      return Format(new Date(date), dateFormat);
    }
  };

  return (
    <>
      {date
        ? !Number.isNaN(new Date(date).getDate())
          ? renderDate()
          : date
        : ''}
    </>
  );
};

export default DateFormat;
