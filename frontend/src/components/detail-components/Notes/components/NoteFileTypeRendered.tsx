import { attachmentResponse } from "components/detail-components/Attachment/types/attachment.types";
import Icon from "components/Icon";
import Image from "components/Image";

type NoteFileProps = {
    mimeType: string;
    attach: attachmentResponse;
    onClick: () => void;
    onDownload: () => void;
};
export const NoteFileTypeRenderer = (props: NoteFileProps) => {
    const { mimeType, attach, onClick, onDownload } = props;
    const renderFile = () => {
        switch (mimeType?.split('/')[0]) {
            case 'image':
                return (
                    <>
                        <Image
                            imgPath={attach?.url}
                            serverPath
                            imgClassName="absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor"
                        />
                        <div className="hover__action hidden group-hover:block absolute top-0 left-0 w-full h-full before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-ip__black__text__color before:opacity-70 before:rounded-[10px]">
                            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] inline-flex">
                                <button
                                    className="bg-ip__white__text__color rounded-[6px] mt-0 mr-[8px]"
                                    onClick={onClick}
                                >
                                    <Icon iconType="eyeFilled" />
                                </button>
                                <button
                                    className="bg-ip__white__text__color rounded-[6px] mt-0"
                                    onClick={onDownload}
                                >
                                    <Icon iconType="downloadFilledIocn" />
                                </button>
                            </div>
                        </div>
                    </>
                );
            case 'video':
                return (
                    <>
                        <Icon
                            iconType="videoIconFilledPrimaryColor"
                            className="absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor"
                        />
                        <div className="hover__action hidden group-hover:block absolute top-0 left-0 w-full h-full before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-ip__black__text__color before:opacity-70 before:rounded-[10px]">
                            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] inline-flex">
                                <button
                                    className="bg-ip__white__text__color rounded-[6px] mt-0"
                                    onClick={onDownload}
                                >
                                    <Icon iconType="downloadFilledIocn" />
                                </button>
                            </div>
                        </div>
                    </>
                );
            case 'application':
                return (
                    <>
                        <Icon
                            iconType="fileIconFilledPrimaryColor"
                            className="absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor"
                        />
                        <div className="hover__action hidden group-hover:block absolute top-0 left-0 w-full h-full before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-ip__black__text__color before:opacity-70 before:rounded-[10px]">
                            <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] inline-flex">
                                <button
                                    className="bg-ip__white__text__color rounded-[6px] mt-0 mr-[8px]"
                                    onClick={onClick}
                                >
                                    <Icon iconType="eyeFilled" />
                                </button>
                                <button
                                    className="bg-ip__white__text__color rounded-[6px] mt-0"
                                    onClick={onDownload}
                                >
                                    <Icon iconType="downloadFilledIocn" />
                                </button>
                            </div>
                        </div>
                    </>
                );
            default:
                break;
        }
    };
    return <>{renderFile()}</>;
};