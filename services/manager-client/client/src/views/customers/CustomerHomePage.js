import React, { useState, useContext } from 'react';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, TextField, Button, Divider } from '@material-ui/core';

import { StoreContext } from '../../context/StoreContext';

import ListLink from '../../components/ListLink';
import ListItem from '../../components/ListItem';

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

export default function CustomerHomePage() {
  const { enqueueSnackbar } = useSnackbar();
  const { makeRequest } = useContext(StoreContext);

  const classes = useStyles();

  const [customers, setCustomers] = useState([]);

  const [query, setQuery] = useState('');

  function searchDB(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.target.blur();
      makeRequest('get', 'api', `/customers/search/${query}`)
        .then((res) => {
          setCustomers(res.data);
        })
        .catch((error) => {
          error.errors.forEach((err) => {
            enqueueSnackbar(err.message, { variant: 'error' });
          });
        });
    }
  }
  function updateQuery(event) {
    setQuery(event.target.value);
  }

  return (
    <Grid container spacing={3}>
      <Grid item className="flex flexBaseline" xs={12}>
        <h2 className="flexSpacer">Customers</h2>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={'/Customers/Create'}
        >
          New Customer
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <TextField
            fullWidth={true}
            id="standard-basic"
            label="Search"
            onChange={updateQuery}
            onKeyPress={searchDB}
            variant="outlined"
          />
        </Paper>
      </Grid>
      {customers.length > 0 && (
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <ListLink>
              {customers.map((customer, i) => (
                <ListItem key={i} to={`/Customers/View/${customer._id}`}>
                  <p>{customer.name}</p>
                  {customer.addresses.length > 0 && (
                    <p>
                      {customer.addresses[0].street},{' '}
                      {customer.addresses[0].zip}
                    </p>
                  )}
                </ListItem>
              ))}
            </ListLink>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
}
