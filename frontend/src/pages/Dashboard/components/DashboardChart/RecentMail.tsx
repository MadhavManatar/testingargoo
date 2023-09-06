// ** Import Packages **
import { Link, useNavigate } from 'react-router-dom';

// ** Components **
import Button from 'components/Button';
import Icon from 'components/Icon';

// ** Types **
import { EmailListingRow, EmailModalType } from 'pages/Email/types/email.type';
import { MailTokenProvider } from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Other **
import { checkAndReturnActualDateOrTime } from 'utils/util';
import { getMailProviderOption } from 'redux/slices/commonSlice';
import { useSelector } from 'react-redux';

interface PropsInterface {
  setModal: React.Dispatch<React.SetStateAction<EmailModalType | undefined>>;
  emails: {
    rows: EmailListingRow[];
    total?: number;
  };
}
const providerImg: { [key in MailTokenProvider]?: string } = {
  [MailTokenProvider.GMAIL]: '/images/gmail__icon.svg',
  [MailTokenProvider.OUTLOOK]: '/images/microsoft__Outlook__icon.svg',
  [MailTokenProvider.SMTP]: '/images/smtp.jpeg',
};

const RecentMail = (props: PropsInterface) => {
  const { setModal, emails } = props;
  const navigate = useNavigate();
  const mailProviders = useSelector(getMailProviderOption);

  return (
    <>
      <div className="recent__email__dash w-[calc(50%_-_136px)] max-w-full px-[20px] 4xl:w-full 4xl:mt-[20px]">
        <div className="inner__wrapper h-full bg-gray__BGColor rounded-[12px] p-[20px] pb-[20px]">
          <div className="header flex flex-wrap items-start mb-[15px] xsm:justify-between">
            <h3 className="text-[20px] font-biotif__Medium text-ipBlack__textColor w-[calc(100%_-_185px)] pr-[10px] sm:w-[calc(100%_-_166px)] sm:pr-0 sm:mb-[10px] xsm:w-full xsm:mr-0">
              Recent Email
            </h3>
            <Link
              className="text-[14px] font-biotif__Regular underline text-ipBlack__textColor duration-500 hover:text-primaryColor relative top-[5px]"
              to={PRIVATE_NAVIGATION.email.view}
            >
              View all
            </Link>
            <Button
              onClick={() => {
                if (
                  (mailProviders?.length === 1 &&
                    mailProviders?.[0].label !== 'All') ||
                  mailProviders?.length > 1
                ) {
                  setModal('compose');
                } else {
                  navigate(
                    `/${PRIVATE_NAVIGATION.settings.emailSetting.connect.view}`
                  );
                }
              }}
              className="compose__btn primary__Btn smaller__with__icon px-[18px] ml-[15px] relative top-[-4px] sm:ml-[10px] sm:px-[12px]"
            >
              <Icon iconType="plusFilled" />
              Compose
            </Button>
          </div>
          <div className="recent__email__table">
            {emails.rows.length > 0 ? (
              emails.rows.map((item) => {
                return (
                  <div
                    key={item.id}
                    className="recent__email__row flex items-center border-b border-b-black/10 py-[12px] flex-wrap sm:items-start sm:relative"
                  >
                    <div className="recent__email__cell email__provide__img px-[8px] w-[32px] flex items-center sm:absolute sm:top-[52px] sm:left-[7px] sm:px-0 sm:w-[16px]">
                      <img
                        className="w-full"
                        src={`${providerImg[item.provider]}`}
                        alt="provider-img"
                      />
                    </div>
                    <div className="recent__email__cell profile__picture px-[8px] w-[46px] sm:px-0 sm:w-[30px] sm:absolute sm:top-[12px] sm:left-0">
                      <img
                        className="w-[30px] h-[30px] rounded-full"
                        src="/images/profileImg.png"
                        alt=""
                      />
                    </div>
                    <div className="recent__email__cell name px-[8px] w-[calc(50%_-_90px)] sm:w-[calc(100%_-_32px)] sm:ml-auto sm:pr-0">
                      <p className="text-[16px] font-biotif__Regular text-ipBlack__textColor whitespace-pre overflow-hidden text-ellipsis">
                        {item.messages[0].from_email_address}
                      </p>
                    </div>
                    <div className="recent__email__cell text px-[8px] w-[calc(50%_-_90px)] sm:w-[calc(100%_-_32px)] sm:ml-auto sm:pr-0">
                      <p className="text-[16px] h-[23px] font-biotif__Regular text-ipBlack__textColor whitespace-pre overflow-hidden text-ellipsis">
                        {item.messages[0].subject || '(no subject)'}
                      </p>
                    </div>
                    <div className="recent__email__cell time px-[8px] w-[100px] sm:w-[calc(100%_-_32px)] sm:ml-auto sm:pr-0 sm:mt-[2px]">
                      <p className="text-[16px] font-biotif__Regular text-black/50 text-right sm:text-left sm:text-[14px]">
                        {checkAndReturnActualDateOrTime(
                          item.messages[0].created_at
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no__recent__email bg-ipWhite__bgColor rounded-[10px] py-[30px] px-[20px] flex flex-wrap justify-center">
                <div className="inline-block text-center">
                  <img
                    className="w-[70px] max-w-full"
                    src="/images/no__recent__emailIcon2.png"
                    alt=""
                  />
                  <p className="text-[20px] text-center text-ipBlack__textColor font-biotif__SemiBold mt-[15px]">
                    No Data Available
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentMail;
