import React from 'react';
import { Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Weather from '../Weather';
import ViewPagerAdapter from 'react-native-tab-view-viewpager-adapter';
import {
  PageControlAji,
} from 'react-native-chi-page-control';
import { View } from 'native-base';
const Tab = createMaterialTopTabNavigator();

const CC = ['white', '#4B8266']

const TabBar = (props) => {
  const { navigationState, navigation, position } = props
  console.log(navigationState)
  return (
    <View style={{
      height: 20,
      // backgroundColor: 'seashell',
      // flexDirection: "row",
      // justifyContent: 'space-around',
      alignItems: 'center',
    }}>
      <View style={{
        // width: 200,
        flexDirection: "row",
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
        {navigationState.routes.map((route, index) => {
          // const focusAnim = position.interpolate({
          //   inputRange: [index - 1, index, index + 1],
          //   outputRange: [0, 1, 0]
          // })
          console.log(index, route, route.name)
          return (
            <View style={{ margin: 5, borderRadius: 5, backgroundColor: navigationState.index == index ? 'blue' : 'red', width: 10, height: 10 }}>

            </View>
          )
        })}
      </View>
    </View>
  )
}

function MyTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="7"
        pager={props => <ViewPagerAdapter {...props} />}
        // pager={props => <PageControlAji {...props} progress={1} numberOfPages={3} />
        // }
        tabBar={(props) => <TabBar {...props} />}
        lazy={true}
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
              options={{
                tabBarLabel: ({ focused }) => (
                  <Text style={{ marginTop: 8, fontSize: 20, fontWeight: 'bold', alignSelf: 'center', color: focused ? 'white' : '#4B8266' }}>{'24 giờ tới'}</Text>
                ),
              }}
              name={item}
              component={Weather} />
          );
        })}
      </Tab.Navigator>
    </NavigationContainer >
  );
}

export default MyTabs;