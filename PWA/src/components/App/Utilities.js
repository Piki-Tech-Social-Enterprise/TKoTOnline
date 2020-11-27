import React, {
  useEffect
} from 'react';
import draftToHtml from 'draftjs-to-html';
import moment from 'moment';

const useWindowEvent = (event, callback) => {
  useEffect(() => {
    window.addEventListener(event, callback);
    return () => window.removeEventListener(event, callback);
  }, [event, callback]);
};
const shallowCompare = (instance, nextProps, nextState, consoleLogResults) => {
  return (
    !shallowEqual(instance.props, nextProps, consoleLogResults, true) ||
    !shallowEqual(instance.state, nextState, consoleLogResults)
  );
};
const shallowEqual = (objA, objB, consoleLogResults, isProps) => {
  const isPropsText = isProps ? 'props' : 'state';
  if (objA === objB) {
    if (consoleLogResults) console.log(`${isPropsText} :: objA === objB: true`);
    return true;
  }
  if (typeof objA !== 'object' || objA === null ||
    typeof objB !== 'object' || objB === null) {
    if (consoleLogResults) console.log(`${isPropsText} :: typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null: ${typeof objA !== 'object'} || ${objA === null} || ${typeof objB !== 'object'} || ${objB === null}`);
    return false;
  }
  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    if (consoleLogResults) console.log(`${isPropsText} :: keysA.length !== keysB.length: ${keysA.length} !== ${keysB.length}`);
    return false;
  }
  var bHasOwnProperty = hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      if (consoleLogResults) {
        console.log(`${isPropsText} :: !bHasOwnProperty('${keysA[i]}') || objA['${keysA[i]}'] !== objB['${keysA[i]}']: ${!bHasOwnProperty(keysA[i])} || ${objA[keysA[i]] !== objB[keysA[i]]}`);
      }
      return false;
    }
  }
  if (consoleLogResults) console.log(`${isPropsText} :: shallowEqual: true`);
  return true;
};
const isEmptyObject = (object) => {
  return !object || (Object.entries(object).length === 0 && object.constructor === Object);
};
const handleLoadBlob = (blob, handleLoadBlobComplete) => {
  const handleFileReaderLoadEnd = e => {
    e.preventDefault();
    handleLoadBlobComplete(e.target.result);
  };
  if (blob) {
    const fileReader = new FileReader();
    fileReader.onloadend = handleFileReaderLoadEnd;
    fileReader.readAsDataURL(blob);
  }
};
const formatBytes = (bytes, dp = 2) => {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const oneKiloByte = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(oneKiloByte));
  const fractionDigits = dp < 0
    ? 0
    : dp;
  const refactoredBytes = parseFloat((bytes / Math.pow(oneKiloByte, i)).toFixed(fractionDigits));
  const formattedBytes = `${refactoredBytes} ${sizes[i]}`;
  return formattedBytes;
};
const formatInteger = (integer) => (
  integer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
);
const fromCamelcaseToTitlecase = camelCase => (
  camelCase
    .replace(/([A-Z])/g, match => ` ${match}`)
    .replace(/^./, match => match.toUpperCase())
);
const DATE_MOMENT_FORMAT = 'DD/MM/YYYY';
const TIME_MOMENT_FORMAT = 'HH:mm:ss';
const DATE_TIME_MOMENT_FORMAT = `${DATE_MOMENT_FORMAT} ${TIME_MOMENT_FORMAT}`;
const ISO8601_DATE_FORMAT = 'YYYY-MM-DD';
const keyCodes = {
  backspace: 8,
  tab: 9,
  enter: 13,
  space: 32,
  arrowLeft: 37,
  arrowRight: 39,
  colon: 59,
  divide: 111,
  semiColon: 186,
  forwardSlash: 191
};
const isShiftPlusTab = (shiftKey, keyCode) => {
  if (!shiftKey) {
    return false;
  }
  return (keyCode === keyCodes.tab);
};
const isShiftSemiColon = (shiftKey, keyCode) => {
  if (!shiftKey) {
    return false;
  }
  return (keyCode === keyCodes.semiColon || keyCode === keyCodes.colon);
};
const isNumeric = keyCode => {
  return (keyCode >= 48 && keyCode <= 57)
    || (keyCode >= 96 && keyCode <= 105);
};
const isAlpha = keyCode => {
  return (keyCode >= 65 && keyCode <= 90);
};
const handleKeyDown = (handleKeyDownOptions) => {
  const {
    e,
    allowOptions,
    validKeyCodes
  } = handleKeyDownOptions,
    {
      shiftKey,
      which: keyCode
    } = e,
    {
      shiftPlusTab,
      shiftSemiColon,
      numeric,
      alpha
    } = allowOptions;
  if ((shiftPlusTab && isShiftPlusTab(shiftKey, keyCode))
    || (shiftSemiColon && isShiftSemiColon(shiftKey, keyCode))
    || (numeric && isNumeric(keyCode))
    || (alpha && isAlpha(keyCode))
    || validKeyCodes.includes(keyCode)) {
    return true;
  }
  e.preventDefault();
  return false;
};
const handleKeyDownForDate = e => {
  return handleKeyDown({
    e,
    allowOptions: {
      shiftPlusTab: true,
      shiftSemiColon: true,
      numeric: true
    },
    validKeyCodes: [
      keyCodes.backspace,
      keyCodes.enter,
      keyCodes.tab,
      keyCodes.arrowLeft,
      keyCodes.arrowRight,
      keyCodes.divide,
      keyCodes.forwardSlash
    ]
  });
};
const handleKeyDownForTime = e => {
  return handleKeyDown({
    e,
    allowOptions: {
      shiftPlusTab: true,
      shiftSemiColon: true,
      numeric: true
    },
    validKeyCodes: [
      keyCodes.backspace,
      keyCodes.enter,
      keyCodes.tab,
      keyCodes.arrowLeft,
      keyCodes.arrowRight
    ]
  });
};
const TAG_SEPARATOR = ', ';
const isJson = value => {
  return (value && (
    (value.startsWith('{') && value.endsWith('}')) ||
    (value.startsWith('[') && value.endsWith(']'))
  )
  );
};
const stripHtml = html => html.replace(/(<([^>]+)>)/ig, '');
const getFirstCharacters = (value, length, excludeEllipse = false) => {
  return value && value.length > length
    ? `${value.substring(0, length - (excludeEllipse ? 0 : 3))}${!excludeEllipse && '...'}`
    : value;
};
const draftToText = (draftRaw, defaultValue = undefined, maxLength = undefined) => {
  if (!isJson(draftRaw)) {
    return defaultValue !== undefined
      ? defaultValue
      : draftRaw;
  }
  const draftAsJson = JSON.parse(draftRaw);
  const draftAsHtml = draftToHtml(draftAsJson);
  const draftAsText = stripHtml(draftAsHtml);
  return isNumber(maxLength)
    ? getFirstCharacters(draftAsText, maxLength, false)
    : draftAsText;
};
const isNumber = value => value && !isNaN(value);
const isEmptyString = value => value === '';
const isNullOrEmpty = value => value == null || isEmptyString(value);
const isTrueOrFalse = value => {
  const valueAsLowercaseString = (value || '').toString().toLowerCase();
  return valueAsLowercaseString === 'true' || valueAsLowercaseString === 'false';
};
const isBoolean = (value, expectedValue = undefined) =>
  !isNullOrEmpty(value) &&
  (typeof value === 'boolean' || isTrueOrFalse(value)) &&
  (isNullOrEmpty(expectedValue) || value.toString().toLowerCase() === expectedValue.toString().toLowerCase());
