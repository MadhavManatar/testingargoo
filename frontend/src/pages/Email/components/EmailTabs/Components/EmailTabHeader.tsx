// ** Import Packages **
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import Dropdown from 'components/Dropdown';
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import ConnectedEmailListDropdown from '../../ConnectedEmailListDropdown';
import EmailHeaderIcons from './EmailHeaderIcons';

// ** Redux **
import { getCurrentUser } from 'redux/slices/authSlice';

// ** Service **
import { usePartialSyncEmailsAPI } from 'pages/Email/services/email.service';

// ** Types **
import {
  SelectedMailDataFilterType,
  CustomLabel,
} from 'pages/Email/types/email.type';
import { MailTokenProvider } from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import {
  EmailTabHeaderActiveProps,
  EmailTabHeaderFilterOptionProps,
  EmailTabHeaderPropsInterface,
} from '../types/email.types';

// ** Constant **
import { BREAD_CRUMB } from 'constant';

// ** Other **
import { context } from 'App';

const filterOption = (filterProps: EmailTabHeaderFilterOptionProps) => {
  const { item, index, close, setSelectedMailData_Filter } = filterProps;
  return (
    <div
      key={index}
      className="item"
      onClick={() => {
        setSelectedMailData_Filter(item);
        close();
      }}
    >
      <div onClick={close} className="item__link">
        <div className="item__text">{item}</div>
      </div>
    </div>
  );
};

