import React, {
  useEffect
} from 'react';

const ScriptElement = props => {
  useEffect(() => {
    const {
      url,
      async,
      defer,
      crossorigin
    } = props;
    const {
      createElement,
      body
    } = document;
    const script = createElement('script');
    script.src = url;
    script.async = async;
    script.defer = defer;
    script.crossorigin = crossorigin;
    body.appendChild(script);
    return () => {
      body.removeChild(script);
    }
  }, [props]);
  return (<></>);
};
const useScript = props => {
  useEffect(() => {
    return ScriptElement(props);
  }, [props]);
  return (<></>);
};

export default useScript;
