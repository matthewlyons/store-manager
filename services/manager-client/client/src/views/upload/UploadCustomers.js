import React, { useState, useEffect, useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, TextField, Button, Divider } from '@material-ui/core';

import { useAlert, useUpload } from '../../customHooks';

import CustomersUploadSheet from './components/CustomersUploadSheet';
import CustomersUploadConfirm from './components/CustomersUploadConfirm';

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

  const { getCustomers } = useUpload();

  const [data, setData] = useState({
    // step of the process
    step: 0,
    // Customers From sheet
    uploadedCustomers: [],
    // Formatted Customer List
    formattedCustomers: []
  });

  useEffect(() => {
    let { formattedCustomers } = getCustomers(data.uploadedCustomers);
    setData({ ...data, formattedCustomers });
  }, [data.uploadedCustomers]);

  const updateData = (field, value) => {
    setData({ ...data, [field]: value, step: data.step + 1 });
  };

  const submit = () => {
    makeRequest('post', 'bulk', '/Customers', {
      customers: data.formattedCustomers
    })
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
        return <CustomersUploadSheet updateData={updateData} />;
      case 1:
        return <CustomersUploadConfirm data={data} submit={submit} />;
      default:
        return 'Error, Something went wrong';
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item className="flex flexBaseline" xs={12}>
        <h2 className="flexSpacer">Bulk Upload Customers</h2>
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
