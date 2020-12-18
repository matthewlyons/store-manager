import React, { useContext, useState, useEffect } from 'react';

import { TextField, Grid, Divider, Button } from '@material-ui/core';

import SlideModal from '../../../components/SlideModal';

export default function EditModal({ open, close, product, submit }) {
  const [editProduct, setEditProduct] = useState({
    sku: '',
    vendorCollection: '',
    title: '',
    quantity: '',
    name: ''
  });

  useEffect(() => {
    if (product) {
      setEditProduct(product);
    }
  }, [product]);

  return (
    <SlideModal
      open={open}
      close={close}
      title={`Edit ${editProduct.sku} for ${editProduct.name}`}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth={true}
            label="Customer Name"
            helperText="Leave Blank for Stock Product"
            variant="outlined"
            name="customerName"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth={true}
            label="Search Product"
            variant="outlined"
            name="productSearch"
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Button
            onClick={() => {
              submit(editProduct);
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </SlideModal>
  );
}
