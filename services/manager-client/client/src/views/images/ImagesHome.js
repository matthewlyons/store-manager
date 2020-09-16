import React, { useState, useEffect, useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, TextField, Button, Divider } from '@material-ui/core';

import { useAlert, useUpload } from '../../customHooks';

import { StoreContext } from '../../context/StoreContext';
import VendorSelect from './components/VendorSelect';
import ImageSelect from './components/ImageSelect';

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

export default function ImagesHome() {
  const classes = useStyles();
  const { makeRequest } = useContext(StoreContext);

  const { createAlert } = useAlert();

  const [vendor, setVendor] = useState(undefined);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (vendor !== undefined) {
      console.log('Making Request');
      makeRequest('post', 'api', '/products/Images', {
        vendor: vendor._id
      })
        .then((res) => {
          setProducts(res.data);
          console.log(res.data);
        })
        .catch((error) => {
          createAlert(error);
        });
    }
  }, [vendor]);

  return (
    <div>
      {vendor === undefined ? (
        <VendorSelect setVendor={setVendor} />
      ) : (
        <ImageSelect products={products} />
      )}
    </div>
  );
}
