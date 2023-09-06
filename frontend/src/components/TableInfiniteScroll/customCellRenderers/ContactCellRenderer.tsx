import Tippy from '@tippyjs/react';
import { ICellRendererParams } from 'ag-grid-community';
import Dropdown from 'components/Dropdown';
import Image from 'components/Image';
import { ContactDetails } from 'pages/Contact/types/contacts.types';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Instance } from 'tippy.js';
import { generateContactCard } from './NameCellRenderer';

interface IContactCellRenderer {
  params: ICellRendererParams;
  dataKey?: string;
  onRowClickNavigateLink: string;
}
const ContactCellRenderer = (props: IContactCellRenderer) => {
  const {
    params,
    dataKey = 'related_contacts',
    onRowClickNavigateLink,
  } = props;
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

  if (data?.[dataKey]?.length > 1) {
    return (
      <div className="agGrid__prelated_contactshone__wrapper flex items-center overflow-hidden">
        <SingleContactCellRenderer
          {...{
            onRowClickNavigateLink,
            contact: data?.[dataKey]?.[0]?.contact,
            role: data?.[dataKey]?.[0]?.job_role,
          }}
        />

        <Tippy
          className="tippy__dropdown agGrid__phoneMore__dropdown"
          visible={openDropdown}
          theme="light"
          hideOnClick
          interactive
          zIndex={4}
          onCreate={(instance) => {
            instanceRef.current = instance;
          }}
          content={
            <div className="p-[10px] max-w-full">
              {data?.[dataKey]?.slice(1)?.map((val: any, index: number) => {
                return (
                  <Fragment key={`ContactItem_${index}`}>
                    <ContactItem contact={val?.contact} role={val?.job_role} />
                  </Fragment>
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
            + {Number(data?.[dataKey]?.length) - 1} more
          </button>
        </Tippy>
      </div>
    );
  }

  return data?.[dataKey]?.[0]?.contact?.name ? (
    <SingleContactCellRenderer
      {...{
        onRowClickNavigateLink,
        contact: data?.[dataKey]?.[0]?.contact,
        role: data?.[dataKey]?.[0]?.job_role,
      }}
    />
  ) : (
    <></>
  );
};

export default ContactCellRenderer;

export const SingleContactCellRenderer = (props: IContactItem) => {
  const { contact, role } = props;
  const [displayInfo, setDisplayInfo] = useState(false);
  const contactCardContent = generateContactCard({ contact });
  return contact?.name ? (
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
                contact?.name
                  ? 'w-[34px] h-[34px] object-cover object-center rounded-full'
                  : ''
              }`}
              first_name={contact?.name}
              imgPath={contact?.contact_image || null}
              serverPath
              color={contact?.initial_color}
            />
          </div>
          <span className="name pl-[8px] whitespace-pre overflow-hidden text-ellipsis">
            {contact?.name || ''}
          </span>
          {role ? ` ( ${role} )` : ''}
        </div>
      </span>
      <Dropdown
        className="quickView__accContact__tippy"
        hideOnClick
        interactive
        content={contactCardContent}
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

interface IContactItem {
  contact: ContactDetails;
  role?: string;
}
const ContactItem = (props: IContactItem) => {
  const { contact, role } = props;

  const contactCardContent = generateContactCard({ contact });

  return (
    <div className="flex profile__img__name items-center">
      <div className="item__row w-full py-[12px] flex items-center border-b-[1px] border-b-whiteScreenBorderColor last:border-b-0">
        <div className="img__wrapper">
          <Image
            imgClassName={`${
              contact?.name
                ? 'w-[34px] h-[34px] object-cover object-center rounded-full'
                : ''
            }`}
            first_name={contact?.name || ''}
            imgPath={contact?.contact_image || null}
            serverPath
            color={contact?.initial_color}
          />
        </div>
        <span className="name pl-[8px] whitespace-pre overflow-hidden text-ellipsis text-[16px] font-biotif__Regular !text-darkTextColorSD w-auto max-w-[200px]">
          {contact?.name || ''}
          {role ? ` ( ${role} )` : ''}
        </span>
        <Dropdown
          className="quickView__accContact__tippy"
          hideOnClick
          interactive
          content={contactCardContent}
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
