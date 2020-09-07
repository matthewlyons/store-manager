import React, { useEffect, useState } from 'react';
import { useAlert } from '../../../customHooks';
import { makeStyles } from '@material-ui/core/styles';

import { Paper, Grid, Button, AppBar, Tabs, Tab, Box } from '@material-ui/core';

import ProductTable from './ProductTable';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

export default function UploadConfirmPricing(props) {
  const classes = useStyles();

  let { submit, data } = props;
  let { vendor, createProducts, deleteProducts, updateProducts } = data;

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { createAlert } = useAlert();

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item className="flex flexBaseline" xs={12}>
          <h2 className="flexSpacer">Upload Products</h2>

          <Button variant="contained" color="primary" onClick={submit}>
            Submit
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <AppBar position="static">
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="simple tabs example"
                centered
              >
                <Tab label="New Products" />
                <Tab label="Old Products" />
                <Tab label="Updated Products" />
              </Tabs>
            </AppBar>
            <ProductTable
              products={createProducts}
              vendor={vendor}
              value={value}
              position={0}
            />
            <ProductTable
              products={deleteProducts}
              vendor={vendor}
              value={value}
              position={1}
            />
            <ProductTable
              products={updateProducts}
              vendor={vendor}
              value={value}
              position={2}
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
