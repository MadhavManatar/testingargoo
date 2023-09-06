import { ModalType } from 'components/EntityDetails/constant';
import { IconTypeJson } from 'indexDB/indexdb.type';
import Tippy from '@tippyjs/react';
import IconAnimation from 'components/IconAnimation';

type noteProps = {
  setOpenModal: (modalName: ModalType) => void;
  setIsLinkDocument: React.Dispatch<React.SetStateAction<boolean>>;
};

const DetailHeaderAttachment = (props: noteProps) => {
  const { setOpenModal, setIsLinkDocument } = props;

  const filedArray = [
    {
      label: 'Link',
      onClick: () => {
        setOpenModal(ModalType.ATTACHMENT);
        setIsLinkDocument(true);
      },
    },
    {
      label: 'File',
      onClick: () => {
        setOpenModal(ModalType.ATTACHMENT);
        setIsLinkDocument(false);
      },
    },
  ];

  return (
    <div className="link__wrapper">
      <Tippy
        className="tippy__dropdown"
        trigger="click"
        hideOnClick
        theme="light"
        content={
          <div>
            <ul className="tippy__dropdown__ul">
              {filedArray.map((val,index) => {
                return (
                  <div
                    key={index}
                    className="item"
                    onClick={val.onClick}
                  >
                    <div className="item__link">
                      <span className="item__text">{val.label}</span>
                    </div>
                  </div>
                );
              })}
            </ul>
          </div>
        }
        placement="bottom-start"
      >
        <Tippy content="Documents" zIndex={999}>
          <div
            ref={(ref) => {
              if (!ref) return;
              ref.onclick = (e) => {
                e.stopPropagation();
              };
            }}
          >
            <IconAnimation
              iconType="attachmentFilledIcon"
              animationIconType={IconTypeJson.Documents}
              className="socian__ani__icon__wrapper"
            />
          </div>
        </Tippy>
      </Tippy>
    </div>
  );
};
export default DetailHeaderAttachment;
