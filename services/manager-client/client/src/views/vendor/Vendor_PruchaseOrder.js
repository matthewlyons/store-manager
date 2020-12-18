import React, { useState, useEffect, useContext } from 'react';
import Moment from 'moment';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import { StoreContext } from '../../context/StoreContext';
import { useAlert } from '../../customHooks';

import ProductModal from './components/ProductModal';
import EditModal from './components/EditModal';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  flexContainer: {
    display: 'flex'
  },
  fixedPosition: {
    position: 'fixed'
  },
  marginAuto: {
    margin: 'auto'
  },
  modal: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    position: 'fixed',
    top: 0,
    left: '10%',
    width: '90%',
    height: '100%',
    overflow: 'scroll'
  },
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
  },
  cardcontent: {
    '&:last-child': {
      paddingBottom: 16
    }
  }
}));

export default function Vendor_PruchaseOrder(props) {
  const classes = useStyles();
  const { createAlert } = useAlert();

  const [vendor, setVendor] = useState({});
  const [products, setProducts] = useState([]);
  const [productModal, setProductModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  // Index of Product to be Edited
  const [editIndex, setEditIndex] = useState(0);

  const { makeRequest } = useContext(StoreContext);

  useEffect(() => {
    makeRequest('get', 'api', `/purchaseorder/vendor/${props.match.params.id}`)
      .then((res) => {
        console.log(res.data);
        setVendor(res.data.vendor);
        setProducts(res.data.productArray);
      })
      .catch((error) => {
        createAlert(error);
      });
  }, []);

  // Add Item to List
  const addItem = (item) => {
    setProducts([...products, item]);
  };

  const removeItem = (item) => {
    let updatedProducts = products.filter(
      (product) => product.sku !== item.sku && product.name !== item.name
    );
    setProducts(updatedProducts);
  };

  const editItem = (item) => {
    console.log('Editing Item');
    console.log(item);
  };

  const submit = () => {
    let orderProducts = products.map((product) => {
      let { date, sku, vendorCollection, title, quantity, name } = product;
      return { date, sku, vendorCollection, title, quantity, name };
    });
    let purchaseOrder = {
      vendor: vendor._id,
      products: orderProducts,
      date: Date.now()
    };
  };

  const openEditModal = (i) => {
    setEditIndex(i);
    setEditModal(true);
  };

  return (
    <Grid container spacing={3}>
      <Grid item className="flex flexBaseline" xs={12}>
        <h2 className="flexSpacer">Create Purchase Order for {vendor.name}</h2>
        <Button variant="contained" color="primary" onClick={submit}>
          Submit Purchase Order
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Card className={classes.root}>
          <CardHeader
            subheader="Products In Order"
            style={{ textAlign: 'center' }}
            action={
              <IconButton
                aria-label="Add Product"
                onClick={() => {
                  setProductModal(true);
                }}
              >
                <AddIcon />
              </IconButton>
            }
          />
          <Divider />
          <CardContent>
            <TableContainer>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Date</TableCell>
                    <TableCell align="left">Quantity</TableCell>
                    <TableCell align="left">Product</TableCell>
                    <TableCell align="left">Color</TableCell>
                    <TableCell align="left">Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product, i) => {
                    let tableClass;
                    if (i === products.length - 1) {
                      tableClass = 'NoBottom' + classes.row;
                    } else {
                      tableClass = classes.row;
                    }
                    return (
                      <TableRow
                        key={i}
                        onClick={() => {
                          openEditModal(i);
                        }}
                      >
                        <TableCell component="th" scope="row" align="left">
                          {Moment(product.date).format('MM/DD/YYYY')}
                        </TableCell>
                        <TableCell align="left">{product.quantity}</TableCell>
                        <TableCell align="left">
                          {product.sku} {product.vendorCollection || ''}{' '}
                          {product.title}
                        </TableCell>
                        <TableCell align="left">{product.color}</TableCell>
                        <TableCell align="left">{product.name}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Grid>
      <ProductModal
        open={productModal}
        close={() => {
          setProductModal(false);
        }}
        vendor={vendor._id}
        products={products}
        submit={addItem}
        removeItem={removeItem}
      />
      <EditModal
        open={editModal}
        close={() => {
          setEditModal(false);
        }}
        product={products[editIndex]}
        submit={editItem}
      />
    </Grid>
  );
}
