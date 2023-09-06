// ** Import Packages **
import { Link, useLocation } from 'react-router-dom';

// ** Components **
import Breadcrumbs from 'components/Breadcrumbs';

// ** Type **
import { SettingLayoutProps } from '../types/index.type';

// ** Constant **
import { PRIVATE_NAVIGATION } from 'constant/navigation.constant';

// ** Constants **
import { isOrganizationOwner } from 'utils/is';

const SettingLayout = (props: SettingLayoutProps) => {
  const { children, breadCrumbPath, sideBarLinks = [], title } = props;

  // ** hooks var **
  const location = useLocation();

  const isMenuActive = (link: string) => {
    return link === PRIVATE_NAVIGATION.dashboard.view
      ? location.pathname === link
      : location.pathname.startsWith(link);
  };

  const sidebarItems = sideBarLinks.filter(
    (item) =>
      (isOrganizationOwner() &&
        ['tag-control', 'rules', 'alerts'].includes(item.id)) ||
      !['tag-control', 'rules', 'alerts'].includes(item.id)
  );

  return (
    <>
      <Breadcrumbs path={breadCrumbPath} />
      <div className="border border-whiteScreen__BorderColor rounded-[12px] overflow-hidden xl:rounded-none xl:border-0 xl:mt-[-15px]">
        <h3 className="setting__FieldTitle mb-0 py-[20px] px-[30px] border-b border-b-whiteScreen__BorderColor 3xl:py-[12px] 3xl:px-[15px] 3xl:text-[18px] xl:py-0 xl:px-0 xl:text-[22px] xl:border-b-0 xl:hidden">
          {title}
        </h3>
        <div className="ip__V__TabsWrapper">
          <div className="ip__V__Tabs h-[calc(100dvh_-_244px)] overflow-y-auto ip__FancyScroll 3xl:h-[calc(100dvh_-_225px)] xl:h-auto sm:hidden">
            <ul className="ip__V__TabsList">
              {sidebarItems.map((obj, index) => (
                <Link
                  key={index}
                  to={obj.link}
                  className={`ip__V__TabsItems ${
                    isMenuActive(obj.link) ? 'active' : ''
                  } `}
                >
                  <button className="ip__V__TabsLink">{obj.label}</button>
                </Link>
              ))}
            </ul>
          </div>
          <div className="ip__V__ContentWrapper">
            <div className="ip__V__Content h-[calc(100dvh_-_244px)] overflow-x-hidden overflow-y-auto ip__FancyScroll 3xl:h-[calc(100dvh_-_225px)] xl:h-auto">
              <div className="inner__scroll__wrapper h-full overflow-x-hidden overflow-y-auto">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingLayout;
