import BaseRepository from './BaseRepository';
import 'firebase/compat/functions';
import axios from 'axios';
import {
  isBoolean,
  isNumber
} from '../../App/Utilities';

class FunctionsRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    this.functions = firebaseApp.functions();
    const {
      REACT_APP_USE_EMULATOR,
      REACT_APP_FNC_PORT
    } = process.env;
    if (isBoolean(REACT_APP_USE_EMULATOR, true) && isNumber(REACT_APP_FNC_PORT)) {
      this.functions.useEmulator('localhost', Number(REACT_APP_FNC_PORT));
      console.log(`FunctionsRepository.functions.useEmulator is set to: 'localhost:${REACT_APP_FNC_PORT}'`);
    }
  }
  _buildUrl = options => {
    const {
      baseUrl,
      functionName,
      queryItems
    } = options;
    const queryItemsAsArray = Object.keys(queryItems || {}).map(queryItemKey => {
      const queryItemValue = queryItems[queryItemKey];
      return `${encodeURIComponent(queryItemKey)}=${encodeURIComponent(queryItemValue)}`;
    });
    const queryString = queryItemsAsArray && queryItemsAsArray.length
      ? `?${queryItemsAsArray.join('&')}`
      : '';
    let url = `${baseUrl}/${functionName}${queryString}`;
    console.log(`url: ${url}`);
    return url;
  }
  getAsync = async (options, config) => {
    let response = {
      data: {
        results: {}
      }
    };
    try {
      const url = this._buildUrl(options);
      response = await axios.get(url, config);
      console.log(`FunctionsRepository.getAsync - response: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.log(`FunctionsRepository.getAsync Error: ${JSON.stringify(error, null, 2)}`);
      response = error.response || response;
    } finally {
      return response;
    }
  }
  postAsync = async options => {
    let response = {
      data: {
        results: {}
      }
    };
    try {
      const url = this._buildUrl(options);
      response = await axios.post(url, options.bodyData);
      console.log(`FunctionsRepository.postAsync - response: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.log(`FunctionsRepository.postAsync Error: ${JSON.stringify(error, null, 2)}`);
      response = error.response || response;
    } finally {
      return response;
    }
  }
  putAsync = async options => {
    let response = {
      data: {
        results: {}
      }
    };
    try {
      const url = this._buildUrl(options);
      response = await axios.put(url, options.bodyData);
      console.log(`FunctionsRepository.putAsync - response: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.log(`FunctionsRepository.putAsync Error: ${JSON.stringify(error, null, 2)}`);
      response = error.response || response;
    } finally {
      return response;
    }
  }
  deleteAsync = async options => {
    let response = {
      data: {
        results: {}
      }
    };
    try {
      const url = this._buildUrl(options);
      response = await axios.delete(url, options.bodyData);
      console.log(`FunctionsRepository.deleteAsync - response: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.log(`FunctionsRepository.deleteAsync Error: ${JSON.stringify(error, null, 2)}`);
      response = error.response || response;
    } finally {
      return response;
    }
  }
  call = async options => {
    let response = null;
    try {
      const {
        functionName,
        data
      } = options;
      // console.log('options: ', JSON.stringify(options, null, 2));
      const callFunction = this.functions.httpsCallable(`${functionName}`);
      // debugger;
      response = await callFunction(data);
    } catch (error) {
      console.log(`FunctionsRepository.call Error: ${JSON.stringify(error, null, 2)}`);
      response = error.response || response;
      // debugger;
      // throw error;
    }
    return response;
  }
}

export default FunctionsRepository;
