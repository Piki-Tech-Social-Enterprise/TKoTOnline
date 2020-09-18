import React, {
  useState,
  useEffect
} from 'react';
import {
  withFirebase
} from 'components/Firebase';
import tkotVideo from '../../../assets/videos/v2.mp4';

const AboutSection = props => {
  const {
    pageAboutImage
  } = props;
  const [state, setState] = useState({
    isLoading: true,
    settings: {}
  });
  useEffect(() => {
    const {
      isLoading
    } = state;
    const getData = async () => {
      const {
        firebase
      } = props;
      const dbSettings = await firebase.getDbSettingsValues(true);
      setState(s => ({
        ...s,
        isLoading: false,
        settings: dbSettings
      }));
    };
    if (isLoading) {
      getData();
    }
  }, [props, state]);
  return (
    <div className="tkot-section">
      <a id="Home" href="#TKoTOnline" className="tkot-anchor">&nsbp;</a>
      <div className="about-image" style={{
        backgroundImage: `linear-gradient(183deg, rgba(0, 0, 0, 0.83), rgba(0, 0, 0, 0)), url(${pageAboutImage})`
      }}>
        <div className="videoHeader">
          <video playsInline autoPlay muted loop>
            <source
              type="video/mp4"
              src={tkotVideo}
            />
          </video>
        </div>
      </div>
    </div>
  );
};

export default withFirebase(AboutSection);
