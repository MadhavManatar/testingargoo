type RedirectToGoogleMapPropsType = {
  address: {
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string | number;
    country?: string;
  };
};
const RedirectToGoogleMap = (props: RedirectToGoogleMapPropsType) => {
  const {
    address: { address1, address2, city, state, country, zip },
  } = props;

  const addressLink = `https://www.google.com/maps/search/${address1 || ''}+${
    address2 || ''
  }+${city || ''}+${state || ''}+${country || ''}+${zip || ''}`;

  return (
    <>
      {address1 || address2 || city || state || country || zip ? (
        <p className="inline-flex text-[14px] text-black__TextColor600 font-biotif__Regular duration-500 hover:text-primaryColor max-w-full hover:underline">
          <a
            href={addressLink}
            className=" inline-flex flex-wrap items-center text-[14px] text-black__TextColor600 font-biotif__Regular max-w-full hover:underline hover:text-primaryColor"
            target="_blank"
            rel="noreferrer"
          >
            {address1 || ''}
            {address1 && (address2 || city || state || country || zip)
              ? ', '
              : ''}
            {address2 || ''}
            {address2 && (city || state || country || zip) ? ', ' : ''}
            {city || ''}
            {city && (state || country || zip) ? ', ' : ''}
            {state || ''}
            {state && (country || zip) ? ', ' : ''}
            {country || ''}
            {country && zip ? ', ' : ''}
            {zip || ''}
          </a>
        </p>
      ) : (
        <></>
      )}
    </>
  );
};

export default RedirectToGoogleMap;
