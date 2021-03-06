import React, { useEffect, useState, useContext } from 'react';

import { useAlert } from '../../../customHooks';

import { makeStyles } from '@material-ui/core/styles';

import {
  Grid,
  Button,
  Divider,
  Card,
  CardHeader,
  CardContent
} from '@material-ui/core';

import { StoreContext } from '../../../context/StoreContext';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  buttonGroup: {
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}));

export default function VendorSelect(props) {
  let { setVendor } = props;

  const { createAlert } = useAlert();

  const { makeRequest } = useContext(StoreContext);

  const classes = useStyles();

  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    makeRequest('get', 'api', '/vendor/')
      .then((res) => {
        setVendors(res.data);
      })
      .catch((error) => {
        createAlert(error);
      });
  }, []);

  return (
    <Grid
      container
      spacing={3}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ paddingTop: '10%' }}
    >
      <Grid item xs={12}>
        <Card className={classes.paper}>
          <CardHeader
            subheader="Select Vendor"
            style={{ textAlign: 'center' }}
          />
          <Divider />
          <CardContent className={classes.buttonGroup}>
            {vendors.map((element, i) => {
              return (
                <Button
                  variant="contained"
                  color="primary"
                  key={i}
                  onClick={() => {
                    setVendor(element);
                  }}
                >
                  {element.name}
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
