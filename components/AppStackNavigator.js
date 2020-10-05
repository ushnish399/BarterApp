import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import ObjectDonateScreen from '../screens/ObjectDonateScreen';
import RecieverDetailsScreen  from '../screens/RecieverDetailsScreen';




export const AppStackNavigator = createStackNavigator({
  ObjectDonateList : {
    screen : ObjectDonateScreen,
    navigationOptions:{
      headerShown : false
    }
  },
  RecieverDetails : {
    screen : RecieverDetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  }
},
  {
    initialRouteName: 'ObjectDonateList'
  }
);
