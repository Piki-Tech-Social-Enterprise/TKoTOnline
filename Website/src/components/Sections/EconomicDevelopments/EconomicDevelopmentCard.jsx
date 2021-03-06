import React, {
  useState,
  useEffect
} from 'react';
import PropTypes from 'prop-types';

import {
  handleBlockTextClick
} from 'components/App/Utilities';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const Button = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-button' */'reactstrap/es/Button'));
const Card = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-card' */'reactstrap/es/Card'));
const CardBody = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-cardbody' */'reactstrap/es/CardBody'));
const CardTitle = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-cardtitle' */'reactstrap/es/CardTitle'));
const CardHeader = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'reactstrap-cardheader' */'reactstrap/es/CardHeader'));
const FirebaseImage = lazy(async () => await import(/* webpackPrefetch: true, webpackChunkName: 'app-firebase-image' */'components/App/FirebaseImage'));
const INITIAL_STATE = {
  isLoading: true,
  contentAsHtml: ''
};
const EconomicDevelopmentCard = props => {
  const [state, setState] = useState(INITIAL_STATE);
  const {
    isLoading,
    contentAsHtml
  } = state;
  const {
    dbEconomicDevelopment,
    onButtonClick
  } = props;
  const {
    header,
    imageUrl,
    economicDevelopmentUrl,
    economicDevelopmentDownloadUrl
  } = dbEconomicDevelopment;
  useEffect(() => {
    const retrieveData = async () => {
      const {
        dbEconomicDevelopment
      } = props;
      const {
        content
      } = dbEconomicDevelopment;
      const {
        default: draftToHtml
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'draftjs-to-html' */'draftjs-to-html');
      const contentAsHtml = draftToHtml(JSON.parse(content || '{}'));
      setState(s => ({
        ...s,
        isLoading: false,
        contentAsHtml
      }));
    };
    if (isLoading) {
      retrieveData();
    }
    return () => { }
  }, [props, isLoading]);
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
            dangerouslySetInnerHTML={{ __html: contentAsHtml }}
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
