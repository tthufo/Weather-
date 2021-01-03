import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Homer from '../Hometab/Home';
// import UserTab from '../Usertab/User';
// import SocialTab from '../Socialtab/Social';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          options={{
            tabBarIcon: ({ focused }) => (
              <Image
                style={{ width: 25, height: 25, marginTop: 10 }}
                source={!focused ? require('../../assets/images/ic_tab_home_active.png') : require('../../assets/images/ic_tab_home_active.png')
                } />
            ),
            tabBarLabel: ''
          }}
          name="Home"
          component={Homer} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MyTabs;