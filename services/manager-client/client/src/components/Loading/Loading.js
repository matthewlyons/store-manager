import React, { useContext, useEffect  } from 'react';

import { StoreContext } from '../../context/StoreContext';

export default function Loading() {
  const { state } = useContext(StoreContext);

useEffect(()=>{
  setTimeout(()=>{
    console.log("Failed")
  },5000)
},[state.loading])

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
