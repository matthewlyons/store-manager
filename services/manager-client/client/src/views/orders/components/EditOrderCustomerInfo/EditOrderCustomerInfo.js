import React, { useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  Grid,
  Button,
  Divider,
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  Switch,
  FormControl,
  Select,
  TextField,
  Typography,
  IconButton
} from '@material-ui/core';

import MoreVertIcon from '@material-ui/icons/MoreVert';

// Components
import MoneyInput from '../../../../components/MoneyInput';

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

export default function EditOrderCustomerInfo(props) {
  const classes = useStyles();

  const {
    customerID,
    customer,
    staticValues,
    setStaticValues,
    orderValues,
    address,
    changeAddress,
    setChangeAddress
  } = props;



  const recommendedDeposit = parseInt(
    (orderValues.subTotal + orderValues.salesTax) * 0.3
  );

  // Change In Address
  const addressChange = (e) => {
    setStaticValues({ ...staticValues, address: e.target.value });
  };

  const updateDelivery = () => {
    setStaticValues({ ...staticValues, delivery: !staticValues.delivery });
  };

  const updateDeposit = (event) => {
    setStaticValues({
      ...staticValues,
      deposit: event.target.value
    });
  };

  const autoDeposit = (event) => {
    setStaticValues({
      ...staticValues,
      deposit: recommendedDeposit
    });
  };

  const updateDeliveryFee = (event) => {
    setStaticValues({
      ...staticValues,
      deliveryFee: event.target.value
    });
  };

  let editCustomerAction;
  if (changeAddress) {
    editCustomerAction = null;
  } else {
    editCustomerAction = (
      <IconButton
        onClick={() => {
          setChangeAddress(true);
        }}
      >
        <MoreVertIcon />
      </IconButton>
    );
  }

  return (
    <React.Fragment>
      <Grid item xs={12} md={12}>
        <Card className={classes.root}>
          <CardHeader
            subheader="Customer Information"
            style={{ textAlign: 'center' }}
            action={editCustomerAction}
          />
          <Divider />
          {staticValues.delivery &&
            address &&
            (changeAddress ? (
              <React.Fragment>
                <CardContent>
                  <FormControl variant="outlined" fullWidth={true}>
                    {customer.addresses && (
                      <Select native name="state" onChange={addressChange}>
                        {customer.addresses.map((element, i) => (
                          <option value={i} key={i}>
                            {element.street}, {element.zip}
                          </option>
                        ))}
                      </Select>
                    )}
                  </FormControl>
                </CardContent>
                <Divider />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <CardContent>
                  <Typography>
                    {address.street}, {address.city}, {address.state}{' '}
                    {address.zip}
                  </Typography>
                </CardContent>
                <Divider />
              </React.Fragment>
            ))}
          {customerID && (
            <CardContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={staticValues.delivery}
                    onChange={updateDelivery}
                    name="delivery"
                    value={staticValues.delivery}
                    color="primary"
                  />
                }
                label="Delivery"
              />
            </CardContent>
          )}
          {staticValues.delivery && (
            <CardContent>
              <TextField
                fullWidth={true}
                id="standard-basic"
                label="Delivery"
                variant="outlined"
                value={staticValues.deliveryFee}
                onChange={updateDeliveryFee}
                InputProps={{
                  inputComponent: MoneyInput
                }}
              />
            </CardContent>
          )}
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth={true}
                  id="standard-basic"
                  label="Deposit"
                  variant="outlined"
                  value={staticValues.deposit}
                  onChange={updateDeposit}
                  InputProps={{
                    inputComponent: MoneyInput
                  }}
                />
              </Grid>
              {staticValues.deposit !== recommendedDeposit && (
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                  <Button variant="outlined" onClick={autoDeposit}>
                    Recommended: ${recommendedDeposit}
                  </Button>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </React.Fragment>
  );
}
