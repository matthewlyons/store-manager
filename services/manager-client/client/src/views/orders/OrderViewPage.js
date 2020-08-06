/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState } from 'react';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';

import OrderProducts from './components/OrderProducts';

import Moment from 'moment';

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
import ModalCenter from '../../components/ModalCenter/ModalCenter';

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
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const { setSuccess, setError, makeRequest } = useContext(StoreContext);

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
    makeRequest('get', 'api', `/orders/${props.match.params.id}`)
      .then((res) => {
        setOrder(res.data);
      })
      .catch((error) => {
        error.errors.forEach((err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        });
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
    console.log(e.target.value);
    setEmail(e.target.value);
  };

  const printInvoice = () => {
    makeRequest('post', 'invoice', '/pdf', order)
      .then((res) => {
        setSuccess(res.data);
      })
      .catch((error) => {
        error.errors.forEach((err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        });
      });
  };

  const emailInvoice = () => {
    makeRequest('post', 'invoice', '/Email/order', {
      email: order.customer.email[email],
      order
    })
      .then((res) => {
        setSuccess(res.data);
      })
      .catch((error) => {
        error.errors.forEach((err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        });
      });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
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
              to={`/Orders/Edit/Order/${props.match.params.id}`}
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
      {order.delivery && (
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
                  <Typography gutterBottom>{order.address.street}</Typography>
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
                <Grid item xs={12}>
                  <Typography gutterBottom>
                    Order Will Arrive in {order.estimatedStoreArrival} Weeks
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}
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
        <Button variant="contained" color="primary" onClick={emailInvoice}>
          Submit
        </Button>
      </ModalCenter>
    </Grid>
  );
}
