import { useDispatch, useSelector } from 'react-redux';
import { getTab, setTab } from 'redux/slices/entityDetailSlice';
import { TAB, TAB_DETAIL_OBJ } from './constant';
import IconAnimation from 'components/IconAnimation';
import { IconTypeJson } from 'indexDB/indexdb.type';

type Props = {
  tabs: TAB[];
};

const Tabs = (props: Props) => {
  const dispatch = useDispatch();
  const activeTab = useSelector(getTab);
  const { tabs } = props;

  return (
    <>
      <div className="horizontalTabs__wrapper mb-[20px]">
        <div
          className={`horizontalTabs__ul ${
            activeTab === TAB.TIMELINE ? 'timeline__tab__active' : ''
          }`}
        >
          {tabs.map((tab) => (
            <div
              key={window.self.crypto.randomUUID()}
              className={`item ${tab === activeTab ? 'active' : ''}`}
              onClick={() => dispatch(setTab(tab))}
            >
              <div className="link">
                <div className="hidden">
                  {tab === 'INFO' ? (
                    <IconAnimation
                      iconType="attachmentFilledIcon"
                      animationIconType={IconTypeJson.Info}
                      className="socian__ani__icon__wrapper"
                    />
                  ) : null}
                  {tab === 'TIMELINE' ? (
                    <IconAnimation
                      iconType="attachmentFilledIcon"
                      animationIconType={IconTypeJson.Timeline}
                      className="socian__ani__icon__wrapper"
                    />
                  ) : null}
                </div>

                <span className="text">{TAB_DETAIL_OBJ[tab].label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="horizontalTabs__wrapper mb-[20px] hidden">
        <div className="horizontalTabs__ul">
          <div className="">
            <IconAnimation
              iconType="attachmentFilledIcon"
              animationIconType={IconTypeJson.Info}
              className="socian__ani__icon__wrapper"
            />
            <span className="text">Info</span>
          </div>
          <div className="">
            <IconAnimation
              iconType="attachmentFilledIcon"
              animationIconType={IconTypeJson.Timeline}
              className="socian__ani__icon__wrapper"
            />
            <span className="text">Timeline</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tabs;
