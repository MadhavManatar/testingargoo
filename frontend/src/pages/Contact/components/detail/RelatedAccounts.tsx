// ** Component **
import RelatedAccountsItem from './RelatedAccountsItem';

// ** Type **
import { RelatedAccount } from 'pages/Contact/types/contacts.types';

interface PropsInterface {
  accounts: RelatedAccount[];
  accordion?: { [key: string]: boolean };
  openCloseAccordion?: (value: string) => void;
  relatedContactData?: {
    id: number;
    name: string | undefined;
  };
}

const RelatedAccounts = (props: PropsInterface) => {
  const { accounts, accordion, openCloseAccordion, relatedContactData } = props;
  const relatedAccount = accounts.filter((obj) => obj.account !== null);
  return (
    <div
      className="details__RelatedAccount__wrapper mb-[30px]"
      id="related-account"
    >
      <div
        className="section__header"
        onClick={() => openCloseAccordion && openCloseAccordion('relAccount')}
      >
        <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_32px)] pr-[10px]">
          Related Accounts ({relatedAccount?.length || 0})
        </span>
        <button
          className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[""] before:absolute before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-ipBlack__borderColor before:border-b-[2px] before:border-b-ipBlack__borderColor before:-rotate-45 before:top-[8px] ${
            accordion && accordion.relAccount ? 'active' : ''
          } `}
        >
          .
        </button>
      </div>
      {accordion && accordion.relAccount && (
        <div className="border border-whiteScreen__BorderColor rounded-[12px] p-[24px] pb-[4px] 3xl:p-[15px] 3xl:pb-0 sm:p-0 sm:border-0">
          <div className="flex flex-wrap mx-[-10px] 3xl:mx-[-7px]">
            {relatedAccount.length &&
              relatedAccount.map(
                (val, index: number) =>
                  val?.account && (
                    <RelatedAccountsItem
                      key={index}
                      account={val.account}
                      job_role={val.job_role || undefined}
                      relatedContactData={relatedContactData}
                    />
                  )
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedAccounts;
