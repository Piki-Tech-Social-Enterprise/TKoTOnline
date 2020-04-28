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

const CommunityLinksSection = () => {

  const [communityLinks, setLinks] = useState([]);

  const createCommunityLinkItems = communityLinks.map((item) => {
    return (
      <NavItem key={item.key}>
        <NavLink href={item.href}>{item.title}</NavLink>
      </NavItem>
    );
  });

  useEffect(() => {

    const createLinks = (href, text, index) => {
      return {
        href: href,
        title: text,
        key: index
      }
    };

    const getLinks = (count) => {

      const communityLinks = [];

      for(let i = 0; i < count; i++){
        communityLinks.push(createLinks('#NewsFeed', 'Link title ' + (i +1) , i));
      }
      return communityLinks;
      
    };

    const getCommunityLinks = async () => {
      const getCommunityLinks = getLinks(12);   
      setLinks(getCommunityLinks);
    }


    getCommunityLinks();

  }, []);

  return (
    <Container className="tkot-section" id="Community-links">
      <Row>
        <Col>
          <div className="mx-auto text-center bg-warning">
            <h3>Community links section</h3>
          </div>
        </Col>
        <Col>
        <Form className="community-links-form col-md-6">
            <FormGroup>
              <Input placeholder="Search" type="text" />
            </FormGroup>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col>
            <div className="mx-auto text-left">
                <p> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</p>
            </div>
        </Col>
      </Row>
      <Row>
        <Col className="community-links">
          <Nav vertical>
              {createCommunityLinkItems}
            </Nav>
        </Col>
      </Row>
    </Container>
  );
};

export default CommunityLinksSection;