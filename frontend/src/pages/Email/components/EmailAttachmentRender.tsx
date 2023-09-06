import Icon from 'components/Icon';
import Image from 'components/Image';
import { EmailFileType } from '../types/email.type';

// file rendered is only for note module
type Props = {
  file: EmailFileType;
};
export const EmailAttachmentRender = (props: Props) => {
  const { file } = props;

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

  return <>{renderFile()}</>;
};
