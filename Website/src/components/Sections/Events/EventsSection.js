import React, {
  useState,
  useEffect
} from 'react';
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
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
  const handleSearchEvents = async e => {
    e.preventDefault();
    const {
      target: eventURL
    } = e;
    const {
      masterEvents
    } = state;
    const filterList = masterEvents.filter(searchEvent =>
      searchEvent.eventName.toString().toLowerCase().indexOf(eventURL.value.toString().toLowerCase()) > -1);
    setState(s => ({
      ...s,
      events: filterList
    }));
  };
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
    <Container id="Events" className="tkot-section bg-secondary1">
      <Row>
        <Col xs={12} sm={8}>
          <h3>Events</h3>
        </Col>
        <Col xs={12} sm={4}>
          <Form className="events-form">
            <FormGroup>
              <Input placeholder="Search" type="text" onChange={handleSearchEvents} />
            </FormGroup>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>{state.eventsDescription}</p>
        </Col>
      </Row>
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
  );
};

export default withFirebase(EventsSection);
