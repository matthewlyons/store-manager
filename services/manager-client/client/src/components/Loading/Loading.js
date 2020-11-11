import React, { useContext, useEffect } from 'react';
import { StoreContext } from '../../context/StoreContext';

export default function Loading() {
  const { state } = useContext(StoreContext);

  return (
    <React.Fragment>
      {state.loading && (
        <div className="Loading">
          <div className="Text">
            <h1>Loading</h1>
          </div>
          <div className="Background"></div>
        </div>
      )}
    </React.Fragment>
  );
}
