import {
  isBoolean
} from 'components/App/Utilities';

const initDbRepositoryFunctions = async initOptions => {
  const {
    default: axios
  } = await import(/* webpackPreload: true */'axios');
  const {
    REACT_APP_FIREBASE_USE_FUNCTIONS_EMULATOR_URL,
    REACT_APP_FIREBASE_FUNCTIONS_EMULATOR_URL,
    REACT_APP_GOOGLE_BASE_CLOUD_FUNCTIONS_URL,
    REACT_APP_FIREBASE_PROJECT_ID
  } = process.env;
  const useFunctionsEmulatorUrl = isBoolean(REACT_APP_FIREBASE_USE_FUNCTIONS_EMULATOR_URL, true);
  const baseUrl = useFunctionsEmulatorUrl
    ? `${REACT_APP_FIREBASE_FUNCTIONS_EMULATOR_URL}/${REACT_APP_FIREBASE_PROJECT_ID}/us-central1`
    : REACT_APP_GOOGLE_BASE_CLOUD_FUNCTIONS_URL;
  const buildUrl = options => {
    const {
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
  };
  const httpMethods = {
    GET: 'get',
    POST: 'post'
  };
  const dbFunctionNames = {
    getDbItemsAsArray: 'getDbItemsAsArray',
    getDbItemValue: 'getDbItemValue',
    getMultipleDbItemsAsArrays: 'getMultipleDbItemsAsArrays',
    saveDbItem: 'saveDbItem'
  };
  const callHttpMethod = async (httpMethod, options, config) => {
    let response = {
      data: {
        results: {}
      }
    };
    try {
      const url = buildUrl(options);
      console.log(`FunctionsRepository.${httpMethod}Data - request: ${JSON.stringify({
        httpMethod,
        url,
        options,
        config
      }, null, 2)}`);
      switch (httpMethod) {
        case httpMethods.POST:
          response = await axios[httpMethod](url, options.bodyData, config);
          break;
        case httpMethods.GET:
        default:
          response = await axios[httpMethod](url, config);
          break;
      }
      console.log(`FunctionsRepository.${httpMethod}Data - response: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      console.log(`FunctionsRepository.${httpMethod}Data Error: ${JSON.stringify(error, null, 2)}`);
      response = error.response || response;
    } finally {
      return response;
    }
  };
  const getData = async (options, config) => {
    return await callHttpMethod(httpMethods.GET, options, config);
  };
  const postData = async (options, config) => {
    return await callHttpMethod(httpMethods.POST, options, config);
  };
  const {
    initialisedFirebaseApp,
    dbTableName
  } = initOptions;
  const getDbItemsAsArray = async (includeInactive = false, childName = 'active', childValue = true, topLimit = NaN, fieldNames = []) => {
    const options = {
      functionName: 'dbFunctions',
      queryItems: {
        dbFunctionName: dbFunctionNames.getDbItemsAsArray,
        dbTableName,
        includeInactive,
        childName,
        childValue,
        topLimit,
        fieldNames
      }
    };
    const {
      data
    } = await getData(options);
    return data;
  };
  const getDbItemValue = async (dbItemId, fieldNames = []) => {
    const options = {
      functionName: 'dbFunctions',
      queryItems: {
        dbFunctionName: dbFunctionNames.getDbItemValue,
        dbTableName,
        dbItemId,
        fieldNames
      }
    };
    const {
      data
    } = await getData(options);
    return data;
  };
  const getMultipleDbItemsAsArrays = async queryItems => {
    const options = {
      functionName: 'dbFunctions',
      queryItems: {
        dbFunctionName: dbFunctionNames.getMultipleDbItemsAsArrays,
        dbTableName: 'settings'
      },
      bodyData: queryItems
    };
    const {
      data
    } = await postData(options);
    return data;
  };
  const saveDbItem = async item => {
    const options = {
      functionName: 'dbFunctions',
      queryItems: {
        dbFunctionName: dbFunctionNames.saveDbItem,
        dbTableName
      },
      bodyData: item
    };
    const {
      data
    } = await postData(options);
    return data;
  };
  return {
    initialisedFirebaseApp,
    dbTableName,
    getDbItemsAsArray,
    getDbItemValue,
    getMultipleDbItemsAsArrays,
    saveDbItem
  };
};

export default initDbRepositoryFunctions;
