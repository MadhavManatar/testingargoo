// ** Import Packages **
import { useEffect, useState } from 'react';

// ** Components **
import AlertModal from 'components/Modal/AlertModal';

// ** Services **


// ** Type **
import { DeleteDealPipelinePropsType } from '../types/deal-pipeline.types';
import { useLazyGetPipelineByIdQuery } from 'redux/api/pipelineApi';
import { useLazyGetAllDealStateQuery } from 'redux/api/dealStageHistoryApi';

const DeleteDealPipelineModal = ({
  isOpen,
  isLoading,
  closeModal,
  deleteOnSubmit,
  moduleName,
  pipelineId,
}: DeleteDealPipelinePropsType) => {
  const [isPipelineAssigned, setIsPipelineAssigned] = useState<boolean>(false);

  // ** APIS **
  const [getDealPipelineById, { isLoading: isDealPipelineLoading }] =
    useLazyGetPipelineByIdQuery();

  const [ getAllDealStageAPI, {isLoading: isDealStageLoading }] =
    useLazyGetAllDealStateQuery();

  useEffect(() => {
    if (pipelineId) {
      checkPipelineIsAssigned(pipelineId);
    }
  }, [pipelineId]);

  const checkPipelineIsAssigned = async (statusId: number) => {
    const { data, error } = await getDealPipelineById({ id: statusId }, true);
    if (data && !error) {
      const stageIds = data.stages.map((stage: { id: number }) => stage.id);
      const { data: stageData } = await getAllDealStageAPI({
        params: {
          'q[isCurrentActive]': true,
          'q[stage_id][in]': `n|${stageIds}`,
        },
      },true);
      if (stageData?.count) {
        setIsPipelineAssigned(stageData.count > 0);
      }
    }
  };

  return (
    <AlertModal
      visible={isOpen}
      onClose={closeModal}
      onCancel={closeModal}
      onSubmit={deleteOnSubmit}
      submitLoading={isLoading}
      width="800px"
      submitButtonText="Delete"
      submitButtonClass={`delete__Btn ${isPipelineAssigned ? 'disabled' : ''}`}
    >
      {isDealPipelineLoading || isDealStageLoading ? (
        <div className="flex items-center justify-center pl-[10px] my-[20px]">
          <div className="i__ButtonLoader i__ButtonLoader__ForLight p-[20px] border-[3px]" />
        </div>
      ) : (
        <h5 className="confirmation__title !w-full">
          {isPipelineAssigned
            ? 'Remove all stages from this pipeline before deleting it.'
            : `Are you sure you want to remove ${moduleName.toLowerCase()} ?`}
        </h5>
      )}
    </AlertModal>
  );
};

export default DeleteDealPipelineModal;
