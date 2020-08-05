import React, { useContext } from 'react';
import { useSnackbar } from 'notistack';
import { Paper, Grid, Typography, Divider, Button } from '@material-ui/core';

import { StoreContext } from '../../../context/StoreContext';

export default function UploadDataConfirm(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { setSuccess, makeRequest } = useContext(StoreContext);

  let { productData } = props;

  const submitData = () => {
    makeRequest('post', 'bulk', '/Data', {
      Products: productData
    })
      .then((res) => {
        setSuccess('Success');
      })
      .catch((error) => {
        error.errors.forEach((err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        });
      });
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item className="flex flexBaseline" xs={12}>
          <h2 className="flexSpacer">Upload Products</h2>

          <Button variant="contained" color="primary" onClick={submitData}>
            Submit
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography style={{ textAlign: 'center' }}>
                  New Products
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                {productData.map((element, i) => {
                  return <li key={i}>{element.sku}</li>;
                })}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
