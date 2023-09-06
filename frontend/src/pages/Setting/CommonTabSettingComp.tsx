import { SettingSidebarInterface } from 'constant/setting.sidebar.constant';
import { useNavigate } from 'react-router-dom';
import { isOrganizationOwner } from 'utils/is';

interface PropsInterface {
  redirectLinks: SettingSidebarInterface[];
  heading: string;
}

const CommonTabSettingComp = (props: PropsInterface) => {
  const { redirectLinks, heading } = props;

  const sidebarItems = redirectLinks.filter(
    (item) =>
      (isOrganizationOwner() &&
        ['tag-control', 'rules', 'alerts'].includes(item.id)) ||
      !['tag-control', 'rules', 'alerts'].includes(item.id)
  );

  const navigate = useNavigate();
  return (
    <div>
      <h2 className="settingPage__title__mobile text-[18px] font-biotif__Medium text-black w-full mb-[15px] whitespace-pre overflow-hidden text-ellipsis">
        {heading}
      </h2>
      <div className="settingM__tabs__new w-full ip__hideScrollbar overflow-y-auto max-h-[calc(100dvh_-_155px)]">
        {sidebarItems.map((item, index) => {
          return (
            <button
              key={index}
              className='items bg-white relative border border-[#CCCCCC]/50 rounded-[10px] text-[18px] text-primaryColor font-biotif__Medium leading-[24px] py-[15px] px-[16px] pr-[38px] w-full mb-[10px] text-left duration-500 before:content-[""] before:absolute before:top-[50%] before:right-[16px] before:translate-y-[-50%] before:-rotate-45 before:w-[10px] before:h-[10px] before:border-b-[2px] before:border-b-primaryColor before:border-r-[2px] before:border-r-primaryColor hover:border-primaryColor hover:bg-primaryColor hover:text-white hover:before:border-b-white hover:before:border-r-white'
              onClick={() => navigate(item.link)}
            >
              <span className="text inline-block"> {item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CommonTabSettingComp;
