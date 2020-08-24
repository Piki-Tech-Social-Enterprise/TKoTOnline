import {
  useEffect
} from 'react';
import draftToHtml from 'draftjs-to-html';
import moment from 'moment';
import Routes from 'components/Routes/routes';

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
const getChunkSize = (array, columnCount) => {
  const {
    length: arrayLength
  } = array;
  const arrayLengthRemainder = arrayLength % columnCount;
  const arrayChunk = arrayLength - arrayLengthRemainder;
  const initalSize = arrayChunk / columnCount;
  const twoColumn = 2;
  const twoColumnRemainder = (arrayLengthRemainder % twoColumn);
  const offset = twoColumnRemainder === 0
    ? arrayLengthRemainder / twoColumn
    : (arrayLengthRemainder - twoColumnRemainder) / twoColumn;
  const chunkSize = initalSize + (arrayLengthRemainder <= 1
    ? arrayLengthRemainder
    : offset);
  return chunkSize;
};
const intoChunks = (array, size) => {
  let chunks = [];
  const arrayClone = [].concat(array);
  while (arrayClone.length) {
    chunks.push(arrayClone.splice(0, size));
  }
  return chunks;
};
const DATE_MOMENT_FORMAT = 'DD/MM/YYYY';
const TIME_MOMENT_FORMAT = 'HH:mm:ss';
const DATE_TIME_MOMENT_FORMAT = `${DATE_MOMENT_FORMAT} ${TIME_MOMENT_FORMAT}`;
const ISO8601_DATE_FORMAT = 'YYYY-MM-DD';
const NEWSFEED_DATE_MOMENT_FORMAT = 'DD MMM, YYYY';
const TAG_SEPARATOR = ', ';
const isJson = value => {
  return (value && (
    (value.startsWith('{') && value.endsWith('}')) ||
    (value.startsWith('[') && value.endsWith(']'))
  )
  );
};
const stripHtml = html => html.replace(/(<([^>]+)>)/ig, '');
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
const indexPageClassName = 'index-page';
const sidebarCollapseClassName = 'sidebar-collapse';
const tkotBackgroundImage = 'tkot-background-image';
const defaultInit = {
  isLoading: false,
  classNames: [
    indexPageClassName,
    sidebarCollapseClassName,
    tkotBackgroundImage
  ]
};
const defaultPageSetup = async (init = defaultInit) => {
  const {
    body
  } = document;
  const {
    classList: bodyClassNames
  } = body;
  const navOpenClassName = 'nav-open';
  const initIsBoolean = isBoolean(init, true);
  const {
    isLoading,
    classNames
  } = initIsBoolean
      ? defaultInit
      : init;
  if (isLoading || initIsBoolean) {
    classNames && classNames.map(className => bodyClassNames.add(className));
    document.documentElement.classList.remove(navOpenClassName);
    window.scrollTo(0, 0);
    body.scrollTop = 0;
    // } else {
    //   bodyClassNames.remove(indexPageClassName);
    //   bodyClassNames.remove(sidebarCollapseClassName);
  }
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
const isDate = value => value && moment(value.toString(), DATE_MOMENT_FORMAT).isValid();
const toDate = value => value && moment(value.toString(), DATE_MOMENT_FORMAT).toDate();
const tryToConvertValue = value => {
  let convertedValue = undefined;
  // let valueType = undefined;
  if (isNumber(value)) {
    // valueType = 'number';
    convertedValue = Number(value);
  } else if (isBoolean(value)) {
    // valueType = 'boolean';
    convertedValue = Boolean(value);
  } else if (isDate(value)) {
    // valueType = 'date';
    convertedValue = toDate(value);
  } else {
    // valueType = 'unknown';
    convertedValue = value;
  }
  // console.log(`value: ${value}, valueType: ${valueType}, convertedValue: ${convertedValue}`);
  return convertedValue;
};
const sortArray = (array, sortName, sortOrder) => {
  console.log('array-before: ', JSON.stringify(array.map(item => `${sortName}: ${item[sortName]}`), null, 2));
  array.sort((a, b) => {
    const aValue = tryToConvertValue(a[sortName]);
    const bValue = tryToConvertValue(b[sortName]);
    const result = sortOrder === 'asc'
      ? bValue - aValue
      : aValue - bValue;
    console.log(`sortName: ${sortName}, sortOrder: ${sortOrder}, aValue: ${aValue}, bValue: ${bValue}, result: ${result}`);
    // sortName: date, sortOrder: desc, aValue: Tue Apr 07 2020, bValue: Mon Apr 06 2020, result: -1
    return result;
  });
  console.log('array-after: ', JSON.stringify(array.map(item => `${sortName}: ${item[sortName]}`), null, 2));
};
const getNavItems = isHomePage => {
  const {
    home,
    homePage,
    iwiMembers,
    // about,
    aboutUs,
    newsFeed,
    newsFeeds,
    events,
    eventsPage,
    projects,
    projectsPage,
    contactUs
  } = Routes;
  const navItems = [{
    id: `homeNavItem${(!isHomePage && '_alt') || ''}`,
    route: isHomePage ? home : homePage,
    name: 'Home',
    tooltip: 'Kāinga',
    group: 'left'
  }, {
    id: `iwiMembersNavItem${(!isHomePage && '_alt') || ''}`,
    route: iwiMembers,
    name: 'Iwi',
    tooltip: 'Iwi',
    group: 'left'
  }, {
    id: `aboutNavItem${(!isHomePage && '_alt') || ''}`,
    route: aboutUs,
    name: 'About',
    tooltip: 'Ko wai mātau',
    group: 'left'
  }, {
    id: `projectsNavItem${(!isHomePage && '_alt') || ''}`,
    route: isHomePage ? projects : projectsPage,
    name: 'Projects',
    tooltip: 'Kaupapa',
    group: 'right'
  }, {
    id: `eventsNavItem${(!isHomePage && '_alt') || ''}`,
    route: isHomePage ? events : eventsPage,
    name: 'Wānanga',
    tooltip: 'Wānanga',
    group: 'right'
  }, {
    id: `newsFeedNavItem${(!isHomePage && '_alt') || ''}`,
    route: isHomePage ? newsFeed : newsFeeds,
    name: 'News',
    tooltip: 'He Karere',
    group: 'right'
  }, {
    id: `contactUsNavItem${(!isHomePage && '_alt') || ''}`,
    route: contactUs,
    name: 'Contact',
    tooltip: 'Hono Mai',
    group: ''
  }];
  return navItems;
};
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const srcPrefix = process.env.NODE_ENV !== 'production' || isBoolean(process.env.REACT_APP_DEBUG_MODE, true)
  ? `${process.env.REACT_APP_GOOGLE_BASE_CLOUD_FUNCTIONS_URL}/imageTransform`
  : process.env.REACT_APP_WEB_BASE_URL;
const getQParameter = (key, value) => (value && `${key}=${value}`) || '';
const getSrc = async (imageURL, width, height, lossless, noImageAvailable, getStorageFileDownloadURL) => {
  const {
    // NODE_ENV,
    // REACT_APP_DEBUG_MODE,
    REACT_APP_USE_IMAGE_CDN
  } = process.env;
  // console.group('getSrc');
  // console.log('VARS: ', { NODE_ENV, REACT_APP_DEBUG_MODE, REACT_APP_USE_IMAGE_CDN, srcPrefix, imageURL });
  // const value = REACT_APP_USE_IMAGE_CDN;
  // const expectedValue = true;
  // console.log({
  //   'isBoolean(REACT_APP_USE_IMAGE_CDN, true)': {
  //     'value': value,
  //     'expectedValue': expectedValue,
  //     'result': isBoolean(REACT_APP_USE_IMAGE_CDN, true),
  //     '!isNullOrEmpty(value)': !isNullOrEmpty(value),
  //     '(typeof value === \'boolean\' || isTrueOrFalse(value))': {
  //       'result': (typeof value === 'boolean' || isTrueOrFalse(value)),
  //       'typeof value === \'boolean\'': typeof value === 'boolean',
  //       'isTrueOrFalse(value)': isTrueOrFalse(value)
  //     },
  //     '(isNullOrEmpty(expectedValue) || value.toString().toLowerCase() === expectedValue)': {
  //       'result': (isNullOrEmpty(expectedValue) || value.toString().toLowerCase() === expectedValue.toString().toLowerCase()),
  //       'isNullOrEmpty(expectedValue)': isNullOrEmpty(expectedValue),
  //       'value.toString().toLowerCase() === expectedValue': value.toString().toLowerCase() === expectedValue.toString().toLowerCase()
  //     }
  //   }
  // });
  // console.groupEnd();
  return imageURL
    ? imageURL.startsWith('/images/')
      ? isBoolean(REACT_APP_USE_IMAGE_CDN, true)
        ? `${srcPrefix}/cdn/image/?s=${encodeURIComponent(imageURL)}${getQParameter('&w', width)}${getQParameter('&h', height)}${getQParameter('&l', (Boolean(lossless) && 1) || undefined)}`
        : (typeof getStorageFileDownloadURL === 'function' && await getStorageFileDownloadURL(imageURL)) || imageURL
      : imageURL
    : noImageAvailable;
};
const getFirstCharacters = (value, length, excludeEllipse = false) => {
  return value && value.length > length
    ? `${value.substring(0, length - (excludeEllipse ? 0 : 3))}${!excludeEllipse && '...'}`
    : value;
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
  getChunkSize,
  intoChunks,
  DATE_MOMENT_FORMAT,
  TIME_MOMENT_FORMAT,
  DATE_TIME_MOMENT_FORMAT,
  ISO8601_DATE_FORMAT,
  NEWSFEED_DATE_MOMENT_FORMAT,
  TAG_SEPARATOR,
  isJson,
  stripHtml,
  draftToText,
  indexPageClassName,
  sidebarCollapseClassName,
  tkotBackgroundImage,
  defaultPageSetup,
  isNumber,
  isEmptyString,
  isNullOrEmpty,
  isTrueOrFalse,
  isBoolean,
  isDate,
  toDate,
  tryToConvertValue,
  sortArray,
  getNavItems,
  sleep,
  srcPrefix,
  getQParameter,
  getSrc,
  getFirstCharacters
};
