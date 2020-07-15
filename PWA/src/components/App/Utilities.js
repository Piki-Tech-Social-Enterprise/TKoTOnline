import {
  useEffect
} from 'react';

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
  TAG_SEPARATOR
};
