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
const getSolutionsMegaMenuItems = (solutions, columnCount) => {
  const solutionsMegaMenuItems = {};
  const chunks = intoChunks(solutions, getChunkSize(solutions, columnCount));
  chunks.map((chunk, index) => {
    solutionsMegaMenuItems[`column${index + 1}Items`] = chunk;
    return null;
  });
  return solutionsMegaMenuItems;
};
const SolutionsMegaMenuColumn = props => {
  const {
    columnItems
  } = props;
  return (
    <Col>
      <Nav vertical>
        {
          columnItems.map(columnItem => {
            const {
              slid,
              solutionURL,
              solutionName
            } = columnItem;
            return (
              <NavItem key={slid} className="solutions px-0 pb-0 bg-light1">
                <NavLink href={solutionURL} className="px-0 text-dark bg-info1" target="_blank" rel="noopener noreferrer">{solutionName}</NavLink>
              </NavItem>
            );
          })
        }
      </Nav>
    </Col>
  );
};
const SolutionsMegaMenu = props => {
  const {
    solutionsMegaMenuItems
  } = props;
  return (
    <Row>
      {
        Object.keys(solutionsMegaMenuItems).map(key => {
          const columnItems = solutionsMegaMenuItems[key];
          return columnItems.length
            ? <SolutionsMegaMenuColumn columnItems={columnItems} key={key} />
            : null
        })
      }
    </Row>
  );
};
const SolutionsSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    solutions: [],
    columnCount: 4,
    masterSolutions: [],
    solutionsDescription: ''
  });
  const handleSearchSolutions = async e => {
    e.prsolutionDefault();
    const {
      target: solutionURL
    } = e;
    const {
      masterSolutions
    } = state;
    const filterList = masterSolutions.filter(searchSolution =>
      searchSolution.solutionName.toString().toLowerCase().indexOf(solutionURL.value.toString().toLowerCase()) > -1);
    setState(s => ({
      ...s,
      solutions: filterList
    }));
  };
  useEffect(() => {
    const {
      isLoading,
      masterSolutions
    } = state;
    const getData = async () => {
      const {
        firebase
      } = props;
      const dbSolutions = await firebase.getDbSolutionsAsArray();
      const dbSettingsValues = await firebase.getDbSettingsValues(true);
      // debugger;
      setState(s => ({
        ...s,
        isLoading: false,
        solutions: dbSolutions,
        masterSolutions: masterSolutions.length
          ? masterSolutions
          : dbSolutions,
        solutionsDescription: ((dbSettingsValues && dbSettingsValues.solutionsDescription) || '')
      }));
    };
    if (isLoading) {
      getData();
    }
  }, [props, state]);
  return (
    <Container id="Solutions" className="tkot-section bg-secondary1">
      <Row>
        <Col xs={12} sm={8}>
          <h3>Solutions</h3>
        </Col>
        <Col xs={12} sm={4}>
          <Form className="solutions-form">
            <FormGroup>
              <Input placeholder="Search" type="text" onChange={handleSearchSolutions} />
            </FormGroup>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>{state.solutionsDescription}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          {
            state.isLoading
              ? <LoadingSpinner />
              : <SolutionsMegaMenu solutionsMegaMenuItems={getSolutionsMegaMenuItems(state.solutions, state.columnCount)} />
          }
        </Col>
      </Row>
    </Container>
  );
};

export default withFirebase(SolutionsSection);
