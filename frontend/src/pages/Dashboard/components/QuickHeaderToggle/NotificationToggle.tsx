import { useToggleDropdown } from 'hooks/useToggleDropdown';
import Notification from '../Notification';
import NotificationCount from '../Notification/NotificationCount';

const NotificationToggle = () => {
  const { dropdownRef, isDropdownOpen, toggleDropdown } = useToggleDropdown();

  // ** ref **
  // const [sakeIcon, setSakeIcon] = useState<boolean>(false);

  return (
    <div
      className="notification__wrapper inline-flex mr-[10px] relative z-[7] cursor-pointer"
      ref={dropdownRef}
    >
      {/* notification sake class is notification__btn__animate */}
      <NotificationCount toggleDropdown={toggleDropdown} />
      {isDropdownOpen && <Notification />}
    </div>
  );
};

export default NotificationToggle;
