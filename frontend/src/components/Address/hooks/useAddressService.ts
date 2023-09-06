// ** others **
import {
  AsyncSelectGetOptions,
  Option,
} from 'components/FormField/types/formField.types';
import {
  AddressFormFields,
  CountryType,
  StateType,
} from '../types/address.types';
import { UseFormSetValue } from 'react-hook-form';
import { isInt } from 'utils/util';
import { useLazyGetTimezoneListQuery } from 'redux/api/timezoneApi';
import {
  useLazyGetCountryQuery,
  useLazyGetStatesQuery,
} from 'redux/api/addressApi';

interface HandleDataSelectedProps {
  getTimeZoneByLatLng: ({
    latitude,
    longitude,
  }: {
    latitude: number;
    longitude: number;
  }) => Promise<void>;
  setValue: UseFormSetValue<AddressFormFields>;
  setAddressOptions:
    | React.Dispatch<
        React.SetStateAction<{
          state: Option;
          country: Option;
        }>
      >
    | undefined;
}

const goFirstAndUpdated = (
  d: {
    iso3: string;
    id: number;
    latitude: string;
    longitude: string;
    name: string;
  }[],
  daFirst: number
) => {
  const r: Option[] = [];

  d.forEach((e) => {
    if (e.id === daFirst) {
      r.unshift({
        label: `${e?.name || ''},${e?.iso3 || ''}`,
        value: e.id,
        extraLabel: `${e?.latitude || ''},${e?.longitude || ''}`,
      });
    } else {
      r.push({
        label: `${e?.name || ''},${e?.iso3 || ''}`,
        value: e.id,
        extraLabel: `${e?.latitude || ''},${e?.longitude || ''}`,
      });
    }
  });

  return r;
};

export const useGetTimeZoneList = () => {
  // ** APIS **
  const [getTimeZoneListAPI, { isLoading }] = useLazyGetTimezoneListQuery();

  const getTimezoneList: AsyncSelectGetOptions = async () => {
    const data = await getTimeZoneListAPI({}, true);
    if ('data' in data) {
      const Options = (data?.data.zones || []).map(
        (item: { zoneName: string }) => {
          return {
            label: item.zoneName,
            value: item.zoneName,
          };
        }
      );

      return {
        option: Options,
        count: 0,
      };
    }
  };
  return {
    getTimezoneList,
    isTimeZoneListLoading: isLoading,
  };
};

export const useGetCountriesOption = () => {
  // ** APIS **
  const [getCountriesAPI, { isLoading }] = useLazyGetCountryQuery();

  const getCountries: AsyncSelectGetOptions = async (option) => {
    const data = await getCountriesAPI(
      {
        params: {
          limit: 1000,
          page: option?.page,
          searchFields: 'name,iso3',
          searchText: (option?.search && `${option?.search}`) || '',
        },
      },
      true
    );
    if ('data' in data) {
      const options = goFirstAndUpdated(data?.data.rows || [], 233);

      return { option: options, count: data?.data.count };
    }
  };

  return {
    getCountries,
    isLoading,
  };
};

export const useGetStatesOption = ({
  watchCountry,
}: {
  watchCountry?: number | null;
}) => {
  // ** APIS **
  const [getStatesAPI, { isLoading }] = useLazyGetStatesQuery();

  const getStates: AsyncSelectGetOptions = async (option) => {
    if (watchCountry) {
      const data = await getStatesAPI(
        {
          params: {
            'q[country_id][in]': watchCountry,
            '[include][country][select]': 'iso2',
            sort: 'name',
            limit: 1000,
            page: option?.page,
            searchFields: 'name,state_code',
            searchText: (option?.search && `${option?.search}`) || '',
          },
        },
        true
      );

      if ('data' in data) {
        const options = (data?.data.rows || [])
          .filter(
            (val: { state_code: string }) =>
              !(val?.state_code || '').startsWith('UM')
          )
          .map(
            (item: {
              state_code: string;
              id: number;
              latitude: string;
              longitude: string;
              name: string;
              country: {
                iso2: string;
              };
            }) => {
              const state_code = isInt(Number(item.state_code))
                ? `${item?.country?.iso2 || ''}-${item?.state_code}`
                : item.state_code || '';

              return {
                label: `${state_code},${item?.name || ''}`,
                value: item.id,
                extraLabel: `${item?.latitude || ''},${item?.longitude || ''}`,
              };
            }
          );
        return { option: options, count: data?.data.count };
      }
    }
    return { option: [], count: 0 };
  };

  return {
    getStates,
    isLoading,
  };
};

