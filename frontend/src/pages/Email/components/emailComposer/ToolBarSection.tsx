// ** Import Packages **
import {
  DialogType,
  RichTextEditorComponent,
} from '@syncfusion/ej2-react-richtexteditor';
import { useEffect } from 'react';

// ** Components **
import Icon from 'components/Icon';
import InsertEmoji from '../emailTemplate/InsertEmoji';
import InsertSignature from '../emailTemplate/InsertSignature';

// ** Constant **
import { ATTACHMENT_FILE_TYPES_FOR_GMAIL } from 'constant/fileArray.constant';

type Props = {
  attachmentUpload: React.ChangeEventHandler<HTMLInputElement>;
  editorRef: React.RefObject<RichTextEditorComponent>;
  setIsInlineModeOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isInlineModeOpen?: boolean;
};

const ToolBarSection = (props: Props) => {
  const { attachmentUpload, editorRef, isInlineModeOpen, setIsInlineModeOpen } =
    props;

  useEffect(() => {
    // editorRef.current?.focusIn();
  }, []);

  return (
    <div className="left__action__bar flex flex-wrap items-center mb-[10px] lg:w-full sm:justify-between">
      <button
        onClick={() => {
          const text = editorRef?.current?.getText();

          if (isInlineModeOpen) {
            setIsInlineModeOpen?.(!isInlineModeOpen);
            editorRef.current?.hideInlineToolbar();
          }

          if (text && !isInlineModeOpen) {
            editorRef.current?.selectAll();
            setIsInlineModeOpen?.(!isInlineModeOpen);
            editorRef.current?.showInlineToolbar();
          }
        }}
        className="action__btn"
      >
        <Icon iconType="composeMailAlphabetFilledIcon" />
      </button>

      <button className="action__btn upload__file">
        <Icon iconType="composeMailUploadFileFilledIcon" />
        <div className="e-folder">
          <div className="e-folder-name">
            <input
              type="file"
              multiple
              onChange={attachmentUpload}
              accept={`${ATTACHMENT_FILE_TYPES_FOR_GMAIL.join(',')}`}
            />
          </div>
        </div>
      </button>
      <button
        onClick={() => editorRef.current?.showDialog(DialogType.InsertLink)}
        className="action__btn"
      >
        <Icon iconType="composeMailLinkFilledIcon" />
      </button>
      <InsertEmoji editorRef={editorRef} />
      {/* 
      // TODO: following commented is for future use. 
      */}
      {/* <button className="action__btn">
        <Icon iconType="composeMailDriveFilledIcon" />
      </button> */}
      <button
        className="action__btn"
        onClick={() => editorRef.current?.showDialog(DialogType.InsertImage)}
      >
        <Icon iconType="composeMailImgFilledIcon" />
      </button>
      {/* <button className="action__btn">
        <Icon iconType="composeMailLocktimeFilledIcon" />
      </button> */}
      <InsertSignature editorRef={editorRef} />
    </div>
  );
};

export default ToolBarSection;
