import React, {
  useState,
  useEffect
} from 'react';
import PropTypes from 'prop-types';
import lazy from 'react-lazy-no-flicker/lib/lazy';

const Helmet = lazy(async () => await import(/* webpackPreload: true, webpackChunkName: 'react-helmet' */'react-helmet/es/Helmet'));
const MAX_DESCRIPTION_LENGTH = 160;
const INITAL_STATE = {
  isLoading: true,
  title: '',
  canonicalHref: '',
  robotsContent: '',
  descriptionContent: '',
  subjectContent: '',
  keywordsContent: '',
  imageContent: '',
  imageTypeContent: '',
  siteNameContent: ''
};
const TKoTHelmet = props => {
  const [state, setState] = useState(INITAL_STATE);
  const {
    preloadImages,
    prefetchImages
  } = props;
  const {
    isLoading,
    title,
    canonicalHref,
    robotsContent,
    descriptionContent,
    subjectContent,
    keywordsContent,
    imageContent,
    imageTypeContent,
    siteNameContent
  } = state;
  useEffect(() => {
    const retrieveData = async () => {
      const {
        isBoolean,
        isNullOrEmpty,
        getFirstCharacters
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'app-utilities' */'components/App/Utilities');
      const {
        name,
        path,
        description,
        subject,
        keywords,
        image,
        robotsNoIndex,
        robotsNoFollow,
        websiteNameOverride,
        websiteUrlOverride
      } = props;
      const {
        REACT_APP_WEB_BASE_URL,
        REACT_APP_WEB_NAME
      } = process.env;
      const canonicalHref = new URL(path, (websiteUrlOverride || REACT_APP_WEB_BASE_URL));
      const robotsIndexText = isBoolean(robotsNoIndex, true)
        ? 'noindex'
        : 'index'
      const robotsFollowText = isBoolean(robotsNoFollow, true)
        ? 'nofollow'
        : 'follow';
      const {
        extname
      } = await import(/* webpackPrefetch: true, webpackChunkName: 'path' */'path');
      const imageType = !isNullOrEmpty(image)
        ? extname(image).substring(1).split('&')[0]
        : null;
      const siteNameContent = websiteNameOverride || REACT_APP_WEB_NAME;
      setState(async s => ({
        ...s,
        isLoading: false,
        title: `${(name ? `${name} | ` : '')}${siteNameContent}`,
        canonicalHref: canonicalHref.toString(),
        robotsContent: `noodp,${robotsIndexText},${robotsFollowText}`,
        descriptionContent: getFirstCharacters(description, MAX_DESCRIPTION_LENGTH, false),
        subjectContent: subject,
        keywordsContent: keywords,
        imageContent: image,
        imageTypeContent: imageType
          ? `image/${imageType}`
          : null,
        siteNameContent: siteNameContent
      }));
    };
    if (isLoading) {
      retrieveData();
    }
    return () => { };
  }, [props, isLoading]);
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="canonical" href={canonicalHref} />
        <meta name="robots" content={robotsContent} />
        <meta name="description" content={descriptionContent} />
        <meta name="subject" content={subjectContent} />
        <meta name="keywords" content={keywordsContent} />
        <meta property="og:description" content={descriptionContent} />
        <meta property="og:image" content={imageContent} />
        <meta property="og:image:type" content={imageTypeContent} />
        <meta property="og:site_name" content={siteNameContent} />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={canonicalHref} />
        {
          preloadImages.map((preloadImage, index) =>
            <link
              rel="preload"
              as="image"
              importance="high"
              href={preloadImage}
              key={index}
            />
          )
        }
        {
          prefetchImages.map((prefetchImage, index) =>
            <link
              rel="prefetch"
              as="image"
              importance="high"
              href={prefetchImage}
              key={index}
            />
          )
        }
      </Helmet>
    </>
  );
};

TKoTHelmet.propTypes = {
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  subject: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  robotsNoIndex: PropTypes.bool,
  robotsNoFollow: PropTypes.bool,
  websiteNameOverride: PropTypes.string,
  websiteUrlOverride: PropTypes.string,
  preloadImages: PropTypes.array,
  prefetchImages: PropTypes.array
};
TKoTHelmet.defaultProps = {
  preloadImages: [],
  prefetchImages: []
};

export default TKoTHelmet;
