import React, { useContext, useEffect } from 'react';
import { useAlert } from '../../customHooks';
import { StoreContext } from '../../context/StoreContext';

export default function Loading() {
  const { state, setLoading } = useContext(StoreContext);
  const { createAlert } = useAlert();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.loading) {
        setLoading(false);
        createAlert('Server Took Too Long To Respond');
      }
    }, 30000);
    return () => {
      clearTimeout(timer);
    };
  }, [state.loading]);

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
