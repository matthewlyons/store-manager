import React, { useEffect, useContext } from 'react';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

// Context
import { StoreContext } from '../../context/StoreContext';
import { types } from '../../context/reducers';

export default function Alert() {
  const { state, dispatch } = useContext(StoreContext);

  useEffect(() => {
    setTimeout(() => {
      dispatch({
        type: types.SET_ALERT,
        payload: { message: '', success: true, active: false }
      });
    }, 3000);
  });

  return (
    <div>
      <Snackbar open={state.alert.active}>
        <MuiAlert
          elevation={6}
          variant="filled"
          severity={state.alert.success ? 'success' : 'error'}
        >
          {typeof state.alert.message === 'string' && state.alert.message}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}
