import React, { Component } from 'react';
import { Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Weather from '../Weather';
import { View } from 'native-base';
const Tab = createMaterialTopTabNavigator();

const CC = ['white', '#4B8266']

const TabBar = ({ props, getPos, navi }) => {
  const { navigationState, navigation, position } = props
  navi(navigation)
  getPos(navigationState.index)
  return (
    <View style={{
      height: 20,
      alignItems: 'center',
    }}>
      <View style={{
        flexDirection: "row",
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
        {navigationState.routes.map((route, index) => {
          return (
            <View style={{ margin: 5, borderRadius: 5, backgroundColor: navigationState.index == index ? 'black' : 'white', width: 10, height: 10 }}>

            </View>
          )
        })}
      </View>
    </View>
  )
}

export default class mytabs extends Component {

  constructor(props) {
    super(props);

    this.didChangeTab = this.didChangeTab.bind(this);
    this.navigation = null;
  }

  componentDidMount() {
    if (this.props.onRef != null) {
      this.props.onRef(this, this.didChangeTab);
    }
  }

  didChangeTab(tab) {
    this.navigation.navigation.jumpTo(tab)
  }

  render() {
    const { tabChange } = this.props;
    return (
      <NavigationContainer>
        <Tab.Navigator
          sceneContainerStyle={{
            backgroundColor: 'transparent',
          }}
          tabBar={(props) => <TabBar props={props} getPos={(pos) => tabChange(pos)} navi={() => this.navigation = props} />}
          lazy={true}
          lazyPlaceholder={(props) => <View></View>}
          tabBarOptions={{
            indicatorStyle: {
              height: '100%',
              backgroundColor: '#4B8266'
            },
            showIcon: false,
            style: {
              height: 10,
              width: 100,
              backgroundColor: '#faecde',
            }
          }}
        >
          {['1', '2', '3', '4', '5', '6', '7'].map(item => {
            return (
              <Tab.Screen
                name={item}
                component={Weather}
              />
            );
          })}
        </Tab.Navigator>
      </NavigationContainer >
    );
  }
}