const EmailTabHeader = (props: EmailTabHeaderPropsInterface) => {
  const {
    openModal,
    providerOption,
    setSelectedProvider,
    selectedMails,
    count,
    setPage,
    page,
    conservationsCount,
    setEmailTabs,
    selectedProvider,
    SetSelectedMails,
    label,
    setRefresh,
    setSearchData,
    setSelectedMailData_Filter,
    selectedMailData_Filter,
    providers,
  } = props;

  const { state } = useLocation();

  const selectFilterOptions: SelectedMailDataFilterType[] = [
    'All',
    'None',
    'Read',
    'Unread',
  ];

  const socket = useContext(context);
  const currentUser = useSelector(getCurrentUser);
  const organizationId = localStorage.getItem('organization_uuid');

  const [showHeaderIcons, SetShowHeaderIcons] = useState<boolean>(false);
  const [isActive, setActive] = useState<EmailTabHeaderActiveProps>({
    menu: false,
    provider: false,
    filter: false,
    mobile: false,
  });

  const { partialSyncEmailsAPI } = usePartialSyncEmailsAPI();

  const provider_name = (selectedProvider.value as string).split(',')[1];
  const provider_email = (selectedProvider.value as string).split(',')[0];

  useEffect(() => {
    const tabName = (state as { [key: string]: CustomLabel })?.status;
    if (tabName !== undefined) {
      setEmailTabs(tabName);
    }
  }, [state]);

  useEffect(() => {
    if (selectedMails.length > 0) {
      SetShowHeaderIcons(true);
    } else {
      SetShowHeaderIcons(false);
    }
  }, [selectedMails]);

  useEffect(() => {
    SetSelectedMails([]);
  }, [label]);

  useEffect(() => {
    socket?.on(`full_sync_${currentUser?.id}_${organizationId}`, (syncData) => {
      if (syncData && syncData?.mail_provider !== MailTokenProvider.All) {
        setRefresh(true);
      }
    });

    socket?.on(
      `partial_sync_${currentUser?.id}_${organizationId}`,
      (syncData) => {
        if (syncData && syncData?.mail_provider !== MailTokenProvider.All) {
          setRefresh(true);
        }
      }
    );
  }, [socket]);

  const refreshMail = async () => {
    const isActiveProvider = providers.find(
      (val) => val.token_provider_mail === provider_email
    )?.is_active;

    if (isActiveProvider === false) {
      openModal('reconnect_provider');
    }

    const bodyObj = { provider_name, email: provider_email, partial: true };
    await partialSyncEmailsAPI(bodyObj);
  };

  const filterDropdown = (dropDownProps: { close: () => void }) => {
    const { close } = dropDownProps;
    return (
      <ul className="tippy__dropdown__ul">
        {selectFilterOptions.map((item, index) =>
          filterOption({
            item,
            index,
            close,
            setSelectedMailData_Filter,
          })
        )}
      </ul>
    );
  };

  const tabList = [
    {
      title: 'Inbox',
      onClick: () => setEmailTabs(CustomLabel.INBOX),
      activeClassName: label === CustomLabel.INBOX ? 'active' : '',
    },
    {
      title: 'Draft',
      onClick: () => setEmailTabs(CustomLabel.DRAFT),
      activeClassName: label === CustomLabel.DRAFT ? 'active' : '',
    },
    {
      title: 'Sent',
      onClick: () => setEmailTabs(CustomLabel.SENT),
      activeClassName: label === CustomLabel.SENT ? 'active' : '',
    },
    {
      title: 'Archive',
      onClick: () => setEmailTabs(CustomLabel.ARCHIVED),
      activeClassName: label === CustomLabel.ARCHIVED ? 'active' : '',
    },
    {
      title: 'Spam',
      onClick: () => setEmailTabs(CustomLabel.SPAM),
      activeClassName: label === CustomLabel.SPAM ? 'active' : '',
    },
    {
      title: 'Trash',
      onClick: () => setEmailTabs(CustomLabel.TRASH),
      activeClassName: label === CustomLabel.TRASH ? 'active' : '',
    },
    {
      title: 'Scheduled',
      onClick: () => setEmailTabs(CustomLabel.SCHEDULED),
      activeClassName: label === CustomLabel.SCHEDULED ? 'active' : '',
    },
  ];
  return (
    <>
      <div className="email__breadcrumbs">
        <Breadcrumbs path={BREAD_CRUMB.email} />
      </div>
      <div className="emailInbox__header mb-[15px] flex flex-wrap items-center justify-between 3xl:mb-[5px] lg:hidden">
        <div className="left pr-[20px] 3xl:mb-[10px] sm:pr-0">
          <div className="inner__wrapper flex flex-wrap items-center">
            <div className="mr-[10px] relative top-[-2px] sm:max-w-[calc(100%_-_82px)]">
              <ConnectedEmailListDropdown
                options={providerOption}
                selectedValue={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                providers={providers}
              />
            </div>
          </div>
        </div>
        <div className="right inline-flex items-center 3xl:w-full">
          <div className="buttons__wrapper inline-flex flex-wrap 3xl:w-full 3xl:justify-between">
            <div className="inner__wrapper flex flex-wrap items-center sm:justify-between sm:w-full">
              <div className="actionToggle__btns inline-flex">
                {showHeaderIcons && (
                  <EmailHeaderIcons
                    selectedMails={selectedMails}
                    label={label}
                    type="tableView"
                    SetSelectedMails={SetSelectedMails}
                    setRefresh={setRefresh}
                  />
                )}
              </div>
              <div className="inline-flex">
                {provider_name !== MailTokenProvider.All ? (
                  <>
                    <Dropdown
                      className="tippy__dropdown__signature"
                      placement="bottom"
                      content={({ close }) => filterDropdown({ close })}
                    >
                      <button className='select__btn ml-[10px] mb-[10px] h-[32px] leading-[32px] rounded-[6px] bg-[#F2F6F9] px-[16px] pr-[30px] text-[16px] text-black/50 font-biotif__Regular relative before:content-[""] before:absolute before:top-[9px] before:right-[11px] before:w-[8px] before:h-[8px] before:border-l-[1px] before:border-l-[#00000080] before:border-b-[1px] before:border-b-[#00000080] before:rotate-[-45deg]'>
                        {selectedMailData_Filter || 'Select'}
                      </button>
                    </Dropdown>
                    <button
                      onClick={refreshMail}
                      className="reset__btn ml-[10px] mb-[10px]"
                    >
                      <Icon
                        className="w-[32px] h-[32px] bg-[#F2F6F9] rounded-[6px] p-[5px] duration-500"
                        iconType="resetFilledIcon"
                      />
                    </button>
                    <button className="filter__btn ml-[10px] mb-[10px]">
                      <Icon
                        className="w-[32px] h-[32px] bg-[#F2F6F9] rounded-[6px] p-[8px] duration-500"
                        iconType="filterFilled"
                      />
                    </button>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <FormField
              wrapperClass="search__box w-[224px] ml-[10px] mb-[10px]"
              type="text"
              name="name"
              onChange={_.debounce((e) => {
                setSearchData({
                  searchFields: 'short_description,subject,from_email_address',
                  searchText: e.target.value || '',
                });
              }, 500)}
              placeholder="Search"
              icon="searchStrokeIcon"
              iconPosition="left"
            />
          </div>
          <div className="flex items-center justify-center email__pagination mb-[10px] ml-[10px]">
            <p className="text-[14px] font-biotif__SemiBold text-black mr-[12px] relative top-[2px]">
              {conservationsCount ? (page - 1) * 50 + 1 : 0}-
              {conservationsCount / page > 50 ? page * 50 : conservationsCount}{' '}
              of {conservationsCount}
            </p>
            <button
              className={`${
                page !== 1 ? '' : 'pointer-events-none opacity-50'
              } w-[32px] h-[32px] rounded-full bg-ipBlue__transparentBG mr-[6px] p-[6px] pl-[5px] duration-500 hover:bg-primaryColor xl:w-[28px] xl:h-[28px] xl:p-[5px] xl:pl-[4px]`}
              onClick={() => {
                setSelectedMailData_Filter(undefined);
                if (setPage && page) setPage(page - 1);
              }}
            >
              <Icon className="w-full h-full" iconType="backBtnFilled" />
            </button>

            <button
              className={`${
                count > page * 50 ? '' : 'pointer-events-none opacity-50'
              } w-[32px] h-[32px] rounded-full bg-ipBlue__transparentBG mr-[6px] p-[6px] pl-[5px] duration-500 hover:bg-primaryColor rotate-180 xl:w-[28px] xl:h-[28px] xl:p-[5px] xl:pl-[4px]`}
              onClick={() => {
                setSelectedMailData_Filter(undefined);
                if (setPage && page) setPage(page + 1);
              }}
            >
              <Icon className="w-full h-full" iconType="backBtnFilled" />
            </button>
          </div>
        </div>
      </div>

      <div className="emailInbox__header__2 flex flex-wrap items-center lg:hidden">
        <div className="emailInbox__tabs__wrapper inline-flex w-[calc(100%_-_142px)] mr-[10px] mb-[12px] px-[22px] py-[8px] bg-ipBlue__transparentBG rounded-[12px] lg:px-[12px] sm:w-full sm:mr-0">
          <div className="emailInbox__tabs whitespace-pre overflow-x-auto">
            {tabList.map((tab, index) => {
              return (
                <button
                  key={index}
                  onClick={() => {
                    tab.onClick();
                    setSearchData({ searchFields: '', searchText: '' });
                  }}
                  className={`${tab.activeClassName} item text-[14px] font-biotif__Medium leading-[16px] text-primaryColor bg-transparent rounded-[30px] px-[25px] py-[8px] mr-[10px] duration-500 hover:bg-ipWhite__bgColor`}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>
        </div>
        <Button
          className="i__Button primary__Btn text-[16px] font-biotif__Medium py-[8px] px-[20px] rounded-[12px] mb-[12px] h-[48px] lg:hidden sm:w-full sm:mb-0"
          icon="plusFilled"
          fill="var(--ipWhite__textColor)"
          onClick={() => openModal('compose')}
        >
          Compose
        </Button>
      </div>

      {/* For Mobile Start */}
      <div className="email__listing__mobile__header hidden items-center justify-between lg:flex lg:pb-[10px]">
        <div className="left">
          <button
            onClick={() =>
              setActive((prev) => ({ ...prev, menu: !isActive.menu }))
            }
            className="toggle__btn w-[20px] h-[32px] rounded-[6px] group"
          >
            <span className="line block w-[18px] h-[2px] mb-[4px] bg-black/50 rounded-[10px] duration-500 group-hover:bg-black" />
            <span className="line block w-[15px] h-[2px] mb-[4px] bg-black/50 rounded-[10px] duration-500 group-hover:bg-black" />
            <span className="line block w-[12px] h-[2px] bg-black/50 rounded-[10px] duration-500 group-hover:bg-black" />
          </button>
        </div>
        <div className="right inline-flex items-center justify-end w-[calc(100%_-_32px)]">
          <div className="search__wrapper w-[calc(100%_-_42px)] relative flex justify-end">
            <input
              className={`ip__input h-[32px] py-[2px] px-[12px] pr-[42px] bg-transparent duration-500 ${
                isActive.mobile ? 'w-full !bg-formField__BGColor' : 'w-0'
              }`}
              placeholder="Search..."
              type="search"
            />
            <button
              onClick={() =>
                setActive((prev) => ({ ...prev, mobile: !isActive.mobile }))
              }
              className={`search__btn w-[32px] h-[32px] absolute top-[50%] translate-y-[-50%] right-0 z-[2] rounded-[6px] duration-500 hover:bg-[#E6E6E6] ${
                isActive.mobile ? '!h-[30px] right-[1px]' : ''
              }`}
            >
              <Icon iconType="searchStrokeIcon" />
            </button>
          </div>
          <button
            onClick={() =>
              setActive((prev) => ({ ...prev, filter: !isActive.filter }))
            }
            className="filter__btn w-[32px] h-[32px] rounded-[6px] ml-[10px]"
          >
            <Icon iconType="filterFilled" />
          </button>
        </div>
      </div>

      <Button
        className="compose__mobile__fixed__btn fixed bottom-[15px] right-[15px] w-[42px] h-[42px] rounded-full bg-primaryColor text-[0px] shadow-[0px_1px_19px_#07070740] z-[4] p-[2px] hover:bg-primaryColor__hoverDark hidden lg:block"
        icon="plusFilled"
        fill="var(--ipWhite__textColor)"
        onClick={() => openModal('compose')}
      >
        .
      </Button>

      <div
        className={`overlay fixed top-0 left-0 w-screen h-screen bg-[#0009] z-[8] ${
          isActive.menu ? 'block' : 'hidden'
        }`}
      />
      <div
        className={`email__mobile__menu fixed bottom-0 left-0 w-screen h-auto z-[9] duration-700 translate-y-[105%] ${
          isActive.menu ? 'show' : ''
        }`}
      >
        <div className="contant__wrapper bg-white overflow-hidden rounded-t-[30px]">
          <div className="provider__header flex items-center justify-start bg-[#E6E6E6] py-[15px] px-[15px]">
            <div className="item active w-[34px] h-[34px] p-[3px] rounded-full mr-[14px] cursor-pointer last:mr-0 duration-500 hover:bg-[#cecece]">
              <div className="flex items-center justify-center w-full h-full rounded-full bg-white p-[7px]">
                <img
                  className="w-full h-auto"
                  src="images/gmail__icon.svg"
                  alt=""
                />
              </div>
            </div>
            <div className="item w-[34px] h-[34px] p-[3px] rounded-full mr-[14px] cursor-pointer last:mr-0 duration-500 hover:bg-[#cecece]">
              <div className="flex items-center justify-center w-full h-full rounded-full bg-white p-[7px]">
                <img
                  className="w-full h-auto"
                  src="images/gmail__icon.svg"
                  alt=""
                />
              </div>
            </div>
            <div className="item w-[34px] h-[34px] p-[3px] rounded-full mr-[14px] cursor-pointer last:mr-0 duration-500 hover:bg-[#cecece]">
              <div className="flex items-center justify-center w-full h-full rounded-full bg-white p-[7px]">
                <img
                  className="w-full h-auto"
                  src="images/gmail__icon.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div className="inner__cn p-[16px]">
            <div className="max-h-[60vh] overflow-y-auto ip__hideScrollbar">
              <div className="flex items-center relative pr-[35px] border-b border-b-black/10 pb-[15px] mb-[15px]">
                <div className="img__wrapper w-[60px] h-[60px]">
                  <img
                    className="w-full h-full rounded-[10px] object-cover object-center"
                    src="images/user__profile.png"
                    alt=""
                  />
                </div>
                <div className="w-[calc(100%_-_61px)] pl-[12px] flex flex-wrap items-center">
                  <h3 className="w-full text-[16px] text-[#222222] font-biotif__SemiBold whitespace-pre overflow-hidden text-ellipsis">
                    Brook Swift
                  </h3>
                  <span className="inline-block text-[12px] font-biotif__Regular text-[#222222] whitespace-pre overflow-hidden text-ellipsis max-w-full">
                    Brookswift99@gmail.com
                  </span>
                </div>
                <button
                  onClick={() =>
                    setActive((prev) => ({
                      ...prev,
                      provider: !isActive.provider,
                    }))
                  }
                  className="setting__btn w-[24px] h-[24px] p-[5px] absolute top-[calc(50%_-_15px)] translate-y-[-50%] right-0 rounded-full duration-500 hover:bg-ipGray__transparentBG"
                >
                  <Icon
                    className="w-full h-full p-0"
                    iconType="settingFilled"
                  />
                </button>
              </div>
              <div className="menu">
                <div className="item active cursor-pointer text-[16px] font-biotif__Medium text-[#000000]/60 flex items-center justify-between duration-500 py-[7px] hover:text-black">
                  <span className="inline-block pr-[12px]">Inbox</span>
                  <span className="count inline-block pt-[6px] pr-[7px] pb-[4px] pl-[8px] text-[12px] leading-[12px] font-biotif__Regular text-white bg-primaryColor rounded-full">
                    3
                  </span>
                </div>
                <div className="item text-[16px] font-biotif__Medium text-[#000000]/60 flex items-center justify-between duration-500 py-[7px] cursor-pointer hover:text-black">
                  <span className="inline-block pr-[12px]">Draft</span>
                </div>
                <div className="item text-[16px] font-biotif__Medium text-[#000000]/60 flex items-center justify-between duration-500 py-[7px] cursor-pointer hover:text-black">
                  <span className="inline-block pr-[12px]">Outbox</span>
                </div>
                <div className="item text-[16px] font-biotif__Medium text-[#000000]/60 flex items-center justify-between duration-500 py-[7px] cursor-pointer hover:text-black">
                  <span className="inline-block pr-[12px]">Sent</span>
                </div>
                <div className="item text-[16px] font-biotif__Medium text-[#000000]/60 flex items-center justify-between duration-500 py-[7px] cursor-pointer hover:text-black">
                  <span className="inline-block pr-[12px]">Archive</span>
                </div>
                <div className="item text-[16px] font-biotif__Medium text-[#000000]/60 flex items-center justify-between duration-500 py-[7px] cursor-pointer hover:text-black">
                  <span className="inline-block pr-[12px]">Spam</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`email__account__list__modal fixed top-0 left-0 w-screen h-screen z-[10] ${
          isActive.provider ? 'block' : 'hidden'
        }`}
      >
        <div className="overlay fixed top-0 left-0 w-screen h-screen bg-[#0009]" />
        <div className="h-full w-full flex items-center justify-center relative z-[2] px-[15px]">
          <div className="contant__wrapper bg-white rounded-[10px] overflow-hidden">
            <div className="header flex items-center relative p-[15px] bg-[#E6E6E6] pr-[40px] pb-[15px]">
              <div className="img__wrapper w-[36px] h-[36px]">
                <img
                  className="w-full h-full rounded-[6px] object-cover object-center"
                  src="images/user__profile.png"
                  alt=""
                />
              </div>
              <div className="w-[calc(100%_-_37px)] pl-[12px] flex flex-wrap items-center">
                <h3 className="w-full text-[14px] text-[#222222] font-biotif__SemiBold whitespace-pre overflow-hidden text-ellipsis">
                  Brook Swift
                </h3>
                <span className="inline-block text-[12px] font-biotif__Regular text-[#222222] whitespace-pre overflow-hidden text-ellipsis max-w-full">
                  Brookswift99@gmail.com
                </span>
              </div>
              <button className="setting__btn w-[24px] h-[24px] p-[5px] absolute top-[50%] translate-y-[-50%] right-[10px] rounded-full duration-500 hover:bg-ipGray__transparentBG">
                <Icon className="w-full h-full p-0" iconType="settingFilled" />
              </button>
            </div>
            <div className="contant__body py-[12px]">
              <div className="max-h-[calc(100dvh_-_250px)] overflow-y-auto ip__hideScrollbar">
                <div className="flex flex-wrap items-center justify-between px-[15px] py-[8px]">
                  <div className="flex flex-wrap items-center max-w-[calc(100%_-_38px)]">
                    <div className="img__wrapper w-[36px] h-[36px]">
                      <img
                        className="w-full h-full rounded-[6px] object-cover object-center"
                        src="images/user__profile.png"
                        alt=""
                      />
                    </div>
                    <div className="w-[calc(100%_-_37px)] pl-[12px] pr-[10px] flex flex-wrap items-center">
                      <h3 className="w-full text-[14px] text-[#222222] font-biotif__SemiBold whitespace-pre overflow-hidden text-ellipsis">
                        Brook Swift
                      </h3>
                      <span className="inline-block text-[12px] font-biotif__Regular text-[#222222] whitespace-pre overflow-hidden text-ellipsis max-w-full">
                        Brookswift99@gmail.com
                      </span>
                    </div>
                  </div>
                  <span className="count inline-block pt-[4px] pr-[6px] pb-[3px] pl-[6px] text-[10px] leading-[10px] font-biotif__Regular text-white bg-primaryColor rounded-full">
                    3
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between px-[15px] py-[8px]">
                  <div className="flex flex-wrap items-center max-w-[calc(100%_-_38px)]">
                    <div className="img__wrapper w-[36px] h-[36px]">
                      <img
                        className="w-full h-full rounded-[6px] object-cover object-center"
                        src="images/user__profile.png"
                        alt=""
                      />
                    </div>
                    <div className="w-[calc(100%_-_37px)] pl-[12px] pr-[10px] flex flex-wrap items-center">
                      <h3 className="w-full text-[14px] text-[#222222] font-biotif__SemiBold whitespace-pre overflow-hidden text-ellipsis">
                        Brook Swift
                      </h3>
                      <span className="inline-block text-[12px] font-biotif__Regular text-[#222222] whitespace-pre overflow-hidden text-ellipsis max-w-full">
                        Brookswift99@gmail.com
                      </span>
                    </div>
                  </div>
                  <span className="count inline-block pt-[4px] pr-[6px] pb-[3px] pl-[6px] text-[10px] leading-[10px] font-biotif__Regular text-white bg-primaryColor rounded-full">
                    3
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between px-[15px] py-[8px]">
                  <div className="flex flex-wrap items-center max-w-[calc(100%_-_38px)]">
                    <div className="img__wrapper w-[36px] h-[36px]">
                      <img
                        className="w-full h-full rounded-[6px] object-cover object-center"
                        src="images/user__profile.png"
                        alt=""
                      />
                    </div>
                    <div className="w-[calc(100%_-_37px)] pl-[12px] pr-[10px] flex flex-wrap items-center">
                      <h3 className="w-full text-[14px] text-[#222222] font-biotif__SemiBold whitespace-pre overflow-hidden text-ellipsis">
                        Brook Swift
                      </h3>
                      <span className="inline-block text-[12px] font-biotif__Regular text-[#222222] whitespace-pre overflow-hidden text-ellipsis max-w-full">
                        Brookswift99@gmail.com
                      </span>
                    </div>
                  </div>
                  <span className="count inline-block pt-[4px] pr-[6px] pb-[3px] pl-[6px] text-[10px] leading-[10px] font-biotif__Regular text-white bg-primaryColor rounded-full">
                    3
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between px-[15px] py-[8px]">
                  <div className="flex flex-wrap items-center max-w-[calc(100%_-_38px)]">
                    <div className="img__wrapper w-[36px] h-[36px]">
                      <img
                        className="w-full h-full rounded-[6px] object-cover object-center"
                        src="images/user__profile.png"
                        alt=""
                      />
                    </div>
                    <div className="w-[calc(100%_-_37px)] pl-[12px] pr-[10px] flex flex-wrap items-center">
                      <h3 className="w-full text-[14px] text-[#222222] font-biotif__SemiBold whitespace-pre overflow-hidden text-ellipsis">
                        Brook Swift
                      </h3>
                      <span className="inline-block text-[12px] font-biotif__Regular text-[#222222] whitespace-pre overflow-hidden text-ellipsis max-w-full">
                        Brookswift99@gmail.com
                      </span>
                    </div>
                  </div>
                  <span className="count inline-block pt-[4px] pr-[6px] pb-[3px] pl-[6px] text-[10px] leading-[10px] font-biotif__Regular text-white bg-primaryColor rounded-full">
                    3
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between px-[15px] py-[8px]">
                  <div className="flex flex-wrap items-center max-w-[calc(100%_-_38px)]">
                    <div className="img__wrapper w-[36px] h-[36px]">
                      <img
                        className="w-full h-full rounded-[6px] object-cover object-center"
                        src="images/user__profile.png"
                        alt=""
                      />
                    </div>
                    <div className="w-[calc(100%_-_37px)] pl-[12px] pr-[10px] flex flex-wrap items-center">
                      <h3 className="w-full text-[14px] text-[#222222] font-biotif__SemiBold whitespace-pre overflow-hidden text-ellipsis">
                        Brook Swift
                      </h3>
                      <span className="inline-block text-[12px] font-biotif__Regular text-[#222222] whitespace-pre overflow-hidden text-ellipsis max-w-full">
                        Brookswift99@gmail.com
                      </span>
                    </div>
                  </div>
                  <span className="count inline-block pt-[4px] pr-[6px] pb-[3px] pl-[6px] text-[10px] leading-[10px] font-biotif__Regular text-white bg-primaryColor rounded-full">
                    3
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between px-[15px] py-[8px]">
                  <div className="flex flex-wrap items-center max-w-[calc(100%_-_38px)]">
                    <div className="img__wrapper w-[36px] h-[36px]">
                      <img
                        className="w-full h-full rounded-[6px] object-cover object-center"
                        src="images/user__profile.png"
                        alt=""
                      />
                    </div>
                    <div className="w-[calc(100%_-_37px)] pl-[12px] pr-[10px] flex flex-wrap items-center">
                      <h3 className="w-full text-[14px] text-[#222222] font-biotif__SemiBold whitespace-pre overflow-hidden text-ellipsis">
                        Brook Swift
                      </h3>
                      <span className="inline-block text-[12px] font-biotif__Regular text-[#222222] whitespace-pre overflow-hidden text-ellipsis max-w-full">
                        Brookswift99@gmail.com
                      </span>
                    </div>
                  </div>
                  <span className="count inline-block pt-[4px] pr-[6px] pb-[3px] pl-[6px] text-[10px] leading-[10px] font-biotif__Regular text-white bg-primaryColor rounded-full">
                    3
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between px-[15px] py-[8px]">
                  <div className="flex flex-wrap items-center max-w-[calc(100%_-_38px)]">
                    <div className="img__wrapper w-[36px] h-[36px]">
                      <img
                        className="w-full h-full rounded-[6px] object-cover object-center"
                        src="images/user__profile.png"
                        alt=""
                      />
                    </div>
                    <div className="w-[calc(100%_-_37px)] pl-[12px] pr-[10px] flex flex-wrap items-center">
                      <h3 className="w-full text-[14px] text-[#222222] font-biotif__SemiBold whitespace-pre overflow-hidden text-ellipsis">
                        Brook Swift
                      </h3>
                      <span className="inline-block text-[12px] font-biotif__Regular text-[#222222] whitespace-pre overflow-hidden text-ellipsis max-w-full">
                        Brookswift99@gmail.com
                      </span>
                    </div>
                  </div>
                  <span className="count inline-block pt-[4px] pr-[6px] pb-[3px] pl-[6px] text-[10px] leading-[10px] font-biotif__Regular text-white bg-primaryColor rounded-full">
                    3
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between px-[15px] py-[8px]">
                  <div className="flex flex-wrap items-center max-w-[calc(100%_-_38px)]">
                    <div className="img__wrapper w-[36px] h-[36px]">
                      <img
                        className="w-full h-full rounded-[6px] object-cover object-center"
                        src="images/user__profile.png"
                        alt=""
                      />
                    </div>
                    <div className="w-[calc(100%_-_37px)] pl-[12px] pr-[10px] flex flex-wrap items-center">
                      <h3 className="w-full text-[14px] text-[#222222] font-biotif__SemiBold whitespace-pre overflow-hidden text-ellipsis">
                        Brook Swift
                      </h3>
                      <span className="inline-block text-[12px] font-biotif__Regular text-[#222222] whitespace-pre overflow-hidden text-ellipsis max-w-full">
                        Brookswift99@gmail.com
                      </span>
                    </div>
                  </div>
                  <span className="count inline-block pt-[4px] pr-[6px] pb-[3px] pl-[6px] text-[10px] leading-[10px] font-biotif__Regular text-white bg-primaryColor rounded-full">
                    3
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between px-[15px] py-[8px]">
                  <div className="flex flex-wrap items-center max-w-[calc(100%_-_38px)]">
                    <div className="img__wrapper w-[36px] h-[36px]">
                      <img
                        className="w-full h-full rounded-[6px] object-cover object-center"
                        src="images/user__profile.png"
                        alt=""
                      />
                    </div>
                    <div className="w-[calc(100%_-_37px)] pl-[12px] pr-[10px] flex flex-wrap items-center">
                      <h3 className="w-full text-[14px] text-[#222222] font-biotif__SemiBold whitespace-pre overflow-hidden text-ellipsis">
                        Brook Swift
                      </h3>
                      <span className="inline-block text-[12px] font-biotif__Regular text-[#222222] whitespace-pre overflow-hidden text-ellipsis max-w-full">
                        Brookswift99@gmail.com
                      </span>
                    </div>
                  </div>
                  <span className="count inline-block pt-[4px] pr-[6px] pb-[3px] pl-[6px] text-[10px] leading-[10px] font-biotif__Regular text-white bg-primaryColor rounded-full">
                    3
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between px-[15px] py-[8px]">
                  <div className="flex flex-wrap items-center max-w-[calc(100%_-_38px)]">
                    <div className="img__wrapper w-[36px] h-[36px]">
                      <img
                        className="w-full h-full rounded-[6px] object-cover object-center"
                        src="images/user__profile.png"
                        alt=""
                      />
                    </div>
                    <div className="w-[calc(100%_-_37px)] pl-[12px] pr-[10px] flex flex-wrap items-center">
                      <h3 className="w-full text-[14px] text-[#222222] font-biotif__SemiBold whitespace-pre overflow-hidden text-ellipsis">
                        Brook Swift
                      </h3>
                      <span className="inline-block text-[12px] font-biotif__Regular text-[#222222] whitespace-pre overflow-hidden text-ellipsis max-w-full">
                        Brookswift99@gmail.com
                      </span>
                    </div>
                  </div>
                  <span className="count inline-block pt-[4px] pr-[6px] pb-[3px] pl-[6px] text-[10px] leading-[10px] font-biotif__Regular text-white bg-primaryColor rounded-full">
                    3
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-between px-[15px] py-[8px]">
                  <div className="flex flex-wrap items-center max-w-[calc(100%_-_38px)]">
                    <div className="img__wrapper w-[36px] h-[36px]">
                      <img
                        className="w-full h-full rounded-[6px] object-cover object-center"
                        src="images/user__profile.png"
                        alt=""
                      />
                    </div>
                    <div className="w-[calc(100%_-_37px)] pl-[12px] pr-[10px] flex flex-wrap items-center">
                      <h3 className="w-full text-[14px] text-[#222222] font-biotif__SemiBold whitespace-pre overflow-hidden text-ellipsis">
                        Brook Swift
                      </h3>
                      <span className="inline-block text-[12px] font-biotif__Regular text-[#222222] whitespace-pre overflow-hidden text-ellipsis max-w-full">
                        Brookswift99@gmail.com
                      </span>
                    </div>
                  </div>
                  <span className="count inline-block pt-[4px] pr-[6px] pb-[3px] pl-[6px] text-[10px] leading-[10px] font-biotif__Regular text-white bg-primaryColor rounded-full">
                    3
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`overlay fixed top-0 left-0 w-screen h-screen bg-[#0009] z-[8] ${
          isActive.filter ? 'block' : 'hidden'
        }`}
      />
      <div
        className={`email__mobile__filter__modal fixed bottom-0 left-0 w-screen h-auto z-[9] duration-700 translate-y-[105%] ${
          isActive.filter ? 'show' : ''
        }`}
      >
        <div className="contant__wrapper bg-white overflow-hidden rounded-t-[30px] py-[17px]">
          <div className="header px-[15px] flex flex-wrap items-center justify-between">
            <h2 className="inline-block text-[18px] font-biotif__SemiBold text-black pr-[14px]">
              Select
            </h2>
            <div className="inline-flex flex-wrap">
              <button
                onClick={() =>
                  setActive((prev) => ({ ...prev, filter: !isActive.filter }))
                }
                className="bg-secondary__Btn__BGColor text-black text-[12px] font-biotif__SemiBold mr-[8px] py-[4px] px-[10px] rounded-[6px] duration-500 hover:bg-[#c6c6c6]"
              >
                Clear
              </button>
              <button className="bg-primaryColor text-[#ffffff] text-[12px] font-biotif__SemiBold py-[4px] px-[10px] rounded-[6px] duration-500 hover:bg-primaryColor__hoverDark">
                Apply
              </button>
            </div>
          </div>
          <div className="body__wrapper pt-[10px]">
            <div className="max-h-[calc(100dvh_-_100px)] overflow-y-auto ip__hideScrollbar">
              <div className="px-[15px] pb-[10px] mb-[18px] border-b border-b-[#CCCCCC]/70">
                <div className="item active cursor-pointer text-[16px] font-biotif__Medium text-[#000000]/60 flex items-center justify-between duration-500 py-[7px] hover:text-black">
                  <span className="inline-block pr-[12px]">All</span>
                </div>
                <div className="item active cursor-pointer text-[16px] font-biotif__Medium text-[#000000]/60 flex items-center justify-between duration-500 py-[7px] hover:text-black">
                  <span className="inline-block pr-[12px]">Read</span>
                </div>
                <div className="item active cursor-pointer text-[16px] font-biotif__Medium text-[#000000]/60 flex items-center justify-between duration-500 py-[7px] hover:text-black">
                  <span className="inline-block pr-[12px]">Unread</span>
                  <span className="count inline-block pt-[6px] pr-[7px] pb-[4px] pl-[8px] text-[12px] leading-[12px] font-biotif__Regular text-white bg-primaryColor rounded-full">
                    3
                  </span>
                </div>
              </div>
              <div className="px-[15px]">
                <h2 className="inline-block text-[18px] font-biotif__SemiBold text-black pr-[14px] mb-[12px]">
                  Filter
                </h2>
                <FormField
                  type="checkbox"
                  name="all"
                  value=""
                  options={[
                    {
                      label: 'Linked with a Lead',
                      value: 'Linked with a Lead',
                    },
                    {
                      label: 'Linked with a Deal',
                      value: 'Linked with a Deal',
                    },
                    {
                      label: 'Linked with a Account',
                      value: 'Linked with a Account',
                    },
                    {
                      label: 'Linked with a Contact',
                      value: 'Linked with a Contact',
                    },
                    { label: 'To: me', value: 'To: me' },
                    {
                      label: 'From an existing contact',
                      value: 'From an existing contact',
                    },
                    {
                      label: 'Only with attachments',
                      value: 'Only with attachments',
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* For Mobile End */}
    </>
  );
};

export default EmailTabHeader;
