import {
  useEffect
} from 'react';
import draftToHtml from 'draftjs-to-html';

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
const draftToText = (draftRaw, defaultValue = undefined) => {
  if (!isJson(draftRaw)) {
    return defaultValue !== undefined
      ? defaultValue
      : draftRaw;
  }
  const draftAsJson = JSON.parse(draftRaw);
  const draftAsHtml = draftToHtml(draftAsJson);
  const draftAsText = stripHtml(draftAsHtml);
  return draftAsText;
};
const defaultPageSetup = async init => {
  const {
    body
  } = document;
  const {
    classList: bodyClassNames
  } = body;
  const indexPageClassName = 'index-page';
  const sidebarCollapseClassName = 'sidebar-collapse';
  const tkotBackgroundImage = 'tkot-background-image';
  const navOpenClassName = 'nav-open';
  if (init) {
    bodyClassNames.add(indexPageClassName);
    bodyClassNames.add(sidebarCollapseClassName);
    bodyClassNames.add(tkotBackgroundImage);
    document.documentElement.classList.remove(navOpenClassName);
    window.scrollTo(0, 0);
    body.scrollTop = 0;
  // } else {
  //   bodyClassNames.remove(indexPageClassName);
  //   bodyClassNames.remove(sidebarCollapseClassName);
  }
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
  defaultPageSetup
};
