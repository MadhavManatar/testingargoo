// ** Import Packages **
import Icon from 'components/Icon';
import { fontColorBasedOnBgColor } from 'utils/util';

// ** Redux **
import {
  useAssignTagMutation,
  useLazyGetAssignedTagByModelRecordIdQuery,
} from 'redux/api/tagApi';

// ** Type **
import { ICellRendererParams } from 'ag-grid-community';
import { AssignTagsProps } from 'components/EntityDetails/types';
import { tag } from 'components/detail-components/AssignTags/types/assignTags.type';

// ** Constant **
import { TagPermissions } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';

const useTagListView = () => {
  const [getAssignedTagByModelRecordId] =
    useLazyGetAssignedTagByModelRecordIdQuery();

  const showTagList = (tagLIstViewProps: showTagListProps) => {
    const { params, openAddTagModal } = tagLIstViewProps;
    // Hooks

    return (
      <>
        {params?.data?.associated_tags?.length > 0 ? (
          <>
            <div className="agGrid__prelated_contactshone__wrapper flex flex-wrap items-center group">
              <span
                className="badge square__round primary__badge mr-[8px] mb-[6px] py-[3px] px-[8px] lg:text-[12px] lg:px-[10px]"
                key={window.crypto.randomUUID()}
                style={{
                  backgroundColor:
                    params?.data?.associated_tags?.[0]?.tag?.color || '#3a25f1',
                  color: fontColorBasedOnBgColor(
                    params?.data?.associated_tags?.[0]?.tag?.color,
                    'white',
                    'black'
                  ),
                }}
              >
                {params?.data?.associated_tags?.[0]?.tag?.name}
              </span>

              <button
                ref={(ref) => {
                  if (!ref) return;
                  ref.onclick = (e) => {
                    e.stopPropagation();
                  };
                }}
                onMouseDown={() => openAddTagModal(params?.data?.id || -1)}
                className={`${'shrink-0 text-[14px] leading-normal text-primaryColorSD hover:underline'}`}
              >
                {params?.data?.associated_tags?.length > 1 ? (
                  <>
                    + {Number(params?.data?.associated_tags?.length) - 1} more
                  </>
                ) : (
                  <Icon
                    className="hidden relative top-[-2px] group-hover:flex"
                    iconType="offerTagsFilledIcon"
                  />
                )}
              </button>
            </div>
          </>
        ) : null}
      </>
    );
  };

  const getAssignedTags = async (
    accountId: number | null,
    setAssignedTags: React.Dispatch<React.SetStateAction<AssignTagsProps>>,
    assignedTags: AssignTagsProps,
    moduleName: string
  ) => {
    // Custom Hooks
    if (accountId) {
      const { data, error } = await getAssignedTagByModelRecordId(
        {
          modelName: TagPermissions.ACCOUNT,
          id: accountId,
          params: {
            select: 'tag',
            'q[model_name]': moduleName,
          },
        },
        true
      );

      if (data && !error) {
        setAssignedTags({ list: data?.rows, total: data?.count });
      }
    }

    return {
      getAssignedTags,
      assignedTags,
    };
  };
  const deleteAssignedTags = (
    accountId: number | null,
    setAssignedTags: React.Dispatch<React.SetStateAction<AssignTagsProps>>,
    assignedTags: AssignTagsProps,
    moduleName: string
  ) => {
    const [assignTag] = useAssignTagMutation();

    const deleteAssignedTag = async (deletedId: number, tagDetail?: tag) => {
      const filteredArray = assignedTags.list.filter((obj) => {
        return obj.tag.id !== tagDetail?.id && obj.tag.name !== tagDetail?.name;
      });
      setAssignedTags({ list: filteredArray, total: filteredArray.length });
      callAssignTagAPI(deletedId, accountId || 0);
    };

    const callAssignTagAPI = async (deletedId: number, account_id: number) => {
      await assignTag({
        id: account_id,
        data: {
          modelName: moduleName,
          tags: { deletedTagIds: [deletedId] },
          message: ToastMsg.common.deleteTag,
        },
      });
    };

    return {
      deleteAssignedTag,
    };
  };

  return { showTagList, getAssignedTags, deleteAssignedTags };
};
export default useTagListView;

export type showTagListProps = {
  params: ICellRendererParams<any, any>;
  onRowClickNavigateLink: string;
  openAddTagModal: (id: number) => void;
};
