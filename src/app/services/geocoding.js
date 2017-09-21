import axios from 'axios';
import * as Logger from 'loglevel';
const mapApiKey = require('../../../config/private').mapsApiKey;
const BASE_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';

export const geocodeAddress = async (address) => {
  Logger.info(`request to geocode ${address} recieved by service`);
  const addressString = formatAddress(address);
  Logger.info(`formatted string, result is : ${addressString}`);
  try {
    const geocodeResult = await axios.get(BASE_GEOCODE_URL, {
      params: {
        address: addressString,
        key: mapApiKey
      }
    });
    Logger.info(`geocode result assumed fetched. Data: ${JSON.stringify(geocodeResult)}`);
    return geocodeResult;
  } catch (err) {
    Logger.warn(`there was an error while fetching from the geocode api: ${err}`);
  }
};
function formatAddress({address1, address2, address3, country}) {
  Logger.info('attempting to format address');
  Logger.info(`first line: ${address1}`);
  let address = address1 + ', ';
  if (address2 && address2.length > 0) {
    Logger.info(`second line found. Second line: ${address2}`);
    address += address2 + ', ';
  }
  if (address3 && address3.length > 0) {
    Logger.info(`Third line found. Third line: ${address3}`);
    address += address3 + ', ';
  }
  Logger.info(`returning ${address + country}`);
  return `${address}${country}`;
}
