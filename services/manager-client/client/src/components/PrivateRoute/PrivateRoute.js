import React from 'react';

import { Route, Redirect } from 'react-router-dom';

// Custom Hooks
import { hasApiToken } from '../../customHooks';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const ApiToken = hasApiToken();

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
