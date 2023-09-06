// ** Components **
import AuthCard from 'pages/auth/components/AuthCard';

// ** Type **
import { OrganizationFormProps } from 'pages/auth/Login/types/login.types';

const OrganizationForm = (props: OrganizationFormProps) => {
  const {
    organizationOptions = [],
    organizationSuccess,
    prev: goToPrev,
    showPrevBtn,
  } = props;

  const options = organizationOptions.map((val) => ({
    label: val.name,
    value: val.uuid,
  }));

  const onSubmit = (organization: string) => {
    organizationSuccess(organization);
  };

  return (
    <AuthCard
      title="Select Organization"
      subTitle="Select any one to continue"
      showBackBtn={showPrevBtn}
      onBackBtnClicked={goToPrev}
    >
      <div className="signup__Card__Body p-[30px]">
        {options.map((obj) => (
          <div
            className="organization__box group cursor-pointer bg-black/5 rounded-[10px] py-[10px] px-[15px] relative mb-[15px] duration-500 hover:bg-primaryColor last:mb-0"
            key={obj.value}
            onClick={() => onSubmit(obj.value)}
          >
            <div className="inner__wrapper">
              <h3 className="text-[16px] font-biotif__Medium text-black duration-500 group-hover:text-white">
                {obj.label}
              </h3>
              <button
                type="button"
                className="text-[0px] w-[9px] h-[9px] border-b-[2px] border-b-[#6D6D6D] border-r-[2px] border-r-[#6D6D6D] absolute top-[50%] translate-y-[-50%] right-[15px] -rotate-45 duration-500 group-hover:border-b-white group-hover:border-r-white"
              >
                .
              </button>
            </div>
          </div>
        ))}
      </div>
    </AuthCard>
  );
};

export default OrganizationForm;
