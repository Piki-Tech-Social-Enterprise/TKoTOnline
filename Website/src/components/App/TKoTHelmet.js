import React, {
  useState,
  useEffect
} from 'react';
import {
  Helmet
} from 'react-helmet';
import PropTypes from 'prop-types';
import {
  extname,
  join
} from 'path';
import {
  isBoolean,
  isNullOrEmpty,
  getFirstCharacters
} from 'components/App/Utilities';

const MAX_DESCRIPTION_LENGTH = 160;
const TKoTHelmet = props => {
  const [state, setState] = useState({
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
  });
  const {
    // isLoading,
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
    const {
      isLoading
    } = state;
    if (isLoading) {
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
      const robotsIndexText = isBoolean(robotsNoIndex, true)
        ? 'noindex'
        : 'index'
      const robotsFollowText = isBoolean(robotsNoFollow, true)
        ? 'nofollow'
        : 'follow';
      const imageType = !isNullOrEmpty(image)
        ? extname(image).substring(1).split('&')[0]
        : null;
      const siteNameContent = websiteNameOverride || REACT_APP_WEB_NAME;
      setState(s => ({
        ...s,
        isLoading: false,
        title: `${(name ? `${name} | ` : '')}${siteNameContent}`,
        canonicalHref: join((websiteUrlOverride || REACT_APP_WEB_BASE_URL), path),
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
    }
    return () => { };
  }, [props, state]);
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
  websiteUrlOverride: PropTypes.string
};
TKoTHelmet.defaultProps = {

};

export default TKoTHelmet;
