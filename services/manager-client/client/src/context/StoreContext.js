import React, { createContext, useReducer } from 'react';
import { reducer, globalState, types } from './reducers';

import axios from 'axios';

const StoreContext = createContext(globalState);

const StoreProvider = ({ children }) => {
  // Set up reducer with useReducer and our defined reducer, globalState from reducers.js
  const [state, dispatch] = useReducer(reducer, globalState);

  async function makeRequest(method, host, route, data) {
    let url;
    if (process.env.NODE_ENV === 'development') {
      url = `http://192.168.0.166/${host}${route}`;
    } else {
      url = `/${host}${route}`;
    }

    return new Promise((resolve, reject) => {
      axios({
        method: method,
        url,
        headers: {
          Authorization: 'Bearer ' + state.apiAuth.token,
          Customer: 'Bearer ' + state.custAuth.token
        },
        data
      })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          if (err.response) {
            reject(err.response.data);
          } else {
            reject('Server Unresponsive');
          }
        });
    });
  }

  function setError(message) {
    dispatch({
      type: types.SET_ALERT,
      payload: {
        message: message,
        success: false,
        active: true
      }
    });
  }
  function setLoading(loading) {
    dispatch({
      type: types.SET_LOADING,
      payload: loading
    });
  }

  function setSuccess(message) {
    dispatch({
      type: types.SET_ALERT,
      payload: {
        message: message,
        success: true,
        active: true
      }
    });
  }

  function setUser(user) {
    dispatch({
      type: types.SET_API,
      payload: user
    });
  }

  function signOut() {
    dispatch({
      type: types.SET_API,
      payload: {}
    });
  }

  return (
    <StoreContext.Provider
      value={{
        state,
        dispatch,
        makeRequest,
        setError,
        setSuccess,
        setUser,
        signOut,
        setLoading
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StoreProvider };
