// =================== import packages ==================
import React, { Fragment, useState } from 'react';
// ======================================================
import Icon from 'components/Icon';
import Image from 'components/Image';
import { checkFileType, srcFilePath } from 'utils/util';
import FilePreview from './FilePreview';

type FileType = string | File;

interface Props {
  files: FileType[];
}

const Images = ({ file }: { file: FileType }) => {
  // ================= States ===================
  const [previewModal, setPreviewModal] = useState<FileType>();

  const handleFile = (value?: FileType) => setPreviewModal(value);
  return (
    <>
      <div onClick={() => handleFile(file)} className="dropZone__file__preview">
        <div className="inner__wrapper">
          <Image imgPath={file} />
          <button className="dropZone__close__btn">
            <Icon iconType="closeBtnFilled" />
          </button>
        </div>
      </div>
      {previewModal && (
        <FilePreview
          visible={!!previewModal}
          file={previewModal}
          onClose={() => handleFile()}
        />
      )}
    </>
  );
};
const Video = ({ file }: { file: FileType }) => {
  // ================= States ===================
  const [previewModal, setPreviewModal] = useState<FileType>();

  const handleFile = (value?: FileType) => setPreviewModal(value);
  return (
    <>
      <div onClick={() => handleFile(file)}>
        <video muted autoPlay controls src={srcFilePath(file)} />
      </div>
      {previewModal && (
        <FilePreview
          visible={!!previewModal}
          file={previewModal}
          onClose={() => handleFile()}
        />
      )}
    </>
  );
};
const Embed = ({ file }: any) => {
  // ================= States ===================
  const [previewModal, setPreviewModal] = useState<FileType>();

  const handleFile = (value?: FileType) => setPreviewModal(value);

  return (
    <>
      <div onClick={() => handleFile(file)}>
        <embed title="Smackdab" src={srcFilePath(file)} />
      </div>
      {previewModal && (
        <FilePreview
          visible={!!previewModal}
          file={previewModal}
          onClose={() => handleFile()}
        />
      )}
    </>
  );
};

const FileList = (props: Props) => {
  const { files } = props;

  const renderFileList = () => {
    return (
      <div className="dropZone__file__preview__wrapper">
        {' '}
        {React.Children.toArray(
          files.map((el, index) => {
            const fileType = checkFileType(el);
            return (
              <Fragment key={index}>
                {fileType?.startsWith('image') && <Images file={el} />}
                {fileType?.startsWith('video') && <Video file={el} />}
                {fileType?.startsWith('application') && <Embed file={el} />}
              </Fragment>
            );
          })
        )}
      </div>
    );
  };

  return <>{renderFileList()}</>;
};

export default FileList;
