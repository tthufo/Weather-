import axiosCallApi from '../axiosCallApi';

const userInfo = (params) => axiosCallApi('/usermanagerment/fetch/user', 'post', params);
const resend = (params) => axiosCallApi('/usermanagerment/register/regain-OTP', 'post', params);
const confirm = (params) => axiosCallApi('/usermanagerment/register/confirm-account', 'post', params);
const signUp = async params => axiosCallApi('/usermanagerment/register/user', 'post', params);
const reset = async params => axiosCallApi('/usermanagerment/password/resetPass', 'post', params);
const forgot = async params => axiosCallApi('/usermanagerment/password/sendRequireForgetPassword', 'post', params);

export default {
  userInfo,
  signUp,
  confirm,
  resend,
  reset,
  forgot,
};
