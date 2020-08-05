/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react';
import { useSnackbar } from 'notistack';
import { Prompt } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import { Grid, Button, Divider } from '@material-ui/core';

// Components
import EditOrderCustomerInfo from './components/EditOrderCustomerInfo';
import OrderTotals from './components/OrderTotals';
import OrderProducts from './components/OrderFormProducts';

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

export default function OrderUpdateForm(props) {
  const { enqueueSnackbar } = useSnackbar();
  let { type } = props.match.params;

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
  const [customer, setCustomer] = useState({});

  const [note, setNote] = useState('');

  const [address, setAddress] = useState({});
  const [changeAddress, setChangeAddress] = useState(false);

  const [staticValues, setStaticValues] = useState({
    storeArrival: 16,
    address: 0,
    deposit: 0,
    delivery: false,
    deliveryFee: 100,
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
      estimatedStoreArrival: staticValues.storeArrival,
      note
    };

    if (staticValues.delivery) {
      orderObj.deliveryFee = staticValues.deliveryFee;
    }

    if (changeAddress) {
      orderObj.address = {
        street: customer.addresses[staticValues.address].street,
        city: customer.addresses[staticValues.address].city,
        state: customer.addresses[staticValues.address].state,
        zip: customer.addresses[staticValues.address].zip
      };
    } else {
      orderObj.address = {
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip
      };
    }

    let dest = type === 'Order' ? 'orders' : 'draftorders';
    let viewDest = type === 'Order' ? 'Orders' : 'DraftOrders';
    makeRequest('put', 'api', `/${dest}/${props.match.params.id}`, orderObj)
      .then((res) => {
        let order = res.data;
        window.location = `/${viewDest}/View/${order._id}`;
      })
      .catch((error) => {
        error.errors.forEach((err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        });
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
      let { street, city, zip, state } = staticValues.delivery
        ? customer.addresses[staticValues.address]
        : VancouverWoodworks;

      if (state !== 'Washington') {
        setStaticValues({ ...staticValues, taxRate: 0 });
      } else {
        makeRequest('post', 'tax', '/', { street, city, zip })
          .then((res) => {
            setStaticValues({ ...staticValues, taxRate: res.data.rate });
          })
          .catch((error) => {
            error.errors.forEach((err) => {
              enqueueSnackbar(err.message, { variant: 'error' });
            });
          });
      }
    }
  }, [staticValues.address, staticValues.delivery]);

  // Get Order Information
  useEffect(() => {
    let dest = type === 'Order' ? 'orders' : 'draftorders';
    makeRequest('get', 'api', `/${dest}/${props.match.params.id}`)
      .then((res) => {
        let { delivery, deliveryFee, deposit } = res.data;
        let orderProducts = res.data.products;
        let orderCustomer = res.data.customer;
        setStaticValues({
          ...staticValues,
          delivery,
          deliveryFee,
          deposit
        });
        setAddress({ ...res.data.address });
        setProducts([...orderProducts]);
        setCustomerID(orderCustomer._id);
        setCustomer({ ...orderCustomer });
      })
      .catch((error) => {
        error.errors.forEach((err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        });
      });
  }, []);

  // Product Change
  useEffect(() => {
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
      subTotal = itemTotal + deliveryFee + salesTax;
    } else {
      salesTax = parseFloat((itemTotal * taxRate).toFixed(2));
      subTotal = itemTotal + salesTax;
    }

    let totalDue = parseFloat(subTotal - deposit).toFixed(2);

    setOrderValues({ itemTotal, salesTax, subTotal, totalDue });
  }, [products, staticValues]);

  return (
    <Grid container spacing={3}>
      <Grid item className="flex flexBaseline" xs={12}>
        {customerID ? (
          <h2 className="flexSpacer">New Order for {customer.name}</h2>
        ) : (
          <h2 className="flexSpacer">New Order</h2>
        )}
        <div className={classes.buttonGroup}>
          <Button variant="contained" color="primary" onClick={submitOrder}>
            Save Order
          </Button>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <OrderProducts products={products} setProducts={setProducts} />
      <Grid item xs={12} md={3}>
        <Grid container spacing={3}>
          <Grid item xs={6} md={12}>
            <EditOrderCustomerInfo
              edit={true}
              customerID={customerID}
              setCustomerID={setCustomerID}
              customer={customer}
              staticValues={staticValues}
              setStaticValues={setStaticValues}
              orderValues={orderValues}
              address={address}
              changeAddress={changeAddress}
              setChangeAddress={setChangeAddress}
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
