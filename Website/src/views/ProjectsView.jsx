import React, {
  useEffect,
  useState
} from 'react';
import {
  Container,
  Row,
  Col
} from 'reactstrap';
import HomeNavbar from 'components/Navbars/HomeNavbar';
import HomeFooter from 'components/Footers/HomeFooter';
import {
  withFirebase
} from 'components/Firebase';
import LoadingSpinner from 'components/App/LoadingSpinner';
import FirebaseImage from 'components/App/FirebaseImage';

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
const Solution = props => {
  const {
    dbSolution
  } = props;
  const {
    slid,
    solutionImageURL,
    solutionName,
    solutionURL
  } = dbSolution;
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
};
const ProjectsView = props => {
  const [state, setState] = useState({
    isLoading: true,
    dbSolutions: []
  });
  useEffect(() => {
    const retrieveProjectValues = async () => {
      const {
        firebase
      } = props;
      const dbSolutionsAsArray = await firebase.getDbSolutionsAsArray();
      setState(s => ({
        ...s,
        isLoading: false,
        dbSolutions: dbSolutionsAsArray
      }));
    }
    if (state.isLoading) {
      retrieveProjectValues();
    }
  }, [props, state]);
  return (
    <>
      <HomeNavbar />
      <Container className="p-5 mt-5">
        <Row>
          <Col className="px-0 mt-5 text-uppercase text-center">
            <h3>Our Projects &amp; Initiatives</h3>
            <Row>
              {
                state.isLoading
                  ? <LoadingSpinner outerClassName="ignore" innerClassName="ignore" />
                  : state.dbSolutions.map((dbSolution, index) => <Solution dbSolution={dbSolution} key={index} />)
              }
            </Row>
          </Col>
        </Row>
      </Container>
      <HomeFooter />
    </>
  );
};

export default withFirebase(ProjectsView);
