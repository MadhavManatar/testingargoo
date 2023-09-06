import { useEffect, useState } from 'react';
import { useGetIconJsonAPI } from './indexdb.service';
import { IconJsonType, IconSingle, IconTypeJson, Stores } from './indexdb.type';
import {
  setAnimationIconjson,
  setIconAnimationSetting,
} from 'redux/slices/commonSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useLazyGetGeneralSettingQuery } from 'redux/api/generalSettingApi';
import { GENERAL_SETTING_VALID_KEYS } from 'constant';
import { POLYMORPHIC_MODELS } from 'constant/permissions.constant';
import { getCurrentUser } from 'redux/slices/authSlice';
import { GeneralSetting } from 'pages/Setting/general-setting/common-controls/service/types/generalSettings.types';

let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 1;
const DBName = 'iconJsonDB';

// IndexDB init
export const initDB = (): Promise<boolean> => {
  return new Promise((resolve) => {
    request = indexedDB.open(DBName); // open the connection
    request.onupgradeneeded = () => {
      db = request.result;
      if (!db.objectStoreNames.contains(Stores.IconData)) {
        const objectStore = db.createObjectStore(Stores.IconData, {
          keyPath: 'iconType',
        });
        objectStore.createIndex('iconType', 'iconType', { unique: true });
        objectStore.createIndex('iconJson', 'iconJson', { unique: false });
      }
    };
    request.onsuccess = () => {
      db = request.result;
      version = db.version;
      resolve(true);
    };
    request.onerror = () => {
      resolve(false);
    };
  });
};

// Get Multiple Icon Hook
export const animationIconJsonListMultiple = (iconType: IconTypeJson[]) => {
  const [iconJson, setIconJson] = useState<IconJsonType>({});
  const getIconData = async () => {
    const dataOfIcon: IconJsonType = await getAnimatedIconFromIndexDBMultiple(
      iconType
    );
    setIconJson(dataOfIcon);
  };
  useEffect(() => {
    getIconData();
  }, []);
  return { iconJson };
};

// Get Multiple Key Data From IndexDB
export const getAnimatedIconFromIndexDBMultiple = (
  iconType: IconTypeJson[]
): Promise<IconJsonType> => {
  return new Promise((resolve) => {
    const requestForGet = indexedDB.open(DBName);
    requestForGet.onsuccess = () => {
      db = requestForGet.result;
      const transaction = db.transaction([Stores.IconData], 'readwrite');
      const objectStore = transaction.objectStore(Stores.IconData);
      const requests = iconType.map((key) => objectStore.get(key));
      const IconJsonData: IconJsonType = {};
      let completedRequests = 0;
      requests.forEach((requestChild) => {
        requestChild.onsuccess = () => {
          if (requestChild.result) {
            const key = iconType[completedRequests]; // Key Of Define Type Of Object
            IconJsonData[key] = requestChild?.result?.iconJson;
          }
          completedRequests++;
          if (completedRequests === iconType.length) {
            resolve(IconJsonData);
          }
        };
      });
    };
  });
};

// Get Multiple Icon Hook
export const animationIconJson = (iconType: IconTypeJson) => {
  const [iconJson, setIconJson] = useState<string>();
  const [iconJsonLoading, setIconJsonLoading] = useState<boolean>(true);
  const getIconData = async () => {
    const dataOfIcon = await getAnimatedIconFromIndexDB(iconType);
    setIconJson(dataOfIcon);
    setIconJsonLoading(false);
  };
  useEffect(() => {
    getIconData();
  }, []);
  return { iconJson, iconJsonLoading };
};

// Get Single Key Data From IndexDB
export const getAnimatedIconFromIndexDB = (
  iconType: IconTypeJson
): Promise<string> => {
  return new Promise((resolve) => {
    const requestForGet = indexedDB.open(DBName);
    requestForGet.onsuccess = () => {
      db = requestForGet.result;
      const transaction = db.transaction([Stores.IconData], 'readwrite');
      const objectStore = transaction.objectStore(Stores.IconData);
      const requests = objectStore.get(iconType);
      requests.onsuccess = () => {
        const jsonData = requests?.result?.iconJson;
        resolve(jsonData);
      };
    };
  });
};

/* API for add/update data in indexdb */
export const useAutoLoadIndexDbForIcon = () => {
  const { getIconJsonAPI } = useGetIconJsonAPI();
  const getIconJson = async () => {
    await initDB();
    const { data, error } = await getIconJsonAPI();
    if (data.length > 0 && !error) {
      return new Promise((resolve) => {
        const requestAdd = indexedDB.open(DBName, version);
        requestAdd.onsuccess = () => {
          const store = request.result
            .transaction(Stores.IconData, 'readwrite')
            .objectStore(Stores.IconData);
          // Loop For All DB ICONS
          Object.keys(data).forEach((index) => {
            const oldDataRequest = store.get(data[index].iconType);
            oldDataRequest.onsuccess = () => {
              const oldData = oldDataRequest.result;
              if (oldData) {
                oldData.iconJson = data[index].iconJson
                  ? data[index].iconJson
                  : null;
                store.put(oldData);
              } else {
                const insertData = {
                  iconType: data[index].iconType,
                  iconJson: data[index].iconJson,
                };
                store.add(insertData);
              }
            };
          });
        };
        // Error Resolve
        requestAdd.onerror = () => {
          const errorAdd = request.error?.message;
          if (errorAdd) {
            resolve(errorAdd);
          } else {
            resolve('Unknown error');
          }
        };
      });
    }
  };
  return {
    getIconJson,
  };
};

/* API for add/update data in indexdb */
export const useAutoLoadReduxForIcon = () => {
  const { getIconJsonAPI } = useGetIconJsonAPI();
  const dispatch = useDispatch();
  const getIconJson = async () => {
    const { data, error } = await getIconJsonAPI();
    if (data && !error) {
      const iconReduxData: IconJsonType = {};
      data.forEach((singleIcon: IconSingle) => {
        iconReduxData[singleIcon.iconType] = singleIcon.iconJson;
      });
      dispatch(
        setAnimationIconjson({
          data: iconReduxData,
        })
      );
    }
  };
  return {
    getIconJson,
  };
};

// Set Animation Icon Setting in Redux
export const useSetAnimationIconSettingRedux = () => {
  const [getGeneralSetting] = useLazyGetGeneralSettingQuery();
  const dispatch = useDispatch();
  const currentUser = useSelector(getCurrentUser);
  const getAnimationIconSetting = async () => {
    const { data, error } = await getGeneralSetting(
      {
        params: {
          'q[key]': GENERAL_SETTING_VALID_KEYS.is_icon_animation_required,
          'q[model_name]': POLYMORPHIC_MODELS.ORGANIZATION,
          'q[model_record_id]': currentUser?.organization?.organization_id,
          module: 'organizations',
        },
      },
      true
    );
    if (data && !error) {
      const is_icon_required = data.find(
        (d: GeneralSetting) =>
          d.key === GENERAL_SETTING_VALID_KEYS.is_icon_animation_required
      );
      if (is_icon_required) {
        const iconAnimationSetting = is_icon_required?.value === 'true';
        dispatch(setIconAnimationSetting({ iconAnimationSetting }));
      }
    }
  };
  return {
    getAnimationIconSetting,
  };
};
