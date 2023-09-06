import parse from 'html-react-parser';
import { smileys } from 'constant/emailCompose';

import { useState } from 'react';
import {
  NodeSelection,
  RichTextEditorComponent,
} from '@syncfusion/ej2-react-richtexteditor';

import Dropdown from 'components/Dropdown';
import Icon from 'components/Icon';

type Props = {
  editorRef: React.RefObject<RichTextEditorComponent>;
};

const InsertEmoji = (props: Props) => {
  const { editorRef } = props;

  let range: Range | null;
  const selection: NodeSelection = new NodeSelection();
  const [saveSelection, setSaveSelection] = useState<NodeSelection | null>();

  const insertField = (emoji: string) => {
    saveSelection?.restore();
    editorRef.current?.executeCommand('insertHTML', emoji);
    editorRef.current?.formatter.saveData?.();
  };

  const setCursor = () => {
    (editorRef.current?.contentModule.getEditPanel?.() as HTMLElement).focus();
    range = selection.getRange(document);
    setSaveSelection(selection.save(range, document));
  };

  return (
    <>
      <div onClick={() => setCursor()}>
        <Dropdown
          className="tippy__dropdown__emoji"
          placement="top"
          content={({ close }) => (
            <div onClick={close} className="emoji__wrapper">
              {smileys.map((smiley, key) => (
                <div
                  key={key}
                  className="emoji__box"
                  title={smiley.title}
                  onClick={() => insertField(smiley.content)}
                >
                  {parse(smiley.content)}
                </div>
              ))}
            </div>
          )}
        >
          <button className="action__btn !mr-[6px]">
            <Icon iconType="composeMailEmojiFilledIcon" />
          </button>
        </Dropdown>
      </div>
    </>
  );
};
export default InsertEmoji;
