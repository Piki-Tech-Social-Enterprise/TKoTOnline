import {
  useEffect
} from 'react';
import draftToHtml from 'draftjs-to-html';
import moment from 'moment-mini';
import Routes from 'components/Routes/routes';

const useWindowEvent = (event, callback) => {
  useEffect(() => {
    window.addEventListener(event, callback);
    return () => window.removeEventListener(event, callback);
  }, [event, callback]);
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
    resources,
    resourcesPage,
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
    group: 'left'
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
    id: `resourcesNavItem${(!isHomePage && '_alt') || ''}`,
    route: isHomePage ? resources : resourcesPage,
    name: 'Resources',
    tooltip: 'Rauemi Ipurangi',
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
const getFirstCharacters = (value, length, excludeEllipse = false) => {
  return value && value.length > length
    ? `${value.substring(0, length - (excludeEllipse ? 0 : 3))}${!excludeEllipse && '...'}`
    : value;
};

export {
  useWindowEvent,
  intoChunks,
  DATE_MOMENT_FORMAT,
  TIME_MOMENT_FORMAT,
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
  handleSort,
  sortArray,
  getNavItems,
  srcPrefix,
  getQParameter,
  getSrc,
  getFirstCharacters
};
