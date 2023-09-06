// ** Import Packages **
import React from 'react';

// ** Components **
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import Icon from 'components/Icon';
import Image from 'components/Image';
import CompanyDetailsViewSkeleton from 'pages/Setting/general-setting/CompanyDetails/skeletons/CompanyDetailsViewSkeleton';
import AuthGuard from 'pages/auth/components/AuthGuard';

// ** Type **
import { CompanyDetailsViewPropsType } from '../types/company-settings.types';

// ** Hooks **
import usePermission from 'hooks/usePermission';
import { useGetCompanyDetails } from '../hooks/useCompanyService';

const CompanyDetailsView = ({ setViewMode }: CompanyDetailsViewPropsType) => {
  const { companyData, isLoading: isCompanyLoading } = useGetCompanyDetails();

  const {
    name,
    phone,
    country,
    state,
    city,
    address1,
    address2,
    website,
    zip,
    email,
    organization_category,
    organization_logo,
  } = companyData;
  const { updateOrganizationPermission } = usePermission();
  return (
    <>
      {isCompanyLoading ? (
        <>
          <CompanyDetailsViewSkeleton />
        </>
      ) : (
        <>
          <div className="company__setting__edit__page border border-whiteScreen__BorderColor rounded-[20px]">
            <div className="flex flex-wrap items-center p-[30px] border-b border-b-whiteborder-whiteScreen__BorderColor 3xl:px-[15px] 3xl:py-[20px] 3xl:pb-[13px] sm:block">
              <div className="inline-block profile__img relative">
                <Image
                  first_name={name || ''}
                  imgPath={organization_logo || ''}
                  serverPath
                />
                <span className="onlineState inline-block absolute bottom-[10px] right-[-2px] w-[14px] h-[14px] rounded-full bg-[#24BD64] border-[2px] border-[#ffffff]" />
              </div>
              <div className="w-[calc(100%_-_72px)] pl-[12px] sm:w-full sm:pl-0 sm:mt-[15px]">
                <h6 className="text-[16px] text-ipBlack__textColor font-biotif__Medium mb-[8px] flex items-center">
                  <span className="name inline-block mr-[8px]">{name}</span>
                </h6>
                {email ? (
                  <ClickableEmail
                    isIconVisible
                    rootClassName="mr-[20px] mb-[10px] max-w-full"
                    iconClassName="highlighted !w-[30px] !h-[30px] !rounded-[7px] !p-[6px] mr-[7px]"
                    textClassName="inline-block text-[14px] font-biotif__Regular max-w-[calc(100%_-_37px)] pt-[1px]"
                    mail={email}
                  />
                ) : null}
                {phone ? (
                  <ClickableMobile
                    number={phone}
                    isIconVisible
                    rootClassName="mr-[20px] mb-[10px] max-w-full"
                    iconClassName="highlighted !w-[30px] !h-[30px] !rounded-[7px] !p-[6px] mr-[7px]"
                    textClassName="inline-block text-[14px] font-biotif__Regular max-w-[calc(100%_-_37px)] pt-[1px]"
                  />
                ) : null}
              </div>
            </div>
            <div className="p-[30px] border-b border-b-whiteborder-whiteScreen__BorderColor 3xl:px-[15px] 3xl:py-[22px]">
              <h3 className="setting__FieldTitle">
                <span className="inline-block max-w-[calc(100%_-_32px)] pr-[15px]">
                  Business Information
                </span>
                <AuthGuard isAccessible={updateOrganizationPermission}>
                  <button>
                    <Icon
                      onClick={() => setViewMode((prev) => !prev)}
                      iconType="editFilled"
                      className="highlighted !w-[30px] !h-[30px] !p-[6px] !rounded-[7px]"
                    />
                  </button>
                </AuthGuard>
              </h3>
              <div className="flex flex-wrap mx-[-10px]">
                <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
                  <p className="ipInfo__View__Label">Business Name</p>
                  <pre className="ipInfo__View__Value whitespace-normal">
                    {name || ''}
                  </pre>
                </div>
                <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
                  <p className="ipInfo__View__Label">Industry</p>
                  <pre className="ipInfo__View__Value whitespace-normal">
                    {organization_category || ''}
                  </pre>
                </div>
                <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
                  <p className="ipInfo__View__Label">Email</p>
                  <pre className="ipInfo__View__Value whitespace-normal link">
                    {email ? <ClickableEmail mail={email} /> : ''}
                  </pre>
                </div>
                <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
                  <p className="ipInfo__View__Label">Website</p>
                  <pre className="ipInfo__View__Value whitespace-normal link">
                    <a href={website} target="_blank" rel="noreferrer">
                      {website || ''}
                    </a>
                  </pre>
                </div>
                <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
                  <p className="ipInfo__View__Label">Phone</p>
                  <pre className="ipInfo__View__Value whitespace-normal">
                    {phone ? <ClickableMobile number={phone} /> : ''}
                  </pre>
                </div>
              </div>
            </div>
            <div className="p-[30px] 3xl:px-[15px] 3xl:py-[22px]">
              <h3 className="setting__FieldTitle">Address</h3>
              <div className="flex flex-wrap mx-[-10px]">
                <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
                  <p className="ipInfo__View__Label">Address Line 1</p>
                  <pre className="ipInfo__View__Value whitespace-normal">
                    {address1 || ''}
                  </pre>
                </div>
                <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
                  <p className="ipInfo__View__Label">Address Line 2</p>
                  <pre className="ipInfo__View__Value whitespace-normal">
                    {address2 || ''}
                  </pre>
                </div>
                <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
                  <p className="ipInfo__View__Label">City</p>
                  <pre className="ipInfo__View__Value whitespace-normal">
                    {city || ''}
                  </pre>
                </div>
                <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
                  <p className="ipInfo__View__Label">State</p>
                  <pre className="ipInfo__View__Value whitespace-normal">
                    {state?.name || ''}
                  </pre>
                </div>
                <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
                  <p className="ipInfo__View__Label">Zip</p>
                  <pre className="ipInfo__View__Value whitespace-normal">
                    {zip || ''}
                  </pre>
                </div>
                <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
                  <p className="ipInfo__View__Label">Country</p>
                  <pre className="ipInfo__View__Value whitespace-normal">
                    {country?.name || ''}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CompanyDetailsView;
