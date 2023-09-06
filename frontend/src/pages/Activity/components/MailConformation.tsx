// ** import packages ** //
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// ** others ** //
import { convertAtoB } from 'utils/util';
import { useConformActivityInvitationMutation } from 'redux/api/activityApi';

function MailConformation() {
  // ** hooks ** //
  const [searchParams] = useSearchParams();

  // ** states ** //
  const [loading, setLoading] = useState<boolean>(true);

  // ** APIS **
  const [conformActivityInvitationAPI] = useConformActivityInvitationMutation();

  useEffect(() => {
    const params = searchParams?.get('data');
    if (params) {
      conformInvitation(params);
    }
  }, []);

  const conformInvitation = async (val: string) => {
    const parseData = JSON.parse(convertAtoB(val));
    const data = await conformActivityInvitationAPI({
      data: {
        activity_id: parseData?.activityId,
        guest_mail: parseData?.toMail,
        participant_id: parseData?.participant_id,
      },
    });
    if (!('error' in data)) {
      setLoading(false);
    }
  };

  return <>{loading ? <p>....Loading</p> : <p>You are conformed</p>}</>;
}

export default MailConformation;
