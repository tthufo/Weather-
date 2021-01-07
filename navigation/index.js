import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from "react-navigation";

import RootScreen from '../src/Root';
import LoginScreen from '../src/Login';
import RegisterScreen from '../src/Register';
import ForgotScreen from '../src/Forgot';
import ConfirmScreen from '../src/Confirm';
import ResetScreen from '../src/Reset';

import TabbarScreen from '../src/Tabbar';
import TabbarScreen1 from '../src/Tabbar1';

import TrickyScreen from '../src/Hometab/Tricky';
import CropScreen from '../src/Hometab/Crops';
import WeatherScreen from '../src/Hometab/Weather';
import ListNewsScreen from '../src/Hometab/ListNews';
import NewsScreen from '../src/Hometab/News';
import FilterScreen from '../src/Socialtab/Filter';
import QuestionScreen from '../src/Question';
import AnswerScreen from '../src/Answer';
import UpdateScreen from '../src/Usertab/Update';
import ForecastScreen from '../src/Forecast';


import MainScreen from '../src/Main';
import LocationListScreen from '../src/LocationList';
import LocationScreen from '../src/Location';
import Main24DetailScreen from '../src/Main_24H_Detail';

const AppNavigator = createStackNavigator({
  Root: { screen: RootScreen },
  Login: { screen: LoginScreen },
  Register: { screen: RegisterScreen },
  Forgot: { screen: ForgotScreen },
  Confirm: { screen: ConfirmScreen },
  Reset: { screen: ResetScreen },
  Tabbar: {
    screen: TabbarScreen, navigationOptions: {
      gesturesEnabled: false,
    }
  },
  Tabbar1: {
    screen: TabbarScreen1, navigationOptions: {
      gesturesEnabled: false,
    }
  },
  Tricky: { screen: TrickyScreen },
  Crop: { screen: CropScreen },
  Weather: { screen: WeatherScreen },
  ListNews: { screen: ListNewsScreen },
  News: { screen: NewsScreen },
  Filter: { screen: FilterScreen },
  Question: { screen: QuestionScreen },
  Answer: { screen: AnswerScreen },
  Update: { screen: UpdateScreen },
  Forecast: { screen: ForecastScreen },
  MainScreen: {
    screen: MainScreen, navigationOptions: {
      gesturesEnabled: false,
    }
  },
  LocationListScreen: { screen: LocationListScreen },
  LocationScreen: { screen: LocationScreen },
  Main24DetailScreen: { screen: Main24DetailScreen },
}, {
  headerMode: 'none',
});

export default createAppContainer(AppNavigator);
