// ** external packages **
import { useState } from 'react';
import _ from 'lodash';
import { useDispatch } from 'react-redux';

// ** services **
import { useGetLoggedInUserTokensAPI } from 'services/userToken.service';
import { useGetSmtpConnectedDetailsAPI } from 'pages/Email/services/email.service';

// ** types **
import { TokenProvider, UserToken } from '../EmailSetting/types/userToken.type';

// ** redux **
import { setMailProviderOption } from 'redux/slices/commonSlice';

export const useGetLoggedIUserTokens = ({
  setCurrentScreen,
  INITIAL_PROVIDER_ARRAY,
}: {
  setCurrentScreen?: React.Dispatch<React.SetStateAction<string>>;
  INITIAL_PROVIDER_ARRAY: readonly TokenProvider[];
}) => {
  const dispatch = useDispatch();

  // ** state **
  const [usersTokens, setUsersTokens] = useState<UserToken[]>([]);

  // ** custom Hooks **
  const { getLoggedInUserTokensAPI, isLoading, isError } =
    useGetLoggedInUserTokensAPI();

  const { getSmtpConnectedDetailsAPI, isLoading: smtpLoading } =
    useGetSmtpConnectedDetailsAPI();

  const getLoggedIUserTokens = async () => {
    const connectedMailInfo: UserToken[] = [];

    const [{ data, error }, { data: smtpData, error: smtpError }] =
      await Promise.all([
        getLoggedInUserTokensAPI({
          params: {
            select:
              'id,token_provider,token_provider_mail,is_active,updated_at',
            'q[token_provider][in]': `${INITIAL_PROVIDER_ARRAY}`,
          },
        }),
        getSmtpConnectedDetailsAPI({
          params: {
            'q[type]': 'smtp',
            select: 'id,type,username',
          },
        }),
      ]);

    data?.rows?.forEach((item: UserToken) => {
      connectedMailInfo.push({
        id: item.id,
        token_provider: item.token_provider,
        token_provider_mail: item.token_provider_mail,
        token_provider_user_id: item.token_provider_user_id,
        updated_at: item.updated_at,
        is_active: item.is_active,
      });
    });

    smtpData?.forEach(
      (item: { id: number; type: TokenProvider; username: string }) => {
        connectedMailInfo.push({
          id: item.id,
          token_provider: item.type,
          token_provider_mail: item.username,
        });
      }
    );

    if (
      connectedMailInfo &&
      !smtpError &&
      !error &&
      _.isArray(connectedMailInfo)
    ) {
      if (setCurrentScreen) {
        setCurrentScreen(connectedMailInfo.length ? 'list' : 'default');
      }

      setUsersTokens([...connectedMailInfo]);
      let mailProviderOptions = connectedMailInfo.map((val) => ({
        label: val.token_provider_mail,
        value: `${val.token_provider_mail},${val.token_provider}`,
      }));

      mailProviderOptions = [
        {
          value: `all,all`,
          label: 'All',
        },
        ...mailProviderOptions,
      ];
      dispatch(setMailProviderOption(mailProviderOptions));
      return connectedMailInfo;
    }
  };

  return {
    getLoggedIUserTokens,
    usersTokens,
    isLoading: isLoading || smtpLoading,
    isError,
  };
};
