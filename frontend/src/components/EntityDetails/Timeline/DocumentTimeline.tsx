// ** Import Packages **
import { useState } from 'react';
import { useDispatch } from 'react-redux';

// ** Components **
import Icon from 'components/Icon';
import LinkPreview from 'components/LinkPreview';
import DeleteAttachmentModal from 'components/detail-components/Attachment/components/DeleteAttachmentModal';
import { DocumentTypeRender } from './components/DocumentTypeRender';

// ** Redux **
import { useDeleteAttachmentMutation } from 'redux/api/attachmentApi';
import { setLoadPinTimeLines } from 'redux/slices/commonSlice';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** Type **
import {
  DocumentTimeline as DocumentTimelineType,
  TimelineType,
} from './types';

// ** Service **
import { getPresignedImageUrl } from 'services/wasabi.service';

// ** Helper **
import { downloadAttachmentFile } from 'helper';

const DocumentTimeline = ({
  documents: documents1,
  setHistoryData,
  setIsDocument,
}: {
  documents: DocumentTimelineType[] | undefined;
  setHistoryData?: React.Dispatch<React.SetStateAction<TimelineType[]>>;
  setIsDocument?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [documents, setDocuments] = useState(documents1);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    id: number | null;
  }>({
    isOpen: false,
    id: null,
  });
  const dispatch = useDispatch();

  // ** APIS **
  const [deleteAttachmentAPI, { isLoading: isDeleteAttachmentLoading }] =
    useDeleteAttachmentMutation();

  const deleteAttachment = async (documentId: number) => {
    const data = await deleteAttachmentAPI({
      id: documentId,
    });

    if ('data' in data) {
      setDocuments(data?.data[1]);
      setModal({
        id: null,
        isOpen: false,
      });
      // refreshTimeline();
      if (setHistoryData) {
        setHistoryData((prev) => {
          const finIndex = prev.findIndex((obj) => obj.id === data.data.id);
          prev.splice(finIndex, 1);
          return [...prev];
        });
        dispatch(setLoadPinTimeLines({ pinTimeline: true }));
      }
      if (setIsDocument) {
        setIsDocument(true);
      }
    }
  };
  const { deleteDocumentPermission } = usePermission();
  const getDocumentSize = (size: number) => {
    if (size / 1024 / 1024 > 1) {
      return `${(size / 1024 / 1024).toFixed(2)} MB`;
    }
    if (size / 1024 > 0) {
      return `${(size / 1024).toFixed(2)} KB`;
    }
  };

  return (
    <div className="timeline__document__listing w-full">
      {documents?.map((document, index) => {
        const isDeleted = document?.deleted_at;
        return (
          <div
            className="timeline__document__list__box flex items-center w-full mb-[15px] last:mb-0"
            key={`${Number(index)}_document_timeline`}
          >
            {document?.type === 'link' && !isDeleted ? (
              <>
                <div className="timeline__contant__wrapper w-[calc(100%_-_41px)] pt-[9px] sm:w-[calc(100%_-_29px)] sm:pt-[7px]">
                  <div className="flex flex-wrap items-center w-full">
                    <div className="text-[16px] font-biotif__Regular text-black">
                      <span>{document?.doc_details?.original_name}</span>
                      <a
                        className="text-[16px] text-primaryColor font-biotif__Regular underline inline-block"
                        href={document?.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <LinkPreview url={document?.url} />
                      </a>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {!isDeleted && (
                  <>
                    <div className="img__wrapper w-[70px] h-[70px] relative">
                      <DocumentTypeRender document={document} />
                    </div>
                    <div className="documnet__details pl-[20px] w-[calc(100%_-_70px)]">
                      <div className="documnet__header flex flex-wrap items-start">
                        {!isDeleted && (
                          <div className="action__btn__wrapper inline-flex items-center mt-[-4px]">
                            <Icon
                              className="cursor-pointer w-[30px] h-[30px] p-[7px] rounded-full hover:bg-[#e6e6e6]"
                              onClick={async (e) => {
                                e.stopPropagation();
                                e.preventDefault();

                                const imgURL = document?.url;
                                if (imgURL) {
                                  const downloadURL =
                                    await getPresignedImageUrl(imgURL);
                                  downloadAttachmentFile({
                                    url: downloadURL,
                                    fileName:
                                      document?.doc_details.original_name,
                                  });
                                }
                              }}
                              iconType="timelineDocumentDownloadIcon"
                            />
                            <p>{document?.doc_details.original_name}</p>
                            {deleteDocumentPermission && (
                              <Icon
                                className="cursor-pointer w-[30px] h-[30px] p-[9px] rounded-full hover:bg-[#e6e6e6]"
                                onClick={() =>
                                  setModal({
                                    id: document.id,
                                    isOpen: true,
                                  })
                                }
                                iconType="timelineDocunetCrossIcon"
                              />
                            )}
                          </div>
                        )}
                      </div>
                      {!isDeleted && (
                        <div className="text-[14px] font-biotif__Regular text-black">
                          {getDocumentSize(document?.doc_details?.size)}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        );
      })}
      {modal.isOpen && (
        <DeleteAttachmentModal
          isOpen={modal.isOpen}
          closeModal={() =>
            setModal({
              id: null,
              isOpen: false,
            })
          }
          deleteAttachment={() => modal.id && deleteAttachment(modal.id)}
          isLoading={isDeleteAttachmentLoading}
        />
      )}
    </div>
  );
};
export default DocumentTimeline;
