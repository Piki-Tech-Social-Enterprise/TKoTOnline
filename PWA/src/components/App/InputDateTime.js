import React from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from 'reactstrap';
import PropTypes from 'prop-types';
import {
  DATE_MOMENT_FORMAT,
  handleKeyDownForDate
} from 'components/App/Utilities';
import Datetime from 'react-datetime';

const InputDateTime = props => {
  const {
    dateFormat,
    timeFormat,
    inputProps,
    value,
    closeOnSelect,
    onChange
  } = props;
  const {
    className,
    onKeyDown
  } = inputProps;
  return (
    <Datetime
      dateFormat={dateFormat}
      timeFormat={timeFormat}
      inputProps={{
        ...inputProps,
        className: className || 'form-control',
        onKeyDown: onKeyDown || handleKeyDownForDate
      }}
      value={value}
      closeOnSelect={closeOnSelect}
      onChange={onChange}
      renderInput={(props, openCalendar) => {
        return (
          <InputGroup>
            <input {...props} />
            <InputGroupAddon addonType="append" onClick={openCalendar}>
              <InputGroupText>
                <i className="now-ui-icons ui-1_calendar-60" />
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        );
      }}
    />
  );
};

InputDateTime.propTypes = {
  dateFormat: PropTypes.string,
  timeFormat: PropTypes.string,
  inputProps: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  closeOnSelect: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};
InputDateTime.defaultProps = {
  dateFormat: DATE_MOMENT_FORMAT,
  timeFormat: null,
  closeOnSelect: true
};

export default InputDateTime;
