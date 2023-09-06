// ** Import Packages **
import { useEffect, useState } from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns-tz';

// ** use-services **
import { useGetLeadDealAccContactOptions } from 'hooks/useSearchService';

// ** Components **
import Button from 'components/Button';
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import EmailQuickAddEntityDropdown from './EmailQuickAddEntityDropdown';

// ** Types **
import {
  ComposeMailAccountData,
  ComposeMailContactData,
  ComposeMailDealData,
  ComposeMailLeadData,
  EmailComposerFieldType,
} from 'pages/Email/types/email.type';
import { getCurrentUser } from 'redux/slices/authSlice';
import { ModuleNames } from 'constant/permissions.constant';
import DisplayEntityDetail from './DisplayEntityDetail';
import { Option } from 'components/FormField/types/formField.types';
import EmailEntityOption from 'pages/Contact/components/EmailEntityOption';
import {
  useConnectEntityWithComposeMailMutation,
  useLazyGetComposeMailEntityDetailByIdQuery,
  useRemoveEntityFromComposeMaiByIdMutation,
} from 'redux/api/composeMailConnectEntityApi';
import {
  getEmailInsertField,
  setEmailInsertField,
} from 'redux/slices/emailInsertField';
import { Tab } from 'constant/emailTemplate.constant';
import { formatPhoneNumber } from 'utils/util';

type Props = {
  control: Control<EmailComposerFieldType, any>;
  runSetFieldValueScript: number;
  isSideNavigation: boolean;
  defaultEmail?: boolean;
  setIsSideNavigation: (value: boolean) => void;
  setValue: UseFormSetValue<EmailComposerFieldType>;
  connectedEntity:
    | {
        modelName: string | undefined;
        detail: ComposeMailContactData &
          ComposeMailLeadData &
          ComposeMailDealData &
          ComposeMailAccountData;
      }
    | undefined;
  setConnectedEntity: React.Dispatch<
    React.SetStateAction<
      | {
          modelName: string | undefined;
          detail: ComposeMailContactData &
            ComposeMailLeadData &
            ComposeMailDealData &
            ComposeMailAccountData;
        }
      | undefined
    >
  >;
  connectEntityModelName?: ModuleNames;
  connectEntityModelRecordId?: number;
  setDefaultRecipientList: React.Dispatch<
    React.SetStateAction<Option[] | undefined>
  >;
};

