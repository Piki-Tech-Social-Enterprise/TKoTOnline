import React, {
  useEffect,
  useState
} from 'react';

const INITIAL_STATE = {
  isLoading: true,
};
const LazySizes = props => {
  const [state, setState] = useState(INITIAL_STATE);
  const {
    isLoading
  } = state;
  useEffect(() => {
    const pageSetup = async () => {
      await import(/* webpackPreload: true, webpackChunkName: 'lazysizes' */'lazysizes');
      setState(s => ({
        ...s,
        isLoading: false,
      }));
    };
    if (isLoading) {
      pageSetup();
    }
  }, [props, isLoading]);
  return (
    <>
    </>
  )
};

export default LazySizes;
