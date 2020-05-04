import React, {useState, useEffect} from 'react';
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

const CommunityLinksSection = (props) => {

  const [communityLinks, setLinks] = useState([]);
  const [masterLinks, setMasterLinks] = useState([]);
  const [communityLinksDescription, setDescription] = useState([]);

  const searchLinks =  async e => {
    const link = e.target;
    
    const filterList = masterLinks.filter((searchLink) =>{
      return searchLink.linkName.toString().toLowerCase().indexOf(link.value.toString().toLowerCase()) > -1;
    });

    setLinks(filterList);
    
  }

  useEffect(() => {

    const getLinks = async () => {

     const communityLinksAsArray = await props.firebase.getDbCommunityLinksAsArray();
     
     return communityLinksAsArray;
      
    };

    const getSettings = async () =>{
      const communityLinksDescription = await props.firebase.getDbSettingsValues(true);
      return communityLinksDescription;
    }

    const getCommunityLinks = async () => {
      const getCommunityLinks = await getLinks();  
      setLinks(getCommunityLinks);

      if(masterLinks.length === 0){
        setMasterLinks(getCommunityLinks);
      }
    }

    const getDescription = async () => {
      const getDescription = await getSettings();
      setDescription(getDescription.communityLinksDescritpion);
    }


    getDescription();
    getCommunityLinks();

  }, [props, masterLinks]);

  return (
    <Container className="tkot-section" id="community-links">
      <Row>
        <Col>
          <div className="mx-auto text-center bg-warning">
            <h3>Community Links Section</h3>
          </div>
        </Col>
        <Col>
        <Form className="community-links-form col-md-6">
            <FormGroup>
              <Input placeholder="Search" name="serachLink" type="text" onChange={searchLinks} />
            </FormGroup>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
            <div className="mx-auto text-left">
            <p>{communityLinksDescription}</p>
            </div>
        </Col>
      </Row>
      <Row>
        <Col className="community-links">
          <Nav vertical>
              {
                communityLinks.map((item) => {
                    return (
                      <NavItem key={item.clid} className="links">
                        <NavLink href={item.link}>{item.linkName}</NavLink>
                      </NavItem>
                    );
                  })
              }
            </Nav>
        </Col>
      </Row>
    </Container>
  );
};

export default withFirebase(CommunityLinksSection);