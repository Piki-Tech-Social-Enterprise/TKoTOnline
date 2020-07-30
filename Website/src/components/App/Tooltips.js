import React from 'react';
import {
  UncontrolledTooltip
} from 'reactstrap';

const Tooltips = props => {
  const {
    items
  } = props;
  const Tooltip = props => {
    const {
      id,
      text
    } = props;
    // console.log('text: ', text);
    return (
      <UncontrolledTooltip
        innerClassName="tkot-secondary-color-black-bg-color text-light text-uppercase"
        placement="top"
        target={`${id}`}
      >{text}</UncontrolledTooltip>
    );
  };
  return (
    <>
      {
        items.map((item, index) => {
          const {
            id,
            tooltip
          } = item;
          return (
            <Tooltip
              id={id}
              text={tooltip}
              key={index}
            />);
        })
      }
    </>
  );
};

export default Tooltips;
