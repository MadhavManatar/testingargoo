import { SettingSidebarInterface } from "constant/setting.sidebar.constant";

export interface SettingLayoutProps {
    title: string;
    children?: React.ReactNode;
    breadCrumbPath: {
        trails: { title: string; path: string }[];
        title: string;
    };
    sideBarLinks: SettingSidebarInterface[];
}
