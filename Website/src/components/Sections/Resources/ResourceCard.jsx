import React, {
  lazy
} from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardHeader
} from 'reactstrap';
import draftToHtml from 'draftjs-to-html';
import {
  handleBlockTextClick
} from 'components/App/Utilities';

const FirebaseImage = lazy(async () => await import('components/App/FirebaseImage'));
const ResourceCard = props => {
  const {
    dbResource,
    onButtonClick
  } = props;
  return (
    <>
      <Card className="card-block resource-card">
        <CardHeader>
          <CardTitle
            className="h5 text-uppercase my-3 mx-2 resource-header clickable header-with-text"
            onClick={async e => await handleBlockTextClick(e, 'div.resource-header', 'header-with-text')}
          >{dbResource.header}</CardTitle>
        </CardHeader>
        {
          dbResource.imageUrl
            ? <FirebaseImage
              className="card-img-max-height"
              imageURL={dbResource.imageUrl}
              width="340"
              lossless={true}
              alt={dbResource.header}
              loadingIconSize="lg"
              imageResize="md"
            />
            : null
        }
        <CardBody className="bg-white text-dark text-left">
          <div
            className="resource-content clickable block-with-text"
            dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(dbResource.content || '{}')) }}
            onClick={async e => await handleBlockTextClick(e, 'div.resource-content', 'block-with-text')}
          />
          <div className="text-center mt-3">
            <Button
              download={dbResource.resourceUrl.split('/').pop()}
              href={dbResource.resourceDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="tkot-primary-red-bg-color btn-outline-dark"
              color="white"
              onClick={onButtonClick}
            >Pā Mai</Button>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

ResourceCard.propTypes = {
  dbResource: PropTypes.object,
  onButtonClick: PropTypes.func
};

export default ResourceCard;
