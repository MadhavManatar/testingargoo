import Modal from 'components/Modal';
import {
  LinkEntityData,
  LinkEntityResponse,
} from 'pages/Email/types/emailLinkEntity.type';
import { useEffect, useState } from 'react';
import { useLazyGetMailLinksQuery } from 'redux/api/mailApi';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  email_id: number;
  openAddLinkEntityModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const LinkEntityListModal = (props: Props) => {
  const { isOpen, closeModal, email_id, openAddLinkEntityModal } = props;
  const [getLinkEntities, { data: linkEntities }] = useLazyGetMailLinksQuery();
  const [{ contacts, leads, accounts, deals }, setEntities] =
    useState<LinkEntityData>({
      contacts: [],
      leads: [],
      accounts: [],
      deals: [],
    });

  const onClose = () => {
    closeModal();
  };
  useEffect(() => {
    getLinkEntities(email_id);
  }, []);
  useEffect(() => {
    if (linkEntities && linkEntities.length) {
      const contactsData = linkEntities
        .filter((le: LinkEntityResponse) => le.contacts)
        .map((e: LinkEntityResponse) => e.contacts);
      const accountsData = linkEntities
        .filter((le: LinkEntityResponse) => le.accounts)
        .map((e: LinkEntityResponse) => e.accounts);
      const leadsData = linkEntities
        .filter(
          (le: LinkEntityResponse) => le.leads && le.model_name === 'leads'
        )
        .map((e: LinkEntityResponse) => e.leads);
      const dealsData = linkEntities
        .filter(
          (le: LinkEntityResponse) => le.leads && le.model_name === 'deals'
        )
        .map((e: LinkEntityResponse) => e.leads);
      setEntities({
        contacts: contactsData,
        accounts: accountsData,
        leads: leadsData,
        deals: dealsData,
      });
    }
  }, [linkEntities]);

  return (
    <>
      <Modal
        modalWrapperClass="schedule__send__modal"
        title="Link Entity Lists"
        visible={isOpen}
        onCancel={onClose}
        onClose={onClose}
        width="560px"
      >
        <>
          <button
            className="text-[16px] mb-[10px] font-biotif__Medium text-primaryColor hover:text-primaryColor__hoverDark"
            onClick={() => {
              openAddLinkEntityModal(true);
              onClose();
            }}
          >
            + Add New Entity
          </button>
          <table className="w-full">
            {/* <thead>
              <th className='bg-primaryColor text-[16px] font-biotif__SemiBold text-white text-left py-[7px] px-[14px] first:rounded-tl-[8px]'>Name</th>
              <th className='bg-primaryColor text-[16px] font-biotif__SemiBold text-white text-left py-[7px] px-[14px] last:rounded-tr-[8px]'>Action</th>
            </thead> */}
            <tbody>
              {accounts && accounts.length ? (
                <tr>
                  <td
                    colSpan={2}
                    className="bg-[#f7f7f7] pt-[15px] text-[14px] font-biotif__SemiBold text-black text-left py-[7px] px-[14px]"
                  >
                    Account
                  </td>
                </tr>
              ) : (
                <></>
              )}
              {accounts && accounts.length ? (
                accounts.map((e, index) => {
                  return (
                    <tr key={index}>
                      <td className="bg-[#f7f7f7] text-[14px] font-biotif__Regular text-black text-left py-[7px] px-[14px]">
                        {e.name}{' '}
                      </td>
                      <td className="bg-[#f7f7f7] text-[14px] font-biotif__Regular text-black text-left py-[7px] px-[14px]">
                        {' '}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <></>
              )}
              {contacts && contacts.length ? (
                <tr>
                  <td
                    colSpan={2}
                    className="bg-[#f7f7f7] pt-[15px] text-[14px] font-biotif__SemiBold text-black text-left py-[7px] px-[14px]"
                  >
                    Contact
                  </td>
                </tr>
              ) : (
                <></>
              )}
              {contacts && contacts.length ? (
                contacts.map((e, index) => {
                  return (
                    <tr key={index}>
                      <td className="bg-[#f7f7f7] text-[14px] font-biotif__Regular text-black text-left py-[7px] px-[14px]">
                        {' '}
                        {e.name}{' '}
                      </td>
                      <td className="bg-[#f7f7f7] text-[14px] font-biotif__Regular text-black text-left py-[7px] px-[14px]">
                        {' '}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <></>
              )}
              {leads && leads.length ? (
                <tr>
                  <td
                    colSpan={2}
                    className="bg-[#f7f7f7] pt-[15px] text-[14px] font-biotif__SemiBold text-black text-left py-[7px] px-[14px]"
                  >
                    Lead
                  </td>
                </tr>
              ) : (
                <></>
              )}
              {leads && leads.length ? (
                leads.map((e, index) => {
                  return (
                    <tr key={index}>
                      <td className="bg-[#f7f7f7] text-[14px] font-biotif__Regular text-black text-left py-[7px] px-[14px]">
                        {e.name}{' '}
                      </td>
                      <td className="bg-[#f7f7f7] text-[14px] font-biotif__Regular text-black text-left py-[7px] px-[14px]">
                        {' '}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <></>
              )}
              {deals && deals.length ? (
                <tr>
                  <td
                    colSpan={2}
                    className="bg-[#f7f7f7] pt-[15px] text-[14px] font-biotif__SemiBold text-black text-left py-[7px] px-[14px]"
                  >
                    Deals
                  </td>
                </tr>
              ) : (
                <></>
              )}
              {deals && deals.length ? (
                deals.map((e, index) => {
                  return (
                    <tr key={index}>
                      <td className="bg-[#f7f7f7] text-[14px] font-biotif__Regular text-black text-left py-[7px] px-[14px]">
                        {e.name}{' '}
                      </td>
                      <td className="bg-[#f7f7f7] text-[14px] font-biotif__Regular text-black text-left py-[7px] px-[14px]">
                        {' '}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </>
      </Modal>
    </>
  );
};

export default LinkEntityListModal;
