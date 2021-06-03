import React from 'react';

import { Typography } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  product: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px'
  },
  note: {
    margin: 0,
    padding: '0 0 10px 10%'
  },
  row: {
    borderBottom: '1px solid lightgray'
  }
}));

export default function OrderProducts(props) {
  const classes = useStyles();
  let { products, click } = props;

  return (
    <section>
      {products.map((product, i) => {
        let tableClass;
        if (i === products.length - 1) {
          tableClass = 'NoBottom' + classes.row;
        } else {
          tableClass = classes.row;
        }

        let vendor = product.vendor ? product.vendor.name : '';
        return (
          <section
            key={product.sku + i}
            className={tableClass}
            onClick={() => {
              console.log('product', i);
            }}
          >
            <div className={classes.product}>
              <Typography variant="subtitle1">
                {product.quantity} x {vendor} | {product.sku} | {product.title}
              </Typography>
              <Typography variant="subtitle1">${product.price}</Typography>
            </div>
            <div className={classes.note}>
              {product.notes.map((note, i) => {
                return (
                  <Typography variant="subtitle1" key={note + i}>
                    -{note}
                  </Typography>
                );
              })}
            </div>
          </section>
        );
      })}
    </section>
  );
}
