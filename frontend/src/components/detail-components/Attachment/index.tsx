// ** external packages **
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Viewer from 'react-viewer';

// ** redux **
import {
  getIsAttachmentsLoad,
  setLoadAttachments,
  setLoadDetails,
} from 'redux/slices/commonSlice';

// ** components **
import { TableActionButton } from 'components/Button/TableActionButton';
import AuthGuard from 'pages/auth/components/AuthGuard';
import { AttachmentFileTypeRenderer } from './components/AttachmentFileTypeRenderer';
import AddAttachmentModal from './components/AddAttachmentModal';
import DeleteAttachmentModal from './components/DeleteAttachmentModal';
import InfiniteScroll from 'components/InfiniteScroll';
import DateFormat from 'components/DateFormat';

// ** hook **
import useAuth from 'hooks/useAuth';

import {
  AttachmentSkeleton,
  SingleAttachmentSkeleton,
} from './skeletons/AttachmentSkeleton';

// ** constants
import {
  BasicPermissionTypes,
  ModuleNames,
} from 'constant/permissions.constant';

// ** others **
import { fileSizeGenerator } from 'utils/util';
import { attachmentResponse } from './types/attachment.types';

import NoAttachmentsMsg, {
  NoAttachmentsAccessMsg,
} from './components/NoAttachmentsMsg';
import { downloadAttachmentFile } from 'helper';
import {
  useDeleteAttachmentsMutation,
  useLazyGetAttachmentsQuery,
} from 'redux/api/attachmentApi';

type Props = {
  modelName: string;
  modelRecordId: number;
};

