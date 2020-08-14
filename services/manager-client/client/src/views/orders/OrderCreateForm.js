/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import { useAlert } from '../../customHooks';
import { Prompt } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { Grid, Button, Divider, Menu, MenuItem } from '@material-ui/core';

// Components
import OrderCustomerInfo from './components/OrderCustomerInfo';
import OrderTotals from './components/OrderTotals';
import OrderFormProducts from './components/OrderFormProducts';

import { StoreContext } from '../../context/StoreContext';

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

export default function OrderCreateForm(props) {
  const { createAlert } = useAlert();
  const classes = useStyles();

  const { makeRequest, state } = useContext(StoreContext);

  // Pickup Sales Tax Address
  const VancouverWoodworks = {
    street: '3000 NE Andreson Rd',
    city: 'Vancouver',
    zip: '98661',
    state: 'Washington'
  };

  // State
  const [customerID, setCustomerID] = useState(undefined);
  const [customer, setCustomer] = useState({ addresses: [] });

  const [note, setNote] = useState('');

  const [driversLicense, setDriversLicense] = useState({
    number: '',
    experationDate: ''
  });

  const [staticValues, setStaticValues] = useState({
    storeArrival: 16,
    address: 0,
    deposit: 0,
    delivery: false,
    deliveryFee: 99,
    topLine: false,
    taxRate: 0.084
  });

  // Products in Order
  const [products, setProducts] = useState([]);
  const [orderValues, setOrderValues] = useState({
    itemTotal: 0,
    salesTax: 0,
    subTotal: 0,
    totalDue: 0
  });

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Submit Order to Database
  const submitOrder = () => {
    let orderObj = {
      products: products,
      delivery: staticValues.delivery,
      salesTaxRate: staticValues.taxRate,
      ...orderValues,
      deposit: staticValues.deposit,
      customer: customer._id,
      employee: state.apiAuth.user.name,
      note
    };

    let customProducts = products.filter((product) => {
      return product.status === 'Special Order';
    });

    if (customProducts.length > 0) {
      orderObj.estimatedStoreArrival = staticValues.storeArrival;
    }

    if (staticValues.delivery) {
      orderObj.deliveryFee = staticValues.deliveryFee;
      let address = {
        street: customer.addresses[staticValues.address].street,
        city: customer.addresses[staticValues.address].city,
        state: customer.addresses[staticValues.address].state,
        zip: customer.addresses[staticValues.address].zip
      };
      orderObj.address = address;
      if (customer.addresses[staticValues.address].state === 'Oregon') {
        orderObj.driversLicense = driversLicense;
      }
    } else if (customer.addresses.length > 0) {
      let address = {
        street: customer.addresses[0].street,
        city: customer.addresses[0].city,
        state: customer.addresses[0].state,
        zip: customer.addresses[0].zip
      };
      orderObj.address = address;
    }

    makeRequest('post', 'api', '/orders/', orderObj)
      .then((res) => {
        let order = res.data;
        window.location = `/Orders/View/${order._id}`;
      })
      .catch((error) => {
        createAlert(error);
      });
  };

  // Submit Draft Order to Database
  const submitDraftOrder = () => {
    let orderObj = {
      products: products,
      delivery: staticValues.delivery,
      salesTaxRate: staticValues.taxRate,
      ...orderValues,
      deposit: staticValues.deposit,
      customer: customer._id,
      employee: state.apiAuth.user.name,
      note
    };

    let customProducts = products.filter((product) => {
      return product.status === 'Special Order';
    });

    if (customProducts.length > 0) {
      orderObj.estimatedStoreArrival = staticValues.storeArrival;
    }

    if (staticValues.delivery) {
      orderObj.deliveryFee = staticValues.deliveryFee;
      let address = {
        street: customer.addresses[staticValues.address].street,
        city: customer.addresses[staticValues.address].city,
        state: customer.addresses[staticValues.address].state,
        zip: customer.addresses[staticValues.address].zip
      };
      orderObj.address = address;
      if (customer.addresses[staticValues.address].state === 'Oregon') {
        orderObj.driversLicense = driversLicense;
      }
    } else if (customer.addresses.length > 0) {
      let address = {
        street: customer.addresses[0].street,
        city: customer.addresses[0].city,
        state: customer.addresses[0].state,
        zip: customer.addresses[0].zip
      };
      orderObj.address = address;
    }

    makeRequest('post', 'api', '/draftorders/', orderObj)
      .then((res) => {
        let order = res.data;
        window.location = `/DraftOrders/View/${order._id}`;
      })
      .catch((error) => {
        createAlert(error);
      });
  };

  // Set Customer ID from Params
  useEffect(() => {
    if (props.match.params.id) {
      setCustomerID(props.match.params.id);
    }
  }, [props.match.params.id]);

  // Update Tax information on address or dlivery change
  useEffect(() => {
    if (customer.addresses) {
      console.log(customer);
      let { street, city, zip, state } = staticValues.delivery
        ? customer.addresses[staticValues.address]
        : VancouverWoodworks;

      if (state !== 'Washington' && state !== 'WA') {
        console.log(state);
        setStaticValues({ ...staticValues, taxRate: 0 });
      } else {
        makeRequest('post', 'tax', '/', { street, city, zip })
          .then((res) => {
            setStaticValues({ ...staticValues, taxRate: res.data.rate });
          })
          .catch((error) => {
            createAlert(error);
          });
      }
    }
  }, [staticValues.address, staticValues.delivery]);

  // Get Customer Information
  useEffect(() => {
    if (customerID) {
      makeRequest('get', 'api', `/customers/${customerID}`)
        .then((res) => {
          setCustomer(res.data);
        })
        .catch((error) => {
          createAlert(error);
        });
    }
  }, [customerID]);

  useEffect(() => {
    console.log(products);
    let { deliveryFee, taxRate, deposit, delivery } = staticValues;

    deliveryFee = Number(deliveryFee);
    deposit = Number(deposit);

    let itemTotal = products.reduce((total, product) => {
      return total + parseInt(product.price) * product.quantity;
    }, 0);

    let salesTax;
    let subTotal;
    if (delivery) {
      salesTax = parseFloat(((itemTotal + deliveryFee) * taxRate).toFixed(2));
      subTotal = parseFloat((itemTotal + deliveryFee + salesTax).toFixed(2));
    } else {
      salesTax = parseFloat((itemTotal * taxRate).toFixed(2));
      subTotal = parseFloat((itemTotal + salesTax).toFixed(2));
    }

    let totalDue = parseFloat((subTotal - deposit).toFixed(2));

    setOrderValues({ itemTotal, salesTax, subTotal, totalDue });
  }, [products, staticValues]);

  return (
    <Grid container spacing={3}>
      <Grid item className="flex flexBaseline" xs={12}>
        {customerID ? (
          <h2 className="flexSpacer">New Order for {customer.name}.</h2>
        ) : (
          <h2 className="flexSpacer">New Order.</h2>
        )}
        <div className={classes.buttonGroup}>
          <Button variant="contained" color="primary" onClick={handleClick}>
            Menu
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={submitOrder}>Submit Order</MenuItem>
            <MenuItem onClick={submitDraftOrder}>Save as Draft</MenuItem>
          </Menu>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <OrderFormProducts products={products} setProducts={setProducts} />
      <Grid item xs={12} md={3}>
        <Grid container spacing={3}>
          <Grid item xs={6} md={12}>
            <OrderCustomerInfo
              customerID={customerID}
              setCustomerID={setCustomerID}
              customer={customer}
              setCustomer={setCustomer}
              staticValues={staticValues}
              setStaticValues={setStaticValues}
              orderValues={orderValues}
              driversLicense={driversLicense}
              setDriversLicense={setDriversLicense}
            />
          </Grid>
          <Grid item xs={6} md={12}>
            <OrderTotals
              staticValues={staticValues}
              orderValues={orderValues}
              setStaticValues={setStaticValues}
              setNote={setNote}
              note={note}
            />
          </Grid>
        </Grid>
      </Grid>
      <Prompt when={true} message={'Are You Sure You Want To Leave?'} />
    </Grid>
  );
}
