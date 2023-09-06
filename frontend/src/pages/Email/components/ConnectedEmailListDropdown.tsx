import Tippy from '@tippyjs/react';
import Dropdown from 'components/Dropdown';
import { Option } from 'components/FormField/types/formField.types';
import {
  TokenProvider,
  UserToken,
} from 'pages/Setting/email-setting/EmailSetting/types/userToken.type';
import React, { useMemo, useRef } from 'react';

const providerImg: { [key in TokenProvider]?: string } = {
  [TokenProvider.GOOGLE_MAIL]: '/images/gmail__icon.svg',
  [TokenProvider.MICROSOFT]: '/images/microsoft__Outlook__icon.svg',
  [TokenProvider.OUTLOOK]: '/images/microsoft__Outlook__icon.svg',
  [TokenProvider.SMTP]: '/images/smtp.jpeg',
  [TokenProvider.All]: '/images/email__icon.svg',
};

const EmailDropdownLabel = React.forwardRef<
  any,
  { data: Option; isProviderActive?: boolean }
>(({ data, isProviderActive }, _ref) => {
  return (
    <div>
      <div className="img__wrapper shrink-0 inline-flex items-center justify-center !w-[25px] h-[25px] bg-[#ffffff] p-[6px] rounded-full overflow-hidden">
        <img
          className="w-full h-full object-contain object-center"
          src={`${
            providerImg[(data?.value as string)?.split(',')[1] as TokenProvider]
          }`}
          alt="provider-img"
        />
      </div>
      <p className="name text-[14px] text-primaryColor font-biotif__Medium">
        {data?.label || ''}
      </p>
      {isProviderActive === false ? (
        <Tippy content="Please re-connect account">
          <div className="w-[16px] h-[16px] text-[10px] leading-[16px] ml-[5px] shrink-0 flex items-center justify-center !text-ip__Red border-[1px] border-ip__Red rounded-full">
            !
          </div>
        </Tippy>
      ) : null}
    </div>
  );
});

interface PropsTypes {
  options: Option[];
  selectedValue: Option;
  setSelectedProvider: React.Dispatch<React.SetStateAction<Option>>;
  providers?: UserToken[];
}

const ConnectedEmailListDropdown = (props: PropsTypes) => {
  const { options, selectedValue, setSelectedProvider, providers } = props;

  const ref = useRef(null);

  const onChangeMail = (mail: any) => {
    setSelectedProvider(mail);
  };

  const createOption = (option: Option) => {
    const isProviderActive = providers?.find(
      (item) =>
        item.token_provider_mail === (option?.value as string).split(',')[0]
    )?.is_active;

    return (
      <div
        className="item"
        key={option.value}
        onClick={() => onChangeMail(option)}
      >
        <div className="img__wrapper inline-flex items-center justify-center !w-[25px] h-[25px] bg-[#ffffff] p-[6px] rounded-full shrink-0">
          <img
            className="w-full h-full object-contain object-center"
            src={`${
              providerImg[
                (option?.value as string).split(',')[1] as TokenProvider
              ]
            }`}
            alt="provider-img"
          />
        </div>
        <div className="name w-full pl-[5px] whitespace-pre overflow-hidden text-ellipsis text-[14px] !text-primaryColor font-biotif__Medium">
          {option.label}
        </div>
        {isProviderActive === false ? (
          <Tippy content="Please re-connect account">
            <div className="w-[16px] h-[16px] !text-[10px] !leading-[10px] pt-[4px] ml-[5px] shrink-0 flex !items-center justify-center !text-ip__Red border-[1px] border-ip__Red rounded-full">
              !
            </div>
          </Tippy>
        ) : null}
      </div>
    );
  };

  const dropDownList = (
    close: React.MouseEventHandler<HTMLDivElement> | undefined
  ) => {
    return (
      <div onClick={close}>{options.map((option) => createOption(option))}</div>
    );
  };

  const isProviderActive = useMemo(() => {
    return providers?.find(
      (item) =>
        item.token_provider_mail ===
        (selectedValue?.value as string).split(',')[0]
    )?.is_active;
  }, [selectedValue]);

  return (
    <>
      <div className="emailProvide__dropdown mb-[7px]">
        <Dropdown
          className="emailProvide__tippy"
          content={({ close }) => dropDownList(close)}
        >
          <button className="emailProvide__dropdown__btn">
            <EmailDropdownLabel
              ref={ref}
              data={selectedValue}
              isProviderActive={isProviderActive}
            />
          </button>
        </Dropdown>
      </div>
    </>
  );
};

export default ConnectedEmailListDropdown;
