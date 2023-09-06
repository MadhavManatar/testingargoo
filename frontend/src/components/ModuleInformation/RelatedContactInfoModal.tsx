// ** Import Packages **
import { useNavigate } from 'react-router-dom';

// ** Components **
import Modal from 'components/Modal';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Other **
import { setUrlParams } from 'utils/util';

interface PropsInterface {
  close: () => void;
  title: string;
  isOpen: true;
  contactInfo: {
    job_role?: string;
    name: string;
    id: number;
    email: string | undefined;
  }[];
}

const RelatedContactInfoModal = (props: PropsInterface) => {
  const { close, title, isOpen, contactInfo } = props;

  // ** custom hook **
  const navigate = useNavigate();

  return (
    <Modal
      title={title}
      visible={isOpen}
      showFooter={false}
      onClose={() => close()}
      onCancel={() => close()}
      submitLoading={false}
      width="665px"
    >
      <div className="related__contact__body bg-ipWhite__bgColor rounded-[12px]">
        {contactInfo.length
          ? contactInfo?.map((item, index) => {
              return (
                <div
                  key={index}
                  className="related__contact__row flex flex-wrap items-start py-[11px] px-[16px] border-b border-b-whiteScreen__BorderColor"
                >
                  <h3 className="name w-[calc(50%_-_50px)] pl-[10px] text-[14px] font-biotif__Medium text-dark__TextColor whitespace-pre overflow-hidden text-ellipsis sm:w-[calc(100%_-_26px)] sm:pl-[5px]">
                    <span
                      onClick={() =>
                        navigate(
                          setUrlParams(
                            PRIVATE_NAVIGATION.contacts.detailPage,
                            item.id
                          )
                        )
                      }
                      style={{
                        cursor: 'pointer',
                      }}
                    >
                      {item.name}
                    </span>
                  </h3>
                  <h3 className="name w-[calc(50%_-_50px)] pl-[10px] text-[14px] font-biotif__Medium text-dark__TextColor whitespace-pre overflow-hidden text-ellipsis sm:w-[calc(100%_-_26px)] sm:pl-[5px]">
                    <span>{item.job_role}</span>
                  </h3>
                  <div className="email w-[calc(50%_-_50px)] px-[10px] text-[14px] font-biotif__Regular text-light__TextColor whitespace-pre overflow-hidden text-ellipsis sm:w-[calc(100%_-_74px)] sm:pl-0 sm:mt-[3px]">
                    {item?.email || ''}
                  </div>
                </div>
              );
            })
          : ''}
      </div>
    </Modal>
  );
};

export default RelatedContactInfoModal;
