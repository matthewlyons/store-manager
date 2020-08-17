import React, { useState, useContext } from 'react';
import { useAlert } from '../../customHooks';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, TextField, Button, Divider } from '@material-ui/core';

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
  }
}));

export default function ProductHomePage() {
  const { createAlert } = useAlert();
  const { makeRequest } = useContext(StoreContext);
  const classes = useStyles();

  const [products, setProducts] = useState([]);

  const [query, setQuery] = useState('');

  function update(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      setProducts([]);
      makeRequest('get', 'api', `/products/search/${query}`)
        .then((res) => {
          if (res.data.length < 1) {
            createAlert('No Products Found');
          } else {
            console.log(res.data);
            setProducts(res.data);
          }
        })
        .catch((error) => {
          createAlert(error);
        });
    }
  }

  function handle(event) {
    setQuery(event.target.value);
  }

  return (
    <Grid container spacing={3}>
      <Grid item className="flex flexBaseline" xs={12}>
        <h2 className="flexSpacer">Products</h2>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={'/Products/Create'}
        >
          New Product
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
            onChange={handle}
            onKeyPress={update}
            variant="outlined"
          />
        </Paper>
      </Grid>
      {products.length > 0 && (
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <ListLink>
              {products.map((product, i) => (
                <ListItem key={i} to={`/products/View/${product._id}`}>
                  <p>
                    {product.vendor.name} | {product.title}
                  </p>
                  <p>${product.price}</p>
                </ListItem>
              ))}
            </ListLink>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
}
