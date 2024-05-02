import { View } from 'react-native'
import React from 'react'

interface IProps {
	currentStep: number
	totalSteps: number
	activeColor: string
	inactiveColor: string
}

const ProgressBar = ({
	currentStep,
	totalSteps,
	activeColor,
	inactiveColor,
}: IProps) => {
	return (
		<>
			<View
				style={{
					height: 7,
					width: `70%`,
					borderRadius: 5,
					justifyContent: 'space-between',
					flexDirection: 'row',
				}}
			>
				{Array.from({ length: totalSteps }, (_, index) => (
					<View
						key={index}
						style={{
							height: 7,
							width: `${100 / totalSteps - 1}%`,
							backgroundColor:
								currentStep > index
									? activeColor
									: inactiveColor,
							borderRadius: 10,
						}}
					></View>
				))}
			</View>
		</>
	)
}

export default ProgressBar
