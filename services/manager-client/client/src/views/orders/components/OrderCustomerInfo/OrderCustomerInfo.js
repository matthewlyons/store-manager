import React, { useState, useContext, useEffect } from 'react';

import { useAlert } from '../../../../customHooks';

import { makeStyles } from '@material-ui/core/styles';

import {
  Grid,
  Button,
  Divider,
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  InputLabel,
  Switch,
  FormControl,
  Select,
  TextField,
  IconButton
} from '@material-ui/core';

import MoreVertIcon from '@material-ui/icons/MoreVert';

// Components
import SlideModal from '../../../../components/SlideModal/SlideModal';
import ListLink from '../../../../components/ListLink';
import ListItem from '../../../../components/ListItem';
import MoneyInput from '../../../../components/MoneyInput';

import { StoreContext } from '../../../../context/StoreContext';
import CustomerForm from '../../../../components/Modals/CustomerForm';
import DriversLicenseModal from '../../../../components/Modals/DriversLicenseModal';

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

export default function OrderCustomerInfo(props) {
  const { createAlert } = useAlert();

  const { setError, makeRequest } = useContext(StoreContext);

  const classes = useStyles();

  const {
    edit,
    customerID,
    setCustomerID,
    customer,
    setCustomer,
    staticValues,
    setStaticValues,
    orderValues,
    driversLicense,
    setDriversLicense
  } = props;

  const [editCustomerModal, setEditCustomerModal] = useState(false);
  const [searchCustomerModal, setSearchCustomerModal] = useState(false);
  const [newCustomerModal, setNewCustomerModal] = useState(false);

  const [customerModal, setCustomerModal] = useState(false);
  const [driversLicenseModal, setDriversLicenseModal] = useState(false);
  const [addressModal, setAddressModal] = useState(false);

  const [recommendedDeposit, setRecommendedDeposit] = useState(0);

  // Value of DB search
  const [query, setQuery] = useState('');

  // Returned Array from DB Search
  const [databaseArray, setDatabaseArray] = useState([]);

  const toggleModal = (modal) => {
    switch (modal) {
      case 'search':
        setSearchCustomerModal(!searchCustomerModal);
        setQuery('');
        setDatabaseArray([]);
        break;
      case 'address':
        setAddressModal(!addressModal);
        break;
      case 'new':
        setNewCustomerModal(!newCustomerModal);
        break;
      case 'edit':
        setEditCustomerModal(!editCustomerModal);
        break;
      case 'customer':
        setCustomerModal(!customerModal);
        break;
      case 'license':
        setDriversLicenseModal(!driversLicenseModal);
        break;
      default:
        break;
    }
  };

  // Set Search Query
  const updateQuery = (event) => {
    setQuery(event.target.value);
  };

  // Search Product Database for Query
  const searchDB = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.target.blur();
      let url = `/customers/search/${query}`;

      makeRequest('get', 'api', url)
        .then((res) => {
          if (res.data.length > 0) {
            setDatabaseArray(res.data);
          } else {
            setError('No Customers Found');
          }
        })
        .catch((error) => {
          console.log(error);
          createAlert(error);
        });
    }
  };

  // Change In Address
  const addressChange = (e) => {
    setStaticValues({ ...staticValues, address: e.target.value });
  };

  const updateStaticValues = (e) => {
    let updatedValues = { ...staticValues };
    updatedValues[e.target.name] = e.target.value;
    setStaticValues({ ...updatedValues });
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

  const addCurrentCustomer = (id) => {
    setCustomerID(id);
    toggleModal('search');
  };

  const removeCustomer = () => {
    setCustomerID('');
    setStaticValues({ ...staticValues, delivery: false });
  };

  const createCustomer = (newCustomer) => {
    makeRequest('post', 'api', '/customers/', newCustomer)
      .then((res) => {
        toggleModal('customer');
        let customer = res.data;
        setCustomerID(customer._id);
      })
      .catch((error) => {
        console.log(error);
        console.log('Error Occurred');
      });
  };

  const updateCustomer = (updatedCustomer) => {
    makeRequest('put', 'api', `/customers/${customerID}`, updatedCustomer)
      .then((res) => {
        let customer = res.data;
        setCustomer({ ...customer });
        toggleModal('customer');
      })
      .catch((error) => {
        createAlert(error);
      });
  };

  useEffect(() => {
    let recommended = parseInt(
      (orderValues.subTotal + orderValues.salesTax) * 0.3
    );
    setRecommendedDeposit(recommended);
    console.log(recommended);
    console.log(orderValues);
  }, [orderValues]);

  let editCustomerAction;
  if (customerID && edit !== true) {
    editCustomerAction = (
      <IconButton
        onClick={() => {
          toggleModal('customer');
        }}
      >
        <MoreVertIcon />
      </IconButton>
    );
  } else {
    editCustomerAction = null;
  }

  return (
    <React.Fragment>
      <Grid item xs={12} md={12}>
        <Card className={classes.root}>
          <CardHeader
            subheader="Customer Information!"
            style={{ textAlign: 'center' }}
            action={editCustomerAction}
          />
          <Divider />
          {staticValues.delivery && (
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
          )}
          {customerID &&
            staticValues.delivery &&
            customer.addresses[staticValues.address].state === 'Oregon' && (
              <React.Fragment>
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} style={{ textAlign: 'center' }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          toggleModal('license');
                        }}
                      >
                        Add Drivers License
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
              </React.Fragment>
            )}
          {!customerID && (
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      toggleModal('search');
                    }}
                  >
                    Current Customer
                  </Button>
                </Grid>
                <Grid item xs={12} style={{ textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      toggleModal('customer');
                    }}
                  >
                    New Customer
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          )}
          {customerID && (
            <CardContent>
              {customer.addresses.length > 0 ? (
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
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12} style={{ textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        toggleModal('customer');
                      }}
                    >
                      Add Address
                    </Button>
                  </Grid>
                </Grid>
              )}
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
          <Divider />
          <CardContent>
            <FormControl variant="outlined" fullWidth={true}>
              <InputLabel id="demo-controlled-open-select-label">
                Estimated Store Arrival Date
              </InputLabel>
              <Select
                native
                name="storeArrival"
                label="Estimated Recieving Date"
                onChange={updateStaticValues}
                value={staticValues.storeArrival}
              >
                <option value={1}>1 Week</option>
                <option value={2}>2 Weeks</option>
                <option value={3}>3 Weeks</option>
                <option value={4}>4 Weeks</option>
                <option value={5}>5 Weeks</option>
                <option value={6}>6 Weeks</option>
                <option value={7}>7 Weeks</option>
                <option value={8}>8 Weeks</option>
                <option value={9}>9 Weeks</option>
                <option value={10}>10 Weeks</option>
                <option value={11}>11 Weeks</option>
                <option value={12}>12 Weeks</option>
                <option value={13}>13 Weeks</option>
                <option value={14}>14 Weeks</option>
                <option value={15}>15 Weeks</option>
                <option value={16}>16 Weeks</option>
              </Select>
            </FormControl>
          </CardContent>
          <Divider />
        </Card>
      </Grid>
      {/* Search Current Customers Modal */}
      <SlideModal
        open={searchCustomerModal}
        close={() => {
          toggleModal('search');
        }}
        title="Search Customers"
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth={true}
              id="standard-basic"
              label="Search"
              onChange={updateQuery}
              onKeyPress={searchDB}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <ListLink>
              {databaseArray.map((customer, i) => {
                return (
                  <div
                    key={i}
                    onClick={() => {
                      addCurrentCustomer(customer._id);
                    }}
                  >
                    <ListItem>
                      <p>{customer.name}</p>
                      {customer.addresses.length > 0 && (
                        <p>
                          {customer.addresses[0].street},{' '}
                          {customer.addresses[0].zip}
                        </p>
                      )}
                    </ListItem>
                  </div>
                );
              })}
            </ListLink>
          </Grid>
        </Grid>
      </SlideModal>
      {/* Create Customer Modal */}
      <CustomerForm
        customer={customer}
        open={customerModal}
        customerID={customerID}
        updateCustomer={updateCustomer}
        createCustomer={createCustomer}
        removeCustomer={removeCustomer}
        close={() => {
          toggleModal('customer');
        }}
      />
      {/* Oregon Drivers License Modal */}
      <DriversLicenseModal
        driversLicense={driversLicense}
        setDriversLicense={setDriversLicense}
        open={driversLicenseModal}
        close={() => {
          toggleModal('license');
        }}
      />
    </React.Fragment>
  );
}
