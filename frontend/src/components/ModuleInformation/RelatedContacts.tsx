import { useState } from 'react';
import RelatedContactInfoModal from './RelatedContactInfoModal';

interface PropsInterface {
  contactInfo: {
    name: string;
    id: number;
    job_role?: string;
    email: string | undefined;
  }[];
  title: string;
}

const RelatedContacts = (props: PropsInterface) => {
  const { contactInfo, title = 'Related Contacts' } = props;

  // ** states **
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const close = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="ipInfo__ViewBox w-1/3 3xl:w-1/2 lg:w-full">
        <p className="ipInfo__View__Label">{title}</p>
        <pre className="ipInfo__View__Value whitespace-normal">
          {contactInfo.length ? (
            <div onClick={() => setIsOpen(true)} className="flex flex-wrap">
              <span className="text-primaryColor !w-auto max-w-[calc(100%_-_90px)] pr-[10px]">
                {contactInfo[0].name} {contactInfo.length > 1 ? '...' : ''}
              </span>
              <span className="text-primaryColor cursor-pointer !w-auto hover:underline">
                {contactInfo.length > 1
                  ? `+${contactInfo.length - 1} more`
                  : ''}
              </span>{' '}
            </div>
          ) : (
            ''
          )}
        </pre>
      </div>

      {isOpen ? (
        <RelatedContactInfoModal
          close={close}
          title={title}
          isOpen={isOpen}
          contactInfo={contactInfo}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default RelatedContacts;
