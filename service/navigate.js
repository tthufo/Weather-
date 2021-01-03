import { NavigationActions } from 'react-navigation';
import { TabActions } from '@react-navigation/native';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function popTop(routeName, params) {
  _navigator.dispatch(
    NavigationActions.PopToTop()
  );
}

function jumping(routeName) {
  const jumpToAction = TabActions.jumpTo(routeName);

  _navigator.dispatch(
    jumpToAction
  );
}

function getCurrentRoute() {
  let route = _navigator.state.nav
  while (route.routes) {
    route = route.routes[route.index]
  }
  return route
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  getCurrentRoute,
  popTop,
  jumping,
};