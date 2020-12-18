import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Paper, Grid, TextField, Button, Divider } from '@material-ui/core';

import { StoreContext } from '../../context/StoreContext';
import { useAlert } from '../../customHooks';

export default function VendorView(props) {
  const { createAlert } = useAlert();

  const [vendor, setVendor] = useState({});

  const { makeRequest } = useContext(StoreContext);

  useEffect(() => {
    makeRequest('get', 'api', `/vendor/${props.match.params.id}`)
      .then((res) => {
        console.log(res.data);
        setVendor(res.data);
      })
      .catch((error) => {
        createAlert(error);
      });
  }, []);
  return (
    <Grid container spacing={3}>
      <Grid item className="flex flexBaseline" xs={12}>
        <h2 className="flexSpacer">{vendor.name}</h2>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={`/Vendor/Purchase/${props.match.params.id}`}
        >
          Create Purchase Order
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );
}
