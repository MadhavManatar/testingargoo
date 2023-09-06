// ** external packages **
import axios from 'axios';

// ** get **
export const getClientIpAPI = async () => {
  const data = await axios.get(`https://api.ipify.org?format=json`);
  if (data) {
    return localStorage.setItem('clientIp', data?.data?.ip);
  }
};
