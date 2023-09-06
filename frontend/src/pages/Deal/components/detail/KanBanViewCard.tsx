// ** Import Packages **
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ** Components **
import { TableActionButton } from 'components/Button/TableActionButton';
import DateFormat from 'components/DateFormat';
import DeleteModal from 'components/DeleteComponents/DeleteModal';
import Icon from 'components/Icon';

// ** Types **
import { DealKanBanType } from 'pages/Deal/types/kanbanDeal.type';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** services **

// ** Constant **
import { STAGE_TYPES } from 'constant';
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';
import { ToastMsg } from 'constant/toast.constants';

// ** others **
import { setUrlParams, usCurrencyFormat } from 'utils/util';
import { useDeleteLeadMutation } from 'redux/api/leadApi';

const KanBanViewCard = (
  deal: DealKanBanType,
  setIsDealUpdate: (value: boolean) => void
) => {
  const { dealId, description, dealName, deal_value, closing_date, stageType } =
    deal;

  // ** states **
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [cardBgColor, setCardBgColor] = useState('');
  // ** hooks **
  const navigate = useNavigate();

  // ** custom hooks **

  const [deleteLeadsAPI, { isLoading: isDeleteDealsLoading }] =
    useDeleteLeadMutation();

  const { updateDealPermission, deleteDealPermission } = usePermission();

  const permissionArray: {
    label: string;
    onClick: () => void;
    Icon?: JSX.Element;
  }[] = [];

  permissionArray.push({
    label: 'View',
    Icon: <Icon className="i__Icon" iconType="permissionEditFilled" />,
    onClick: () =>
      navigate(setUrlParams(PRIVATE_NAVIGATION.deals.detailPage, dealId)),
  });

  if (updateDealPermission) {
    permissionArray.push({
      label: 'Edit',
      Icon: <Icon className="i__Icon" iconType="permissionEditFilled" />,
      onClick: () =>
        navigate(setUrlParams(PRIVATE_NAVIGATION.deals.edit, dealId)),
    });
  }

  if (deleteDealPermission) {
    permissionArray.push({
      label: 'Delete',
      Icon: <Icon className="i__Icon" iconType="deleteFilled" />,
      onClick: () => {
        setOpenDeleteDealModal();
      },
    });
  }

  useEffect(() => {
    if (stageType) {
      const index = STAGE_TYPES.findIndex((stage) => stage.value === stageType);
      setCardBgColor(index > -1 ? `${STAGE_TYPES[index].color}card` : '');
    }
  }, [stageType]);

  const setOpenDeleteDealModal = () => {
    setOpenDeleteModal(true);
  };

  const onDeleteAll = async () => {
    const deleteDealsIds: number[] = [];
    if (dealId) {
      deleteDealsIds.push(dealId);
    }
    const data = await deleteLeadsAPI({
      data: { allId: deleteDealsIds, message: ToastMsg.deal.deleteMsg },
    });
    if (!('error' in data)) {
      setIsDealUpdate(true);
      closeModal();
    }
  };

  const closeModal = () => {
    setOpenDeleteModal(false);
  };

  return (
    <>
      <div className={`inner__card ${cardBgColor}`}>
        <div className="cn__wrapper">
          <TableActionButton filedArray={[...permissionArray]} />
          <h3 className="title">{dealName}</h3>
          <p className="text">{description || ''}</p>
          <div className="valueTime">
            <div className="price__value">
              <span className="currencySign">$</span>
              <span className="value">
                {' '}
                {usCurrencyFormat(deal_value || '') || 0}
              </span>
            </div>
            {closing_date && (
              <div className="time">
                <DateFormat date={closing_date} />
              </div>
            )}
          </div>
        </div>
      </div>
      <DeleteModal
        isOpen={openDeleteModal}
        deleteOnSubmit={() => onDeleteAll()}
        isLoading={isDeleteDealsLoading}
        closeModal={closeModal}
        moduleName="this deal"
      />
    </>
  );
};

export default KanBanViewCard;
