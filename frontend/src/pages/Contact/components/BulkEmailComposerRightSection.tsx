// ** Import Packages **
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// ** Components **
import FormField from 'components/FormField';
import { AsyncSelectGetOptions } from 'components/FormField/types/formField.types';
import Icon from 'components/Icon';
import Image from 'components/Image';

// *** Type **
import { AddContactFormFieldsType } from '../types/contacts.types';
import { useLazyGetContactsQuery } from 'redux/api/contactApi';

type Props = {
  selectedContact: any;
  setSelectionList: any;
  selectionRef: any;
};

const BulkEmailComposerRightSection = (props: Props) => {
  const { selectedContact, setSelectionList, selectionRef } = props;

  const formMethods = useForm<AddContactFormFieldsType>({});
  const { control } = formMethods;
  const [existMailError, setExistMailError] = useState('');
  const [contactInfo, setContactInfo] = useState<any>([]);
  const selectedMailsId: number[] = [];

  // ** APIS **
  const [getContactsAPI, { isLoading: isContactsOptionsLoading }] =
    useLazyGetContactsQuery();

  useEffect(() => {
    if (existMailError) {
      setTimeout(() => {
        setExistMailError('');
      }, 2000);
    }
  }, [existMailError]);

  Object.values(selectedContact).forEach((contact: any) => {
    const selectedMailId = contact.id;
    selectedMailsId.push(selectedMailId);
  });

  const updateContactList = (Id: number) => {
    const updatedList = {
      ...selectionRef.current,
    };
    if (updatedList[Id]) {
      delete updatedList[Id];
    }
    selectionRef.current = { ...updatedList };
    setSelectionList({ ...updatedList });
  };
  const getContactOptions: AsyncSelectGetOptions = async (option) => {
    const { data, error } = await getContactsAPI(
      {
        data: {
          query: {
            limit: 100,
            page: option?.page,
            'q[id][notIn]': `${[...selectedMailsId]}`,
            ...(option?.search
              ? {
                  'q[name][iLike]': `%${option.search}%`,
                }
              : {}),
            select: 'id,name,job_role,emails',
          },
        },
      },
      true
    );
    if (!error && data.rows) {
      const Options = data.rows.map(
        (val: { job_role: string; name?: string; id: number }) => ({
          label: `${val.name}`,
          value: val.id,
          job_role: val.job_role,
        })
      );
      setContactInfo([...data.rows]);
      return { option: Options, count: data.count };
    }
  };

  const updateList = (e: any) => {
    const checkList = Object.values(selectedContact).find(
      (contacts: any) => contacts.id === e
    );
    const contactObj = contactInfo.find((obj: { id: number }) => obj.id === e);
    if (!checkList) {
      const updatedList = {
        ...selectionRef.current,
        ...{ [contactObj.id]: contactObj },
      };
      selectionRef.current = { ...updatedList };
      setSelectionList({ ...updatedList });
    } else {
      setExistMailError('Recipient already Exist.');
    }
  };

  return (
    <div className="right bg-[#FEEDDB] w-[309px] absolute top-0 right-0 h-full z-[5] rounded-r-[12px] pt-[59px] md:w-full">
      <div className="inner__wrapper border-t border-t-[#0000001a] p-[15px] h-full overflow-y-auto ip__FancyScroll">
        <div className="recipients h-full">
          <h2 className="title text-[18px] font-biotif__Medium text-black mb-[5px]">
            Recipients{' '}
            {/* <span className="text-black/50">({selectedContact.length})</span> */}
          </h2>
          <FormField<AddContactFormFieldsType>
            wrapperClass="mb-[7px]"
            id="contact_owner_id"
            placeholder="Search Contact"
            type="asyncSelect"
            name="contact_owner_id"
            control={control}
            defaultSelectValue={null}
            serveSideSearch
            getOptions={getContactOptions}
            menuPlacement="auto"
            onChange={(e) => updateList(e)}
            isLoading={isContactsOptionsLoading}
            menuPosition="fixed"
          />
          {existMailError && (
            <p className="text-[14px] font-biotif__Regular text-black/50 w-full whitespace-pre overflow-hidden text-ellipsis">
              <span className="ip__Error">{existMailError}</span>
            </p>
          )}
          <div className="recipients__box__wrapper mt-[15px] mb-[15px] h-[calc(100%_-_94px)] overflow-y-auto ip__hideScrollbar">
            {Object.values(selectedContact).map((contact: any, index) => {
              const primaryEmail = (contact.emails || []).filter(
                (val: { is_primary: boolean }) => val.is_primary
              );
              const contactProfile = contact?.contact_owner;
              return (
                <div
                  key={index}
                  className="recipients__box flex flex-wrap items-center border-b border-b-black/10 pb-[10px] mb-[10px]"
                >
                  <div className="img__wrapper w-[44px] h-[44px]">
                    <Image
                      imgPath={contactProfile?.profile_image || ''}
                      first_name={contactProfile?.first_name || ''}
                      last_name={contactProfile?.last_name || ''}
                    />
                  </div>

                  <div className="contant w-[calc(100%_-_45px)] pl-[8px] pr-[36px] relative flex flex-wrap items-center">
                    <h3 className="text-black text-[16px] leading-[20px] font-biotif__Medium w-full whitespace-pre overflow-hidden text-ellipsis">
                      {contact.name}
                    </h3>
                    <p className="text-[14px] leading-[20px] font-biotif__Regular text-black/50 w-full whitespace-pre overflow-hidden text-ellipsis">
                      {primaryEmail[0]?.value || (
                        <span className="ip__Error !text-[14px]">
                          No email address available
                        </span>
                      )}
                    </p>

                    <Icon
                      onClick={() => updateContactList(contact.id)}
                      className="closeBtn"
                      iconType="closeBtnFilled"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkEmailComposerRightSection;
