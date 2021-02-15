import React, {
  useState,
  useEffect
} from 'react';
import PropTypes from 'prop-types';
// import {
//   Button,
//   Card,
//   CardBody,
//   CardTitle,
//   CardHeader
// } from 'reactstrap';
// import draftToHtml from 'draftjs-to-html';
import {
  handleBlockTextClick
} from 'components/App/Utilities';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const Button = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Button'));
const Card = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/Card'));
const CardBody = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/CardBody'));
const CardTitle = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/CardTitle'));
const CardHeader = lazy(async () => await import(/* webpackPrefetch: true */'reactstrap/es/CardHeader'));
const FirebaseImage = lazy(async () => await import(/* webpackPrefetch: true */'components/App/FirebaseImage'));
const INITIAL_STATE = {
  isLoading: true,
  contentAsHtml: ''
};
const ResourceCard = props => {
  const [state, setState] = useState(INITIAL_STATE);
  const {
    isLoading,
    contentAsHtml
  } = state;
  const {
    dbResource,
    onButtonClick
  } = props;
  const {
    header,
    imageUrl,
    resourceUrl,
    resourceDownloadUrl
  } = dbResource;
  useEffect(() => {
    const retrieveData = async () => {
      const {
        dbResource
      } = props;
      const {
        content
      } = dbResource;
      const {
        default: draftToHtml
      } = await import(/* webpackPrefetch: true */'draftjs-to-html');
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
      <Card className="card-block resource-card">
        <CardHeader>
          <CardTitle
            className="h5 text-uppercase my-3 mx-2 resource-header clickable header-with-text"
            onClick={async e => await handleBlockTextClick(e, 'div.resource-header', 'header-with-text')}
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
            className="resource-content clickable block-with-text"
            dangerouslySetInnerHTML={{ __html: contentAsHtml }}
            onClick={async e => await handleBlockTextClick(e, 'div.resource-content', 'block-with-text')}
          />
          <div className="text-center mt-3">
            <Button
              download={resourceUrl.split('/').pop()}
              href={resourceDownloadUrl}
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
