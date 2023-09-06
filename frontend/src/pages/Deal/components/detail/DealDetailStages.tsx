// ** Import Packages **
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// ** Redux **
import {
  getIsLoadDetailsLoad,
  setLoadTimeLines,
} from 'redux/slices/commonSlice';

// ** Components **
import DealStageArrowHeaderSkeleton from 'pages/Deal/skeletons/DealStageArrowHeaderSkeleton';
import AddDealLostModal from './AddDealLostModal';

// ** Hook **
import usePermission from 'hooks/usePermission';
import { useDealStages } from 'pages/Deal/hooks/useDealStages';

// ** Types **
import { DealResponseType } from 'pages/Deal/types/deals.types';

// ** Services **
import { useUpdateDealStageMutation } from 'redux/api/dealStageHistoryApi';

type Props = {
  dealData: DealResponseType;
  setReRenderOnStage: (arg: boolean) => void;
  reRenderOnStage: boolean;
  isShowMainLoader: boolean;
  setShowMainLoader: Dispatch<SetStateAction<boolean>>;
};

function DealDetailStages(props: Props) {
  // ** hooks **
  const { updateDealPermission } = usePermission();
  const dispatch = useDispatch();
  const isDealHeaderLoad = useSelector(getIsLoadDetailsLoad);

  // ** const **
  const {
    dealData,
    setReRenderOnStage,
    reRenderOnStage,
    isShowMainLoader,
    setShowMainLoader,
  } = props;

  // ** states **
  const [openDealLostModal, setOpenDealLostModal] = useState<boolean>(false);
  const [currentStageId, setCurrentStageId] = useState<number>();

  // ** APIS **
  const [updateDealStageAPI] = useUpdateDealStageMutation();

  const {
    currentActiveStage,
    dealStageArray,
    getDealStagesWithAge,
    lostStageId,
    setCurrentActiveStage,
    dealStageLoading,
  } = useDealStages({ dealId: dealData?.lead?.id });

  useEffect(() => {
    if (dealData.lead?.id || reRenderOnStage) {
      invokeGetDealStagesWithAge();
    }
  }, [dealData.lead?.id, reRenderOnStage, isDealHeaderLoad]);

  const invokeGetDealStagesWithAge = async () => {
    await getDealStagesWithAge();
    setShowMainLoader(false);
  };

  // ** functions ** //
  const updateDealStage = async (stage_id: number) => {
    const DealFormData = new FormData();
    DealFormData.append('stage_id', stage_id.toString());
    DealFormData.append('is_deal', 'true');
    DealFormData.append('deal_id', dealData.lead?.id?.toString() || '');
    const data = await updateDealStageAPI({ data: DealFormData });

    if ('data' in data) {
      setReRenderOnStage(true);
      dispatch(setLoadTimeLines({ timeline: true }));
    }
  };

  const onClickUpdateDeal = (data: {
    id: number;
    stage: string;
    age: string;
  }) => {
    if (data.id !== currentActiveStage?.id) {
      if (lostStageId.includes(data.id)) {
        setOpenDealLostModal(true);
        setCurrentStageId(data.id);
      } else {
        updateDealStage(data.id);

        const stageDetails = {
          id: data.id,
          value: data.stage,
          age: data.age,
        };
        setCurrentActiveStage(stageDetails);
      }
    }
  };

  const closeDealLostModal = (data?: string) => {
    setOpenDealLostModal(false);
    if (data === 'success') {
      const stageDetails2 = {
        id: currentStageId as number,
        value: '',
        age: '',
      };
      setCurrentActiveStage(stageDetails2);
      setReRenderOnStage(true);
    }
  };

  return (
    <>
      {(dealStageLoading && isShowMainLoader) || isDealHeaderLoad?.deals ? (
        <DealStageArrowHeaderSkeleton />
      ) : (
        <div className="ip__arrow__tabs__wrapper mb-[20px] lg:mt-[10px] sm:hidden">
          <div className="ip__arrow__tabs__wrapper relative after:content-[''] after:absolute after:top-0 after:right-0 after:h-full after:w-[30px] after:bg-gradient-to-r after:from-[#fff0] after:to-[#fff] after:z-[2]">
            <ul className="ip__arrow__tabs__ul ip__hideScrollbar">
              {dealStageArray.map((obj, index) => (
                <li
                  key={index}
                  className={`item ${currentActiveStage?.id === obj.id ? 'active' : ''
                    }`}
                >
                  <button
                    className="link"
                    disabled={!updateDealPermission}
                    onClick={() =>
                      onClickUpdateDeal({
                        id: obj.id,
                        stage: obj.value,
                        age: obj.age,
                      })
                    }
                  >
                    <div className="flex flex-wrap items-center">
                      <svg
                        className="arrow__before"
                        width="29"
                        height="72"
                        viewBox="0 0 29 72"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.31244 7.49387C-0.605764 4.16054 1.80025 0 5.6461 0H23.3417C26.1031 0 28.3417 2.23858 28.3417 5V36V67C28.3417 69.7614 26.1031 72 23.3417 72H5.6461C1.80025 72 -0.605766 67.8395 1.31244 64.5061L16.2815 38.4939C17.17 36.95 17.17 35.05 16.2815 33.5061L1.31244 7.49387Z"
                          fill="#D4EFDF"
                        />
                      </svg>
                      <div className="">{obj.label}</div>
                      {obj?.age && obj.age !== '0 hours' && (
                        <div className="text-[14px] font-biotif__Regular">
                          {obj.age}
                        </div>
                      )}
                      <svg
                        className="arrow__after"
                        width="44"
                        height="72"
                        viewBox="0 0 44 72"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 5C0 2.23858 2.23858 0 5 0H19.5146C21.2688 0 22.8947 0.919286 23.799 2.42242L42.4493 33.4224C43.4034 35.0084 43.4034 36.9916 42.4493 38.5776L23.799 69.5776C22.8947 71.0807 21.2688 72 19.5146 72H5C2.23857 72 0 69.7614 0 67V36V5Z"
                          fill="#D4EFDF"
                        />
                      </svg>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {openDealLostModal && (
        <AddDealLostModal
          isOpen={openDealLostModal}
          closeModal={closeDealLostModal}
          id={Number(dealData.lead?.id)}
          stageId={currentStageId}
        />
      )}
    </>
  );
}

export default DealDetailStages;
