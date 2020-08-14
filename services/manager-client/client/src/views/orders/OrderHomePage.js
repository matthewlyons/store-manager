import React, { useState, useEffect, useContext } from 'react';
import { useAlert } from '../../customHooks';
import { Link } from 'react-router-dom';

import Moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Button, Divider } from '@material-ui/core';

import ListLink from '../../components/ListLink';
import ListItem from '../../components/ListItem';

import { StoreContext } from '../../context/StoreContext';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  buttonGroup: {
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}));

export default function OrderHomePage() {
  const { createAlert } = useAlert();
  const { makeRequest } = useContext(StoreContext);
  const classes = useStyles();

  useEffect(() => {
    makeRequest('get', 'api', '/orders/')
      .then((res) => {
        setOrders(res.data);
      })
      .catch((error) => {
        createAlert(error);
      });
  }, []);

  const [orders, setOrders] = useState([]);

  return (
    <Grid container spacing={3}>
      <Grid item className="flex flexBaseline" xs={12}>
        <h2 className="flexSpacer">Recent Orders</h2>
        <div className={classes.buttonGroup}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={'/Orders/New'}
          >
            New Order
          </Button>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      {orders.length > 0 && (
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <ListLink>
              {orders.map((order, i) => (
                <ListItem key={i} to={`/Orders/View/${order._id}`}>
                  <p>{order.customer.name}</p>
                  <p>{Moment(order.date).format('hh:mm A MM/DD/YY')}</p>
                </ListItem>
              ))}
            </ListLink>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
}
