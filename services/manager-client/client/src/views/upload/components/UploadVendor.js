import React, { useEffect, useState, useContext } from 'react';
import { useSnackbar } from 'notistack';
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

export default function UploadVendor(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { setError, makeRequest } = useContext(StoreContext);
  const classes = useStyles();
  const [vendors, setVendors] = useState([]);
  useEffect(() => {
    makeRequest('get', 'api', '/vendor/')
      .then((res) => {
        setVendors(res.data);
      })
      .catch((error) => {
        error.errors.forEach((err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        });
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
                    props.moveForward('vendor', element);
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
