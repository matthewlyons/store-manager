import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Custom Hooks
import { useAuthToken, useWindowDimensions } from './customHooks';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

// Components
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PrivateRoute from './components/PrivateRoute';
import Loading from './components/Loading';

// Views
import HomePage from './views/HomePage';
// Orders
import OrderHomePage from './views/orders/OrderHomePage';
import OrderViewPage from './views/orders/OrderViewPage';
import OrderCreatePage from './views/orders/OrderCreatePage';
// Customers
import CustomerHomePage from './views/customers/CustomerHomePage';
import CustomerViewPage from './views/customers/CustomerViewPage';
import CustomerCreatePage from './views/customers/CustomerCreatePage';
// Bulk Uploads
import Upload from './views/upload/Upload';
import UploadCustomers from './views/upload/UploadCustomers';
// Products
import ProductHomePage from './views/products/ProductHomePage';
import ProductForm from './views/products/ProductForm';
// Settings
import Settings from './views/settings/Settings';
// Images Home Page
import ImagesHome from './views/images/ImagesHome';
// Login
import Login from './views/login/Login';
import ErrorHandler from './components/ErrorHandler';
// Vendor Pages
import VendorHomepage from './views/vendor/VendorHomepage';
import VendorView from './views/vendor/VendorView';
import Vendor_PruchaseOrder from './views/vendor/Vendor_PruchaseOrder';

function App() {
  const { width } = useWindowDimensions();
  const ApiToken = useAuthToken();

  let navigation;
  if (!ApiToken) {
    navigation = null;
  } else if (width < 960) {
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
        <ErrorHandler>
          <main className={classes.content}>
            <Switch>
              <PrivateRoute exact path="/" component={HomePage} />
              <PrivateRoute exact path="/Orders" component={OrderHomePage} />
              <PrivateRoute
                exact
                path="/Orders/View/:type/:id"
                component={OrderViewPage}
              />
              <PrivateRoute
                exact
                path="/Orders/Form/:id?"
                component={OrderCreatePage}
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
              <PrivateRoute exact path="/Upload" component={Upload} />
              <PrivateRoute
                exact
                path="/Upload/Customers"
                component={UploadCustomers}
              />
              <PrivateRoute
                exact
                path="/Products"
                component={ProductHomePage}
              />
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
              <PrivateRoute exact path="/Images" component={ImagesHome} />
              <PrivateRoute exact path="/Settings" component={Settings} />
              <PrivateRoute exact path="/Vendor" component={VendorHomepage} />
              <PrivateRoute exact path="/Vendor/:id" component={VendorView} />
              <PrivateRoute
                exact
                path="/Vendor/Purchase/:id"
                component={Vendor_PruchaseOrder}
              />
              <Route exact path="/Login">
                <Login />
              </Route>
            </Switch>
          </main>
        </ErrorHandler>
      </div>
      <Loading />
    </Router>
  );
}

export default App;
