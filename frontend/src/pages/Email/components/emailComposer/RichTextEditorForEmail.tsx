// ** external packages **
import { MentionComponent } from '@syncfusion/ej2-react-dropdowns';
import {
  HtmlEditor,
  Image,
  Inject,
  Link,
  MarkdownEditor,
  NodeSelection,
  QuickToolbar,
  RichTextEditorComponent,
  Toolbar,
} from '@syncfusion/ej2-react-richtexteditor';
import { useEffect, useRef, useState } from 'react';
import { Control, Controller } from 'react-hook-form';

// ** Redux **
import { useLazyGetSnippetSettingQuery } from 'redux/api/snippetSettingApi';

// ** Types **
import { SnippetModalType } from 'pages/Setting/general-setting/common-controls/Snippet/types/snippet.types';
import { EmailComposerFieldType } from '../../types/email.type';

// ** Util **
import { convertAtoB } from 'utils/util';

interface FieldPropsInterface {
  control: Control<EmailComposerFieldType, any>;
  editorRef: React.RefObject<RichTextEditorComponent>;
  setIsInlineModeOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isInlineModeOpen?: boolean;
}

const RichTextEditorForEmail = (fieldProps: FieldPropsInterface) => {
  const { control, editorRef, isInlineModeOpen, setIsInlineModeOpen } =
    fieldProps;

  const snippetFieldsData: { [key: string]: string } = { text: 'title' };

  const snippetRef = useRef<MentionComponent>(null);

  const [snippetList, setSnippetList] = useState<SnippetModalType>({});

  const [getSnippetsAPI] = useLazyGetSnippetSettingQuery();

  useEffect(() => {
    getSnippetList();
  }, []);

  const getSnippetList = async () => {
    const { data, error } = await getSnippetsAPI(
      {
        data: {
          query: {
            limit: 100,
            'q[type][in]': ['email', 'anywhere'],
            select: 'id,title,type,snippet',
          },
        },
      },
      true
    );
    if (data?.rows && !error && setSnippetList) {
      setSnippetList({ list: [...data.rows] || [] });
    }
  };

  const snippetItemTemplate = (data: any): JSX.Element => {
    const snippetTag = document.createElement('div');
    snippetTag.innerHTML = convertAtoB(data?.snippet);
    return (
      <div className="mention__li">
        <div key={data?.id} className="snippet__row w-full">
          <h3 className="snippet__title">{data?.title}</h3>
          <p className="description whitespace-pre overflow-hidden text-ellipsis">
            {snippetTag.innerText}
          </p>
        </div>
      </div>
    );
  };

  const displaySnippetTemplate = (data: any) => {
    return (
      // eslint-disable-next-line react/no-danger
      <div dangerouslySetInnerHTML={{ __html: convertAtoB(data?.snippet) }} />
    );
  };

  const handleSnippetChange = (args: {
    element: { querySelectorAll: (arg0: string) => any };
  }) => {
    const chips = args.element.querySelectorAll('.e-mention-chip');

    for (let i = 0; i < chips.length; i++) {
      const elem = chips[i].children;
      const childrenArray = Array.from(elem);
      for (let j = 0; j < childrenArray.length; j++) {
        chips[i].insertAdjacentElement('beforebegin', childrenArray[j]);
      }
      chips[i].remove();
    }
    const selection = new NodeSelection();
    const range = editorRef?.current?.getRange();
    if (range?.startContainer) {
      selection.setCursorPoint(
        document,
        range?.startContainer as unknown as Element,
        range?.startOffset
      );
    }
  };
  const onbegin = (args: { requestType: string; cancel: boolean }) => {
    if (args.requestType === 'EnterAction') {
      args.cancel = true;
    }
  };

  useEffect(() => {
    editorRef.current?.focusIn?.();
  }, []);

  return (
    <>
      <Controller
        name="html"
        control={control}
        render={({ field: { onChange, value } }) => {
          if (editorRef.current && value) {
            editorRef.current.value = value;
          }
          return (
            <>
              <RichTextEditorComponent
                ref={editorRef}
                actionBegin={onbegin}
                saveInterval={0}
                id="inlineRTE"
                autoSaveOnIdle
                change={(e) => onChange(e.value ?? '')}
                inlineMode={{
                  enable: true,
                  onSelection: true,
                }}
                quickToolbarClose={() =>
                  setIsInlineModeOpen?.(!isInlineModeOpen)
                }
                quickToolbarOpen={() => setIsInlineModeOpen?.(true)}
                quickToolbarSettings={{ actionOnScroll: 'none' }}
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
            </>
          );
        }}
      />
      <MentionComponent
        allowSpaces
        mentionChar="/"
        showMentionChar
        ref={snippetRef}
        id="mentionEditor"
        popupWidth="250px"
        popupHeight="200px"
        suggestionCount={100}
        fields={snippetFieldsData}
        change={handleSnippetChange}
        dataSource={snippetList.list}
        itemTemplate={snippetItemTemplate}
        displayTemplate={displaySnippetTemplate}
        target="#inlineRTE_rte-edit-view"
      />
    </>
  );
};
export default RichTextEditorForEmail;