const toMoment = (value, dateFormat = DATE_TIME_MOMENT_FORMAT) => moment(value, dateFormat);
const isDate = (value, dateFormat = DATE_TIME_MOMENT_FORMAT) => toMoment(value, dateFormat).isValid();
const toDate = (value, dateFormat = DATE_TIME_MOMENT_FORMAT) => toMoment(value, dateFormat).toDate();
const toFormattedDate = (value, dateFormat = DATE_TIME_MOMENT_FORMAT) => isDate(value, dateFormat)
  ? toMoment(value, dateFormat).format(DATE_MOMENT_FORMAT)
  : value;
const toFormattedDateTime = (value, dateFormat = DATE_TIME_MOMENT_FORMAT) => isDate(value, dateFormat)
  ? toMoment(value, dateFormat).format(DATE_TIME_MOMENT_FORMAT)
  : value;
const tryToConvertValue = value => {
  let convertedValue = undefined;
  let convertedValueType = undefined;
  if (isNumber(value)) {
    convertedValue = Number(value);
  } else if (isBoolean(value)) {
    convertedValue = Boolean(value);
  } else if (isDate(value)) {
    convertedValue = toDate(value);
  } else {
    convertedValue = value;
  }
  convertedValueType = typeof convertedValue;
  return {
    convertedValue,
    convertedValueType
  };
};
const handleSort = (a, b, sortOrder = 'asc', sortName = undefined) => {
  const {
    convertedValue: aValue,
    convertedValueType: aValueType
  } = tryToConvertValue(sortName
    ? a[sortName]
    : a);
  const {
    convertedValue: bValue,
    convertedValueType: bValueType
  } = tryToConvertValue(sortName
    ? b[sortName]
    : b);
  const result = sortOrder === 'asc'
    ? aValueType === 'number' && bValueType === 'number'
      ? bValue - aValue
      : aValue > bValue
        ? 1
        : aValue < bValue
          ? -1
          : 0
    : aValueType === 'number' && bValueType === 'number'
      ? aValue - bValue
      : bValue > aValue
        ? 1
        : bValue < aValue
          ? -1
          : 0;
  console.log(`${JSON.stringify({ sortName, sortOrder, aValue, aValueType, bValue, bValueType, result })}`);
  return result;
};
const sortArray = (array, sortName, sortOrder) => {
  console.log('array-before: ', JSON.stringify(array.map(item => `${sortName}: ${item[sortName]}`), null, 2));
  array.sort((a, b) => handleSort(a, b, sortOrder, sortName));
  console.log('array-after: ', JSON.stringify(array.map(item => `${sortName}: ${item[sortName]}`), null, 2));
};
const renderCaret = (direction, fieldName) => {
  let iconName;
  switch (direction) {
    case 'asc':
      iconName = 'fa-sort-up';
      break;
    case 'desc':
      iconName = 'fa-sort-down';
      break;
    default:
      iconName = 'fa-sort';
  }
  return (
    <i className={`react-bootstrap-table-caret ${fieldName} fas ${iconName}`} />
  );
};
const getImageUrl = (urlFormat, keyFormat, key, filenameFormat, fileName, fileNamePrefix = 'embedded_') => {
  const imageUrl = urlFormat
    .replace(keyFormat, key)
    .replace(filenameFormat, `${fileNamePrefix}${fileName}`);
  return imageUrl;
};
const uploadFileToStorage = async (file, firebase, imageUrl) => {
  await firebase.saveStorageFile(imageUrl, file);
  const imageDownloadUrl = await firebase.getStorageFileDownloadURL(imageUrl);
  const resolveValue = {
    data: {
      link: imageDownloadUrl
    }
  };
  return new Promise(resolve => {
    resolve(resolveValue);
  });
};
const srcPrefix = process.env.NODE_ENV !== 'production' || isBoolean(process.env.REACT_APP_DEBUG_MODE, true)
  ? `${process.env.REACT_APP_GOOGLE_BASE_CLOUD_FUNCTIONS_URL}/imageTransform`
  : process.env.REACT_APP_WEB_BASE_URL;
