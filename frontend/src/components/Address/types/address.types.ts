export type StateType = {
  id: number;
  name: string;
  state_code: string;
};

export type CountryType = {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
};

export type AddressFormFields = {
  city?: string;
  state?: StateType;
  country?: CountryType;
  country_id?: number | null;
  state_id?: number | null;
  address1?: string;
  address2?: string;
  zip?: string;
  address_details?: {
    title?: string;
    position?: { lat?: number; lng?: number };
  };
  county?: string;
};
