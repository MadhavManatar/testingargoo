// ** external packages **
import { useState } from 'react';

import _ from 'lodash';

// ** services **
import { useGetLoggedInUserTokensAPI } from 'services/userToken.service';

// ** types **
import { TokenProvider, UserToken } from '../EmailSetting/types/userToken.type';

// ** types **

export const useSyncCalendarService = ({
  INITIAL_PROVIDER_ARRAY,
}: {
  INITIAL_PROVIDER_ARRAY: readonly TokenProvider[];
}) => {
  // ** state **
  const [usersTokens, setUsersTokens] = useState<UserToken[]>([]);

  // ** custom Hooks **
  const { getLoggedInUserTokensAPI, isLoading, isError } =
    useGetLoggedInUserTokensAPI();

  const getLoggedIUserTokens = async () => {
    const { data, error } = await getLoggedInUserTokensAPI({
      params: {
        select: 'id,other_details,token_provider,token_provider_mail,token_provider_user_id,user_id',
        'q[token_provider][in]': `${INITIAL_PROVIDER_ARRAY}`,
      },
    });
    if (data && !error && _.isArray(data?.rows)) {
      setUsersTokens([...data.rows]);
    }
  };

  return { getLoggedIUserTokens, usersTokens, isLoading, isError };
};
