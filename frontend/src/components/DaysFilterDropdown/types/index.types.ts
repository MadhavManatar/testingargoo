import { TAB_NAME } from "constant";

export type SelectedDayRangeType = {
    [TAB_NAME.ACTIVITIES]?: string;
    [TAB_NAME.CONTACTS]?: string;
    [TAB_NAME.LEAD]?: string;
    [TAB_NAME.DEALS]?: string;
    [TAB_NAME.ACCOUNTS]?: string;
    [TAB_NAME.DEPARTMENT]?: string;
};