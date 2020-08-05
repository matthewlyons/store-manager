import React, { useContext } from 'react';
import Moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';

import { Paper, Grid, Divider } from '@material-ui/core';
import VisitorForm from '../components/VisitorForm';
import VisitorList from '../components/VisitorList';

// Context
import { StoreContext } from '../context/StoreContext';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));

export default function HomePage() {
  const classes = useStyles();

  const { state } = useContext(StoreContext);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item className="flex flexBaseline" xs={12}>
          <h2 className="flexSpacer">
            Welcome back, {state.apiAuth.user.name}!
          </h2>
          <h3>{Moment(Date.now()).format('MMMM Do, YYYY')}</h3>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item md={6} sm={12}>
          <Paper className={classes.paper}>
            <VisitorList />
          </Paper>
        </Grid>
        <Grid item md={6} sm={12}>
          <Paper className={classes.paper + ' FullHeight '}>
            <VisitorForm />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