const EmailComposerRightSection = (props: Props) => {
  const {
    control,
    runSetFieldValueScript,
    isSideNavigation,
    defaultEmail = true,
    setIsSideNavigation,
    setValue,
    setConnectedEntity,
    connectedEntity,
    connectEntityModelName,
    connectEntityModelRecordId,
    setDefaultRecipientList,
  } = props;

  const currentUser = useSelector(getCurrentUser);
  // ** States **
  const [addNewEntity, setAddNewEntity] = useState(false);
  const [connectedEntityNameModel, setConnectedEntityNameModel] =
    useState<ModuleNames>();
  const [changeModel, setChangeModel] = useState<boolean>(false);
  // ** Custom hooks **
  const dispatch = useDispatch();
  const emailInsertField = useSelector(getEmailInsertField);
  const { getLeadDealAccContactOptions, loadingSearchOption } =
    useGetLeadDealAccContactOptions();
  const [getComposeMailEntityDetailByIdsAPI, { isLoading }] =
    useLazyGetComposeMailEntityDetailByIdQuery();
  const [connectEntityWithComposeMailAPI, { isLoading: connectingEntity }] =
    useConnectEntityWithComposeMailMutation();
  const [removeEntityFromComposeMaiByIdAPI, { isLoading: removingEntity }] =
    useRemoveEntityFromComposeMaiByIdMutation();

  useEffect(() => {
    if (currentUser?.id) {
      getComposeMailEntityDetail(currentUser?.id);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (connectEntityModelName && connectEntityModelRecordId) {
      connectEntityWithComposeMail(
        '',
        connectEntityModelName,
        connectEntityModelRecordId
      );
      setChangeModel(true);
    }
  }, [connectEntityModelName, connectEntityModelRecordId]);

  // this effect for do any changes related to dynamic fields that time need to run this script
  useEffect(() => {
    setFieldValue();
  }, [runSetFieldValueScript]);

  const setFieldValue = (connectedEntityArg = connectedEntity) => {
    // set dynamic boy fields value
    const editorFormFields = document.getElementsByClassName(
      'templateInput__field'
    );

    [...Array(editorFormFields.length)].forEach((__, index) => {
      const field = editorFormFields[index] as HTMLInputElement;
      if (connectedEntityArg?.detail) {
        let insertValue =
          connectedEntityArg.detail[
            field.id as keyof typeof connectedEntityArg.detail
          ]?.toString() || '';
        if (field.id === 'closing_date' && insertValue) {
          insertValue = format(new Date(insertValue), 'MM/dd/yyyy') || '';
        }
        if (field.id === 'contact_phone' && insertValue) {
          insertValue = formatPhoneNumber(insertValue) || '';
        }
        field.value = insertValue;
      }
    });
  };

  const getComposeMailEntityDetail = async (id: number) => {
    const { data, error } = await getComposeMailEntityDetailByIdsAPI({
      id: +id,
    });
    if (!error && data?.model_name && data?.detail) {
      setConnectedEntity({
        detail: data.detail,
        modelName: data?.model_name,
      });
      setConnectedEntityNameModel(data.model_name);
      let tempEmail = '';
      if (data?.model_name === 'accounts') {
        if (!data?.detail?.account_email) {
          tempEmail = data?.detail?.account_related_contact_email;
        } else {
          tempEmail = data?.detail?.account_email;
        }
      } else if (data?.model_name === 'contacts') {
        if (!data?.detail?.contact_email) {
          tempEmail = data?.detail?.related_account_email;
        } else {
          tempEmail = data?.detail?.contact_email;
        }
      } else if (data?.model_name === 'leads') {
        // Not Found
        if (!data?.detail?.lead_related_contact_email) {
          tempEmail = data?.detail?.lead_related_account_email;
        } else {
          tempEmail = data?.detail?.lead_related_contact_email;
        }
      } else if (data?.model_name === 'deals') {
        // Not Found
        if (!data?.detail?.deal_related_contact_email) {
          tempEmail = data?.detail?.deal_related_account_email;
        } else {
          tempEmail = data?.detail?.deal_related_contact_email;
        }
      }
      if (tempEmail && defaultEmail) {
        setDefaultRecipientList([...[{ value: tempEmail, label: tempEmail }]]);
      }
    }
  };

  const connectEntityWithComposeMail = async (
    value: string,
    modelName?: ModuleNames,
    modelRecordId?: number
  ) => {
    const currentModelName = modelName || value.split('-')[0];
    const currentModelRecordId = modelRecordId || value.split('-')[1];

    const newData = {
      model_name: currentModelName,
      model_record_id: currentModelRecordId,
      user_id: currentUser?.id,
    };
    const data = await connectEntityWithComposeMailAPI({ data: newData });
    if ('data' in data) {
      let tempEmail = '';
      if (data.data?.model_name === 'accounts') {
        if (!data?.data?.detail?.account_email) {
          tempEmail = data?.data?.detail?.account_related_contact_email;
        } else {
          tempEmail = data?.data?.detail?.account_email;
        }
      } else if (data?.data.model_name === 'contacts') {
        if (!data?.data?.detail?.contact_email) {
          tempEmail = data?.data?.detail?.related_account_email;
        } else {
          tempEmail = data?.data?.detail?.contact_email;
        }
      } else if (data?.data.model_name === 'leads') {
        // Not Found
        if (!data?.data?.detail?.lead_related_contact_email) {
          tempEmail = data?.data?.detail?.lead_related_account_email;
        } else {
          tempEmail = data?.data?.detail?.lead_related_contact_email;
        }
      } else if (data?.data.model_name === 'deals') {
        // Not Found
        if (!data?.data?.detail?.deal_related_contact_email) {
          tempEmail = data?.data?.detail?.deal_related_account_email;
        } else {
          tempEmail = data?.data?.detail?.deal_related_contact_email;
        }
      }
      if (tempEmail && (defaultEmail || changeModel)) {
        setDefaultRecipientList([...[{ value: tempEmail, label: tempEmail }]]);
      }

      if (data?.data.detail && data?.data.model_name && !data.data.error) {
        setConnectedEntity({
          detail: data.data.detail,
          modelName: data.data.model_name,
        });
        setConnectedEntityNameModel(data.data.model_name);
        setFieldValue({
          detail: data.data.detail,
          modelName: data.data.model_name,
        });
      }
    }
  };

  const removeEntityFromComposeMailById = async () => {
    await removeEntityFromComposeMaiByIdAPI({});
    setConnectedEntity(undefined);
    dispatch(
      setEmailInsertField({
        data: null,
        entity: Object.keys(emailInsertField)[0] as Tab,
      })
    );
    setFieldValue({
      detail: {
        id: 0,
        name: '',
      },
      modelName: undefined,
    });
  };

  const renderEntitySection = () => {
    return connectedEntity?.detail?.id ? (
      <div className="template__add__box rounded-[10px] bg-[#ffffff] p-[16px] relative">
        <Icon
          className="closeBtn"
          iconType="closeBtnFilled"
          onClick={() => !removingEntity && removeEntityFromComposeMailById()}
        />

        {/* display entity based on models */}
        {connectedEntityNameModel && (
          <DisplayEntityDetail
            connectedEntityNameModel={connectedEntityNameModel}
            connectedEntity={connectedEntity?.detail}
          />
        )}

        {connectedEntity?.detail?.Activity?.[0] && (
          <div className="connected__activity__listing">
            <div className="cal__box relative pl-[34px] mb-[10px]">
              <Icon
                className="bg-[#ECF2F6] rounded-[5px] absolute top-0 left-0"
                iconType="phoneFilled"
              />
              <h3 className="text-ipBlack__textColor text-[14px] font-biotif__Medium">
                {connectedEntity?.detail.Activity[0].topic}
              </h3>
              <span className="text-[#808080] font-biotif__Regular">
                {format(
                  new Date(connectedEntity?.detail.Activity[0].start_date),
                  'MMM d, yyyy'
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    ) : (
      <div className="template__add__box rounded-[10px] bg-[#ffffff] p-[16px] relative">
        <div className="">
          <h3 className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[5px]">
            Link to a Deal, Lead, Account Or Contact
          </h3>
          <p className="text-[#808080] text-[14px] font-biotif__Regular leading-[18px]">
            Find an exiting link deal,lead,contact,account or create new one.
          </p>
          <FormField<any>
            disabled={connectingEntity}
            onChange={(e) =>
              connectEntityWithComposeMail(e as unknown as string)
            }
            isClearable
            control={control}
            wrapperClass="mb-[15px] mt-[15px] z-[3] relative"
            type="asyncSelect"
            name=""
            serveSideSearch
            getOptions={getLeadDealAccContactOptions}
            isLoading={loadingSearchOption}
            menuPlacement="bottom"
            menuPosition="absolute"
            OptionComponent={EmailEntityOption}
          />
          <Button
            className='primary__Btn w-full text-[14px] font-biotif__Regular relative mb-[10px] before:content-[""] before:absolute before:top-[14px] before:right-[16px] before:w-[8px] before:h-[8px] before:border-l-[2px] before:border-l-[#ffffff] before:border-b-[2px] before:border-b-[#ffffff] before:rotate-[-45deg]'
            onClick={() => setAddNewEntity(!addNewEntity)}
          >
            Add New
          </Button>
          <div
            className={`tippy-box tippy__dropdown emial__linkDealLead__tippy ${
              addNewEntity ? '' : 'hidden'
            }`}
          >
            <EmailQuickAddEntityDropdown
              setValue={setValue}
              connectEntityWithComposeMail={connectEntityWithComposeMail}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`right ${
          isSideNavigation ? 'active' : ''
        } bg-[#FEEDDB] w-[309px] absolute top-0 right-0 h-full z-[5] rounded-r-[12px] pt-[59px] md:w-full`}
      >
        <button
          onClick={() => {
            setIsSideNavigation(false);
          }}
          className='backBtn text-[0px] absolute left-[18px] top-[21px] cursor-pointer w-[20px] h-[15px] bg-red hidden sm:inline-block after:content-[""] after:absolute after:top-[4px] after:left-0 after:w-[8px] after:h-[8px] after:border-l-[2px] after:border-l-ipBlack__borderColor after:border-b-[2px] after:border-b-ipBlack__borderColor after:rotate-45 before:content-[""] before:absolute before:top-[7px] before:left-[0px] before:w-[12px] before:bg-ipBlack__bgColor before:h-[2px]'
        >
          .
        </button>
        <div className="inner__wrapper border-t border-t-[#0000001a] p-[15px] h-full overflow-y-auto ip__FancyScroll">
          {isLoading ? (
            <>
              <div className="template__add__box rounded-[10px] bg-[#ffffff] p-[16px] relative">
                <div className="skeletonBox w-full mb-[10px]" />
                <div className="skeletonBox w-[70%] mb-[20px]" />
                <div className="skeletonBox w-full mb-[10px]" />
                <div className="skeletonBox w-[80%] mb-[10px]" />
                <div className="skeletonBox w-[50%] mb-[20px]" />
                <div className="skeletonBox w-full h-[36px] mb-[10px] rounded-[10px]" />
                <div className="skeletonBox w-full h-[36px] rounded-[10px]" />
              </div>
            </>
          ) : (
            renderEntitySection()
          )}
        </div>
      </div>
    </>
  );
};

export default EmailComposerRightSection;
