import React, { Component } from 'react';
import { Alert } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import LoginScreen from '../Login';
import NetInfo from "@react-native-community/netinfo";
// import stringTabbar from '../Tabbar/string';
// import MainTab from './tab';
// import LoadingScreen from '../Loading';
import backService from '../../service/handle_back_service';
// import strings from './string';
// import { EventRegister } from 'react-native-event-listeners';
// import Constants from '../Config/Constant';
// import { setInternetConnection } from '../utility';

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // app_state: stringTabbar.stateProject,
      is_show_modal: false,
      isLoadInfo: false,
      notification: {
        hasNotification: false,
        pageNotificaiton: '',
        pageId: 0,
        hasRedirect: false,
        tab: null
      },
      // listTab: [stringTabbar.stateProject]
    };
    // this.onReceived = this.onReceived.bind(this);
    // this.onOpened = this.onOpened.bind(this);
    // this.didUpdateUser = this.didUpdateUser.bind(this);
    // this.onChangeTab = this.onChangeTab.bind(this);
    this.onAndroidBackPress = this.onAndroidBackPress.bind(this);
    this.chatData = null;
    this.timoutRedirect = null;
    // this.forceLogout = this.forceLogout.bind(this);
    this.back = 0;
  }

  componentDidMount() {
    // user_service.addListener(this.didUpdateUser);
    // tab_service.addListener(this.didUpdateUser);
    // this.didUpdateUser();
    // ReportService.template.init();
    // user_service.loadInfo();
    // this.subscriptionOneSignal()
    // OneSignal.inFocusDisplaying(0);
    // backService.addListener(this.onAndroidBackPress);
    // this.listener = EventRegister.addEventListener(Constants.resubscriptionOneSignal, (data) => {
    //   this.subscriptionOneSignal();
    // })
    // this.listener = EventRegister.addEventListener(Constants.chatScreen, (data) => {
    //   this.chatData = data;
    // });
    // // Subscribe
    // NetInfo.addEventListener(state => {
    //   setInternetConnection(state.isConnected);
    //   EventRegister.emit(Constants.EVENT_STATUS_NETWORK, state.isConnected);
    // });
  }

  subscriptionOneSignal() {
    // OneSignal.addEventListener('received', this.onReceived);
    // OneSignal.addEventListener('opened', this.onOpened);
  }

  componentWillUnmount() {
    // OneSignal.removeEventListener('received', this.onReceived);
    // OneSignal.removeEventListener('opened', this.onOpened);
    // user_service.removeListener(this.didUpdateUser);
    // tab_service.removeListener(this.didUpdateUser);
    // backService.removeListener(this.onAndroidBackPress);
    // EventRegister.removeEventListener(this.listener);
    // services.removeListener(this.forceLogout);
  }

  componentWillMount() {
    // services.addListener(this.forceLogout);
  }

  // forceLogout(action) {
  //   if (action === 'logOut' && this.back === 0) {
  //     this.back = 1;
  //     this.props.navigation.popToTop();
  //     this.props.navigation.goBack(null);
  //     setTimeout(() =>
  //       this.back = 0, 1000
  //     );
  //   }
  // }

  onAndroidBackPress = () => {
    // if (this.state.app_state === stringTabbar.stateLogin) {
    //   RNExitApp.exitApp();
    //   return true;
    // }
    // if (this.state.listTab.length === 1) {
    //   Alert.alert(
    //     '',
    //     strings.messageExitApp,
    //     [
    //       {
    //         text: strings.cancel
    //       },
    //       {
    //         text: strings.ok,
    //         onPress: () => RNExitApp.exitApp()
    //       }
    //     ],
    //     {
    //       cancelable: false
    //     }
    //   );
    // } else {
    //   let newList = Array.from(this.state.listTab);
    //   newList.pop();
    //   this.setState({
    //     app_state: newList[newList.length - 1],
    //     listTab: newList
    //   });
    // }
    return true;
  };

  // onReceived(notification) {
  //   notification_service.setActions('refresh');
  //   if (this.child) {
  //     this.child.refreshData();
  //   }
  //   const re = /\s*。\s*/;
  //   const notificationParam = notification.payload.body;
  //   const notificationReplace = notificationParam.replace(/。/gi, '。\n');
  //   const title = notification && notification.payload && notification.payload.title ? notification.payload.title : strings.alert;
  //   const additionalData = notification.payload.additionalData;
  //   if (additionalData && additionalData.type === 'chat'
  //     && this.chatData && this.chatData.isInPage
  //     && additionalData.id === this.chatData.conversation_id) return;
  //   Alert.alert(title, notificationReplace);
  // }

  // onOpened(openResult) {
  //   const data =
  //     openResult.notification &&
  //     openResult.notification.payload &&
  //     openResult.notification.payload.additionalData;

  //   const noti =
  //     openResult.notification === undefined
  //       ? openResult.node.data
  //       : openResult.notification.payload.additionalData;

  //   const redirect =
  //     openResult.notification === undefined ? noti.action : noti.page;

  //   const id = noti.id;

  //   const tab = noti.tab;
  //   if (user_service.getUser() != null) {
  //     this.timoutRedirect = setTimeout(() => {
  //       if (redirect === 'ConversationChat') {
  //         this.props.navigation.navigate(redirect, {
  //           id: id,
  //           onGoBack: () => this.onGoBack()
  //         });
  //       } else if (
  //         redirect === 'Notification' ||
  //         redirect === 'PaymentHistory' ||
  //         redirect === 'CompletedProjects' ||
  //         redirect === 'MyRating'
  //       ) {
  //         this.props.navigation.navigate(redirect, { tab: 1 });
  //       } else if (redirect === 'ProjectDetail') {
  //         this.props.navigation.navigate(redirect, { project: id });
  //       } else if (tab !== undefined && tab === 'announcement') {
  //         this.props.navigation.navigate('ProjectDetail', { project: id });
  //       }
  //       clearTimeout(this.timoutRedirect);
  //     }, 200);
  //   }

  //   if (data && data.page) {
  //     this.state.notification.hasNotification = true;
  //     this.state.notification.pageNotificaiton = data.page;
  //     this.state.notification.pageId = data.id;
  //     this.state.notification.hasRedirect = false;
  //     if (data.tab) {
  //       this.state.notification.tab = data.tab;
  //     }
  //   } else {
  //     this.props.navigation.navigate('login');
  //   }
  // }

  onGoBack() { }

  // didUpdateUser() {
  //   const user = user_service.getUser();
  //   if (user == null) {
  //     this.setState({ ...this.state, app_state: stringTabbar.stateLoading });
  //   } else if (user && user.access_token && user.access_token.length) {
  //     if (this.state.app_state !== stringTabbar.stateProject) {
  //       this.setState(
  //         {
  //           ...this.state,
  //           app_state: stringTabbar.stateMyPage
  //         },
  //         () => {
  //           this.setState(
  //             // { ...this.state, app_state: stringTabbar.stateListing },
  //             { ...this.state, app_state: stringTabbar.stateProject },
  //             () => {
  //               this.child.refreshData();
  //               if (
  //                 this.state.notification &&
  //                 this.state.notification.hasNotification &&
  //                 !this.state.notification.hasRedirect
  //               ) {
  //                 this.state.notification.hasRedirect = true;
  //                 if (this.timoutRedirect != null) clearTimeout(this.timoutRedirect);
  //                 if (this.state.notification.tab != null) {
  //                   this.props.navigation.navigate(
  //                     this.state.notification.pageNotificaiton,
  //                     { tab: this.state.notification.tab }
  //                   );
  //                 } else if (this.state.notification.pageNotificaiton === 'ProjectDetail') {
  //                   this.props.navigation.navigate(
  //                     this.state.notification.pageNotificaiton,
  //                     { project: { id: this.state.notification.pageId } }
  //                   );
  //                 } else {
  //                   this.props.navigation.navigate(
  //                     this.state.notification.pageNotificaiton,
  //                     { id: this.state.notification.pageId }
  //                   );
  //                 }
  //               }
  //             }
  //           );
  //         }
  //       );
  //     }
  //   } else if (user && !user.access_token && !this.state.isLoadInfo) {
  //     user_service.loadInfo();
  //     this.state.isLoadInfo = true;
  //   } else {
  //     this.setState({ ...this.state, app_state: stringTabbar.stateLogin });
  //   }
  // }

  // onChangeTab = tab => {
  //   if (tab == this.state.app_state) {
  //     return;
  //   }
  //   this.setState(
  //     {
  //       app_state: tab
  //     },
  //     () => {
  //       if (tab === stringTabbar.stateProject) {
  //         let newList = [stringTabbar.stateProject];
  //         this.setState({ listTab: newList });
  //       } else {
  //         let newList = Array.from(this.state.listTab);
  //         newList.push(tab);
  //         this.setState({ listTab: newList });
  //       }
  //     }
  //   );
  // };

  render() {
    const { navigation } = this.props;
    // if (this.state.app_state === stringTabbar.stateLoading) {
    //   return <LoadingScreen />;
    // } else if (this.state.app_state === stringTabbar.stateLogin) {
    return <LoginScreen navigation={navigation} />;
    // } else {
    //   return (
    //     <MainTab
    //       onRef={ref => (this.child = ref)}
    //       changeTab={tab => this.onChangeTab(tab)}
    //       app_state={this.state.app_state}
    //       navigation={navigation}
    //     />
    //   );
    // }
  }
}

export default index;