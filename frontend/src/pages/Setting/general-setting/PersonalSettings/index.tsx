// ** external packages **
import { useState } from 'react';

// ** components **
import PersonalSettingsView from 'pages/Setting/general-setting/PersonalSettings/components/PersonalSettingsView';
import Breadcrumbs from 'components/Breadcrumbs';
import PersonalSettingsEdit from 'pages/Setting/general-setting/PersonalSettings/components/PersonalSettingsEdit';

// ** others **
import { BREAD_CRUMB } from 'constant';

const UserSettings = () => {
  // ** states **
  const [viewMode, setViewMode] = useState(true);

  return (
    <div>
      <Breadcrumbs path={BREAD_CRUMB.personalSetting} />
      {viewMode ? (
        <PersonalSettingsView setViewMode={setViewMode} />
      ) : (
        <PersonalSettingsEdit setViewMode={setViewMode} />
      )}
    </div>
  );
};

export default UserSettings;
