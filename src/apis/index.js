import axios from 'axios';
import auth from './auth';
import home from './home';
import user from './user';

const API = {
  auth,
  home,
  user,
};

axios.defaults.baseURL = "http://api-appweather.weatherplus.vn";

export default API;
