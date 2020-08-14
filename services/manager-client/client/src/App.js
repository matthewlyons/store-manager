import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Custom Hooks
import { useAuthToken, useWindowDimensions } from './customHooks';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// Components
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Alert from './components/Alert';
import PrivateRoute from './components/PrivateRoute';
import Loading from './components/Loading';

// Views
import HomePage from './views/HomePage';
import OrderHomePage from './views/orders/OrderHomePage';
import OrderViewPage from './views/orders/OrderViewPage';
import DraftOrderViewPage from './views/orders/DraftOrderViewPage';
import CustomerHomePage from './views/customers/CustomerHomePage';
import CustomerViewPage from './views/customers/CustomerViewPage';
import CustomerCreatePage from './views/customers/CustomerCreatePage';
import UploadHomePage from './views/upload/UploadHomePage';
import ProductHomePage from './views/products/ProductHomePage';
import ProductForm from './views/products/ProductForm';
import Settings from './views/settings/Settings';
import Login from './views/login/Login';
import OrderCreateForm from './views/orders/OrderCreateForm';
import UploadData from './views/upload/UploadData';

// Context
import { StoreContext } from './context/StoreContext';
import OrderUpdateForm from './views/orders/OrderUpdateForm';

function App() {
  const { state } = useContext(StoreContext);
  const { width } = useWindowDimensions();
  const ApiToken = useAuthToken();

  let navigation;
  if (!ApiToken) {
    navigation = null;
    // navigation = <Sidebar />;
  } else if (width < 960) {
    // navigation = null;
    navigation = <TopBar />;
  } else {
    navigation = <Sidebar />;
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: width < 960 ? 'column' : 'row'
    },
    menuButton: {
      marginRight: 36
    },
    hide: {
      display: 'none'
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3)
    }
  }));

  const classes = useStyles();

  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        {navigation}
        <main className={classes.content}>
          <Switch>
            <PrivateRoute exact path="/" component={HomePage} />
            <PrivateRoute exact path="/Orders" component={OrderHomePage} />
            <PrivateRoute
              exact
              path="/Orders/View/:id"
              component={OrderViewPage}
            />
            <PrivateRoute
              exact
              path="/DraftOrders/View/:id"
              component={DraftOrderViewPage}
            />
            <PrivateRoute
              exact
              path="/Orders/New/:id?"
              component={OrderCreateForm}
            />
            <PrivateRoute
              exact
              path="/Orders/Edit/:type/:id"
              component={OrderUpdateForm}
            />
            <PrivateRoute
              exact
              path="/Customers"
              component={CustomerHomePage}
            />
            <PrivateRoute
              exact
              path="/Customers/Create"
              component={CustomerCreatePage}
            />
            <PrivateRoute
              exact
              path="/Customers/View/:id"
              component={CustomerViewPage}
            />
            <PrivateRoute exact path="/Upload" component={UploadHomePage} />
            <PrivateRoute exact path="/Upload/Data" component={UploadData} />
            <PrivateRoute exact path="/Products" component={ProductHomePage} />
            <PrivateRoute
              exact
              path="/Products/Create"
              component={ProductForm}
            />
            <PrivateRoute
              exact
              path="/Products/View/:id"
              component={ProductForm}
            />
            <PrivateRoute exact path="/Settings" component={Settings} />
            <Route exact path="/Login">
              <Login />
            </Route>
          </Switch>
        </main>
      </div>
      <Loading />
    </Router>
  );
}

export default App;
