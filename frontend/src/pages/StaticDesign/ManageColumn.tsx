import Button from 'components/Button';
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import { WEEKDAYS } from 'constant';
import { useForm } from 'react-hook-form';

const ManageColumn = () => {
  const { control } = useForm();
  return (
    <>
      <div className="ip__Modal__Wrapper manage__column__modal">
        <div className="ip__Modal__Overlay" />
        <div className="ip__Modal__ContentWrap w-[1373px] max-w-[calc(100%_-_30px)]">
          <div className="ip__Modal__Header">
            <h3 className="title">Manage Columns</h3>
            <Icon iconType="closeBtnFilled" />
          </div>
          <div className="ip__Modal__Body ip__FancyScroll relative !p-[25px] flex flex-wrap">
            <div className="first__column pt-[10px] w-[235px] border-r-[1px] border-r-[#F1F1F1]">
              <div className="px-[20px]">
                <div className="horizontalTabs__wrapper">
                  <div className="horizontalTabs__ul">
                    <div className="item active">
                      <button className="link">
                        <span className="text">Private</span>
                      </button>
                    </div>
                    <div className="item">
                      <button className="link">
                        <span className="text">Public</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sorting__wrapper my-[10px] flex items-center justify-between px-[20px]">
                <button className="sorting__btn py-[7px] px-[10px] flex items-center justify-center w-1/2 ascending__btn bg-[#F1F1F1] rounded-l-[5px] border-r-[1px] border-r-ipWhite__borderColor duration-300 hover:bg-[#E6E6E6]">
                  <span className="arrow up inline-block w-[1px] h-[11px] bg-ipBlack__bgColor mr-[6px] relative before:content-[''] before:absolute before:w-[0px] before:h-[0px] before:border-[3px] before:border-transparent" />
                  <span className="text text-[12px] font-biotif__Medium text-black/50">
                    Ascending
                  </span>
                </button>
                <button className="sorting__btn py-[7px] px-[10px] flex items-center justify-center w-1/2 descending__btn bg-[#F1F1F1] rounded-r-[5px] border-l-[1px] border-l-ipWhite__borderColor duration-300 hover:bg-[#E6E6E6]">
                  <span className="arrow down inline-block w-[1px] h-[11px] bg-ipBlack__bgColor mr-[6px] relative before:content-[''] before:absolute before:w-[0px] before:h-[0px] before:border-[3px] before:border-transparent" />
                  <span className="text text-[12px] font-biotif__Medium text-black/50">
                    Descending
                  </span>
                </button>
              </div>
              <div className="mb-[10px] pb-[10px] h-[calc(100dvh_-_327px)] overflow-y-auto ip__FancyScroll px-[20px]">
                <div className="list__item mb-[4px] last:mb-0 group cursor-pointer px-[15px] py-[9px] relative flex items-center rounded-[6px] duration-300 hover:bg-[#E3E1F1]">
                  <span className="text text-[14px] font-biotif__Medium text-black inline-block whitespace-pre overflow-hidden text-ellipsis duration-300 group-hover:text-[#7467B7]">
                    Converted Leads
                  </span>
                  <span className="arrow__btn shrink-0 absolute top-[50%] translate-y-[-50%] right-[13px] rotate-[-135deg] inline-block w-[8px] h-[8px] border-l-[2px] border-l-black/50 border-b-[2px] border-b-black/50 group-hover:border-l-[2px] group-hover:border-l-[#7467B7] group-hover:border-b-[2px] group-hover:border-b-[#7467B7]" />
                </div>
                <div className="list__item mb-[4px] last:mb-0 group cursor-pointer px-[15px] py-[9px] relative flex items-center rounded-[6px] duration-300 hover:bg-[#E3E1F1]">
                  <span className="text text-[14px] font-biotif__Medium text-black inline-block whitespace-pre overflow-hidden text-ellipsis duration-300 group-hover:text-[#7467B7]">
                    All leads
                  </span>
                  <span className="arrow__btn shrink-0 absolute top-[50%] translate-y-[-50%] right-[13px] rotate-[-135deg] inline-block w-[8px] h-[8px] border-l-[2px] border-l-black/50 border-b-[2px] border-b-black/50 group-hover:border-l-[2px] group-hover:border-l-[#7467B7] group-hover:border-b-[2px] group-hover:border-b-[#7467B7]" />
                </div>
                <div className="list__item mb-[4px] last:mb-0 group cursor-pointer px-[15px] py-[9px] relative flex items-center rounded-[6px] duration-300 hover:bg-[#E3E1F1]">
                  <span className="text text-[14px] font-biotif__Medium text-black inline-block whitespace-pre overflow-hidden text-ellipsis duration-300 group-hover:text-[#7467B7]">
                    Junks Lead
                  </span>
                  <span className="arrow__btn shrink-0 absolute top-[50%] translate-y-[-50%] right-[13px] rotate-[-135deg] inline-block w-[8px] h-[8px] border-l-[2px] border-l-black/50 border-b-[2px] border-b-black/50 group-hover:border-l-[2px] group-hover:border-l-[#7467B7] group-hover:border-b-[2px] group-hover:border-b-[#7467B7]" />
                </div>
                <div className="list__item mb-[4px] last:mb-0 group cursor-pointer px-[15px] py-[9px] relative flex items-center rounded-[6px] duration-300 hover:bg-[#E3E1F1]">
                  <span className="text text-[14px] font-biotif__Medium text-black inline-block whitespace-pre overflow-hidden text-ellipsis duration-300 group-hover:text-[#7467B7]">
                    Recently Deleted Lead
                  </span>
                  <span className="arrow__btn shrink-0 absolute top-[50%] translate-y-[-50%] right-[13px] rotate-[-135deg] inline-block w-[8px] h-[8px] border-l-[2px] border-l-black/50 border-b-[2px] border-b-black/50 group-hover:border-l-[2px] group-hover:border-l-[#7467B7] group-hover:border-b-[2px] group-hover:border-b-[#7467B7]" />
                </div>
                <div className="list__item mb-[4px] last:mb-0 group cursor-pointer px-[15px] py-[9px] relative flex items-center rounded-[6px] duration-300 hover:bg-[#E3E1F1]">
                  <span className="text text-[14px] font-biotif__Medium text-black inline-block whitespace-pre overflow-hidden text-ellipsis duration-300 group-hover:text-[#7467B7]">
                    Open Lead
                  </span>
                  <span className="arrow__btn shrink-0 absolute top-[50%] translate-y-[-50%] right-[13px] rotate-[-135deg] inline-block w-[8px] h-[8px] border-l-[2px] border-l-black/50 border-b-[2px] border-b-black/50 group-hover:border-l-[2px] group-hover:border-l-[#7467B7] group-hover:border-b-[2px] group-hover:border-b-[#7467B7]" />
                </div>
                <div className="list__item mb-[4px] last:mb-0 group cursor-pointer px-[15px] py-[9px] relative flex items-center rounded-[6px] duration-300 hover:bg-[#E3E1F1]">
                  <span className="text text-[14px] font-biotif__Medium text-black inline-block whitespace-pre overflow-hidden text-ellipsis duration-300 group-hover:text-[#7467B7]">
                    Unread Leads
                  </span>
                  <span className="arrow__btn shrink-0 absolute top-[50%] translate-y-[-50%] right-[13px] rotate-[-135deg] inline-block w-[8px] h-[8px] border-l-[2px] border-l-black/50 border-b-[2px] border-b-black/50 group-hover:border-l-[2px] group-hover:border-l-[#7467B7] group-hover:border-b-[2px] group-hover:border-b-[#7467B7]" />
                </div>
              </div>
              <div className="px-[20px]">
                <button className="text-[14px] font-biotif__SemiBold text-center rounded-[6px] py-[9px] px-[15px] w-full bg-[#E3E1F1] text-[#7467B7] duration-300 hover:bg-[#7467B7] hover:text-white">
                  New Custom View
                </button>
              </div>
            </div>
            <div className="right__wrapper w-[calc(100%_-_235px)] flex flex-wrap">
              <div className="second__column w-[576px] border-r-[1px] border-r-[#F1F1F1] pt-[20px]">
                <div className="second__column__header px-[20px]">
                  <div className="border-b-[1px] border-b-[#F1F1F1] flex flex-wrap justify-between mb-[14px] pb-[14px]">
                    <div className="name__wrapper w-[calc(50%_-_8px)]">
                      <label className="w-full block text-[16px] font-biotif__Medium text-black mb-[3px]">
                        Name
                      </label>
                      <div className="form__Group mb-0">
                        <div>
                          <input
                            className="ip__input rounded-[8px] py-[6px]"
                            placeholder="Enter name"
                            type="text"
                            autoComplete='off'
                          />
                        </div>
                      </div>
                    </div>
                    <div className="name__wrapper w-[calc(50%_-_8px)]">
                      <label className="w-full block text-[16px] font-biotif__Medium text-black mb-[3px]">
                        View set as
                      </label>
                      <div className="radio__btns__wrapper flex items-center pt-[8px]">
                        <div className="custom__radio__wrapper w-[calc(100%_-_8px)]">
                          <div className="ip__Radio">
                            <input type="radio" name="optionNew" value="and" />
                            <label className="rc__Label !text-ipBlack__textColor">
                              Private
                            </label>
                          </div>
                        </div>
                        <div className="custom__radio__wrapper w-[calc(100%_-_8px)]">
                          <div className="ip__Radio">
                            <input type="radio" name="optionNew" value="and" />
                            <label className="rc__Label !text-ipBlack__textColor">
                              Public
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap px-[20px] h-[calc(100dvh_-_345px)] overflow-y-auto ip__FancyScroll pb-[10px]">
                  <div className="columns__options w-1/2 pr-[30px]">
                    <h3 className="text-[15px] font-biotif__Medium text-black mb-[6px]">
                      Columns Options
                    </h3>
                    <div className="form__Group mb-[10px]">
                      <div className="ip__form__hasIcon">
                        <input
                          className="ip__input py-[4px] rounded-[8px]"
                          type="text"
                          autoComplete='off'
                        />
                        <Icon
                          className="grayscale !top-[5px]"
                          iconType="searchStrokeIcon"
                        />
                      </div>
                    </div>
                    <div className="checkbox__wrapper">
                      <div className="ip__Checkbox">
                        <input type="checkbox" />
                        <label className="rc__Label inline-block !w-auto !max-w-full">
                          Name
                        </label>
                      </div>
                      <div className="ip__Checkbox">
                        <input type="checkbox" />
                        <label className="rc__Label inline-block !w-auto !max-w-full">
                          Country
                        </label>
                      </div>
                      <div className="ip__Checkbox">
                        <input type="checkbox" />
                        <label className="rc__Label inline-block !w-auto !max-w-full">
                          City
                        </label>
                      </div>
                      <div className="ip__Checkbox">
                        <input type="checkbox" />
                        <label className="rc__Label inline-block !w-auto !max-w-full">
                          Created By
                        </label>
                      </div>
                      <div className="ip__Checkbox">
                        <input type="checkbox" />
                        <label className="rc__Label inline-block !w-auto !max-w-full">
                          Email Opt Out
                        </label>
                      </div>
                      <div className="ip__Checkbox">
                        <input type="checkbox" />
                        <label className="rc__Label inline-block !w-auto !max-w-full">
                          Fax
                        </label>
                      </div>
                      <div className="ip__Checkbox">
                        <input type="checkbox" />
                        <label className="rc__Label inline-block !w-auto !max-w-full">
                          Tasks
                        </label>
                      </div>
                      <div className="ip__Checkbox">
                        <input type="checkbox" />
                        <label className="rc__Label inline-block !w-auto !max-w-full">
                          Lead Owner
                        </label>
                      </div>
                      <div className="ip__Checkbox">
                        <input type="checkbox" />
                        <label className="rc__Label inline-block !w-auto !max-w-full">
                          State
                        </label>
                      </div>
                      <div className="ip__Checkbox">
                        <input type="checkbox" />
                        <label className="rc__Label inline-block !w-auto !max-w-full">
                          Source
                        </label>
                      </div>
                      <div className="ip__Checkbox">
                        <input type="checkbox" />
                        <label className="rc__Label inline-block !w-auto !max-w-full">
                          Related Account
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="columns__selection w-1/2 pl-[30px]">
                    <h3 className="text-[15px] font-biotif__Medium text-black mb-[6px]">
                      Columns Selection
                    </h3>
                    <div className="columns__selection__box flex items-center rounded-[7px] py-[6px] px-[12px] pr-[5px] border-[1px] border-[#CCCCCC]/70 mb-[10px] last:mb-0">
                      <div className="drag__icon w-[12px] h-auto flex flex-wrap shrink-0">
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px] mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px] mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50" />
                      </div>
                      <p className="text-[14px] font-biotif__Medium text-black w-full pl-[10px] pr-[10px]">
                        Name
                      </p>
                      <div className="relative cursor-pointer w-[26px] h-[26px] shrink-0 duration-300 rounded-full before:content-[''] before:w-[11px] before:h-[1px] before:bg-black/50 before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] before:rotate-45 after:content-[''] after:w-[11px] after:h-[1px] after:bg-black/50 after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] after:-rotate-45 hover:bg-[#f0f0f0]" />
                    </div>
                    <div className="columns__selection__box flex items-center rounded-[7px] py-[6px] px-[12px] pr-[5px] border-[1px] border-[#CCCCCC]/70 mb-[10px] last:mb-0">
                      <div className="drag__icon w-[12px] h-auto flex flex-wrap shrink-0">
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px] mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px] mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50" />
                      </div>
                      <p className="text-[14px] font-biotif__Medium text-black w-full pl-[10px] pr-[10px]">
                        Country
                      </p>
                      <div className="relative cursor-pointer w-[26px] h-[26px] shrink-0 duration-300 rounded-full before:content-[''] before:w-[11px] before:h-[1px] before:bg-black/50 before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] before:rotate-45 after:content-[''] after:w-[11px] after:h-[1px] after:bg-black/50 after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] after:-rotate-45 hover:bg-[#f0f0f0]" />
                    </div>
                    <div className="columns__selection__box flex items-center rounded-[7px] py-[6px] px-[12px] pr-[5px] border-[1px] border-[#CCCCCC]/70 mb-[10px] last:mb-0">
                      <div className="drag__icon w-[12px] h-auto flex flex-wrap shrink-0">
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px] mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px] mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50" />
                      </div>
                      <p className="text-[14px] font-biotif__Medium text-black w-full pl-[10px] pr-[10px]">
                        Fax
                      </p>
                      <div className="relative cursor-pointer w-[26px] h-[26px] shrink-0 duration-300 rounded-full before:content-[''] before:w-[11px] before:h-[1px] before:bg-black/50 before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] before:rotate-45 after:content-[''] after:w-[11px] after:h-[1px] after:bg-black/50 after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] after:-rotate-45 hover:bg-[#f0f0f0]" />
                    </div>
                    <div className="columns__selection__box flex items-center rounded-[7px] py-[6px] px-[12px] pr-[5px] border-[1px] border-[#CCCCCC]/70 mb-[10px] last:mb-0">
                      <div className="drag__icon w-[12px] h-auto flex flex-wrap shrink-0">
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px] mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px] mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50" />
                      </div>
                      <p className="text-[14px] font-biotif__Medium text-black w-full pl-[10px] pr-[10px]">
                        State
                      </p>
                      <div className="relative cursor-pointer w-[26px] h-[26px] shrink-0 duration-300 rounded-full before:content-[''] before:w-[11px] before:h-[1px] before:bg-black/50 before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] before:rotate-45 after:content-[''] after:w-[11px] after:h-[1px] after:bg-black/50 after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] after:-rotate-45 hover:bg-[#f0f0f0]" />
                    </div>
                    <div className="columns__selection__box flex items-center rounded-[7px] py-[6px] px-[12px] pr-[5px] border-[1px] border-[#CCCCCC]/70 mb-[10px] last:mb-0">
                      <div className="drag__icon w-[12px] h-auto flex flex-wrap shrink-0">
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px] mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px] mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50" />
                      </div>
                      <p className="text-[14px] font-biotif__Medium text-black w-full pl-[10px] pr-[10px]">
                        Source
                      </p>
                      <div className="relative cursor-pointer w-[26px] h-[26px] shrink-0 duration-300 rounded-full before:content-[''] before:w-[11px] before:h-[1px] before:bg-black/50 before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] before:rotate-45 after:content-[''] after:w-[11px] after:h-[1px] after:bg-black/50 after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] after:-rotate-45 hover:bg-[#f0f0f0]" />
                    </div>
                    <div className="columns__selection__box flex items-center rounded-[7px] py-[6px] px-[12px] pr-[5px] border-[1px] border-[#CCCCCC]/70 mb-[10px] last:mb-0">
                      <div className="drag__icon w-[12px] h-auto flex flex-wrap shrink-0">
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px] mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px] mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mb-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50 mr-[3px]" />
                        <div className="w-[4px] h-[4px] rounded-full bg-black/50" />
                      </div>
                      <p className="text-[14px] font-biotif__Medium text-black w-full pl-[10px] pr-[10px]">
                        Related Account
                      </p>
                      <div className="relative cursor-pointer w-[26px] h-[26px] shrink-0 duration-300 rounded-full before:content-[''] before:w-[11px] before:h-[1px] before:bg-black/50 before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] before:rotate-45 after:content-[''] after:w-[11px] after:h-[1px] after:bg-black/50 after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] after:-rotate-45 hover:bg-[#f0f0f0]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="filters__column h-[calc(100dvh_-_232px)] overflow-y-auto ip__FancyScroll px-[20px] w-[562px] py-[20px]">
                <div className="border-[1px] border-dashed border-[#CCC]/90 rounded-[10px] p-[13px] mt-[10px] first:mt-0">
                  <div className="filters__row flex flex-wrap items-center mt-[10px] first:mt-0">
                    <div className="flex flex-wrap mx-[-5px] w-[calc(100%_-_24px)] pr-[10px]">
                      <div className="px-[5px] w-1/3">
                        <FormField
                          wrapperClass="mb-0"
                          id="week_day"
                          placeholder="Select Week Day"
                          type="select"
                          name="week_day"
                          labelClass="if__label__blue"
                          control={control}
                          options={WEEKDAYS}
                          menuPosition="fixed"
                          menuPlacement="auto"
                        />
                      </div>
                      <div className="px-[5px] w-1/3">
                        <FormField
                          wrapperClass="mb-0"
                          id="week_day"
                          placeholder="Select Week Day"
                          type="select"
                          name="week_day"
                          labelClass="if__label__blue"
                          control={control}
                          options={WEEKDAYS}
                          menuPosition="fixed"
                          menuPlacement="auto"
                        />
                      </div>
                      <div className="px-[5px] w-1/3">
                        <div className="form__Group mb-0">
                          <div className="">
                            <input
                              placeholder="ABC"
                              className="ip__input"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <Icon
                      className="delete__btn w-[32px] h-[32px] p-[8px] cursor-pointer rounded-[6px] duration-300 hover:bg-[#F1F1F1]"
                      iconType="deleteFilled"
                    />
                  </div>
                  <div className="custom__radio__wrapper flex items-center justify-center mt-[10px] first:mt-0">
                    <div className="ip__Radio mr-[15px]">
                      <input type="radio" name="optionNew" value="and" />
                      <label className="rc__Label">AND</label>
                    </div>
                    <div className="ip__Radio">
                      <input type="radio" name="optionNew" value="and" />
                      <label className="rc__Label">OR</label>
                    </div>
                  </div>
                  <div className="filters__row flex flex-wrap items-center mt-[10px] first:mt-0">
                    <div className="flex flex-wrap mx-[-5px] w-[calc(100%_-_24px)] pr-[10px]">
                      <div className="px-[5px] w-1/3">
                        <FormField
                          wrapperClass="mb-0"
                          id="week_day"
                          placeholder="Select Week Day"
                          type="select"
                          name="week_day"
                          labelClass="if__label__blue"
                          control={control}
                          options={WEEKDAYS}
                          menuPosition="fixed"
                          menuPlacement="auto"
                        />
                      </div>
                      <div className="px-[5px] w-1/3">
                        <FormField
                          wrapperClass="mb-0"
                          id="week_day"
                          placeholder="Select Week Day"
                          type="select"
                          name="week_day"
                          labelClass="if__label__blue"
                          control={control}
                          options={WEEKDAYS}
                          menuPosition="fixed"
                          menuPlacement="auto"
                        />
                      </div>
                      <div className="px-[5px] w-1/3">
                        <div className="form__Group mb-0">
                          <div className="">
                            <input
                              placeholder="ABC"
                              className="ip__input"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative cursor-pointer w-[32px] h-[32px] shrink-0 duration-300 rounded-[5px] before:content-[''] before:w-[11px] before:h-[1px] before:bg-black before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] after:content-[''] after:w-[1px] after:h-[11px] after:bg-black after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] hover:bg-[#f0f0f0]" />
                  </div>
                </div>
                <div className="custom__radio__wrapper flex items-center justify-center mt-[10px] first:mt-0">
                  <div className="ip__Radio mr-[15px]">
                    <input type="radio" name="optionNew" value="and" />
                    <label className="rc__Label">AND</label>
                  </div>
                  <div className="ip__Radio">
                    <input type="radio" name="optionNew" value="and" />
                    <label className="rc__Label">OR</label>
                  </div>
                </div>
                <div className="border-[1px] border-dashed border-[#CCC]/90 rounded-[10px] p-[13px] mt-[10px] first:mt-0">
                  <div className="filters__row flex flex-wrap items-center mt-[10px] first:mt-0">
                    <div className="flex flex-wrap mx-[-5px] w-[calc(100%_-_24px)] pr-[10px]">
                      <div className="px-[5px] w-1/3">
                        <FormField
                          wrapperClass="mb-0"
                          id="week_day"
                          placeholder="Select Week Day"
                          type="select"
                          name="week_day"
                          labelClass="if__label__blue"
                          control={control}
                          options={WEEKDAYS}
                          menuPosition="fixed"
                          menuPlacement="auto"
                        />
                      </div>
                      <div className="px-[5px] w-1/3">
                        <FormField
                          wrapperClass="mb-0"
                          id="week_day"
                          placeholder="Select Week Day"
                          type="select"
                          name="week_day"
                          labelClass="if__label__blue"
                          control={control}
                          options={WEEKDAYS}
                          menuPosition="fixed"
                          menuPlacement="auto"
                        />
                      </div>
                      <div className="px-[5px] w-1/3">
                        <div className="form__Group mb-0">
                          <div className="">
                            <input
                              placeholder="ABC"
                              className="ip__input"
                              type="text"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="relative cursor-pointer w-[32px] h-[32px] shrink-0 duration-300 rounded-[5px] before:content-[''] before:w-[11px] before:h-[1px] before:bg-black before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] after:content-[''] after:w-[1px] after:h-[11px] after:bg-black after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] hover:bg-[#f0f0f0]" />
                  </div>
                </div>
                <button className="text-[#7467B7] text-[14px] font-biotif__Medium duration-300 mt-[10px] hover:text-[#6054A0]">
                  + Add Filter
                </button>
                <div className="border-t-[1px] border-t-[#F1F1F1] pt-[12px] mt-[12px]">
                  <h3 className="title text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[14px]">
                    Sort By
                  </h3>
                  <div className="border-[1px] border-dashed border-[#CCC]/90 rounded-[10px] p-[13px] mt-[10px] w-[410px] max-w-full first:mt-0">
                    <div className="filters__row flex flex-wrap items-center mt-[10px] first:mt-0">
                      <div className="flex flex-wrap mx-[-5px] w-[calc(100%_-_24px)] pr-[10px]">
                        <div className="px-[5px] w-[142px]">
                          <FormField
                            wrapperClass="mb-0"
                            id="week_day"
                            placeholder="Select Week Day"
                            type="select"
                            name="week_day"
                            labelClass="if__label__blue"
                            control={control}
                            options={WEEKDAYS}
                            menuPosition="fixed"
                            menuPlacement="auto"
                          />
                        </div>
                        <div className="px-[5px] w-[100px]">
                          <div className="ip__Radio mt-[5px]">
                            <input type="radio" name="optionNew" value="and" />
                            <label className="rc__Label !text-ipBlack__textColor">
                              Ascending
                            </label>
                          </div>
                        </div>
                        <div className="px-[5px] w-[100px]">
                          <div className="ip__Radio mt-[5px]">
                            <input type="radio" name="optionNew" value="and" />
                            <label className="rc__Label !text-ipBlack__textColor">
                              Descending
                            </label>
                          </div>
                        </div>
                      </div>
                      <Icon
                        className="delete__btn w-[32px] h-[32px] p-[8px] cursor-pointer rounded-[6px] duration-300 hover:bg-[#F1F1F1]"
                        iconType="deleteFilled"
                      />
                    </div>
                    <div className="filters__row flex flex-wrap items-center mt-[10px] first:mt-0">
                      <div className="flex flex-wrap mx-[-5px] w-[calc(100%_-_24px)] pr-[10px]">
                        <div className="px-[5px] w-[142px]">
                          <FormField
                            wrapperClass="mb-0"
                            id="week_day"
                            placeholder="Select Week Day"
                            type="select"
                            name="week_day"
                            labelClass="if__label__blue"
                            control={control}
                            options={WEEKDAYS}
                            menuPosition="fixed"
                            menuPlacement="auto"
                          />
                        </div>
                        <div className="px-[5px] w-[100px]">
                          <div className="ip__Radio mt-[5px]">
                            <input type="radio" name="optionNew" value="and" />
                            <label className="rc__Label !text-ipBlack__textColor">
                              Ascending
                            </label>
                          </div>
                        </div>
                        <div className="px-[5px] w-[100px]">
                          <div className="ip__Radio mt-[5px]">
                            <input type="radio" name="optionNew" value="and" />
                            <label className="rc__Label !text-ipBlack__textColor">
                              Descending
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="relative cursor-pointer w-[32px] h-[32px] shrink-0 duration-300 rounded-[5px] before:content-[''] before:w-[11px] before:h-[1px] before:bg-black before:absolute before:top-[50%] before:left-[50%] before:translate-y-[-50%] before:translate-x-[-50%] after:content-[''] after:w-[1px] after:h-[11px] after:bg-black after:absolute after:top-[50%] after:left-[50%] after:translate-y-[-50%] after:translate-x-[-50%] hover:bg-[#f0f0f0]" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="ip__Modal__Footer w-full">
                <div className="ip__Checkbox">
                  <input type="checkbox" />
                  <label className="rc__Label">Pin this view</label>
                </div>
                <div className="inline-flex">
                  <Button className="bg-transparent w-[80px] rounded-[6px] text-[14px] font-biotif__SemiBold text-[#7467B7] py-[9px] px-[16px] !mr-[12px] hover:bg-[#f2f2f2]">
                    Delete
                  </Button>
                  <Button className="bg-transparent w-[80px] rounded-[6px] text-[14px] font-biotif__SemiBold text-[#7467B7] py-[9px] px-[16px] border-[1px] border-[#7467B7] !mr-[12px] hover:bg-[#7467B7] hover:text-white">
                    Cancel
                  </Button>
                  <Button className="bg-[#7467B7] w-[80px] rounded-[6px] text-[14px] font-biotif__SemiBold text-white py-[9px] px-[16px] !mr-[12px] hover:bg-[#6054A0]">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ManageColumn;
