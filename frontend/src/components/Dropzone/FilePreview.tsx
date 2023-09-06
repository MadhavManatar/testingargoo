import Image from 'components/Image';
import Modal from 'components/Modal';
import { checkFileType, srcFilePath } from 'utils/util';

interface Props {
  visible: boolean;
  file: string | File;
  onClose: () => void;
}

const FilePreview = ({ visible, file, onClose }: Props) => {
  const renderFile = () => {
    const fileType = checkFileType(file);
    if (fileType?.startsWith('image')) {
      return <Image imgPath={file} serverPath />;
    }
    if (fileType?.startsWith('video')) {
      return <video muted autoPlay controls src={srcFilePath(file)} />;
    }
    if (fileType?.startsWith('application')) {
      return <embed title="Smackdab" src={srcFilePath(file)} />;
    }
    return <></>;
  };

  return visible ? (
    <Modal visible={visible} showFooter={false} onClose={onClose}>
      <>{renderFile()}</>
    </Modal>
  ) : (
    <></>
  );
};

export default FilePreview;