const getQParameter = (key, value) => (value && `${key}=${value}`) || '';
const getSrc = async (imageURL, width, height, lossless, noImageAvailable, getStorageFileDownloadURL) => {
  return imageURL
    ? imageURL.startsWith('/images/')
      ? isBoolean(process.env.REACT_APP_USE_IMAGE_CDN, true)
        ? `${srcPrefix}/cdn/image/?s=${encodeURIComponent(imageURL)}${getQParameter('&w', width)}${getQParameter('&h', height)}${getQParameter('&l', (Boolean(lossless) && 1) || undefined)}`
        : (typeof getStorageFileDownloadURL === 'function' && await getStorageFileDownloadURL(imageURL)) || imageURL
      : imageURL
    : noImageAvailable;
};

export default shallowCompare;
export {
  useWindowEvent,
  shallowEqual,
  isEmptyObject,
  handleLoadBlob,
  formatBytes,
  formatInteger,
  fromCamelcaseToTitlecase,
  DATE_MOMENT_FORMAT,
  TIME_MOMENT_FORMAT,
  DATE_TIME_MOMENT_FORMAT,
  ISO8601_DATE_FORMAT,
  keyCodes,
  isShiftPlusTab,
  isShiftSemiColon,
  isNumeric,
  isAlpha,
  handleKeyDown,
  handleKeyDownForDate,
  handleKeyDownForTime,
  TAG_SEPARATOR,
  isJson,
  stripHtml,
  draftToText,
  isNumber,
  isEmptyString,
  isNullOrEmpty,
  isTrueOrFalse,
  isBoolean,
  toMoment,
  isDate,
  toDate,
  toFormattedDateTime,
  toFormattedDate,
  tryToConvertValue,
  handleSort,
  sortArray,
  renderCaret,
  getImageUrl,
  uploadFileToStorage,
  getQParameter,
  getSrc
};
