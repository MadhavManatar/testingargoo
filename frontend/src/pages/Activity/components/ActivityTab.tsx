// import Icon from 'components/Icon';
import { useDispatch, useSelector } from 'react-redux';
import { setActivityTab, getActivityTab } from 'redux/slices/entityDetailSlice';
import { TAB, TAB_DETAIL_OBJ } from 'components/EntityDetails/constant';

type Props = {
  tabs: TAB[];
};

const ActivityTab = (props: Props) => {
  const dispatch = useDispatch();
  const activeTab = useSelector(getActivityTab);
  const { tabs } = props;

  return (
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
            onClick={() => dispatch(setActivityTab(tab))}
          >
            <button className="link">
              {/* <Icon iconType={TAB_DETAIL_OBJ[tab].icon} /> */}
              <span className="text">{TAB_DETAIL_OBJ[tab].label}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityTab;
