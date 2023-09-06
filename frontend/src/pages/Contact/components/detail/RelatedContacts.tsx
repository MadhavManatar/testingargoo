// ** Component **
import RelatedContactsItem from './RelatedContactsItem';

// ** Type **
import {
  ContactDetails,
  RelatedContact,
} from 'pages/Contact/types/contacts.types';

interface PropsInterface {
  contacts: RelatedContact[];
  accordion?: { [key: string]: boolean };
  openCloseAccordion?: (value: string) => void;
  relatedAccountName?:string | undefined
}

const RelatedContacts = (props: PropsInterface) => {
  const { contacts, accordion, openCloseAccordion,relatedAccountName } = props;
  const relatedContact = contacts.filter((obj) => obj.contact !== null);
  return (
    <div
      className="details__RelatedContact__wrapper mb-[30px]"
      id="related-contact"
    >
      <div
        className="section__header"
        onClick={() => openCloseAccordion && openCloseAccordion('relContact')}
      >
        <span className="text text-[16px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_32px)] pr-[10px]">
          Related Contacts ({relatedContact?.length || 0})
        </span>
        <button
          className={`section__toggle__btn w-[30px] h-[30px] rounded-[7px] text-[0px] relative duration-500 hover:bg-white before:content-[""] before:absolute before:left-[10px] before:w-[10px] before:h-[10px] before:border-l-[2px] before:border-l-ipBlack__borderColor before:border-b-[2px] before:border-b-ipBlack__borderColor before:-rotate-45 before:top-[8px] ${
            accordion && accordion.relContact ? 'active' : ''
          } `}
        >
          .
        </button>
      </div>
      {accordion && accordion.relContact && (
        <div className="border border-whiteScreen__BorderColor rounded-[12px] p-[24px] pb-[4px] 3xl:p-[15px] 3xl:pb-0 sm:p-0 sm:border-0">
          <div className="flex flex-wrap mx-[-10px] 3xl:mx-[-7px]">
            {relatedContact &&
              relatedContact.map(
                (val, index: number) =>
                  val.contact && (
                    <RelatedContactsItem
                      key={index}
                      contact={val.contact as ContactDetails}
                      job_role={val.job_role || undefined}
                      relatedAccountName={relatedAccountName}
                    />
                  )
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedContacts;
