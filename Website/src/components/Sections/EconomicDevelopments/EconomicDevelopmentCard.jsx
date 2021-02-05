import React from 'react';
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
import {
  lazy
} from 'react-lazy-no-flicker';

const FirebaseImage = lazy(async () => await import('components/App/FirebaseImage'));
const EconomicDevelopmentCard = props => {
  const {
    dbEconomicDevelopment,
    onButtonClick
  } = props;
  const {
    header,
    imageUrl,
    content,
    economicDevelopmentUrl,
    economicDevelopmentDownloadUrl
  } = dbEconomicDevelopment;
  return (
    <>
      <Card className="card-block economicDevelopment-card">
        <CardHeader>
          <CardTitle
            className="h5 text-uppercase my-3 mx-2 economicDevelopment-header clickable header-with-text"
            onClick={async e => await handleBlockTextClick(e, 'div.economicDevelopment-header', 'header-with-text')}
          >{header}</CardTitle>
        </CardHeader>
        {
          imageUrl
            ? <FirebaseImage
              className="card-img-max-height"
              imageURL={imageUrl}
              width="340"
              lossless={true}
              alt={header}
              loadingIconSize="lg"
              imageResize="md"
            />
            : null
        }
        <CardBody className="bg-white text-dark text-left">
          <div
            className="economicDevelopment-content clickable block-with-text"
            dangerouslySetInnerHTML={{ __html: draftToHtml(JSON.parse(content || '{}')) }}
            onClick={async e => await handleBlockTextClick(e, 'div.economicDevelopment-content', 'block-with-text')}
          />
          <div className="text-center mt-3">
            <Button
              download={economicDevelopmentUrl.split('/').pop()}
              href={economicDevelopmentDownloadUrl}
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

EconomicDevelopmentCard.propTypes = {
  dbEconomicDevelopment: PropTypes.object,
  onButtonClick: PropTypes.func
};

export default EconomicDevelopmentCard;
