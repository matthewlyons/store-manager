import React, { useEffect, useState, useContext } from 'react';
import { useAlert, useOrder } from '../../customHooks';
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

export default function OrderCreatePage(props) {
  const { createAlert } = useAlert();
  const { getValues, getOrder } = useOrder();
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
  const [type, setType] = useState('Create');
  const [title, setTitle] = useState('');
  const [customerID, setCustomerID] = useState(undefined);
  const [customer, setCustomer] = useState({});

  const [address, setAddress] = useState({});
  const [changeAddress, setChangeAddress] = useState(false);

  const [showEst, setShowEst] = useState(true);

  const [note, setNote] = useState('');

  const [driversLicense, setDriversLicense] = useState({
    number: '',
    experationDate: ''
  });

  const [staticValues, setStaticValues] = useState({
    storeArrival: 16,
    address: 0,
    deposit: 0,
    militaryDiscount: false,

    delivery: false,
    deliveryFee: 99,
    topLine: false,
    taxRate: 0.084
  });

  // Products in Order
  const [products, setProducts] = useState([]);
  const [orderValues, setOrderValues] = useState({
    itemTotal: 0,
    discount: 0,
    salesTax: 0,
    subTotal: 0,
    totalDue: 0
  });

  // Menu Events
  const [anchor, setAnchor] = useState(null);

  const handleClick = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  // Submit Order to Database
  const submitOrder = () => {
    let orderObj = getOrder({
      customer,
      address,
      products,
      staticValues,
      orderValues,
      employee: state.apiAuth.user.name,
      note,
      driversLicense
    });

    makeRequest('post', 'api', '/orders/', orderObj)
      .then((res) => {
        let order = res.data;
        window.location = `/Orders/View/Order/${order._id}`;
      })
      .catch((error) => {
        createAlert(error);
      });
  };
  // Update Order
  const updateOrder = () => {
    let orderObj = getOrder({
      customer,
      address,
      products,
      staticValues,
      orderValues,
      employee: state.apiAuth.user.name,
      note,
      driversLicense
    });
    let dest = props.location.state.type === 'Order' ? 'orders' : 'draftorders';
    let viewDest = props.location.state.type === 'Order' ? 'Order' : 'Draft';
    makeRequest('put', 'api', `/${dest}/${props.location.state.id}`, orderObj)
      .then((res) => {
        let order = res.data;
        window.location = `/Orders/View/${viewDest}/${order._id}`;
      })
      .catch((error) => {
        createAlert(error);
      });
  };

  // Submit Draft Order to Database
  const submitDraftOrder = () => {
    let orderObj = getOrder({
      customer,
      address,
      products,
      staticValues,
      orderValues,
      employee: state.apiAuth.user.name,
      note,
      driversLicense
    });

    makeRequest('post', 'api', '/draftorders/', orderObj)
      .then((res) => {
        let order = res.data;
        window.location = `/Orders/View/Draft/${order._id}`;
      })
      .catch((error) => {
        createAlert(error);
      });
  };

  // Inital View Load
  useEffect(() => {
    // Check if Type is Create Or Update
    if (props.location.state?.id) {
      setType('Update');
      console.log('Running');
      let dest =
        props.location.state.type === 'Order' ? 'orders' : 'draftorders';
      makeRequest('get', 'api', `/${dest}/${props.location.state.id}`)
        .then((res) => {
          console.log(res.data);
          let {
            delivery,
            deliveryFee,
            deposit,
            estimatedStoreArrival
          } = res.data;
          let orderProducts = res.data.products;
          let orderCustomer = res.data.customer;
          setStaticValues({
            ...staticValues,
            delivery,
            deliveryFee,
            deposit,
            storeArrival: estimatedStoreArrival
          });
          setAddress({ ...res.data.address });
          setProducts([...orderProducts]);
          setCustomerID(orderCustomer._id);
          setCustomer({ ...orderCustomer });
          setTitle('Update Order.');
        })
        .catch((error) => {
          createAlert(error);
        });
    } else {
      setTitle('New Order.');
    }
  }, []);

  // Set Customer ID from Params
  useEffect(() => {
    if (props.match.params.id) {
      setCustomerID(props.match.params.id);
    }
  }, [props.match.params.id]);

  // Update Tax information on address or dlivery change
  useEffect(() => {
    console.log('Updating Tax Rate');
    if (customer.addresses) {
      let { street, city, zip, state } = staticValues.delivery
        ? address
        : VancouverWoodworks;
      if (state !== 'Washington' && state !== 'WA') {
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
  }, [address, staticValues.delivery]);

  // Get Customer Information
  useEffect(() => {
    if (customerID) {
      makeRequest('get', 'api', `/customers/${customerID}`)
        .then((res) => {
          setCustomer(res.data);
          setTitle(`New Order for ${res.data.name}.`);
          if (res.data.addresses?.length > 0) {
            setAddress({ ...res.data.addresses[0] });
          }
        })
        .catch((error) => {
          createAlert(error);
        });
    }
  }, [customerID]);

  useEffect(() => {
    let { itemTotal, discount, salesTax, subTotal, totalDue } = getValues(
      staticValues,
      products
    );

    setOrderValues({ itemTotal, discount, salesTax, subTotal, totalDue });
  }, [products, staticValues]);

  useEffect(() => {
    let customProducts = products.filter((product) => {
      return product.status === 'Special Order';
    });

    if (customProducts.length > 0) {
      setShowEst(true);
    } else {
      setShowEst(false);
    }
  }, [products]);

  return (
    <Grid container spacing={3}>
      <Grid item className="flex flexBaseline" xs={12}>
        <h2 className="flexSpacer">{title}</h2>

        <div className={classes.buttonGroup}>
          <Button variant="contained" color="primary" onClick={handleClick}>
            Menu
          </Button>
          {type === 'Create' ? (
            <Menu
              id="simple-menu"
              anchorEl={anchor}
              keepMounted
              open={Boolean(anchor)}
              onClose={handleClose}
            >
              <MenuItem onClick={submitOrder}>Submit Order</MenuItem>
              <MenuItem onClick={submitDraftOrder}>Save as Draft</MenuItem>
            </Menu>
          ) : (
            <Menu
              id="simple-menu"
              anchorEl={anchor}
              keepMounted
              open={Boolean(anchor)}
              onClose={handleClose}
            >
              <MenuItem onClick={updateOrder}>Save</MenuItem>
            </Menu>
          )}
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
              type={type}
              address={address}
              setAddress={setAddress}
              changeAddress={changeAddress}
              setChangeAddress={setChangeAddress}
              showEst={showEst}
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
