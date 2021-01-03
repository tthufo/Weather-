import axios from 'axios';
import STG from "../../service/storage";

async function axiosCallApi(url, method = 'get', params, postParamsUrl) {
  const axiosSetup = {
    url,
    method,
    timeout: 10000,
  };
  if (STG.getData('token') !== null) {
    const userInfo = await STG.getData('token')
    const basic = 'YWdyaS1lY29zeXN0ZW0tYXBwOjEyMzQ1NmFB'
    axiosSetup.headers = { Authorization: userInfo && userInfo.access_token ? `bearer ${(userInfo && userInfo.access_token) || ''}` : `Basic ${basic}` };
  }
  if (method === 'get') {
    axiosSetup.params = params;
  } else {
    axiosSetup.data = params;
    axiosSetup.params = postParamsUrl;
  }
  try {
    const result = await axios(axiosSetup);
    return result;
  } catch (error) {
    if (error && error.response && error.response.status && error.response.status === 401) {
      if (error && error.response && error.response.data.detail && error.response.data.detail === 'Not signed in') {
        // localStorage.removeItem('userInfo_user');
      }
    }

    throw error;
  }
}
export default axiosCallApi;
