export const DEVICE_TYPE_ICON: {
  [key: string]: {
    name: string;
    color: string;
  };
} = {
  light: {
    name: 'lightbulb',
    color: '#000',
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
};

export const DEVICE_LOCATIONS: {
  [key: string]: string;
} = {
  1: 'Phòng khách',
  2: 'Phòng ngủ',
  3: 'Nhà bếp',
  4: 'Phòng tắm',
  5: 'Phòng làm việc',
  6: 'Phòng ăn',
  7: 'Sân vườn',
  8: 'Nhà vệ sinh',
};

export const DEVICE_TYPES: {
  [key: string]: string;
} = {
  light: 'Bóng đèn',
  fan: 'Quạt',
  bell: 'Chuông cửa',
};
