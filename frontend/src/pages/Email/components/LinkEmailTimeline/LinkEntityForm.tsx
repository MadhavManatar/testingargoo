import FormField from 'components/FormField';
import { useGetLeadDealAccContactOptions } from 'hooks/useSearchService';
import EmailEntityOption from 'pages/Contact/components/EmailEntityOption';
import { EmailLinkEntityFieldType } from 'pages/Email/types/emailLinkEntity.type';
import { Control, FieldErrors } from 'react-hook-form';

interface Props {
  control: Control<EmailLinkEntityFieldType>;
  errors: FieldErrors<EmailLinkEntityFieldType>;
}

const LinkEntityForm = (props: Props) => {
  const { control, errors } = props;
  // ** custom hooks **
  const { getLeadDealAccContactOptions, loadingSearchOption } =
    useGetLeadDealAccContactOptions();

  return (
    <div className="template__add__box rounded-[10px] bg-[#ffffff] relative mb-[-20px]">
      <div className="">
        <h3 className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[4px]">
          Link to a Deal, Lead, Account Or Contact
        </h3>
        <FormField<any>
          isClearable
          control={control}
          wrapperClass="z-[3] relative"
          type="asyncSelect"
          name="entity"
          serveSideSearch
          getOptions={getLeadDealAccContactOptions}
          isLoading={loadingSearchOption}
          menuPlacement="bottom"
          menuPosition="fixed"
          OptionComponent={EmailEntityOption}
          error={errors?.entity}
        />
      </div>
    </div>
  );
};

export default LinkEntityForm;
