export interface IWeatherCondition {
	location: {
		name: string
	}
	current: {
		feelslike_c: number
		humidity: number
		condition: {
			text: string
			icon: string
		}
	}
}
