import React, { useEffect, useState, useContext } from 'react';
import { useAlert } from '../../customHooks';
import { Link } from 'react-router-dom';

import Moment from 'moment';

import OrderProducts from './components/OrderProducts';

import { StoreContext } from '../../context/StoreContext';

import { makeStyles } from '@material-ui/core/styles';
import {
  FormControl,
  Select,
  Grid,
  Button,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography,
  Menu,
  MenuItem
} from '@material-ui/core';

import ModalCenter from '../../components/ModalCenter';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary
  },
  buttonGroup: {
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}));

export default function OrderViewPage(props) {
  const { createAlert } = useAlert();
  const classes = useStyles();
  const { makeRequest, setLoading } = useContext(StoreContext);

  //   Order State
  const [order, setOrder] = useState({
    delivery: false,
    customer: {
      name: undefined,
      email: []
    },
    address: {
      street: undefined,
      city: undefined,
      state: undefined,
      zip: undefined
    },
    products: []
  });

  const [emailModal, setEmailModal] = useState(false);
  const [email, setEmail] = useState(0);

  useEffect(() => {
    setLoading(false);
    let { type, id } = props.match.params;
    let route = type === 'Order' ? 'orders' : 'draftorders';
    makeRequest('get', 'api', `/${route}/${id}`)
      .then((res) => {
        console.log(res.data);
        setOrder(res.data);
      })
      .catch((error) => {
        createAlert(error);
      });
  }, []);

  const toggleModal = (modal) => {
    switch (modal) {
      case 'email':
        setEmailModal(!emailModal);
        break;
      default:
        break;
    }
  };

  const emailChange = (e) => {
    setEmail(e.target.value);
  };

  const printInvoice = () => {
    let { type } = props.match.params;
    let route = type === 'Order' ? 'order' : 'draftorders';
    console.log(order);
    setLoading(true);
    makeRequest('post', 'invoice', `/Print/${route}`, { order })
      .then((res) => {
        setLoading(false);
        createAlert(res.data, false);
      })
      .catch((error) => {
        setLoading(false);
        createAlert(error);
      });
  };

  const emailInvoice = () => {
    let { type } = props.match.params;
    let route = type === 'Order' ? 'order' : 'draftorders';
    setLoading(true);
    makeRequest('post', 'invoice', `/Email/${route}`, {
      email: order.customer.email[email],
      order
    })
      .then((res) => {
        setLoading(false);
        createAlert(res.data, false);
      })
      .catch((error) => {
        setLoading(false);
        createAlert(error);
      });
  };

  const createOrder = () => {
    makeRequest('post', 'api', `/draftorders/convert/${props.match.params.id}`)
      .then((res) => {
        let order = res.data;
        window.location = `/Orders/View/Order/${order._id}`;
      })
      .catch((error) => {
        createAlert(error);
      });
  };

  // Material Menu
  const [anchor, setAnchor] = useState(null);

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  return (
    <Grid container spacing={3}>
      <Grid item className="flex flexBaseline" xs={12}>
        <h2 className="flexSpacer">
          {order.customer.name} |{' '}
          {Moment(order.date).format('hh:mm A MM/DD/YY')}
        </h2>
        <div className={classes.buttonGroup}>
          <Button variant="contained" color="primary" onClick={handleClick}>
            Menu
          </Button>
          {props.match.params.type === 'Order' ? (
            <Menu
              id="simple-menu"
              anchorEl={anchor}
              keepMounted
              open={Boolean(anchor)}
              onClose={handleClose}
            >
              <MenuItem
                component={Link}
                to={`/Customers/View/${order.customer._id}`}
              >
                View Customer
              </MenuItem>
              <MenuItem
                component={Link}
                to={{
                  pathname: `/Orders/Form/`,
                  state: {
                    type: props.match.params.type,
                    id: props.match.params.id
                  }
                }}
              >
                Edit Order
              </MenuItem>
              <MenuItem onClick={printInvoice}>Print Invoice</MenuItem>
              <MenuItem
                onClick={() => {
                  toggleModal('email');
                }}
              >
                Email Invoice
              </MenuItem>
            </Menu>
          ) : (
            <Menu
              id="simple-menu"
              anchorEl={anchor}
              keepMounted
              open={Boolean(anchor)}
              onClose={handleClose}
            >
              <MenuItem
                component={Link}
                to={`/Customers/View/${order.customer._id}`}
              >
                View Customer
              </MenuItem>
              <MenuItem onClick={createOrder}>Create Order</MenuItem>
              <MenuItem
                component={Link}
                to={{
                  pathname: `/Orders/Form/`,
                  state: {
                    type: props.match.params.type,
                    id: props.match.params.id
                  }
                }}
              >
                Edit Quote
              </MenuItem>
              <MenuItem onClick={printInvoice}>Print Quote</MenuItem>
              <MenuItem
                onClick={() => {
                  toggleModal('email');
                }}
              >
                Email Quote
              </MenuItem>
            </Menu>
          )}
        </div>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Card className={classes.paper}>
          <CardHeader
            subheader="Products In Order"
            style={{ textAlign: 'center' }}
          />
          <Divider />
          <CardContent>
            <OrderProducts products={order.products} />
          </CardContent>
        </Card>
      </Grid>
      {order.note !== '' && (
        <Grid item xs={12} md={6}>
          <Card className={classes.paper}>
            <CardHeader
              subheader="Order Note"
              style={{ textAlign: 'center' }}
            />
            <Divider />
            <CardContent>
              <Typography>{order.note}</Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
      <Grid item xs={6} md={3}>
        <Card className={classes.paper}>
          <CardHeader
            subheader="Customer Information"
            style={{ textAlign: 'center' }}
          />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography gutterBottom>
                  {order.address.street}, {order.address.unit}
                </Typography>
                <Typography gutterBottom>
                  {order.address.city}, {order.address.state}{' '}
                  {order.address.zip}
                </Typography>
              </Grid>
              {order.driversLicense && (
                <React.Fragment>
                  <Grid item xs={12}>
                    <Typography gutterBottom>
                      License Number: {order.driversLicense.number}
                    </Typography>
                    <Typography gutterBottom>
                      Experation Date:{order.driversLicense.experationDate}
                    </Typography>
                  </Grid>
                </React.Fragment>
              )}
              {order.estimatedStoreArrival && (
                <Grid item xs={12}>
                  <Typography gutterBottom>
                    Order Will Arrive in {order.estimatedStoreArrival} Weeks
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6} md={3}>
        <Card className={classes.paper}>
          <CardHeader subheader="Totals" style={{ textAlign: 'center' }} />
          <Divider />
          <CardContent>
            <Grid container>
              <Grid item xs={6}>
                <Typography gutterBottom align="right">
                  Item Total
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom align="right">
                  ${order.itemTotal}
                </Typography>
              </Grid>
              {order.delivery && (
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom align="right">
                      Delivery Fee
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom align="right">
                      ${order.deliveryFee}
                    </Typography>
                  </Grid>
                </React.Fragment>
              )}
              {order.militaryDiscount && (
                <React.Fragment>
                  <Grid item xs={6}>
                    <Typography gutterBottom align="right">
                      Military Discount
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography gutterBottom align="right">
                      -${order.discount}
                    </Typography>
                  </Grid>
                </React.Fragment>
              )}
              <Grid item xs={6}>
                <Typography gutterBottom align="right">
                  Sales Tax
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom align="right">
                  ${order.salesTax}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom align="right">
                  Sub Total
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom align="right">
                  ${order.subTotal}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom align="right">
                  Deposit
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom align="right">
                  ${order.deposit || 0}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
                <Typography gutterBottom align="right" />
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom align="right">
                  Total
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom align="right">
                  ${order.totalDue}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <ModalCenter
        open={emailModal}
        close={() => {
          toggleModal('email');
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl variant="outlined" fullWidth={true}>
              {order.customer.email.length > 0 && (
                <Select native onChange={emailChange}>
                  {order.customer.email.map((element, i) => (
                    <option value={i} key={i}>
                      {element}
                    </option>
                  ))}
                </Select>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={emailInvoice}>
              Submit
            </Button>
          </Grid>
        </Grid>
      </ModalCenter>
    </Grid>
  );
}
