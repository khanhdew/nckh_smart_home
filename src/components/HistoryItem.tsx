import { StyleSheet, View } from 'react-native'
import { Icon, Text } from 'react-native-paper'
import React from 'react'

interface IProps {
	historyItemData: string
}

const HistoryItem = ({ historyItemData }: IProps) => {
	return (
		<View style={styles.historyItem}>
			<Text>
				<Text style={styles.deviceName}>{historyItemData}</Text> vừa
				được bấm
			</Text>
			<Text>
				<Icon source="calendar-clock" size={20} />
				10h20, 3/5/2022
			</Text>
			<Text>
				<Icon source="map-marker" size={20} />
				Phòng khách
			</Text>
		</View>
	)
}

export default HistoryItem

const styles = StyleSheet.create({
	historyItem: {
		backgroundColor: '#cccccc84',
		paddingVertical: 10,
		paddingHorizontal: 20,
		width: '100%',
		borderRadius: 10,
		marginBottom: 10,
		fontSize: 18,
		rowGap: 3,
	},
	deviceName: {
		fontWeight: 'bold',
	},
})
