import { agoTimeShow } from 'helper/dateAndTimeHelper';
import { useToggleDropdown } from 'hooks/useToggleDropdown';
import { getMailRecipientsForReply } from 'pages/Email/helper/email.helper';
import { EmailDetail } from 'pages/Email/types/email.type';

type Props = {
  emailData: EmailDetail;
  currentAccountEmail: string;
};

const FromToInfoCard = (props: Props) => {
  const { emailData, currentAccountEmail } = props;

  const { dropdownRef, isDropdownOpen, toggleDropdown } = useToggleDropdown();

  const emailRecipients = emailData.email_recipients
    ?.map((obj) => obj.emails.map((innerObj) => innerObj.email))
    .flat();

  const { defaultBCCRecipient, defaultCCRecipient, defaultToRecipient } =
    getMailRecipientsForReply({
      emailRecipient: emailData.email_recipients,
      from_email_address: emailData?.from_email_address,
      currentAccountEmail,
      filterData: false,
    });

  return (
    <div className="send__to inline-flex flex-wrap items-center relative pr-[17px] w-auto max-w-full">
      <div className="w-full">
        <span className="name inline-block text-[14px] font-biotif__Medium text-[#5F6368] max-w-full whitespace-pre overflow-hidden text-ellipsis">
          {/* Here show all recipients and if in recipients include from email address the show 'to me' */}
          {emailRecipients
            ?.filter((obj) => obj !== emailData.from_email_address)
            ?.join(',')}{' '}
          {emailRecipients?.includes(emailData.from_email_address || '') &&
            'to me'}
          <div ref={dropdownRef}>
            <span
              className='downBtn cursor-pointer inline-block absolute top-[3px] right-0 w-[15px] h-[15px] rounded-[3px] duration-300 before:content-[""] before:absolute before:top-[5px] before:left-[50%] before:translate-x-[-50%] before:border-[5px] before:border-transparent before:border-t-[5px] before:border-t-[#5F6368] hover:bg-[#f0f0f0]'
              onClick={toggleDropdown}
            />
            {isDropdownOpen && (
              <div className="infoModal absolute top-[calc(100%_+_1px)] left-[calc(100%_-_15px)] z-[4]">
                <div className="inner-wrapper bg-white shadow-[0px_3px_17px_#0000001a] p-[16px] rounded-[8px] w-[410px]">
                  <div className="flex flex-wrap mb-[10px] last:mb-0">
                    <label className="inline-block text-[14px] font-biotif__SemiBold text-primaryColor w-[85px] text-right">
                      from:
                    </label>
                    <span className="inline-block break-all whitespace-break-spaces w-[calc(100%_-_85px)] pl-[6px] text-[14px] font-biotif__Regular text-black/50">
                      {emailData.from_email_address}
                    </span>
                  </div>
                  <div className="flex flex-wrap mb-[10px] last:mb-0">
                    <label className="inline-block text-[14px] font-biotif__SemiBold text-primaryColor w-[85px] text-right">
                      To:
                    </label>
                    <span className="inline-block break-all whitespace-break-spaces w-[calc(100%_-_85px)] pl-[6px] text-[14px] font-biotif__Regular text-black/50">
                      {defaultToRecipient.map((obj) => obj.value)?.join(',')}
                    </span>
                  </div>
                  {defaultCCRecipient.length > 0 && (
                    <div className="flex flex-wrap mb-[10px] last:mb-0">
                      <label className="inline-block text-[14px] font-biotif__SemiBold text-primaryColor w-[85px] text-right">
                        Cc:
                      </label>
                      <span className="inline-block break-all whitespace-break-spaces w-[calc(100%_-_85px)] pl-[6px] text-[14px] font-biotif__Regular text-black/50">
                        {defaultCCRecipient.map((obj) => obj.value)?.join(',')}
                      </span>
                    </div>
                  )}
                  {defaultBCCRecipient.length > 0 && (
                    <div className="flex flex-wrap mb-[10px] last:mb-0">
                      <label className="inline-block text-[14px] font-biotif__SemiBold text-primaryColor w-[85px] text-right">
                        Bcc:
                      </label>
                      <span className="inline-block break-all whitespace-break-spaces w-[calc(100%_-_85px)] pl-[6px] text-[14px] font-biotif__Regular text-black/50">
                        {defaultBCCRecipient.map((obj) => obj.value)?.join(',')}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-wrap mb-[10px] last:mb-0">
                    <label className="inline-block text-[14px] font-biotif__SemiBold text-primaryColor w-[85px] text-right">
                      Date:
                    </label>
                    <span className="inline-block break-all whitespace-break-spaces w-[calc(100%_-_85px)] pl-[6px] text-[14px] font-biotif__Regular text-black/50">
                      {agoTimeShow(emailData?.send_date)}
                    </span>
                  </div>
                  <div className="flex flex-wrap mb-[10px] last:mb-0">
                    <label className="inline-block text-[14px] font-biotif__SemiBold text-primaryColor w-[85px] text-right">
                      Subject:
                    </label>
                    <span className="inline-block break-all whitespace-break-spaces w-[calc(100%_-_85px)] pl-[6px] text-[14px] font-biotif__Regular text-black/50">
                      {emailData.subject}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </span>
      </div>
    </div>
  );
};

export default FromToInfoCard;
