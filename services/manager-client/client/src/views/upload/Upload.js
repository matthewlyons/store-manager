import React, { useState, useEffect, useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, TextField, Button, Divider } from '@material-ui/core';

import { useAlert, useUpload } from '../../customHooks';

import UploadTypeSelect from './components/UploadTypeSelect';
import UploadVendorSelect from './components/UploadVendorSelect';
import UploadSheetSelect from './components/UploadSheetSelect';
import UploadConfirmPricing from './components/UploadConfirmPricing';

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

export default function Upload() {
  const classes = useStyles();
  const { makeRequest } = useContext(StoreContext);

  const { createAlert } = useAlert();

  const { getProducts } = useUpload();

  const [data, setData] = useState({
    // step of the process
    step: 0,
    // selected vendor object
    vendor: undefined,
    // Products from vendor currently in db
    currentProducts: [],
    // Products from sheet
    uploadedProducts: [],
    // Products in sheet but not in db
    createProducts: [],
    // products in db but not in sheet
    deleteProducts: [],
    // products in db and in sheet
    updateProducts: []
  });

  useEffect(() => {
    if (data.vendor !== undefined) {
      makeRequest('post', 'api', '/products/Vendor', {
        vendor: data.vendor._id
      })
        .then((res) => {
          setData({ ...data, currentProducts: res.data });
        })
        .catch((error) => {
          createAlert(error);
        });
    }
  }, [data.vendor]);

  useEffect(() => {
    if (data.uploadedProducts.length > 0) {
      let { createProducts, deleteProducts, updateProducts } = getProducts(
        data.currentProducts,
        data.uploadedProducts,
        data.vendor._id
      );
      setData({ ...data, createProducts, deleteProducts, updateProducts });
    }
  }, [data.uploadedProducts]);

  const updateData = (field, value) => {
    setData({ ...data, [field]: value, step: data.step + 1 });
  };

  const downloadProducts = () => {
    makeRequest('post', 'api', '/products/save')
      .then((res) => {
        createAlert(res.data, false);
      })
      .catch((error) => {
        createAlert(error);
      });
  };

  const submitPricing = () => {
    let obj = {
      Create: data.createProducts,
      Delete: data.deleteProducts,
      Update: data.updateProducts
    };
    console.log(obj);
    makeRequest('post', 'bulk', '/Pricing', obj)
      .then((res) => {
        createAlert(res.data, false);
      })
      .catch((error) => {
        createAlert(error);
      });
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <UploadTypeSelect updateData={updateData} />;
      case 1:
        return <UploadVendorSelect updateData={updateData} />;
      case 2:
        return <UploadSheetSelect updateData={updateData} />;
      case 3:
        return <UploadConfirmPricing submit={submitPricing} data={data} />;
      default:
        return 'Error, Something went wrong';
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item className="flex flexBaseline" xs={12}>
        <h2 className="flexSpacer">Bulk Upload Products</h2>
        <Button variant="contained" color="primary" onClick={downloadProducts}>
          Download Products
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        {getStepContent(data.step)}
      </Grid>
    </Grid>
  );
}
