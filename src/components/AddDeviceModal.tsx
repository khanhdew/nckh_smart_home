import { View, StyleSheet, GestureResponderEvent } from 'react-native'
import React, { useState } from 'react'
import {
	Button,
	TextInput,
	Text,
	ActivityIndicator,
	Icon,
	useTheme,
} from 'react-native-paper'
import ProgressBar from './ProgressBar'
import { SelectList } from 'react-native-dropdown-select-list'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import { addDevice, filterDeviceByLocation } from '../redux/deviceSlice'

interface IProps {
	setModalVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const AddDeviceModal = ({ setModalVisible }: IProps) => {
	const theme = useTheme()
	const dispatch = useDispatch<AppDispatch>()

	const [inputIDValue, setInputIDValue] = useState<string>('')
	const [inputNameValue, setInputNameValue] = useState<string>('')
	const [inputLocationValue, setInputLocationValue] = useState<string>('')
	const [inputTypeValue, setInputTypeValue] = useState<string>('')
	const [inputErrorMessage, setInputErrorMessage] = useState('')
	const [step, setStep] = useState<number>(1)
	const locationList = useSelector<
		RootState,
		{
			[key: string]: string
		}
	>((state) => state.deviceManager.locationList)
	const locationListForSelect = Object.entries(locationList).map(
		([key, label]) => ({
			key: key,
			value: label,
		}),
	)
	const deviceTypeList = useSelector<
		RootState,
		{
			[key: string]: string
		}
	>((state) => state.deviceManager.deviceTypeList)
	const deviceTypeListForSelect = Object.entries(deviceTypeList).map(
		([key, label]) => ({
			key: key,
			value: label,
		}),
	)

	const addButtonPressHandle = (e: GestureResponderEvent): void => {
		if (inputIDValue === '') {
			setInputErrorMessage('Vui lòng nhập ID thiết bị')
			return
		}
		// else if (inputIDValue.length !== 12) {
		// 	setInputErrorMessage('Vui lòng nhập ID hợp lệ')
		// 	return
		// }
		if (step === 1) {
			setStep(step + 1)
		} else {
			setModalVisible(false)
			dispatch(
				addDevice({
					device: {
						name: inputNameValue,
						id: inputIDValue,
						location: inputLocationValue,
						type: inputTypeValue,
						quickActionStatus: false,
						dimValue: 0,
					},
				}),
			)
			dispatch(filterDeviceByLocation())
		}
	}
	const addDeviceHelpHandle = () => {}

	return (
		<View style={styles.container}>
			<Text variant="titleMedium" style={styles.title}>
				Thêm thiết bị mới
			</Text>
			<ProgressBar
				currentStep={step}
				totalSteps={2}
				activeColor={theme.colors.primary}
				inactiveColor={theme.colors.backdrop}
			/>
			<View style={{ width: '100%', gap: 10 }}>
				{step === 1 ? (
					<>
						<View
							style={{
								flexDirection: 'row',
								gap: 5,
								alignSelf: 'center',
							}}
						>
							<Icon source="help-circle-outline" size={20} />
							<Text
								style={{ color: '#4a4a4a' }}
								onPress={addDeviceHelpHandle}
							>
								Hướng dẫn lấy ID thiết bị
							</Text>
						</View>
						<View style={{ width: '100%' }}>
							<TextInput
								value={inputIDValue}
								onChangeText={(text) => {
									setInputIDValue(text)
									setInputErrorMessage('')
								}}
								style={{
									...styles.input,
									textTransform: 'uppercase',
								}}
								activeUnderlineColor={theme.colors.primary}
								textColor={theme.colors.primary}
								label="ID thiết bị"
							/>
							<Text
								variant="labelSmall"
								style={{ color: theme.colors.error }}
							>
								{inputErrorMessage}
							</Text>
						</View>
					</>
				) : (
					<>
						<View>
							<Text>Tên thiết bị: </Text>
							<TextInput
								value={inputNameValue}
								onChangeText={(text) => {
									setInputNameValue(text)
								}}
								disabled={
									!(inputLocationValue && inputTypeValue)
								}
								style={{ ...styles.input, fontSize: 16 }}
								dense={true}
								activeUnderlineColor={theme.colors.primary}
								textColor={theme.colors.primary}
							/>
						</View>
						<View>
							<Text>Loại thiết bị: </Text>
							<SelectList
								data={deviceTypeListForSelect}
								setSelected={(val: string) => {
									setInputTypeValue(val)
									setInputNameValue(
										`${deviceTypeList[val]} ${
											locationList[inputLocationValue] ||
											''
										}`,
									)
								}}
								placeholder="Chon loại thiết bị"
								search={false}
								dropdownStyles={styles.selectInputDropdown}
								save="key"
							/>
						</View>
						<View>
							<Text>Vị trí: </Text>
							<SelectList
								data={locationListForSelect}
								setSelected={(val: string) => {
									setInputLocationValue(val)
									setInputNameValue(
										`${
											deviceTypeList[inputTypeValue] || ''
										} ${locationList[val]}`,
									)
								}}
								placeholder="Chon vị trí đặt thiết bị"
								search={false}
								dropdownStyles={styles.selectInputDropdown}
								save="key"
							/>
						</View>
					</>
				)}
			</View>
			<Button
				mode="contained"
				onPress={addButtonPressHandle}
				buttonColor={theme.colors.primary}
				textColor={theme.colors.onBackground}
			>
				<Text style={styles.buttonText}>
					{step === 1 ? 'Tiếp tục' : 'Kết nối'}
				</Text>
			</Button>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		gap: 15,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		fontSize: 20,
	},
	input: {
		fontSize: 22,
		width: '100%',
		textAlign: 'center',
		fontWeight: 'bold',
	},
	buttonText: {
		fontWeight: '500',
	},
	selectInputDropdown: {
		backgroundColor: '#fff',
		opacity: 1,
		position: 'absolute',
		top: 40,
		right: 0,
		left: 0,
		zIndex: 1,
	},
})

export default AddDeviceModal
