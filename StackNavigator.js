import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

import Ar_draw from './Ar_draw';
import Main from './Main';
import Example from './Example';

const Stack = createStackNavigator();

const StackNavigator = () => {
    return(
        <Stack.Navigator 
            initialRouteName='Main'
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name = 'Ar_draw' component={Ar_draw} options={{unmountOnBlur: true}}/>
            <Stack.Screen name = 'Main' component={Main} options={{unmountOnBlur: true}}/>
            <Stack.Screen name = 'Example' component={Example} options={{unmountOnBlur:true}}/>
        </Stack.Navigator>
    )
}

export default StackNavigator;