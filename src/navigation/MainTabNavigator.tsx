import React from 'react';
import {Platform, Dimensions} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from '../contexts/ThemeContext';
import { Image } from 'lucide-react-native';
import PhotoSelectionScreen from '../screens/PhotoSelectionScreen';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isDesktop = isWeb && width > 768;

// Define tab types explicitly
export type MainTabsParamList = {
  Photos: undefined;
};

const Tab = createBottomTabNavigator<MainTabsParamList>();

// Main tab navigator - completely driven by config
export const MainTabNavigator = () => {
    const {
        tabBarBackground,
        tabBarActiveIcon,
        tabBarInactiveIcon,
        tabBarBorder,
        tabBarBorderTopWidth,
        tabBarIconSize,
        tabBarLabelFontSize
    } = useTheme();

    // On desktop web, we don't need tab navigation - just show the main screen
    if (isDesktop) {
        return <PhotoSelectionScreen />;
    }

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: tabBarActiveIcon,
                tabBarInactiveTintColor: tabBarInactiveIcon,
                tabBarStyle: {
                    backgroundColor: tabBarBackground,
                    borderTopColor: tabBarBorder,
                    height: Platform.OS === 'ios' ? 72 : 60,
                    paddingBottom: 8,
                    borderTopWidth: tabBarBorderTopWidth,
                    elevation: 0,
                    shadowOpacity: 0,
                    // Ensure tab bar doesn't overlap with bottom notch
                    ...(Platform.OS === 'ios' ? {paddingBottom: 0} : {}),
                },
                tabBarLabelStyle: {
                    fontSize: tabBarLabelFontSize,
                    fontWeight: '500',
                }
            }}
        >
            <Tab.Screen
                name="Photos"
                component={PhotoSelectionScreen}
                options={{
                    tabBarLabel: 'Photos',
                    tabBarIcon: ({color}) => <Image size={tabBarIconSize} color={color} />
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabNavigator;
