import { fontColorBasedOnBgColor } from 'utils/util';
import { tagResponse } from 'pages/Setting/general-setting/common-controls/Tag/types/tag.type';
import Tippy from '@tippyjs/react';

interface TagDesignProps {
  tagData: tagResponse;
  editTagsPermission?: boolean;
  deleteTagFromState: (tagIndex: number, tagId: number) => void;
}

export const ListElement = (props: TagDesignProps) => {
  const { tagData, editTagsPermission, deleteTagFromState } = props;
  const fontColor = fontColorBasedOnBgColor(
    tagData.tag.color,
    'white',
    'black'
  );
  const btnArrowColor = `after:bg-${fontColor} before:bg-${fontColor}`;

  return (
    <>
      <Tippy content={tagData.tag.name} zIndex={999999}>
        <span
          className="badge square__round primary__badge flex items-center mr-[8px] mb-[6px] py-[3px] px-[8px] pr-0 lg:text-[12px] lg:px-[10px]"
          key={tagData.tag.id}
          style={{
            backgroundColor: tagData.tag.color,
            color: fontColor,
          }}
        >
          <span className="w-full whitespace-pre overflow-hidden text-ellipsis">
            {tagData.tag.name}
          </span>
          <button
            className={`close__btn w-[18px] h-[18px] ml-[6px] relative right-[3px] top-0 shrink-0 ${btnArrowColor}`}
            disabled={!editTagsPermission}
            onClick={() => deleteTagFromState(tagData.id, tagData.tag.id)}
          >
            .
          </button>
        </span>
      </Tippy>
    </>
  );
};
