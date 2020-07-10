import React, {
  useState,
  useEffect
} from 'react';
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import {
  withFirebase
} from 'components/Firebase';
import LoadingSpinner from 'components/App/LoadingSpinner';
import {
  intoChunks
} from 'components/App/Utilities';

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
const getEventsMegaMenuItems = (events, columnCount) => {
  const eventsMegaMenuItems = {};
  const chunks = intoChunks(events, getChunkSize(events, columnCount));
  chunks.map((chunk, index) => {
    eventsMegaMenuItems[`column${index + 1}Items`] = chunk;
    return null;
  });
  return eventsMegaMenuItems;
};
const EventsMegaMenuColumn = props => {
  const {
    columnItems
  } = props;
  return (
    <Col>
      <Nav vertical>
        {
          columnItems.map(columnItem => {
            const {
              evid,
              eventURL,
              eventName
            } = columnItem;
            return (
              <NavItem key={evid} className="events px-0 pb-0 bg-light1">
                <NavLink href={eventURL} className="px-0 text-dark bg-info1" target="_blank" rel="noopener noreferrer">{eventName}</NavLink>
              </NavItem>
            );
          })
        }
      </Nav>
    </Col>
  );
};
const EventsMegaMenu = props => {
  const {
    eventsMegaMenuItems
  } = props;
  return (
    <Row>
      {
        Object.keys(eventsMegaMenuItems).map(key => {
          const columnItems = eventsMegaMenuItems[key];
          return columnItems.length
            ? <EventsMegaMenuColumn columnItems={columnItems} key={key} />
            : null
        })
      }
    </Row>
  );
};
const EventsSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    events: [],
    columnCount: 4,
    masterEvents: [],
    eventsDescription: ''
  });
  useEffect(() => {
    const {
      isLoading,
      masterEvents
    } = state;
    const getData = async () => {
      const {
        firebase
      } = props;
      const dbEvents = await firebase.getDbEventsAsArray();
      const dbSettingsValues = await firebase.getDbSettingsValues(true);
      // debugger;
      setState(s => ({
        ...s,
        isLoading: false,
        events: dbEvents,
        masterEvents: masterEvents.length
          ? masterEvents
          : dbEvents,
        eventsDescription: ((dbSettingsValues && dbSettingsValues.eventsDescription) || '')
      }));
    };
    if (isLoading) {
      getData();
    }
  }, [props, state]);
  return (
    <div className="tkot-section bg-secondary1 tkot-primary-blue-bg-color-50-pc">
      <Container>
        <a id="Wananga" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
        <Row>
          <Col className="text-uppercase text-center">
            <h3>Upcoming Wānanga &amp; Events</h3>
          </Col>
        </Row>
        {
          state.eventsDescription
            ? <Row>
              <Col>
                <p>{state.eventsDescription}</p>
              </Col>
            </Row>
            : null
        }
        <Row>
          <Col>
            {
              state.isLoading
                ? <LoadingSpinner />
                : <EventsMegaMenu eventsMegaMenuItems={getEventsMegaMenuItems(state.events, state.columnCount)} />
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default withFirebase(EventsSection);
