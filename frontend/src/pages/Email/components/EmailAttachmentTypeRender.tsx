import Icon from 'components/Icon';
import Image from 'components/Image';
import { EmailFileType } from '../types/email.type';
import { downloadAttachmentFile } from 'helper';

// file rendered is only for note module
type Props = {
  file: EmailFileType;
  deleteFile?: (id: number, attach_id: number) => void;
  hideDownload?: boolean;
  index?: number;
};
export const EmailAttachmentTypeRender = (props: Props) => {
  const { file, deleteFile, hideDownload, index } = props;

  const renderFile = () => {
    const responseFile = file;
    switch (file.contentType?.split('/')[0]) {
      case 'image':
        return (
          <>
            <Image
              imgPath={responseFile?.path}
              imgClassName="absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor"
              serverPath={!!responseFile?.path}
            />
          </>
        );
      case 'video':
        return (
          <>
            <Icon
              iconType="videoIconFilledPrimaryColor"
              className="p-[18px] absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor bg-ipGray__transparentBG"
            />
          </>
        );
      case 'application':
        return (
          <>
            <Icon
              iconType="fileIconFilledPrimaryColor"
              className="p-[15px] absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor bg-ipGray__transparentBG"
            />
          </>
        );
      default:
        return (
          <>
            <div className="hidden">
              <Image
                imgPath={responseFile?.path}
                serverPath
                imgClassName="absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor"
              />
            </div>
            <Icon
              iconType="fileIconFilledPrimaryColor"
              className="p-[15px] bg-ipGray__transparentBG absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor"
            />
          </>
        );
    }
  };

  return (
  <>
  {renderFile()}
  <div className="action__btn__wrapper items-center justify-end absolute top-[8px] right-[10px] hidden z-[3] group-hover:flex">
        {!hideDownload && (
          <>
            <Icon
              className="view__btn cursor-pointer w-[20px] h-[20px] p-[4px] rounded-[5px] bg-[#ffffff] mr-[5px] hover:bg-black"
              onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                e.stopPropagation();
                e.preventDefault();
                window.open(file?.path, '_blank');
              }}
              iconType="eyeFilled"
            />
            <Icon
              className="download__btn cursor-pointer w-[20px] h-[20px] p-[4px] rounded-[5px] bg-[#ffffff] mr-[5px] hover:bg-black"
              onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
                e.stopPropagation();
                e.preventDefault();
                downloadAttachmentFile({
                  url: file?.path,
                  fileName: file.filename,
                });
              }}
              iconType="timelineDocumentDownloadIcon"
            />
          </>
        )}
        {deleteFile && (
          <button
            type="button"
            className="delete__btn bg-ip__white__text__color group rounded-[5px] duration-500 hover:shadow-none hover:bg-ip__black__text__color"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              e.preventDefault();
              return index !== undefined && file.id && deleteFile(index, file.id);
            }}
          >
            <Icon
              className="p-0 w-[20px] h-[20px] invert group-hover:invert-0"
              iconType="closeBtnFilled"
            />
          </button>
        )}
      </div>
  </>);
};
