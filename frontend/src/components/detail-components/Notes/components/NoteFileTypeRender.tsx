import Icon from 'components/Icon';
import Image from 'components/Image';
import { downloadAttachmentFile } from 'helper';
import { NoteResponseFileType } from '../types/notes.type';
import { getPresignedImageUrl } from 'services/wasabi.service';

type FileTypeRendererProps = {
  mimeType: string;
  file: File | NoteResponseFileType;
  deleteFile?: (id: number, attach_id: number) => void;
  index?: number;
  disableDownload?: boolean;
};

const FileTypeRenderer = (props: FileTypeRendererProps) => {
  const { file, mimeType, deleteFile, index, disableDownload = true } = props;
  const noteFile = file as File;
  const responseFile = file as NoteResponseFileType;

  const renderFile = () => {
    switch (mimeType?.split('/')[0]) {
      case 'image':
        return (
          <Image
            imgPath={responseFile?.url || noteFile}
            imgClassName="absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor"
            serverPath={!!responseFile?.url}
          />
        );
      case 'video':
        return (
          <Icon
            iconType="videoIconFilledPrimaryColor"
            className="p-[18px] absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor bg-ipGray__transparentBG"
          />
        );
      case 'application':
        return (
          <Icon
            iconType="fileIconFilledPrimaryColor"
            className="p-[15px] absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor bg-ipGray__transparentBG"
          />
        );
      default:
        return (
          <Icon
            iconType="fileIconFilledPrimaryColor"
            className="p-[15px] absolute top-0 left-0 !w-full !h-full object-cover object-center rounded-[10px] duration-500 hover:blur-[0px] border border-whiteScreen__BorderColor bg-ipGray__transparentBG"
          />
        );
    }
  };

  return (
    <>
      {renderFile()}{' '}
      <div className="action__btn__wrapper items-center justify-end absolute top-[8px] right-[10px] hidden z-[3] group-hover:flex">
        {disableDownload && (
          <>
            <Icon
              className="view__btn cursor-pointer w-[20px] h-[20px] p-[4px] rounded-[5px] bg-[#ffffff] mr-[5px] hover:bg-black"
              onClick={async (e: React.MouseEvent<HTMLSpanElement>) => {
                e.stopPropagation();
                e.preventDefault();

                const imgURL = responseFile?.url;
                if (imgURL) {
                  const viewURL = await getPresignedImageUrl(imgURL);
                  window.open(viewURL, '_blank');
                }
              }}
              iconType="eyeFilled"
            />
            <Icon
              className="download__btn cursor-pointer w-[20px] h-[20px] p-[4px] rounded-[5px] bg-[#ffffff] mr-[5px] hover:bg-black"
              onClick={async (e: React.MouseEvent<HTMLSpanElement>) => {
                e.stopPropagation();
                e.preventDefault();

                const imgURL = responseFile?.url;
                if (imgURL) {
                  const downloadURL = await getPresignedImageUrl(imgURL);
                  downloadAttachmentFile({
                    url: downloadURL,
                    fileName:
                      responseFile?.doc_details?.original_name || 'SmackDab',
                  });
                }
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
              return index !== undefined && deleteFile(index, responseFile?.id);
            }}
          >
            <Icon
              className="p-0 w-[20px] h-[20px] invert group-hover:invert-0"
              iconType="closeBtnFilled"
            />
          </button>
        )}
      </div>
    </>
  );
};

export default FileTypeRenderer;
