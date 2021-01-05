import axiosCallApi from '../axiosCallApi';

const getWeather = (params) => axiosCallApi('/appcontent/weather/data-weather', 'post', params);
const addCrop = (params) => axiosCallApi('/appcontent/cropsUser/add-crops-user', 'post', params);
const searchCrop = (params) => axiosCallApi('/appcontent/cropsPost/search-crops-post', 'post', params);
const getWeather24 = (params) => axiosCallApi('/app_weather/get_weather', 'post', params);
const getWeatherList = (params) => axiosCallApi('/app_weather/location/list', 'post', params);

export default {
  getWeather,
  addCrop,
  searchCrop,
  getWeather24,
  getWeatherList,
};
