// ** types **
import { AddressFormFields } from 'components/Address/types/address.types';
import { agGridSelectedProps } from 'components/TableInfiniteScroll';
import { SocialMediaFields } from 'pages/Setting/general-setting/PersonalSettings/types/personal-settings.types';

export type DealLostReasonFormFieldsType = {
  reason: string;
};

export type AddDealLostReasonFormFieldsType = DealLostReasonFormFieldsType &
  AddressFormFields &
  SocialMediaFields;

type Response = {
  id: number | null;
};

export type DealLostReasonDetails = AddDealLostReasonFormFieldsType & Response;

export type DealLostReasonResponseType = {
  dealLostReason: DealLostReasonDetails;
};

type DealLostReasonInformationFieldType = 'reason';

export type DealLostReasonFormObject = {
  information: {
    [key in DealLostReasonInformationFieldType]: JSX.Element;
  };
};

export type DealLostReasonFieldType = {
  information?: DealLostReasonInformationFieldType[];
};

export type AddLostReasonModalPropsType = {
  isQuickModal?: boolean;
  isOpen: boolean;
  onAdd?: () => void;
  closeModal: () => void;
  displayField?: DealLostReasonFieldType;
  id?: number | null;
  setDealLostInfo?: React.Dispatch<React.SetStateAction<agGridSelectedProps>>;
};
