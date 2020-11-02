<<<<<<< HEAD
import React, { useContext, useEffect  } from 'react';

=======
import React, { useContext, useEffect } from 'react';
import { useAlert } from '../../customHooks';
>>>>>>> origin/master
import { StoreContext } from '../../context/StoreContext';

export default function Loading() {
  const { state, setLoading } = useContext(StoreContext);
  const { createAlert } = useAlert();

  useEffect(() => {
    setTimeout(() => {
      if (state.loading) {
        setLoading(false);
        createAlert('Server Took Too Long To Respond');
      }
    }, 10000);
  }, [state.loading]);

useEffect(()=>{
  setTimeout(()=>{
    console.log("Failed")
  },5000)
},[state.loading])

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
