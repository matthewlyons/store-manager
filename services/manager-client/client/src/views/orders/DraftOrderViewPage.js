/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useContext, useState } from 'react';
import { useAlert } from '../../customHooks';
import { Link } from 'react-router-dom';

import OrderProducts from './components/OrderProducts';

import Moment from 'moment';

import { StoreContext } from '../../context/StoreContext';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Button,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography
} from '@material-ui/core';

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
  const { setSuccess, makeRequest } = useContext(StoreContext);
  const [order, setOrder] = useState({
    delivery: false,
    customer: {
      name: undefined
    },
    address: {
      street: undefined,
      city: undefined,
      state: undefined,
      zip: undefined
    },
    products: []
  });

  useEffect(() => {
    makeRequest('get', 'api', `/draftorders/${props.match.params.id}`)
      .then((res) => {
        setOrder(res.data);
      })
      .catch((error) => {
        createAlert(error);
      });
  }, []);

  const printInvoice = () => {
    makeRequest('post', 'invoice', '/draft', order)
      .then((res) => {
        setSuccess(res.data);
      })
      .catch((error) => {
        createAlert(error);
      });
  };

  const createOrder = () => {
    makeRequest('post', 'api', `/draftorders/convert/${props.match.params.id}`)
      .then((res) => {
        let order = res.data;
        window.location = `/Orders/View/${order._id}`;
      })
      .catch((error) => {
        createAlert(error);
      });
  };

  return (
    <Grid container spacing={3}>
      <Grid item className="flex flexBaseline" xs={12}>
        <h2 className="flexSpacer">
          {order.customer.name} |{' '}
          {Moment(order.date).format('hh:mm A MM/DD/YY')}
        </h2>
        <div className={classes.buttonGroup}>
          <Button variant="contained" color="primary" onClick={createOrder}>
            Create Order
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`/Orders/Edit/Draft/${props.match.params.id}`}
          >
            Edit Order
          </Button>
          <Button ariant="contained" color="primary" onClick={printInvoice}>
            Print Quote
          </Button>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Card className={classes.paper}>
          <CardHeader
            subheader="Products In Quote"
            style={{ textAlign: 'center' }}
          />
          <Divider />
          <CardContent>
            <OrderProducts products={order.products} />
          </CardContent>
        </Card>
      </Grid>
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
                  <Grid item xs={12}>
                    <Typography gutterBottom>
                      License Number: {order.driversLicense.number}
                    </Typography>
                    <Typography gutterBottom>
                      Experation Date:{order.driversLicense.experationDate}
                    </Typography>
                  </Grid>
                )}
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
    </Grid>
  );
}