function Attachment(props: Props) {
  const { modelName, modelRecordId } = props;

  // ** hook **
  const dispatch = useDispatch();
  const IsAttachmentLoad = useSelector(getIsAttachmentsLoad);

  // ** states **
  const [attachments, setAttachments] = useState<{
    allAttachments: attachmentResponse[];
    attachmentsImages: { src: string; alt: string }[];
  }>({
    allAttachments: [],
    attachmentsImages: [],
  });

  const [isOpen, setIsOpen] = useState<{
    addLink: boolean;
    addFile: boolean;
    delete: boolean;
    view: boolean;
    viewActiveIndex: number;
    deleteId: number;
  }>({
    addFile: false,
    addLink: false,
    delete: false,
    view: false,
    viewActiveIndex: 0,
    deleteId: 0,
  });

  const [attachmentPageInfo, setAttachmentPageInfo] = useState<{
    page: number;
    hasMore: boolean;
  }>({
    page: 1,
    hasMore: true,
  });

  // ** APIS **
  const [getAttachmentsAPI, { isLoading: isFetchAttachmentLoading }] =
    useLazyGetAttachmentsQuery();
  const [deleteAttachmentAPI, { isLoading: isDeleteAttachmentLoading }] =
    useDeleteAttachmentsMutation();

  const { hasAuthorized } = useAuth();

  const readPermission = hasAuthorized([
    { module: ModuleNames.ATTACHMENT, type: BasicPermissionTypes.READ },
  ]);
  useEffect(() => {
    if (!IsAttachmentLoad && attachmentPageInfo.hasMore && readPermission) {
      getAllAttachment();
    }
  }, [attachmentPageInfo]);

  useEffect(() => {
    if (IsAttachmentLoad) {
      resetAttachmentDataState();
      dispatch(setLoadAttachments({ attachment: false }));
    }
  }, [IsAttachmentLoad]);

  // ** functions **

  const resetAttachmentDataState = () => {
    setAttachmentPageInfo({
      page: 1,
      hasMore: true,
    });
    setAttachments({
      allAttachments: [],
      attachmentsImages: [],
    });
  };

  const getAllAttachment = async () => {
    const data = await getAttachmentsAPI(
      {
        data: {
          query: {
            'q[model_name]': modelName,
            'q[model_record_id]': modelRecordId,
            'q[is_deleted]': false,
            'include[creator]': 'all',
            page: attachmentPageInfo.page,
            limit: 10,
          },
        },
      },
      true
    );

    if ('data' in data) {
      if (data.data?.rows?.length) {
        setAttachments((prev) => ({
          allAttachments: [...prev.allAttachments, ...data.data.rows],
          attachmentsImages: [
            ...prev.attachmentsImages,
            ...data.data.rows
              .filter((val: { mimeType: string }) =>
                val?.mimeType?.includes('image')
              )
              .map((attach: attachmentResponse) => ({
                src: `${attach?.url}`,
                alt: `${attach?.original_name}`,
              })),
          ],
        }));
      } else {
        setAttachmentPageInfo((prev) => ({
          ...prev,
          hasMore: false,
        }));
      }
    }
  };

  const deleteAttachment = async () => {
    if (isOpen.deleteId) {
      const data = await deleteAttachmentAPI({
        data: { allId: isOpen.deleteId },
      });
      if (!('error' in data)) {
        resetAttachmentDataState();
        dispatch(
          setLoadDetails({
            loadModuleDetails: {
              leads: modelName === 'leads',
              accounts: modelName === 'accounts',
              contacts: modelName === 'contacts',
              deals: modelName === 'deals',
              activity: modelName === 'activities',
            },
          })
        );
        closeModal();
      }
    }
  };

  const closeModal = () => {
    setIsOpen({
      addFile: false,
      addLink: false,
      delete: false,
      view: false,
      viewActiveIndex: 0,
      deleteId: 0,
    });
  };

  const viewFile = (attach: attachmentResponse) => {
    if (attach?.mimeType?.includes('image')) {
      let currIndex = 0;
      attachments?.attachmentsImages?.forEach((val, id) => {
        if (val.src === `${attach?.url}`) {
          currIndex = id;
        }
      });
      setIsOpen({
        addFile: false,
        addLink: false,
        delete: false,
        view: true,
        viewActiveIndex: currIndex,
        deleteId: 0,
      });
    } else {
      const link = document.createElement('a');
      if (attach?.mimeType?.includes('pdf')) {
        link.href = `${attach?.url}`;
      } else {
        link.href = attach?.url;
      }
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const addFile = () => {
    setIsOpen({
      addFile: true,
      addLink: false,
      delete: false,
      view: false,
      viewActiveIndex: 0,
      deleteId: 0,
    });
  };

  const addLink = () => {
    setIsOpen({
      addFile: false,
      addLink: true,
      delete: false,
      view: false,
      viewActiveIndex: 0,
      deleteId: 0,
    });
  };

  const deleteFile = (id: number) => {
    setIsOpen((prev) => ({
      ...prev,
      add: false,
      delete: true,
      view: false,
      deleteId: id,
    }));
  };

  return (
    <>
      <div className="leads__tab__contant__wrapper">
        <div className="leads__tab__contant__box">
          <div className="border border-[#CCCCCC] rounded-[20px] sm:ml-[-15px] sm:mr-[-15px] sm:rounded-none sm:border-0 sm:bg-ipGray__transparentBG ip__attachments__sec">
            <div className="p-[30px] 3xl:px-[15px] 3xl:py-[22px] attachments__sec ip__FancyScroll">
              {isFetchAttachmentLoading && attachmentPageInfo.page === 1 ? (
                <AttachmentSkeleton />
              ) : (
                <>
                  <div className="attachments__sec__header flex flex-wrap items-center justify-between mb-[15px] sm:mb-0">
                    <h3 className="text-[20px] font-biotif__Medium text-ip__black__text__color mb-[12px]">
                      Documents
                    </h3>
                    <AuthGuard
                      permissions={[
                        {
                          module: ModuleNames.ATTACHMENT,
                          type: BasicPermissionTypes.CREATE,
                        },
                      ]}
                    >
                      <TableActionButton
                        filedArray={[
                          { label: 'Link', onClick: () => addLink() },
                          { label: 'File', onClick: () => addFile() },
                        ]}
                        buttonChild="Add Document"
                        buttonClassName="i__Button mb-[12px] primary__Btn"
                      />
                    </AuthGuard>
                  </div>
                  {readPermission ? (
                    <>
                      {attachments?.allAttachments?.length ? (
                        <div
                          id="attachment_table_Wrapper"
                          className="attachments__table__wrapper overflow-x-auto ip__FancyScroll"
                        >
                          <div className="attachments__table min-w-[1000px] border border-whiteScreen__BorderColor rounded-[10px]">
                            <div className="attachments__header py-[15px] border-b border-whiteScreen__BorderColor">
                              <div className="attachments__row flex flex-wrap">
                                <div className="attachments__cell w-[calc(25%_-_15px)] px-[20px] text-[18px] font-biotif__Medium file__name">
                                  File Name
                                </div>
                                <div className="attachments__cell w-[calc(25%_-_15px)] px-[20px] text-[18px] font-biotif__Medium attached__by">
                                  Attached By
                                </div>
                                <div className="attachments__cell w-[calc(25%_-_15px)] px-[20px] text-[18px] font-biotif__Medium date">
                                  Date Added
                                </div>
                                <div className="attachments__cell w-[calc(25%_-_15px)] px-[20px] text-[18px] font-biotif__Medium size">
                                  Size
                                </div>
                                <div className="attachments__cell w-[60px] text-[18px] font-biotif__Medium toggle__btn" />
                              </div>
                            </div>
                            <div
                              className="attachments__body py-[10px] min-h-[200px] max-h-[500px] overflow-y-auto ip__FancyScroll"
                              id="attachment_infiniteScroll"
                            >
                              <InfiniteScroll
                                hasMore={attachmentPageInfo.hasMore}
                                next={() =>
                                  attachmentPageInfo.hasMore &&
                                  setAttachmentPageInfo((prev) => ({
                                    ...prev,
                                    page: prev.page + 1,
                                  }))
                                }
                                isLoading={isFetchAttachmentLoading}
                                Loader={<SingleAttachmentSkeleton />}
                                scrollableTarget="attachment_infiniteScroll"
                              >
                                <>
                                  {attachments.allAttachments.map((attach) => {
                                    const file = attach.size
                                      ? fileSizeGenerator(attach?.size)
                                      : null;
                                    const attachmentActionArray =
                                      attach.mimeType &&
                                      attach.mimeType.includes('video')
                                        ? []
                                        : [
                                            {
                                              label: 'View',
                                              onClick: () => viewFile(attach),
                                            },
                                          ];
                                    if (
                                      hasAuthorized([
                                        {
                                          module: ModuleNames.ATTACHMENT,
                                          type: BasicPermissionTypes.DELETE,
                                        },
                                      ])
                                    ) {
                                      attachmentActionArray.push({
                                        label: 'Delete',
                                        onClick: () => deleteFile(attach?.id),
                                      });
                                    }

                                    // download option is only for file
                                    if (attach.type === 'file') {
                                      attachmentActionArray.push({
                                        label: 'Download',
                                        onClick: () =>
                                          downloadAttachmentFile({
                                            url: attach?.url,
                                            fileName: attach.original_name,
                                          }),
                                      });
                                    }

                                    return (
                                      <div
                                        className="attachments__row flex flex-wrap"
                                        key={attach.id}
                                      >
                                        <div className="attachments__cell w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] sm:pt-[8px] sm:pb-[9px] file__name">
                                          <div className="file__name__wrapper flex flex-wrap">
                                            <AttachmentFileTypeRenderer
                                              attach={attach}
                                              mimeType={attach.mimeType}
                                              onClickView={() =>
                                                viewFile(attach)
                                              }
                                            />
                                          </div>
                                        </div>
                                        <div className="attachments__cell w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[8px] sm:pb-[9px] attached__by">{`${
                                          attach?.creator?.first_name || ''
                                        } ${
                                          attach?.creator?.last_name || ''
                                        }`}</div>
                                        <div className="attachments__cell w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[8px] sm:pb-[9px] date">
                                          <DateFormat
                                            format="MMM d, yyyy, hh:mm a"
                                            date={attach?.created_at}
                                          />
                                        </div>
                                        <div className="attachments__cell w-[calc(25%_-_15px)] px-[20px] pt-[12px] pb-[10px] text-[16px] font-biotif__Regular sm:pt-[8px] sm:pb-[9px] size">{`${
                                          attach?.type === 'file'
                                            ? `${file?.size} ${file?.sizeType}`
                                            : ''
                                        }`}</div>
                                        <div className="attachments__cell w-[60px] pt-[12px] pb-[10px] toggle__btn flex justify-center">
                                          <TableActionButton
                                            filedArray={attachmentActionArray}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </>
                              </InfiniteScroll>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <NoAttachmentsMsg />
                      )}
                    </>
                  ) : (
                    <NoAttachmentsAccessMsg />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddAttachmentModal
        isOpen={isOpen.addFile || isOpen.addLink}
        closeModal={closeModal}
        modelName={modelName}
        modelRecordId={modelRecordId}
        isLink={isOpen.addLink}
      />
      <DeleteAttachmentModal
        isOpen={isOpen.delete}
        closeModal={closeModal}
        deleteAttachment={deleteAttachment}
        isLoading={isDeleteAttachmentLoading}
      />
      {isOpen.view ? (
        <Viewer
          visible={isOpen.view}
          onClose={closeModal}
          images={attachments.attachmentsImages}
          activeIndex={isOpen.viewActiveIndex}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export default Attachment;
