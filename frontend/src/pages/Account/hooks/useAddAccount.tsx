// ** Import Packages **
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

// ** Redux **
import { setAccountQuickAdd } from 'redux/slices/commonSlice';

// ** Helper **
import generateAccountFormData from '../helper/account.helper';

// ** Types **
import {
  AddAccountFormFieldsType,
  UseAddAccountPropsType,
} from '../types/account.types';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Util **
import { setUrlParams } from 'utils/util';

const useAddAccount = (props: UseAddAccountPropsType) => {
  const { isQuickModal, onAdd, addAccountAPI, closeModal } = props;

  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const addAccount = async (formVal: AddAccountFormFieldsType) => {
    const { annual_revenue } = formVal;

    const updatedAnnualValue = annual_revenue
      ?.match(/(\d+)(\.\d+)?/g)
      ?.join('');

    const AccountFormData = generateAccountFormData({
      ...formVal,
      annual_revenue: updatedAnnualValue || '0',
    });

    const data = await addAccountAPI({
      data: AccountFormData,
    });

    if ('data' in data && !('error' in data)) {
      if (isQuickModal && pathname === PRIVATE_NAVIGATION.accounts.view) {
        dispatch(setAccountQuickAdd({ account: true }));
      }
      if (closeModal) {
        closeModal();
        onAdd?.(data);
      } else {
        navigate(
          setUrlParams(PRIVATE_NAVIGATION.accounts.detailPage, data?.data?.id)
        );
      }
    }
  };

  return {
    addAccount,
  };
};

export default useAddAccount;
