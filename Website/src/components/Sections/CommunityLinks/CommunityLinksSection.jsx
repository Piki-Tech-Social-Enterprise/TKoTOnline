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
const LoadingSpinner = lazy(async () => await import('components/App/LoadingSpinner'));
import {
  intoChunks
} from 'components/App/Utilities';

const getCommunityLinksMegaMenuItems = (communityLinks, columnCount) => {
  const communityLinksMegaMenuItems = {};
  const chunks = intoChunks(communityLinks, columnCount);
  chunks.map((chunk, index) => {
    communityLinksMegaMenuItems[`column${index + 1}Items`] = chunk;
    return null;
  });
  return communityLinksMegaMenuItems;
};
const CommunityLinksMegaMenuColumn = props => {
  const {
    columnItems
  } = props;
  return (
    <Col>
      <Nav vertical>
        {
          columnItems.map(columnItem => {
            const {
              clid,
              link,
              linkName
            } = columnItem;
            return (
              <NavItem key={clid} className="links px-0 pb-0 bg-light1">
                <NavLink href={link} className="px-0 text-dark bg-info1" target="_blank" rel="noopener noreferrer">{linkName}</NavLink>
              </NavItem>
            );
          })
        }
      </Nav>
    </Col>
  );
};
const CommunityLinksMegaMenu = props => {
  const {
    communityLinksMegaMenuItems
  } = props;
  return (
    <Row>
      {
        Object.keys(communityLinksMegaMenuItems).map(key => {
          const columnItems = communityLinksMegaMenuItems[key];
          return columnItems.length
            ? <CommunityLinksMegaMenuColumn columnItems={columnItems} key={key} />
            : null
        })
      }
    </Row>
  );
};
const CommunityLinksSection = props => {
  const [state, setState] = useState({
    isLoading: true,
    communityLinks: [],
    columnCount: 4,
    masterLinks: [],
    communityLinksDescription: ''
  });
  const handleSearchLinks = async e => {
    e.preventDefault();
    const {
      target: link
    } = e;
    const {
      masterLinks
    } = state;
    const filterList = masterLinks.filter(searchLink =>
      searchLink.linkName.toString().toLowerCase().indexOf(link.value.toString().toLowerCase()) > -1);
    setState(s => ({
      ...s,
      communityLinks: filterList
    }));
  };
  useEffect(() => {
    const {
      isLoading,
      masterLinks
    } = state;
    const getData = async () => {
      const {
        firebase
      } = props;
      const dbCommunityLinks = await firebase.getDbCommunityLinksAsArray();
      const dbSettingsValues = await firebase.getDbSettingsValues(true);
      // debugger;
      setState(s => ({
        ...s,
        isLoading: false,
        communityLinks: dbCommunityLinks,
        masterLinks: masterLinks.length
          ? masterLinks
          : dbCommunityLinks,
        communityLinksDescription: ((dbSettingsValues && dbSettingsValues.communityLinksDescription) || '')
      }));
    };
    if (isLoading) {
      getData();
    }
  }, [props, state]);
  return (
    <Container id="CommunityLinks" className="tkot-section bg-secondary1">
      <Row>
        <Col xs={12} sm={8}>
          <h3>Community Links</h3>
        </Col>
        <Col xs={12} sm={4}>
          <Form className="community-links-form">
            <FormGroup>
              <Input placeholder="Search" type="text" onChange={handleSearchLinks} />
            </FormGroup>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
          <p>{state.communityLinksDescription}</p>
        </Col>
      </Row>
      <Row>
        <Col>
          {
            state.isLoading
              ? <LoadingSpinner />
              : <CommunityLinksMegaMenu communityLinksMegaMenuItems={getCommunityLinksMegaMenuItems(state.communityLinks, state.columnCount)} />
          }
        </Col>
      </Row>
    </Container>
  );
};

export default withFirebase(CommunityLinksSection);
