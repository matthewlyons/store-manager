import React, { useState, Fragment } from 'react';

export default function LazyLoad(props) {
  const [loading, setLoading] = useState(true);

  const imageLoad = () => {
    setLoading(false);
  };
  return (
    <Fragment>
      <div style={{ display: loading ? 'block' : 'none' }}>Loading</div>
      <div style={{ display: loading ? 'none' : 'block', height: '160px' }}>
        <img src={props.src} onLoad={imageLoad} style={{ height: '160px' }} />
      </div>
    </Fragment>
  );
}