export const useHandleDataSelected = (props: HandleDataSelectedProps) => {
  const { setAddressOptions, setValue, getTimeZoneByLatLng } = props;

  // ** APIS **
  const [getCountriesAPI] = useLazyGetCountryQuery();
  const [getStatesAPI] = useLazyGetStatesQuery();

  const handlePageSelected = async (placeData: {
    place: any;
    fieldName: string;
  }) => {
    const { fieldName, place } = placeData;

    const setAutoStateName = async ({
      country_id,
      state_name,
    }: {
      country_id?: number;
      state_name?: string;
    }) => {
      if (country_id && state_name) {
        const data = await getStatesAPI(
          {
            params: {
              'q[name][in]': state_name || null,
              'q[country_id]': country_id,
            },
          },
          true
        );

        if ('data' in data) {
          const state = (data?.data.rows || [])?.find(
            (item: { name: string; id: number }) => item
          );

          return state;
        }
      }
      return null;
    };

    const setAutoCountryName = async ({
      country_name,
    }: {
      country_name?: string;
    }) => {
      const data = await getCountriesAPI(
        {
          params: {
            'q[iso2]': country_name || '',
          },
        },
        true
      );

      if ('data' in data) {
        const country = (data?.data.rows || [])?.find(
          (item: { name: string; id: number }) => item
        );

        return country;
      }
    };

    // const typesArray = [
    //   'administrative_area_level_1',
    //   'locality',
    //   'administrative_area_level_2',
    //   'country',
    //   'administrative_area_level_3',
    //   'postal_code',
    //   'plus_code',
    //   'street_number',
    //   'neighborhood',
    //   'subpremise',
    // ];

    const lat = await place?.geometry?.location?.lat();
    const lng = await place?.geometry?.location?.lng();

    const address_val1 = placeData.place.name;
    let pin = '';

    if (lat && lng && place?.address_components?.length) {
      const city = place?.address_components?.find(
        (item: { types: string[] }) => {
          return item.types.some((val: string) => val === 'locality');
        }
      );

      const county = place?.address_components?.find(
        (item: { types: string[] }) => {
          return item.types.some((val: string) =>
            [
              'administrative_area_level_3',
              'administrative_area_level_2',
            ].includes(val)
          );
        }
      );

      const state = place?.address_components?.find(
        (item: { types: string[] }) =>
          item.types.includes('administrative_area_level_1')
      );

      const country = place?.address_components?.find(
        (item: { types: string[] }) => item.types.includes('country')
      );

      // const address = place?.address_components[0];
      // const address2 = place?.address_components[1];
      // const address3 = place?.address_components[2];
      // const address4 = place?.address_components[3];

      // if (address && address?.types?.includes('street_number')) {
      //   address_val1 += `${address.long_name} `;
      // }

      // if (address2 && address2?.types?.includes('street_number')) {
      //   address_val1 += `${address2.long_name} `;
      // }

      // if (
      //   address && !address?.types?.find((item: string) => typesArray.includes(item))
      // ) {
      //   address_val1 += `${address.long_name}`;
      // }

      // if (
      //   address2 && !address2?.types?.find((item: string) => typesArray.includes(item))
      // ) {
      //   address_val1 += `${
      //     address_val1.length && !address?.types?.includes('street_number') ? ',' : ''
      //   } ${address2.long_name}`;
      // }

      // if (
      //   address3 && !address3?.types?.find((item: string) => typesArray.includes(item))
      // ) {
      //   address_val1 += `${address_val1.length ? ',' : ''} ${
      //     address3.long_name
      //   }`;
      // }

      // if (
      //   address4 && !address4?.types?.find((item: string) => typesArray.includes(item))
      // ) {
      //   address_val1 += `${address_val1.length ? ',' : ''} ${
      //     address4?.long_name
      //   }`;
      // }

      pin = place.address_components.find((val: { types: string[] }) =>
        val.types.includes('postal_code')
      )?.long_name;

      const countryData: CountryType = await setAutoCountryName({
        country_name: country?.short_name,
      });

      const stateData: StateType = await setAutoStateName({
        country_id: countryData?.id,
        state_name: state?.long_name,
      });

      setValue('city', city?.short_name || '');
      setValue('county', county?.short_name || '');
      setValue('state_id', stateData?.id || 0);
      setValue('country_id', countryData?.id || null);
      if (pin) {
        setValue('zip', pin);
      } else {
        setValue('zip', '');
      }

      const state_code = isInt(Number(stateData?.state_code))
        ? `${countryData?.iso2 || ''}-${stateData?.state_code}`
        : stateData?.state_code || '';

      setAddressOptions?.({
        country: {
          label: countryData?.iso3 || '',
          value: countryData?.id,
        },
        state: {
          label: state_code,
          value: stateData?.id,
        },
      });

      getTimeZoneByLatLng({
        latitude: lat,
        longitude: lng,
      });
    }

    return fieldName === 'zip' ? pin : address_val1;
  };

  return {
    handlePageSelected,
  };
};
