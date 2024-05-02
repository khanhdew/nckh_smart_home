import axios from 'axios';
import {IWeatherCondition} from '../interfaces/greeting';

const BASE_URL_WEATHER_INFO = 'http://api.weatherapi.com/v1';
const WEATHER_API_KEY = '7d0b49df55a94c1babb32549232605';

export const getWeatherCondition = async (): Promise<
  IWeatherCondition | undefined
> => {
  return await axios
    .get(`${BASE_URL_WEATHER_INFO}/current.json`, {
      params: {
        key: WEATHER_API_KEY,
        q: 'HaNoi',
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
