import React from 'react';
import { Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import h24 from './24h';
import d7 from './7d';
const Tab = createMaterialTopTabNavigator();

const CC = ['white', '#4B8266']

function MyTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBarOptions={{
          indicatorStyle: {
            height: '100%',
            backgroundColor: '#4B8266'
          },
          showIcon: false,
          style: {
            height: 60,
            backgroundColor: '#faecde',
          }
        }}
      >
        <Tab.Screen
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={{ marginTop: 8, fontSize: 20, fontWeight: 'bold', alignSelf: 'center', color: focused ? 'white' : '#4B8266' }}>{'24 giờ tới'}</Text>
            ),
          }}
          name="24h"
          component={h24} />
        <Tab.Screen
          options={{
            tabBarLabel: ({ focused }) => (
              <Text style={{ marginTop: 8, fontSize: 20, fontWeight: 'bold', alignSelf: 'center', color: focused ? 'white' : '#4B8266' }}>{'7 ngày tới'}</Text>
            ),
          }}
          name="7d"
          component={d7} />
      </Tab.Navigator>
    </NavigationContainer >
  );
}

export default MyTabs;