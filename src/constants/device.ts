export const DEVICE_TYPE_ICON: {
	[key: string]: {
		name: string
		color: string
	}
} = {
	light: {
		name: 'lightbulb',
		color: '#00f',
	},
	fan: {
		name: 'fan',
		color: '#000',
	},
	bell: {
		name: 'bell',
		color: '#000',
	},
	other: {
		name: 'beaker-question',
		color: '#000',
	},
}

export const DEVICE_LOCATIONS: {
	[key: string]: string
} = {
	1: 'Phòng khách',
	2: 'Phòng ngủ',
	3: 'Nhà bếp',
}

export const DEVICE_TYPES: {
	[key: string]: string
} = {
	light: 'Bóng đèn',
	fan: 'Quạt',
	bell: 'Chuông cửa',
}
