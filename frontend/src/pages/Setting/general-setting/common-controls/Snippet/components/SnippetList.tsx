// ** Component **
import Icon from 'components/Icon';
import DisplayRichTextContent from 'components/RichTextEditor/DisplayRichTextContent';

// ** Type **
import { SnippetListPropsType } from '../types/snippet.types';

const SnippetList = (props: SnippetListPropsType) => {
  const { snippetModal } = props;

  return (
    <div className="snippet__modal absolute  bottom-[100%] left-[0px] z-[99999999] w-[470px] pb-[6px]">
      <div className="inner__wrapper w-full bg-[#FFFFFF] rounded-[12px] shadow-[0px_2px_14px_#0000001a]">
        <div className="snippet__modal__header rounded-t-[12px] flex items-center bg-lightGray__BgColor px-[22px] pr-[12px] py-[10px]">
          <h3 className="title w-full pr-[15px] text-[16px] font-biotif__Medium text-black">
            Snippets
          </h3>
          <Icon className="shrink-0" iconType="closeBtnFilled" />
        </div>
        <div className="snippet__modal__body py-[22px] relative">
          <div className="inner__wrapper__body h-[250px] overflow-y-auto ip__FancyScroll px-[22px]">
            {(snippetModal?.list || []).map((snippetObj, index) => {
              return (
                <div
                  key={index}
                  className="snippet__row border-b-[1px] border-b-[#000000]/05 pb-[12px] mb-[12px] last:pb-0 last:mb-0 last:border-b-0 cursor-pointer"
                >
                  <h3 className="snippet__title text-[14px] font-biotif__Medium text-[#2E3234] mb-[3px] leading-[17px]">
                    {snippetObj?.title}
                  </h3>
                  <p className="text text-[12px] font-biotif__Regular text-[#2E3234]/50 !leading-[17px]">
                    <DisplayRichTextContent information={snippetObj?.snippet} />
                  </p>
                </div>
              );
            })}
          </div>
          <button className="add__btn w-[40px] h-[40px] rounded-full bg-primaryColor shadow-[0px_6px_16px_#00000040] flex items-center justify-center absolute bottom-[10px] right-[18px] z-[3] p-[4px]">
            <Icon className="!w-full !h-full" iconType="plusFilled" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SnippetList;
