import React from 'react';

import { Route, Redirect } from 'react-router-dom';

// Custom Hooks
import { useAuthToken } from '../../customHooks';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const ApiToken = useAuthToken();

  return (
    <Route
      {...rest}
      render={(props) =>
        ApiToken ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export default PrivateRoute;
