// ** Import Packages **
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

// ** components **
import ClickableEmail from 'components/ClickableComponents/ClickableEmail';
import ClickableMobile from 'components/ClickableComponents/ClickableMobile';
import DateFormat from 'components/DateFormat';
import FormField from 'components/FormField';
import Icon from 'components/Icon';
import Image from 'components/Image';
import DisplayRichTextContent from 'components/RichTextEditor/DisplayRichTextContent';

// ** APIS **
import {
  useAddUpdateGeneralSettingMutation,
  useLazyGetGeneralSettingQuery,
} from 'redux/api/generalSettingApi';

// ** types **
import { PersonalSettingView } from 'pages/Setting/general-setting/PersonalSettings/types/personal-settings.types';

// ** Constant **
import { GENERAL_SETTING_VALID_KEYS } from 'constant';
import { POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { ToastMsg } from 'constant/toast.constants';

// ** Util **
import { isOrganizationOwner } from 'utils/is';
import { convertStringToBoolean } from 'utils/util';

interface Props {
  handleEdit: () => void;
  userData: PersonalSettingView;
  currentUserId: number | undefined;
}

export const PersonalSettingViewDetails = ({
  handleEdit,
  userData,
  currentUserId,
}: Props) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    mobile,
    profileName,
    zip,
    city,
    state,
    country,
    address1,
    address2,
    birth_date,
    facebook,
    twitter,
    linkedin,
    website,
    profile_image,
    reportToName,
    fax,
    added_by_user,
    date_format,
    user_signature,
    timezone,
    initial_color
  } = userData;

  const formMethods = useForm<{ isAutoLoadActive: boolean }>();
  const { setValue, register } = formMethods;

  // ** APIS **
  const [getGeneralSetting] = useLazyGetGeneralSettingQuery();
  const [changeGeneralSetting] = useAddUpdateGeneralSettingMutation();

  useEffect(() => {
    checkAutoLoadSignatureIsActive();
  }, []);

  const checkAutoLoadSignatureIsActive = async () => {
    const { data, error } = await getGeneralSetting(
      {
        params: {
          'q[key]': GENERAL_SETTING_VALID_KEYS.is_signature_auto_load,
          'q[model_name]': POLYMORPHIC_MODELS.USER,
          'q[model_record_id]': currentUserId,
          module: 'user_settings',
        },
      },
      true
    );

    if (data && !error) {
      setValue('isAutoLoadActive', convertStringToBoolean(data?.[0]?.value));
    }
  };

  const changeAutoLoadSignatureSetting = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    await changeGeneralSetting({
      data: {
        dataList: [
          {
            model_name: POLYMORPHIC_MODELS.USER,
            key: GENERAL_SETTING_VALID_KEYS.is_signature_auto_load,
            value: `${event.target.checked}`,
            model_record_id: currentUserId,
          },
        ],
        module: 'user_settings',
        toastMsg:
          ToastMsg.settings.generalSettings.personalSetting.autoLoadSignature,
      },
    });
  };
  return (
    <div className="personal__setting__edit__page border border-whiteScreen__BorderColor rounded-[20px]">
      <div className="flex flex-wrap items-center p-[30px] border-b border-b-whiteScreen__BorderColor 3xl:px-[15px] 3xl:py-[20px] 3xl:pb-[13px] sm:block">
        <div className="inline-block profile__img relative">
          <Image
            first_name={first_name || ''}
            last_name={last_name || ''}
            imgPath={profile_image || ''}
            serverPath
            color={initial_color || ''}
          />
          <span className="onlineState inline-block absolute bottom-[10px] right-[-2px] w-[14px] h-[14px] rounded-full bg-ip__SuccessGreen border-[2px] border-ipWhite__borderColor" />
        </div>
        <div className="w-[calc(100%_-_72px)] pl-[12px] sm:w-full sm:pl-0 sm:mt-[15px]">
          <h6 className="text-[16px] text-black__TextColor800 font-biotif__Medium mb-[4px] flex flex-wrap items-center">
            <span className="name inline-block mr-[8px] mb-[5px]">
              {[first_name, last_name].join(' ')}
            </span>
            <span className="rounded-[50px] text-[10px] uppercase text-white font-semibold bg-ip__Orange py-[3px] px-[8px] mb-[5px] inline-block">
              {isOrganizationOwner() ? 'Super admin' : profileName}
            </span>
          </h6>
          {email ? (
            <ClickableEmail
              isIconVisible
              rootClassName="mr-[20px] mb-[10px] max-w-full inline-flex flex-wrap items-center"
              iconClassName="highlighted !w-[30px] !h-[30px] !rounded-[7px] !p-[6px] mr-[7px]"
              textClassName="inline-block text-[14px] font-biotif__Regular text-primaryColor max-w-[calc(100%_-_37px)] pt-[1px]"
              mail={email}
            />
          ) : null}
          {mobile ? (
            <ClickableMobile
              number={mobile}
              isIconVisible
              rootClassName="mr-[20px] mb-[10px] max-w-full inline-flex flex-wrap items-center"
              iconClassName="highlighted !w-[30px] !h-[30px] !rounded-[7px] !p-[6px] mr-[7px]"
              textClassName="inline-block text-[14px] font-biotif__Regular text-primaryColor max-w-[calc(100%_-_37px)] pt-[1px]"
            />
          ) : null}
        </div>
      </div>

      <div className="p-[30px] border-b border-b-whiteScreen__BorderColor 3xl:px-[15px] 3xl:py-[22px]">
        <h3 className="setting__FieldTitle">
          <span className="inline-block max-w-[calc(100%_-_32px)] pr-[15px]">
            User Information
          </span>
          <button>
            <Icon
              onClick={() => handleEdit()}
              iconType="editFilled"
              className="highlighted !w-[30px] !h-[30px] !p-[6px] !rounded-[7px]"
            />
          </button>
        </h3>
        <div className="flex flex-wrap mx-[-10px]">
          <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
            <p className="ipInfo__View__Label">First Name</p>
            <pre className="ipInfo__View__Value whitespace-normal">
              {first_name || ''}
            </pre>
          </div>
          <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
            <p className="ipInfo__View__Label">Last Name</p>
            <pre className="ipInfo__View__Value whitespace-normal">
              {last_name || ''}
            </pre>
          </div>
          <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
            <p className="ipInfo__View__Label">Profile</p>
            <pre className="ipInfo__View__Value whitespace-normal">
              {isOrganizationOwner() ? 'Super admin' : profileName}
            </pre>
          </div>
          {!isOrganizationOwner() ? (
            <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
              <p className="ipInfo__View__Label">Added By</p>
              <pre className="ipInfo__View__Value whitespace-normal">
                {added_by_user?.full_name || ''}
              </pre>
            </div>
          ) : (
            <></>
          )}

          <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
            <p className="ipInfo__View__Label">Phone</p>
            <pre className="ipInfo__View__Value whitespace-normal">
              {phone ? <ClickableMobile number={phone} /> : ''}
            </pre>
          </div>
          <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
            <p className="ipInfo__View__Label">Mobile</p>
            <pre className="ipInfo__View__Value whitespace-normal">
              {mobile ? <ClickableMobile number={mobile} /> : ''}
            </pre>
          </div>
          <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
            <p className="ipInfo__View__Label">Email</p>
            <p className="ipInfo__View__Value link">
              {email ? <ClickableEmail mail={email} /> : ''}
            </p>
          </div>
          <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
            <p className="ipInfo__View__Label">Fax</p>
            <pre className="ipInfo__View__Value whitespace-normal">
              {fax || ''}
            </pre>
          </div>
          <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
            <p className="ipInfo__View__Label">Report To</p>
            <pre className="ipInfo__View__Value whitespace-normal">
              {reportToName || ''}
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
            <p className="ipInfo__View__Label">Birth Date</p>
            <pre className="ipInfo__View__Value whitespace-normal link">
              {birth_date ? <DateFormat date={birth_date} /> : ''}
            </pre>
          </div>
          <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
            <p className="ipInfo__View__Label">Date Format</p>
            <pre className="ipInfo__View__Value whitespace-normal">
              {date_format?.toUpperCase() || ''}
            </pre>
          </div>
          <div className="ipInfo__ViewBox px-[10px] w-1/2 lg:w-full">
            <p className="ipInfo__View__Label">Time Zone</p>
            <pre className="ipInfo__View__Value whitespace-normal">
              {timezone || ''}
            </pre>
          </div>
        </div>
      </div>
      <div className="p-[30px] border-b border-b-whiteScreen__BorderColor 3xl:px-[15px] 3xl:py-[22px]">
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
      <div className="p-[30px] border-b border-b-whiteScreen__BorderColor 3xl:px-[15px] 3xl:py-[22px]">
        <h3 className="setting__FieldTitle">Social Media Profiles</h3>
        <div className="flex flex-wrap mx-[-10px]">
          <div className="ipInfo__ViewBox w-1/2 lg:w-full">
            <p className="ipInfo__View__Label">Facebook</p>
            <pre className="ipInfo__View__Value whitespace-normal">
              {facebook ? (
                <a href={facebook} target="_blank" rel="noreferrer">
                  {facebook}
                </a>
              ) : (
                ''
              )}
            </pre>
          </div>
          <div className="ipInfo__ViewBox w-1/2 lg:w-full">
            <p className="ipInfo__View__Label">Twitter</p>
            <pre className="ipInfo__View__Value whitespace-normal">
              {twitter ? (
                <a href={twitter} target="_blank" rel="noreferrer">
                  {twitter}
                </a>
              ) : (
                ''
              )}
            </pre>
          </div>
          <div className="ipInfo__ViewBox w-1/2 lg:w-full">
            <p className="ipInfo__View__Label">LinkedIn</p>
            <pre className="ipInfo__View__Value whitespace-normal">
              {linkedin ? (
                <a href={linkedin} target="_blank" rel="noreferrer">
                  {linkedin}
                </a>
              ) : (
                ''
              )}
            </pre>
          </div>
        </div>
      </div>
      <div className="p-[30px] 3xl:px-[15px] 3xl:py-[22px]">
        <div className="flex">
          <h3 className="setting__FieldTitle">User Signature</h3>
          <form className="pt-[3px]">
            <div
              className={`flex flex-wrap items-center  ml-[10px] ${
                !user_signature ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              <p className="ipInfo__View__Label mr-[12px]">auto load email :</p>
              <FormField
                wrapperClass="toggleSwitch mb-0"
                type="checkbox"
                name="isAutoLoadActive"
                register={register}
                onChange={(event) => {
                  changeAutoLoadSignatureSetting(
                    event as React.ChangeEvent<HTMLInputElement>
                  );
                }}
              />
            </div>
          </form>
        </div>
        <div className="flex flex-wrap mx-[-10px]">
          {user_signature ? (
            <>
              <div
                className="ipInfo__ViewBox w-full font-biotif__Medium text-[15px] text-light__TextColor"
                id="userSignature"
              >
                <DisplayRichTextContent information={user_signature} />
              </div>
            </>
          ) : (
            <span className="ml-[10px]">-</span>
          )}
        </div>
      </div>
    </div>
  );
};
