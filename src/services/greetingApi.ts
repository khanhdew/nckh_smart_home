import axios from 'axios';
import {IWeatherCondition} from '../interfaces/greeting';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL_WEATHER_INFO = 'http://api.weatherapi.com/v1';
const WEATHER_API_KEY = '7d0b49df55a94c1babb32549232605';

export const getWeatherCondition = async (): Promise<
  IWeatherCondition | undefined
> => {
  const city: string =
    (await AsyncStorage.getItem('city')) || (await getCityByIpv4());
  return await axios
    .get(`${BASE_URL_WEATHER_INFO}/current.json`, {
      params: {
        key: WEATHER_API_KEY,
        q: city,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      return undefined;
    });
};

export const getIPv4 = async () => {
  return await axios
    .get('https://ipv4.getmyip.dev/')
    .then(res => res.data)
    .catch(err => console.log(err));
};

const getCityByIpv4 = async (): Promise<string> => {
  var ipv4;

  await axios
    .get('https://ipv4.getmyip.dev/')
    .then(res => (ipv4 = res.data))
    .catch(err => console.log(err));

  return await axios
    .get(`http://ip-api.com/json/${ipv4}`)
    .then(async res => {
      await AsyncStorage.setItem('city', res.data.city);
      return res.data.city;
    })
    .catch(err => console.log(err));
};
