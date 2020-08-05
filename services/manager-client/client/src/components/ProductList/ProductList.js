import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Card,
  CardHeader,
  TextField,
  Dialog,
  Slide,
  IconButton
} from '@material-ui/core';

import ListLink from '../ListLink';
import ListItem from '../ListItem';

const useStyles = makeStyles((theme) => ({
  flexContainer: {
    display: 'flex'
  },
  fixedPosition: {
    position: 'fixed'
  },
  marginAuto: {
    margin: 'auto'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    position: 'fixed',
    top: 0,
    left: '10%',
    width: '90%',
    height: '100%',
    overflow: 'scroll'
  }
}));

export default function ProductList(props) {
  const { addProduct, closeModal } = props;
  const classes = useStyles();
  return (
    <Dialog
      aria-labelledby="simple-dialog-title"
      open={props.products.length > 0}
      onBackdropClick={() => {
        closeModal('db');
      }}
    >
      <Slide
        direction="left"
        in={props.products.length > 0}
        mountOnEnter
        unmountOnExit
        style={{ zIndex: 10000 }}
      >
        <Paper elevation={4} className={classes.paper} square>
          <div className={classes.flexContainer}>
            <h3 className={classes.marginAuto}>Add Products</h3>
          </div>

          <ListLink>
            {props.products.map((product, i) => (
              <div
                onClick={() => {
                  addProduct(product);
                }}
                key={i}
              >
                <ListItem>
                  <p>
                    {product.sku} | {product.vendor.name} | {product.title}
                  </p>
                  <p>${product.price}</p>
                </ListItem>
              </div>
            ))}
          </ListLink>
        </Paper>
      </Slide>
    </Dialog>
  );
}
