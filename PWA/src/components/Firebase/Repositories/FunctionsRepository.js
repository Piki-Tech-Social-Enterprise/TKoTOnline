import BaseRepository from './BaseRepository';
import 'firebase/auth';
import 'firebase/functions';
import axios from 'axios';

class FunctionsRepository extends BaseRepository {
  constructor(firebaseApp) {
    super();
    const {
      REACT_APP_ENV_NAME,
      REACT_APP_FIREBASE_FUNCTIONS_EMULATOR_URL: FFE_URL
    } = process.env;
    this.auth = firebaseApp.auth();
    this.functions = firebaseApp.functions();
    if (REACT_APP_ENV_NAME === 'local' && FFE_URL) {
      this.functions.useFunctionsEmulator(FFE_URL);
      console.log(`FunctionsRepository.functions.useFunctionsEmulator is set to: '${FFE_URL}')`);
    };
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
    // debugger;
    let response = null;
    try {
      const {
        functionName,
        data
      } = options;
      const callFunction = this.functions.httpsCallable(`${functionName}`);
      response = await callFunction(data);
    } catch (error) {
      console.log(`FunctionsRepository.call Error: ${JSON.stringify(error, null, 2)}`);
      response = error.response || response;
    } finally {
      return response;
    }
  }
}

export default FunctionsRepository;
