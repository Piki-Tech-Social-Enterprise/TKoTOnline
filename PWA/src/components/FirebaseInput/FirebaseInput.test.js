import React from 'react';
import {
  MemoryRouter
} from 'react-router-dom';
import {
  shallow
} from 'enzyme';
import {
  withAuthorization
} from '../../components/Firebase';
import FirebaseInput from './FirebaseInput';

const firebaseInputImage = require('./firebase-input-image.jpg');
const isAuthorized = true,
  isNotAuthorized = false,
  handleFirebaseInputOnChange = () => {
  },
  handleDownloadURLFileInputOnChange = () => {
  },
  downloadURLFormatKeyName = '{duid}',
  downloadURLFormatKeyValue = '1',
  downloadURLFormatFileName = '{filename}',
  downloadURLFormat = `/images/downloadURLs/${downloadURLFormatKeyName}/${downloadURLFormatFileName}`,
  WithAuthorizationComponent = ({ condition, options }) => {
    // debugger;
    return (
      withAuthorization(condition)(
        <MemoryRouter>
          <FirebaseInput
            value={options.value}
            onChange={options.onChange}
            downloadURLFileInputOnChange={options.downloadURLFileInputOnChange}
            downloadURLFormat={options.downloadURLFormat}
            downloadURLFormatKeyName={options.downloadURLFormatKeyName}
            downloadURLFormatKeyValue={options.downloadURLFormatKeyValue}
            downloadURLFormatFileName={options.downloadURLFormatFileName}
          />
        </MemoryRouter>
      )
    );
  };

  describe('Firebase Input', () => {
    it('renders without crashing', () => {
      const wrapper = shallow(
        <WithAuthorizationComponent
          condition={isAuthorized}
          options={{
            value: firebaseInputImage,
            onChange: handleFirebaseInputOnChange,
            downloadURLFileInputOnChange: handleDownloadURLFileInputOnChange,
            downloadURLFormat: downloadURLFormat,
            downloadURLFormatKeyName: downloadURLFormatKeyName,
            downloadURLFormatKeyValue: downloadURLFormatKeyValue,
            downloadURLFormatFileName: downloadURLFormatFileName
          }}
        />
      );
      expect(wrapper.html()).not.toBe(null || '');
    });

    it('un-authorized', () => {
      const wrapper = shallow(
        <WithAuthorizationComponent
          condition={isNotAuthorized}
          options={{
            value: firebaseInputImage,
            onChange: handleFirebaseInputOnChange,
            downloadURLFileInputOnChange: handleDownloadURLFileInputOnChange,
            downloadURLFormat: downloadURLFormat,
            downloadURLFormatKeyName: downloadURLFormatKeyName,
            downloadURLFormatKeyValue: downloadURLFormatKeyValue,
            downloadURLFormatFileName: downloadURLFormatFileName,
          }}
        />
      ),
        webAppAccessDenied = 'Web App Access Denied!';
      // debugger;
      expect(wrapper.contains(webAppAccessDenied)).toBe(true);
    });
  });
