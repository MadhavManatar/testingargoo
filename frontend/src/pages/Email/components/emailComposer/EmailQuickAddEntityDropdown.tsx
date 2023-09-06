// ** Import Packages **
import { useState } from 'react';

// ** Components **
import AddAccountModal from 'pages/Account/components/AddAccountModal';
import AuthGuard from 'pages/auth/components/AuthGuard';
import AddContactModal from 'pages/Contact/components/AddContactModal';
import AddDealModal from 'pages/Deal/components/AddDealModal';
import AddLeadModal from 'pages/Lead/components/AddLeadModal';

// ** Hook **
import usePermission from 'hooks/usePermission';

// ** Constant **
import { ModuleNames } from 'constant/permissions.constant';

// ** Type **
import { EmailModalType } from 'pages/Dashboard/types/dashboard.types';
import { EmailQuickAddEntityDropdownPropsType } from 'pages/Email/types/email.type';

const EmailQuickAddEntityDropdown = (
  props: EmailQuickAddEntityDropdownPropsType
) => {
  const { setValue, connectEntityWithComposeMail } = props;
  const {
    createLeadPermission,
    createContactPermission,
    createDealPermission,
    createAccountPermission,
  } = usePermission();
  const [modal, setModal] = useState<EmailModalType>();

  const openModal = (value: EmailModalType) => setModal(value);
  const closeModal = () => setModal(undefined);

  const afterAddEntity = (data: any, module: ModuleNames) => {
    setValue('autoSuggestAddress', `${module}-${data.id}`);
    connectEntityWithComposeMail(`${module}-${data.id}`);
  };

  return (
    <>
      <div className="tippy__dropdown__ul">
        <AuthGuard isAccessible={createDealPermission}>
          <div
            className="item"
            onClick={() => {
              openModal('deal');
            }}
          >
            <div className="item__link">
              <span className="item__text !text-[#808080] hover:!text-primaryColor">
                Link to a new Deal
              </span>
            </div>
          </div>
        </AuthGuard>
        <AuthGuard isAccessible={createLeadPermission}>
          <div className="item" onClick={() => openModal('lead')}>
            <div className="item__link">
              <span className="item__text !text-[#808080] hover:!text-primaryColor">
                Link to a new Lead
              </span>
            </div>
          </div>
        </AuthGuard>
        <AuthGuard isAccessible={createContactPermission}>
          <div className="item" onClick={() => openModal('contact')}>
            <div className="item__link">
              <span className="item__text !text-[#808080] hover:!text-primaryColor">
                Link to a new Contact
              </span>
            </div>
          </div>
        </AuthGuard>
        <AuthGuard isAccessible={createAccountPermission}>
          <div className="item" onClick={() => openModal('account')}>
            <div className="item__link">
              <span className="item__text !text-[#808080] hover:!text-primaryColor">
                Link to a new Account
              </span>
            </div>
          </div>
        </AuthGuard>
      </div>
      {/* add lead modal */}
      {modal === 'lead' && (
        <AddLeadModal
          isQuickModal
          isOpen={modal === 'lead'}
          closeModal={closeModal}
          onAdd={(data) => afterAddEntity(data, ModuleNames.LEAD)}
        />
      )}

      {/* add contact modal */}
      {modal === 'contact' && (
        <AddContactModal
          isQuickModal
          isOpen={modal === 'contact'}
          closeModal={closeModal}
          onAdd={(data) => afterAddEntity(data, ModuleNames.CONTACT)}
        />
      )}

      {/* add account modal */}
      {modal === 'account' && (
        <AddAccountModal
          isQuickModal
          isOpen={modal === 'account'}
          closeModal={closeModal}
          onAdd={(data) => afterAddEntity(data, ModuleNames.ACCOUNT)}
        />
      )}

      {/* add deal modal */}
      {modal === 'deal' && (
        <AddDealModal
          isQuickModal
          isOpen={modal === 'deal'}
          closeModal={closeModal}
          onAdd={(data) => afterAddEntity(data, ModuleNames.DEAL)}
        />
      )}
    </>
  );
};

export default EmailQuickAddEntityDropdown;
