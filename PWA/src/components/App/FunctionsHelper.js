import axios from 'axios';

class FunctionsHelper {
  /*
  Options = {
    baseUrl: '* Required',
    functionName: '* Required',
    queryItems: {
      key: value
    } || null
    bodyItems: {
      key: value
    } || null
  }
  */
  constructor(options) {
    this.options = options;
    console.log(`FunctionsHelper.options: ${JSON.stringify(options, null, 2)}`);
  }
  _buildUrl = () => {
    const {
      baseUrl,
      functionName,
      queryItems
    } = this.options;
    const queryItemsAsArray = Object.keys(queryItems || {}).map(queryItemKey => {
      const queryItemValue = queryItems[queryItemKey];
      return `${encodeURIComponent(queryItemKey)}=${encodeURIComponent(queryItemValue)}`;
    });
    const queryString = queryItemsAsArray && queryItemsAsArray.length
      ? `?${queryItemsAsArray.join('&')}`
      : '';
    let url = `${baseUrl}/${functionName}${queryString}`;
    console.log(`url: ${url}`);
  }
  postAsync = async () => {
    const url = this._buildUrl();
    let response = {
      data: {
        results: {}
      }
    };
    try {
      response = await axios.post(url, this.options.bodyData);
      console.log(`FunctionsHelper.postAsync - response: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.log(`FunctionsHelper.postAsync Error: ${error.message || error.response.data}`);
      response = error.response || response;
    } finally {
      return response;
    }
  }
  putAsync = async () => {
    // debugger;
    const url = this._buildUrl();
    let response = {
      data: {
        results: {}
      }
    };
    try {
      response = await axios.put(url, this.options.bodyData);
      console.log(`FunctionsHelper.putAsync - response: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.log(`FunctionsHelper.putAsync Error: ${error.message || error.response.data}`);
      response = error.response || response;
    } finally {
      return response;
    }
  }
}

export default FunctionsHelper;
