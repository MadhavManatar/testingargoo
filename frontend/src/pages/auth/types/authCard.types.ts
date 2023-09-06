export interface AuthCardProps {
    title?: React.ReactNode;
    subTitle?: React.ReactNode;
    showBackBtn?: boolean;
    onBackBtnClicked?: () => void;
    showHeader?: React.ReactNode;
    children: React.ReactNode;
}