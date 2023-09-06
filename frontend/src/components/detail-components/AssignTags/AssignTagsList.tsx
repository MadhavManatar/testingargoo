import { fontColorBasedOnBgColor } from 'utils/util';
import { AssignTagsListProps } from './types/assignTags.type';
import { tagResponse } from 'pages/Setting/general-setting/common-controls/Tag/types/tag.type';
import { ListManager } from 'react-beautiful-dnd-grid';
import { ListElement } from './tag';

const AssignTagsList = (props: AssignTagsListProps) => {
  const {
    assignedTags,
    setAssignedTags,
    deleteAssignedTag,
    editTagsPermission,
    isFullList = false,
    setModal,
    setDisableSaveBtn,
    setAlreadyAssignID,
  } = props;
  const tagList = isFullList
    ? assignedTags?.list
    : assignedTags?.list?.slice(0, 5);

  // ReOrder Function
  const reorder = (
    list: tagResponse[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list || []);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // On Tag ReArrange Save In State
  const onArrange = async (
    sourceIndex: number | undefined,
    targetIndex: number | undefined
  ) => {
    if (sourceIndex !== undefined && targetIndex !== undefined) {
      if (setDisableSaveBtn) setDisableSaveBtn(false);
      const items = reorder(tagList, sourceIndex, targetIndex);
      if (items && setAssignedTags) {
        setAssignedTags({
          list: items,
          total: items.length,
        });
      }
      const reArrangeTagIds: number[] = [];
      items.map((val) => reArrangeTagIds.push(Number(val.tag.id)));
    }
  };

  // Delete Tag From State
  const deleteTagFromState = (tagIndex: number, tagId: number) => {
    setAlreadyAssignID?.((prev) => {
      const filterData = prev.filter((val) => val !== tagId);
      return filterData;
    });

    const assignedTagsNew = assignedTags.list.filter(
      (tag) => tag.id !== tagIndex
    );

    setAssignedTags?.({
      list: assignedTagsNew,
      total: assignedTagsNew.length,
    });
    if (setDisableSaveBtn) setDisableSaveBtn(false);
  };

  return tagList?.length && isFullList ? (
    <div className="assign__tag__list">
      <ListManager
        items={tagList}
        direction="horizontal"
        maxItems={4}
        render={(item) => {
          return (
            <ListElement
              tagData={item}
              key={item.tag.id}
              editTagsPermission={editTagsPermission}
              deleteTagFromState={deleteTagFromState}
            />
          );
        }}
        onDragEnd={onArrange}
      />
    </div>
  ) : (
    <>
      {tagList.map((val, index) => {
        const fontColor = fontColorBasedOnBgColor(
          val.tag.color,
          'white',
          'black'
        );
        const btnArrowColor = `after:bg-${fontColor} before:bg-${fontColor}`;
        return (
          <span
            className="badge square__round primary__badge mr-[8px] mb-[6px] py-[3px] px-[8px] lg:text-[12px] lg:px-[10px]"
            key={index}
            style={{
              backgroundColor: val.tag.color,
              color: fontColor,
            }}
          >
            {val.tag.name}
            <button
              className={`close__btn w-[10px] h-[10px] ml-[6px] relative top-0 ${btnArrowColor}`}
              // disabled={!editTagsPermission}
              onClick={() => deleteAssignedTag(val.tag.id, val.tag)}
            >
              .
            </button>
          </span>
        );
      })}
      {!isFullList && assignedTags?.list.length > 5 ? (
        <span
          onClick={() => setModal && setModal()}
          className="inline-block mr-[8px] mb-[6px] py-[4px] font-biotif__Medium relative top-[1px] lg:text-[12px] lg:px-[2px] cursor-pointer hover:underline"
        >
          {`+ ${assignedTags.list.length - tagList.length} more `}
        </span>
      ) : null}
    </>
  );
};

export default AssignTagsList;
