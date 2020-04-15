import React from 'react';

const AuthPanelHeader = props => {
  const {
    size,
    content,
    bgImage
  } = props;
  return (
    <div className={`panel-header${((size && ` panel-header-${size}`) || '')}`} style={{
      backgroundImage: bgImage && `url('${bgImage}')`
    }}>
      {content}
    </div>
  );
};

export default AuthPanelHeader;
