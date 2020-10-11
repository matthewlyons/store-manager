import React, { useMemo } from 'react';

import Moment from 'moment';

import { makeStyles } from '@material-ui/core/styles';

import { Paper, Grid, Typography } from '@material-ui/core';

import ListLink from '../../../../components/ListLink';
import ListItem from '../../../../components/ListItem';

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

export default function OrderList({ orders }) {
  const classes = useStyles();

  let list = useMemo(() => {
    console.log(orders);
    return orders;
  }, [orders]);

  return (
    <Grid item xs={12}>
      <Paper className={classes.paper}>
        {list.length > 0 ? (
          <ListLink>
            {orders.map((order, i) => (
              <ListItem key={i} to={`/Orders/View/Order/${order._id}`}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={4} align="left">
                    <p>{order.customer.name}</p>
                  </Grid>
                  <Grid item xs={4} align="right">
                    <p>{Moment(order.date).format('hh:mm A MM/DD/YY')}</p>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </ListLink>
        ) : (
          <Typography>No Orders Found</Typography>
        )}
      </Paper>
    </Grid>
  );
}
