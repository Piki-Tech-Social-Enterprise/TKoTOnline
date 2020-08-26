import React, {
  useState,
  useEffect
} from 'react';
import {
  UncontrolledTooltip
} from 'reactstrap';

const Tooltips = props => {
  const {
    items
  } = props;
  const [state, setState] = useState({
    isLoading: true
  });
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
  const {
    isLoading
  } = state;
  useEffect(() => {
    if (state.isLoading) {
      setState(s => ({
        ...s,
        isLoading: false
      }));
    }
    return () => { };
  }, [props, state]);
  return (
    <>
      {
        isLoading
          ? null
          : <>
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
      }
    </>
  );
};

export default Tooltips;
