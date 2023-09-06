// ** Import Packages **
import { addDays, subDays } from 'date-fns';

import { UseDealClosingDateCalType } from '../types/deals.types';
import { GENERAL_SETTING_VALID_KEYS } from 'constant';

const useDateColorCal = () => {
  const dateColorCal = (props: UseDealClosingDateCalType) => {
    const { dealClosingDateData, closing_date, converted_at, created_at } =
      props;
    if (closing_date) {
      const formattedClosingDate = addDays(new Date(closing_date), 1);
      const createdDate = new Date(converted_at || created_at);
      const currDate = new Date();
      const setWarningDate = subDays(
        new Date(closing_date),
        Number(dealClosingDateData.time_frame) - 1
      );
      let dateColor;
      if (createdDate <= currDate && currDate < setWarningDate) {
        dateColor = dealClosingDateData.neutral_color;
      } else if (
        setWarningDate <= currDate &&
        currDate < formattedClosingDate
      ) {
        dateColor = dealClosingDateData.warning_color;
      } else if (formattedClosingDate <= currDate) {
        dateColor = dealClosingDateData.passed_due_color;
      }
      return dateColor;
    }
  };

  const dealClosingDateDataCal = (data: any) => {
    let tempData: any;

    if (data?.length) {
      const values = data.reduce(
        (
          acc: { key: string; value: string | number },
          curr: { key: string; value: string | number }
        ) => ({ ...acc, [curr.key || '']: curr.value }),
        {}
      );
      tempData = {
        time_frame:
          values[
            GENERAL_SETTING_VALID_KEYS
              .deal_closing_date_color_settings_time_frame
          ],
        neutral_color:
          values[
            GENERAL_SETTING_VALID_KEYS
              .deal_closing_date_color_settings_neutral_color
          ],
        warning_color:
          values[
            GENERAL_SETTING_VALID_KEYS
              .deal_closing_date_color_settings_warning_color
          ],
        passed_due_color:
          values[
            GENERAL_SETTING_VALID_KEYS
              .deal_closing_date_color_settings_passed_due_color
          ],
      };
      return tempData;
    }
    return tempData;
  };

  return { dateColorCal, dealClosingDateDataCal };
};

export default useDateColorCal;
