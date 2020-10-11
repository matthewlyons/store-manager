import React, { useState, useEffect, useContext } from 'react';
import { useAlert } from '../../customHooks';
import { Link } from 'react-router-dom';

import Loading from '../../components/Loading';

import { makeStyles } from '@material-ui/core/styles';
import { Grid, Button, Divider } from '@material-ui/core';

import { StoreContext } from '../../context/StoreContext';
import OrderList from './components/OrderList';

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

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    makeRequest('get', 'api', '/orders/')
      .then((res) => {
        setOrders(res.data);
      })
      .catch((error) => {
        createAlert(error);
      });
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item className="flex flexBaseline" xs={12}>
        <h2 className="flexSpacer">Recent Orders</h2>
        <div className={classes.buttonGroup}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={'/Orders/Form'}
          >
            New Order
          </Button>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <OrderList orders={orders} />
    </Grid>
  );
}
