// ** components **
import Icon from 'components/Icon';
import { AttachmentFileTypeProps } from '../types/attachment.types';

export const AttachmentFileTypeRenderer = (props: AttachmentFileTypeProps) => {
  const { mimeType, attach, onClickView } = props;

  const renderFile = () => {
    switch (mimeType?.split('/')[0]) {
      case 'image':
        return (
          <>
            <Icon className="p-0" iconType="imageIconFilledPrimaryColor" />
            <div
              className="text w-[calc(100%_-_25px)] pl-[7px] relative top-[2px] text-[16px] font-biotif__Regular cursor-pointer duration-500 text-ip__Blue hover:underline ellipsis__2"
              onClick={onClickView}
            >
              {attach?.original_name}
            </div>
          </>
        );
      case 'video':
        return (
          <>
            <Icon className="p-0" iconType="videoIconFilledPrimaryColor" />
            <div className="text w-[calc(100%_-_25px)] pl-[7px] relative top-[2px] text-[16px] font-biotif__Regular cursor-pointer duration-500 text-ip__Blue hover:underline ellipsis__2">
              {attach?.original_name}
            </div>
          </>
        );

      case 'application':
        return (
          <>
            <Icon className="p-0" iconType="fileIconFilledPrimaryColor" />
            <div
              className="text w-[calc(100%_-_25px)] pl-[7px] relative top-[2px] text-[16px] font-biotif__Regular cursor-pointer duration-500 text-ip__Blue hover:underline ellipsis__2"
              onClick={onClickView}
            >
              {attach?.original_name}
            </div>
          </>
        );

      default:
        return (
          <>
            <Icon className="p-0" iconType="linkIconFilledPrimaryColor" />
            <div
              className="text w-[calc(100%_-_25px)] pl-[7px] relative top-[2px] text-[16px] font-biotif__Regular cursor-pointer duration-500 text-ip__Blue hover:underline ellipsis__2"
              onClick={onClickView}
            >
              {attach?.url}
            </div>
          </>
        );
    }
  };
  return renderFile();
};
