import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StyleSheet } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import HomeScreen from '../screens/HomeScreen'
import DeviceManagerScreen from '../screens/DeviceManagerScreen'
import HistoryScreen from '../screens/HistoryScreen'
import SettingScreen from '../screens/SettingScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Tab = createBottomTabNavigator()

const BottomNavBar = () => {
	return (
		<Tab.Navigator
			initialRouteName="app"
			screenOptions={{
				tabBarHideOnKeyboard: true,
			}}
		>
			<Tab.Screen
				name="Home"
				component={HomeScreen}
				options={{
					title: 'Trang chủ',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="home"
							color={color}
							size={size}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Device"
				component={DeviceManagerScreen}
				options={{
					title: 'Thiết bị',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="devices"
							color={color}
							size={size}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="History"
				component={HistoryScreen}
				options={{
					title: 'Thông báo',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="bell"
							color={color}
							size={size}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="Setting"
				component={SettingScreen}
				options={{
					title: 'Cài đặt',
					tabBarIcon: ({ color, size }) => (
						<MaterialCommunityIcons
							name="cog"
							color={color}
							size={size}
						/>
					),
				}}
			/>
		</Tab.Navigator>
	)
}

export default BottomNavBar
