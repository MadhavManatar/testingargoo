// ** Import Packages **
import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  MarkdownEditor,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
} from '@syncfusion/ej2-react-richtexteditor';
import { Control, Controller } from 'react-hook-form';

// ** Types **
import { CreateEmailTemplateFormFieldType } from '../types/emailTemplate.type';

// ** Util **
import { convertAtoB } from 'utils/util';

type Props = {
  control: Control<CreateEmailTemplateFormFieldType, any>;
  editorRef: React.RefObject<RichTextEditorComponent>;
  setIsInlineModeOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isInlineModeOpen?: boolean;
};

const CreateEmailTemplateEditor = (props: Props) => {
  const { editorRef, control, isInlineModeOpen, setIsInlineModeOpen } = props;

  const onbegin = (args: { requestType: string; cancel: boolean }) => {
    if (args.requestType === 'EnterAction') {
      args.cancel = true;
    }
  };

  return (
    <>
      <Controller
        name="description"
        control={control}
        render={({ field: { onChange, value } }) => {
          if (editorRef.current && value) {
            editorRef.current.value = convertAtoB(value) as unknown as string;
          }
          return (
            <RichTextEditorComponent
              actionBegin={onbegin}
              placeholder="Type something..."
              ref={editorRef}
              saveInterval={0}
              id="inlineRTE"
              autoSaveOnIdle
              change={(e) => {
                onChange(e.value ?? '');
              }}
              quickToolbarSettings={{ actionOnScroll: 'none' }}
              inlineMode={{
                enable: true,
                onSelection: true,
              }}
              quickToolbarClose={() => setIsInlineModeOpen?.(!isInlineModeOpen)}
              quickToolbarOpen={() => setIsInlineModeOpen?.(true)}
              toolbarSettings={{
                items: [
                  'Bold',
                  'Italic',
                  'Underline',
                  'StrikeThrough',
                  'FontName',
                  'FontSize',
                  'FontColor',
                  'BackgroundColor',
                  '-',
                  'LowerCase',
                  'UpperCase',
                  'Formats',
                  'Alignments',
                  'NumberFormatList',
                  'BulletFormatList',
                  'Indent',
                  'Outdent',
                  '-',
                  'CreateLink',
                  'Image',
                  'ClearFormat',
                  'Print',
                  'SourceCode',
                  'FullScreen',
                  'Undo',
                  'Redo',
                ],
                enableFloating: true,
              }}
              format={{ width: 'auto' }}
              insertImageSettings={{
                saveFormat: 'Base64',
              }}
              // space value for open inline toolbar onclick
              value="<p>&nbsp;</p>"
            >
              <Inject
                services={[
                  Toolbar,
                  Image,
                  Link,
                  HtmlEditor,
                  QuickToolbar,
                  MarkdownEditor,
                ]}
              />
            </RichTextEditorComponent>
          );
        }}
      />
    </>
  );
};
export default CreateEmailTemplateEditor;
