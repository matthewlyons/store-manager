import React, { useContext } from 'react';

import { StoreContext } from '../../context/StoreContext';

export default function Loading() {
  const { state } = useContext(StoreContext);

  return (
    <React.Fragment>
      {state.loading && (
        <div className="Loading">
          <h1>Loading</h1>
        </div>
      )}
    </React.Fragment>
  );
}
