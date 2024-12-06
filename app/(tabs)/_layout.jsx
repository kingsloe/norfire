import React from 'react'

// newly added for navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { mainButtonColor, secondaryButtonColor, mainBackgroundColor } from '../../constants/colors';
import { TabIcons, IconColor } from './tabIcons';
const Tab = createBottomTabNavigator();

const TabLayout = () => {
  return (
    <Tab.Navigator screenOptions={{ 
      tabBarActiveTintColor: mainButtonColor,
      tabBarInactiveTintColor: secondaryButtonColor,
      tabBarLabelStyle: { fontSize: 12 },
      tabBarStyle: {
        backgroundColor: mainBackgroundColor,
        height: 50,
      }
      }}>
      {TabIcons.map(({name, title, component, iconName}) => (
        <Tab.Screen 
        key={name}
        name={name} 
        options={{
          headerShown: false,
          title: title,
          tabBarIcon: IconColor({name: iconName})
        }} 
        component={component}
      />
      ))}
    </Tab.Navigator>
  )
}

export default TabLayout