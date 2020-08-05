/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Modal,
  InputAdornment,
  Select,
  FormControl
} from '@material-ui/core';

import { StoreContext } from '../../context/StoreContext';

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

export default function ProductForm(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { setSuccess, makeRequest } = useContext(StoreContext);
  useEffect(() => {
    if (props.match) {
      makeRequest('get', 'api', `/products/${props.match.params.id}`)
        .then((res) => {
          setProduct(res.data);
        })
        .catch((error) => {
          error.errors.forEach((err) => {
            enqueueSnackbar(err.message, { variant: 'error' });
          });
        });
    }
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

  const classes = useStyles();
  const [product, setProduct] = useState({
    vendor: 'A-America',
    sku: '',
    price: undefined,
    compare_at_price: undefined,
    type: undefined,
    title: '',
    description: '',
    vendorCollection: ''
  });

  const [vendors, setVendors] = useState([]);

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const toggleModal = (modal) => {
    switch (modal) {
      case 'delete':
        setOpenDeleteModal(!openDeleteModal);
        break;
      default:
        break;
    }
  };

  const updateField = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  const submitProduct = () => {
    if (props.match) {
      makeRequest('post', 'api', `/products/${props.match.params.id}`, product)
        .then((res) => {
          setSuccess('Success');
        })
        .catch((error) => {
          error.errors.forEach((err) => {
            enqueueSnackbar(err.message, { variant: 'error' });
          });
        });
    } else {
      makeRequest('post', 'api', '/products/', product)
        .then((res) => {
          let product = res.data;
          window.location = `/products/View/${product._id}`;
        })
        .catch((error) => {
          error.errors.forEach((err) => {
            enqueueSnackbar(err.message, { variant: 'error' });
          });
        });
    }
  };

  const deleteProductModal = () => {
    toggleModal('delete');
  };
  const deleteProduct = () => {
    makeRequest('delete', 'api', `/products/${product._id}`)
      .then((res) => {
        window.location = `http://localhost:3000/Products`;
      })
      .catch((error) => {
        error.errors.forEach((err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        });
      });
  };

  const title = props.match ? 'Edit Product' : 'New Product';
  const button = props.match ? 'Save' : 'Submit';

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item className="flex flexBaseline" xs={12}>
          <h2 className="flexSpacer">{title}</h2>
          <div>
            <Grid container spacing={3}>
              <Grid item className="flex flexBaseline" xs={6}>
                {props.match && (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={deleteProductModal}
                  >
                    Delete
                  </Button>
                )}
              </Grid>
              <Grid item className="flex flexBaseline" xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={submitProduct}
                >
                  {button}
                </Button>
              </Grid>
            </Grid>
          </div>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container spacing={3}>
                  <Grid item sm={12} md={3}>
                    <FormControl variant="outlined" fullWidth={true}>
                      <Select
                        native
                        name="vendor"
                        value={product.vendor._id}
                        onChange={updateField}
                      >
                        {vendors.map((vendor, i) => {
                          return (
                            <option key={i} value={vendor._id}>
                              {vendor.name}
                            </option>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item sm={12} md={3}>
                    <TextField
                      fullWidth={true}
                      label="SKU"
                      variant="outlined"
                      name="sku"
                      value={product.sku}
                      onChange={updateField}
                    />
                  </Grid>
                  <Grid item sm={12} md={3}>
                    <TextField
                      fullWidth={true}
                      label="Collection"
                      variant="outlined"
                      name="vendorCollection"
                      value={product.vendorCollection}
                      onChange={updateField}
                    />
                  </Grid>
                  <Grid item sm={12} md={3}>
                    <TextField
                      fullWidth={true}
                      label="Title"
                      variant="outlined"
                      name="title"
                      value={product.title}
                      onChange={updateField}
                    />
                  </Grid>
                  <Grid item sm={12} md={4}>
                    <FormControl variant="outlined" fullWidth={true}>
                      <Select
                        native
                        name="subCategory"
                        value={product.subCategory}
                        onChange={updateField}
                      >
                        <option value="Bed">Bed</option>
                        <option value="Chest">Chest</option>
                        <option value="Dresser">Dresser</option>
                        <option value="Armoire">Armoire</option>
                        <option value="Trundle">Trundle</option>
                        <option value="Nightstand">Nightstand</option>
                        <option value="Mirror">Mirror</option>
                        <option value="Sofa Table">Sofa Table</option>
                        <option value="Coffee Table">Coffee Table</option>
                        <option value="End Table">End Table</option>
                        <option value="Wall Unit">Wall Unit</option>
                        <option value="TV Cabinet">TV Cabinet</option>
                        <option value="Clock">Clock</option>
                        <option value="Curio">Curio</option>
                        <option value="Desk">Desk</option>
                        <option value="Hutch">Hutch</option>
                        <option value="File Cabinet">File Cabinet</option>
                        <option value="Bookcase">Bookcase</option>
                        <option value="Office Chair">Office Chair</option>
                        <option value="Table">Table</option>
                        <option value="Bench">Bench</option>
                        <option value="Chair">Chair</option>
                        <option value="Stool">Stool</option>
                        <option value="Wine">Wine</option>
                        <option value="Buffet">Buffet</option>
                        <option value="Table">Table</option>
                        <option value="Futon">Futon</option>
                        <option value="Rocking Chair">Rocking Chair</option>
                        <option value="Uncategorized">Uncategorized</option>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item sm={12} md={4}>
                    <TextField
                      fullWidth={true}
                      label="Price"
                      variant="outlined"
                      name="price"
                      value={product.price}
                      onChange={updateField}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item sm={12} md={4}>
                    <TextField
                      fullWidth={true}
                      label="Compare At Price"
                      variant="outlined"
                      name="compare_at_price"
                      value={product.compare_at_price}
                      onChange={updateField}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item sm={12}>
                    <TextField
                      fullWidth={true}
                      label="Description"
                      variant="outlined"
                      name="description"
                      value={product.description}
                      multiline
                      onChange={updateField}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={openDeleteModal}
        onClose={() => {
          toggleModal('delete');
        }}
        className="modalContainer"
      >
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <h2>Are you sure you want to delete this product?</h2>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="secondary"
                onClick={deleteProduct}
              >
                Delete
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </React.Fragment>
  );
}
