import React, {
  useState,
  useEffect
} from 'react';
import {
  Container,
  Row,
  Col,
  Button
} from 'reactstrap';
import {
  withFirebase
} from 'components/Firebase';
import LoadingSpinner from 'components/App/LoadingSpinner';
import FirebaseImage from 'components/App/FirebaseImage';

const SolutionsSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    solutions: [],
    columnCount: 4,
    masterSolutions: [],
    solutionsDescription: ''
  });
  const SolutionElement = props => {
    const {
      imageURL,
      name
    } = props;
    return (
      <>
        <FirebaseImage className="solution-image m-3" imageURL={imageURL} alt={name} />
        <h5>{name}</h5>
      </>
    );
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
    <Container className="tkot-section bg-secondary1">
      <a id="Projects" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
      <Row>
        <Col className="text-uppercase text-center">
          <h3>Our Projects &amp; Initiatives</h3>
        </Col>
      </Row>
      {
        state.solutionsDescription
          ? <Row>
            <Col>
              <p>{state.solutionsDescription}</p>
            </Col>
          </Row>
          : null
      }
      <Row>
        <Col>
          <Row>
            {
              state.isLoading
                ? <LoadingSpinner />
                : state.solutions.map(solution => {
                  const {
                    slid,
                    solutionImageURL,
                    solutionName,
                    solutionURL
                  } = solution;
                  return (
                    <Col xs={12} sm={4} key={slid} className="text-uppercase text-center">
                      {
                        solutionURL
                          ? <a href={solutionURL} className="text-dark text-decoration-none" target="_blank" rel="noopener noreferrer">
                            <SolutionElement imageURL={solutionImageURL} name={solutionName} />
                          </a>
                          : <SolutionElement imageURL={solutionImageURL} name={solutionName} />
                      }
                    </Col>
                  );
                })
            }
          </Row>
          <div className="mb-5 text-center">
            <Button href="/Projects" outline color='dark' style={{
              color: 'inherit'
            }}>
              Learn more...
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default withFirebase(SolutionsSection);
