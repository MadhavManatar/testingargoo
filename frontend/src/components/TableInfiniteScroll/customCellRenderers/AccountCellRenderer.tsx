import Tippy from '@tippyjs/react';
import { ICellRendererParams } from 'ag-grid-community';
import Dropdown from 'components/Dropdown';
import Image from 'components/Image';
import { AccountDetails } from 'pages/Account/types/account.types';

import { useState, useRef, useEffect } from 'react';
import { Instance } from 'tippy.js';

import { generateAccountCard } from './NameCellRenderer';

interface IAccountCellRenderer {
  params: ICellRendererParams;
}
const AccountCellRenderer = (props: IAccountCellRenderer) => {
  const { params } = props;
  const { data } = params;

  const [openDropdown, setOpenDropdown] = useState(false);
  const instanceRef = useRef<Instance>();

  useEffect(() => {
    document.addEventListener('mousedown', onClick, true);
    return () => {
      document.removeEventListener('mousedown', onClick, true);
    };
  });

  const onClick = (event: any) => {
    if (instanceRef.current) {
      const { popper, reference, state } = instanceRef.current;

      if (
        !popper.contains(event.target) &&
        !reference.contains(event.target) &&
        !(state.isVisible && reference.contains(event.target))
      ) {
        setOpenDropdown(false);
      }
    }
  };

  if (data?.related_accounts?.length > 1) {
    return (
      <div className="agGrid__prelated_contactshone__wrapper flex items-center overflow-hidden">
        <SingleAccountCellRenderer
          account={data?.related_accounts?.[0]?.account}
        />
        <Tippy
          className="tippy__dropdown"
          visible={openDropdown}
          theme="light"
          zIndex={4}
          interactive
          hideOnClick
          onCreate={(instance) => {
            instanceRef.current = instance;
          }}
          content={
            <div className="p-[10px] max-w-full max-h-[300px] overflow-y-auto ip__hideScrollbar">
              {data?.related_accounts
                ?.slice(1)
                ?.map((val: any, index: number) => {
                  return (
                    <AccountItem
                      key={`AccountItem_${index}`}
                      account={val?.account}
                    />
                  );
                })}
            </div>
          }
          placement="bottom-start"
        >
          <button
            ref={(ref) => {
              if (!ref) return;
              ref.onclick = (e) => {
                e.stopPropagation();
              };
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={() => setOpenDropdown((prev) => !prev)}
            className={`${'shrink-0 ml-[8px] text-primaryColorSD hover:underline'}`}
          >
            + {Number(data?.related_accounts?.length) - 1} more
          </button>
        </Tippy>
      </div>
    );
  }
  return data?.related_accounts?.[0]?.account ? (
    <SingleAccountCellRenderer account={data?.related_accounts?.[0]?.account} />
  ) : (
    <></>
  );
};

export default AccountCellRenderer;

export const SingleAccountCellRenderer = (props: IAccountItem) => {
  const { account } = props;
  const [displayInfo, setDisplayInfo] = useState(false);

  const accountRender = generateAccountCard({ account });
  return account?.name ? (
    <div className="flex items-center group">
      <span className="value inline-block max-w-full">
        <div
          className="flex profile__img__name items-center"
          onFocus={() => setDisplayInfo(true)}
          onBlur={() => setDisplayInfo(false)}
        >
          <div className="img__wrapper">
            <Image
              imgClassName={`${
                account?.name
                  ? 'w-[34px] h-[34px] object-cover object-center rounded-full'
                  : ''
              }`}
              first_name={account?.name}
              imgPath={account?.account_image || null}
              serverPath
              color={account?.initial_color}
            />
          </div>
          <span className="name pl-[8px] whitespace-pre overflow-hidden text-ellipsis">
            {account?.name || ''}
          </span>
        </div>
      </span>
      <Dropdown
        className="quickView__accContact__tippy"
        hideOnClick
        interactive
        content={accountRender}
      >
        <button
          className={`tooltip__iButton shrink-0 ml-[8px] cursor-pointer relative top-[-1px] opacity-0 pointer-events-none ${
            displayInfo
              ? 'opacity-100 pointer-events-auto'
              : 'group-hover:opacity-100 group-hover:pointer-events-auto'
          } `}
        >
          <div className="inner__wrapper">
            <span className="dot" />
            <span className="line" />
          </div>
        </button>
      </Dropdown>
    </div>
  ) : (
    <></>
  );
};

interface IAccountItem {
  account: AccountDetails;
}
const AccountItem = (props: IAccountItem) => {
  const { account } = props;

  const accountRender = generateAccountCard({ account });
  return (
    <div className="flex profile__img__name items-center">
      <div className="item__row w-full py-[12px] flex items-center border-b-[1px] border-b-whiteScreenBorderColor last:border-b-0">
        <div className="img__wrapper">
          <Image
            imgClassName={`${
              account?.name
                ? 'w-[34px] h-[34px] object-cover object-center rounded-full'
                : ''
            }`}
            first_name={account?.name || ''}
            imgPath={account?.account_image || null}
            serverPath
            color={account?.initial_color}
          />
        </div>
        <span className="name pl-[8px] whitespace-pre overflow-hidden text-ellipsis text-[16px] font-biotif__Regular !text-darkTextColorSD w-auto max-w-[200px]">
          {account?.name || ''}
        </span>
        <Dropdown
          className="quickView__accContact__tippy"
          hideOnClick
          interactive
          content={accountRender}
        >
          <button className="tooltip__iButton shrink-0 ml-[8px] cursor-pointer relative top-[-1px] group hover:bg-ipBlack__borderColor">
            <div className="inner__wrapper">
              <span className="dot group-hover:bg-[#ffffff]" />
              <span className="line group-hover:bg-[#ffffff]" />
            </div>
          </button>
        </Dropdown>
      </div>
    </div>
  );
};
