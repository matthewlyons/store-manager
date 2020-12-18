import React, { useContext, useState } from 'react';

import { TextField, Grid, Divider } from '@material-ui/core';

import ListLink from '../../../components/ListLink';
import ListItem from '../../../components/ListItem';

import { useAlert } from '../../../customHooks';
import SlideModal from '../../../components/SlideModal';
import { StoreContext } from '../../../context/StoreContext';

export default function ProductModal({
  open,
  close,
  submit,
  removeItem,
  vendor,
  products
}) {
  const { createAlert } = useAlert();
  const { setError, makeRequest, state } = useContext(StoreContext);

  const [query, setQuery] = useState('');
  const [name, setName] = useState('');
  const [databaseArray, setDatabaseArray] = useState([]);

  // Set Search Query
  const updateQuery = (event) => {
    setQuery(event.target.value);
  };

  const updateName = (event) => {
    setName(event.target.value);
  };

  // Search Product Database for Query
  const searchDB = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.target.blur();
      let url = `/products/vendor/${vendor}/search/${query}`;

      makeRequest('get', 'api', url)
        .then((res) => {
          if (res.data.length > 0) {
            setDatabaseArray(res.data);
            console.log(res.data);
          } else {
            createAlert('No Products Found');
          }
        })
        .catch((error) => {
          createAlert(error);
        });
    }
  };

  // Check if Product is in order for customer
  const productInOrder = (sku) => {
    for (let i = 0; i < products.length; i++) {
      if (products[i].sku === sku && products[i].name === name) {
        return true;
      }
    }
    return false;
  };

  const addItem = (item) => {
    let { color, title, sku, vendorCollection } = item;
    let poItem = {
      color,
      title,
      sku,
      vendorCollection,
      date: Date.now(),
      quantity: 1
    };
    if (name !== '') {
      poItem.name = name;
    } else {
      poItem.name = 'Stock';
    }
    let exists = productInOrder(poItem.sku);
    if (!exists) {
      submit(poItem);
    } else {
      removeItem(poItem);
    }
  };

  return (
    <SlideModal open={open} close={close} title="Product Order Sheet">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth={true}
            label="Customer Name"
            helperText="Leave Blank for Stock Product"
            variant="outlined"
            name="customerName"
            value={name}
            onChange={updateName}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth={true}
            label="Search Product"
            variant="outlined"
            name="productSearch"
            value={query}
            onChange={updateQuery}
            onKeyPress={searchDB}
          />
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <ListLink>
            {databaseArray.map((product, i) => {
              let inOrder = productInOrder(product.sku)
                ? 'activeLink textWhite'
                : '';

              return (
                <div
                  onClick={() => {
                    addItem(product);
                  }}
                  key={i}
                >
                  <ListItem propClasses={inOrder}>
                    <p>
                      {product.sku} | {product.vendor.name} | {product.title}
                    </p>
                  </ListItem>
                </div>
              );
            })}
          </ListLink>
        </Grid>
      </Grid>
    </SlideModal>
  );
}
