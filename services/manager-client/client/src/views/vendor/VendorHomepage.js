import React, { useState, useContext, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { useAlert } from '../../customHooks';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, TextField, Button, Divider } from '@material-ui/core';

import ListLink from '../../components/ListLink';
import ListItem from '../../components/ListItem';

import { StoreContext } from '../../context/StoreContext';
import VendorForm from '../../components/Modals/VendorForm';

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

export default function VendorHomepage(props) {
  const { createAlert } = useAlert();
  const { makeRequest } = useContext(StoreContext);
  const classes = useStyles();

  const [vendors, setVendors] = useState([]);
  const [vendorModal, setVendorModal] = useState(false);

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
    <Grid container spacing={3}>
      <Grid item className="flex flexBaseline" xs={12}>
        <h2 className="flexSpacer">Vendors</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setVendorModal(true);
          }}
        >
          New Vendor
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      {vendors.length > 0 && (
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <ListLink>
              {vendors.map((vendor, i) => (
                <ListItem key={i} to={`/Vendor/${vendor._id}`}>
                  <p>{vendor.name}</p>
                </ListItem>
              ))}
            </ListLink>
          </Paper>
        </Grid>
      )}
      <VendorForm
        open={vendorModal}
        close={() => {
          setVendorModal(false);
        }}
      />
    </Grid>
  );
}
