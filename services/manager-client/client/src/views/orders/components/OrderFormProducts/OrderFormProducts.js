import React, { useEffect, useContext, useState } from 'react';
import { useAlert } from '../../../../customHooks';
import { makeStyles } from '@material-ui/core/styles';

import {
  Grid,
  Divider,
  Card,
  CardHeader,
  CardActions,
  Typography,
  CardContent,
  TextField,
  Paper,
  Dialog,
  Slide,
  Button,
  Select,
  FormControl
} from '@material-ui/core';

// Components
import SlideModal from '../../../../components/SlideModal/SlideModal';
import ListLink from '../../../../components/ListLink';
import ListItem from '../../../../components/ListItem';

import { StoreContext } from '../../../../context/StoreContext';

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

export default function OrderFormProducts(props) {
  const classes = useStyles();
  const { createAlert } = useAlert();
  const { setError, makeRequest, state } = useContext(StoreContext);

  const { products, setProducts } = props;

  // List Of Vendors
  const [vendors, setVendors] = useState([]);

  // Value of DB search
  const [query, setQuery] = useState('');

  // Returned Array from DB Search
  const [databaseArray, setDatabaseArray] = useState([]);

  // Index of Product to be Edited
  const [editIndex, setEditIndex] = useState(0);

  // Product Edit Modal
  const [editProductModal, setEditProductModal] = useState(false);

  // Custom Product
  const [customProduct, setCustomProduct] = useState({
    sku: '',
    color: '',
    title: '',
    quantity: 1,
    status: 'Special Order',
    custom: true,
    vendor: { name: '' },
    notes: []
  });

  // Custom Product Modal
  const [customProductModal, setCustomProductModal] = useState(false);

  const toggleModal = (modal) => {
    switch (modal) {
      case 'search':
        setDatabaseArray([]);
        break;
      case 'edit':
        setEditProductModal(false);
        break;
      case 'custom':
        setCustomProductModal(false);
        break;
      default:
        break;
    }
  };

  const productInOrder = (sku) => {
    for (let i = 0; i < products.length; i++) {
      if (products[i].sku === sku) {
        return true;
      }
    }
    return false;
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
      let url = `/products/search/${query}`;

      makeRequest('get', 'api', url)
        .then((res) => {
          if (res.data.length > 0) {
            setDatabaseArray(res.data);
          } else {
            setError('No Products Found');
          }
        })
        .catch((error) => {
          createAlert(error);
        });
    }
  };

  // Add Product
  const addProduct = async (product) => {
    let exists = false;
    for (let i = 0; i < products.length; i++) {
      if (products[i].sku === product.sku) {
        exists = true;
        // updateProductQuantity('+', i);
        removeProduct(i);
        break;
      }
    }
    if (!exists) {
      let color = product.finish || product.color || '';
      setProducts([...products, { ...product, color, quantity: 1, status: 'Special Order', notes: [] }]);
    }
  };

  // Remove Product
  const removeProduct = (productIndex) => {
    let updatedProducts = products;
    updatedProducts.splice(productIndex, 1);
    setEditProductModal(false);
    setEditIndex(0);
    setProducts([...updatedProducts]);
  };

  // Product Selected for Editing
  const productSelect = (productIndex) => {
    setEditIndex(productIndex);
    setEditProductModal(true);
  };

  // Edit Product
  const editProduct = (event) => {
    let updatedProducts = products;
    updatedProducts[editIndex][event.target.name] = event.target.value;
    setProducts([...updatedProducts]);
  };

  // Edit Product Vendor
  const editVendor = (event) => {
    let updatedProducts = products;
    let name = event.target.value;
    let productVendor = vendors.find((vendor) => vendor.name === name);
    updatedProducts[editIndex].vendor = { ...productVendor };
    setProducts([...updatedProducts]);
  };

  // Edit Custom Product Vendor
  const editCustomVendor = (event) => {
    let updatedCustomProduct = customProduct;
    let name = event.target.value;
    let productVendor = vendors.find((vendor) => vendor.name === name);

    updatedCustomProduct.vendor = { ...productVendor };
    setCustomProduct({ ...updatedCustomProduct });
  };

  // Split Product
  const splitProduct = (productIndex) => {
    let product = products[productIndex];
    setProducts([
      ...products,
      {
        ...product,
        quantity: 1,
        status: 'Special Order',
        notes: []
      }
    ]);
  };

  // Edit Custom Product
  const editCustomProduct = (event) => {
    let updatedCustomProduct = customProduct;
    updatedCustomProduct[event.target.name] = event.target.value;
    setCustomProduct({ ...updatedCustomProduct });
  };

  // Edit Custom Product Quantity
  const editCustomProductQuantity = (type) => {
    let updatedCustomProduct = customProduct;

    updatedCustomProduct.quantity =
      type === '-' ? updatedCustomProduct.quantity - 1 : updatedCustomProduct.quantity + 1;

    setCustomProduct({ ...updatedCustomProduct });
  };

  // Add Custom Product
  const addCustomProduct = () => {
    setProducts([...products, { ...customProduct }]);
    setCustomProductModal(false);
    setCustomProduct({
      title: '',
      quantity: 1,
      status: 'Special Order',
      vendor: { name: '' },
      notes: []
    });
  };

  // Add Custom Product Note
  const addCustomNote = () => {
    let updatedCustomProduct = customProduct;
    updatedCustomProduct.notes.push('');
    setCustomProduct({ ...updatedCustomProduct });
  };

  // Remove Custom Product Note
  const deleteCustomNote = (noteIndex) => {
    let updatedCustomProduct = customProduct;
    updatedCustomProduct.notes.splice(noteIndex, 1);
    setCustomProduct({ ...updatedCustomProduct });
  };

  // Edit Custom Product Note
  const editCustomNote = (event) => {
    let noteIndex = event.target.name.substring(5, event.target.name.length);
    let updatedCustomProduct = customProduct;
    updatedCustomProduct.notes[noteIndex] = event.target.value;
    setCustomProduct({ ...updatedCustomProduct });
  };

  // Update Product Quantity
  const updateProductQuantity = (type, index) => {
    let updatedProducts = products;
    updatedProducts[index].quantity =
      type === '-' ? updatedProducts[index].quantity - 1 : updatedProducts[index].quantity + 1;
    if (updatedProducts[index].quantity < 0) {
      updatedProducts.splice(index, 1);
      setEditProductModal(false);
    }
    setProducts([...updatedProducts]);
  };

  // Add Product Note
  const addNote = () => {
    let updatedProducts = products;
    updatedProducts[editIndex].notes.push('');
    setProducts([...updatedProducts]);
  };

  // Remove Product Note
  const deleteNote = (noteIndex) => {
    let updatedProducts = products;
    updatedProducts[editIndex].notes.splice(noteIndex, 1);
    setProducts([...updatedProducts]);
  };

  // Edit Product Note
  const editNote = (event) => {
    let noteIndex = event.target.name.substring(5, event.target.name.length);
    let updatedProducts = products;
    updatedProducts[editIndex].notes[noteIndex] = event.target.value;
    setProducts([...updatedProducts]);
  };

  useEffect(() => {
    makeRequest('get', 'api', '/vendor/')
      .then((res) => {
        setVendors(res.data);
      })
      .catch((error) => {
        createAlert(error);
      });
  }, [state]);

  useEffect(() => {
    console.log(products);
  }, [products]);

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Card className={classes.root}>
          <CardContent className={classes.cardcontent}>
            <TextField
              fullWidth={true}
              id="standard-basic"
              label="Add Product"
              variant="outlined"
              name="productSearch"
              value={query}
              onChange={updateQuery}
              onKeyPress={searchDB}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={9}>
        <Card className={classes.root}>
          <CardHeader subheader="Products In Order" style={{ textAlign: 'center' }} />
          <Divider />
          <CardContent>
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
                    productSelect(i);
                  }}
                >
                  <div className={classes.product}>
                    <Typography variant="subtitle1">
                      {product.quantity} x {vendor} | {product.sku} | {product.vendorCollection || ''} {product.title}
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
          </CardContent>
          <Divider />
          <CardActions>
            <Button
              style={{ margin: 'auto' }}
              variant="contained"
              color="primary"
              onClick={() => {
                setCustomProductModal(true);
              }}
            >
              Add Custom Product
            </Button>
          </CardActions>
        </Card>
      </Grid>
      {/* Product Search Modal */}
      <Dialog
        open={databaseArray.length > 0}
        onBackdropClick={() => {
          toggleModal('search');
        }}
      >
        <Slide direction="left" in={databaseArray.length > 0} mountOnEnter unmountOnExit style={{ zIndex: 10000 }}>
          <Paper elevation={4} className={classes.modal} square>
            <div className={classes.flexContainer}>
              <h3 className={classes.marginAuto}>Add Products</h3>
            </div>

            <ListLink>
              {databaseArray.map((product, i) => {
                let inOrder = productInOrder(product.sku) ? 'activeLink textWhite' : '';

                return (
                  <div
                    onClick={() => {
                      addProduct(product);
                    }}
                    key={i}
                  >
                    <ListItem propClasses={inOrder}>
                      <p>
                        {product.sku} | {product.vendor.name} | {product.title}
                      </p>
                      <p>${product.price}</p>
                    </ListItem>
                  </div>
                );
              })}
            </ListLink>
          </Paper>
        </Slide>
      </Dialog>
      {/* Edit Product Modal */}
      {products.length > 0 && (
        <SlideModal
          open={editProductModal}
          close={() => {
            toggleModal('edit');
          }}
          title={'Edit ' + products[editIndex].title}
        >
          <Grid container spacing={3}>
            {products[editIndex].custom && (
              <React.Fragment>
                <Grid item xs={6}>
                  <TextField
                    fullWidth={true}
                    label="Product Title"
                    variant="outlined"
                    name="title"
                    value={products[editIndex].title}
                    onChange={editProduct}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth={true}
                    label="Product SKU"
                    variant="outlined"
                    name="sku"
                    value={products[editIndex].sku}
                    onChange={editProduct}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Select
                    native
                    variant="outlined"
                    fullWidth={true}
                    name="vendor"
                    value={products[editIndex].vendor.name}
                    onChange={editVendor}
                  >
                    {vendors.map((vendor, i) => {
                      return (
                        <option key={vendor._id} value={vendor.name}>
                          {vendor.name}
                        </option>
                      );
                    })}
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth={true}
                    label="Collection"
                    variant="outlined"
                    name="vendorCollection"
                    value={products[editIndex].vendorCollection}
                    onChange={editProduct}
                  />
                </Grid>
              </React.Fragment>
            )}
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">Quantity</Typography>
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <Button
                    onClick={() => {
                      updateProductQuantity('-', editIndex);
                    }}
                  >
                    -
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6">{products[editIndex].quantity}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    onClick={() => {
                      updateProductQuantity('+', editIndex);
                    }}
                  >
                    +
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h6">Status</Typography>
              <FormControl variant="outlined" fullWidth={true}>
                <Select native name="status" value={products[editIndex].status} onChange={editProduct}>
                  <option value="Special Order">Special Order</option>
                  <option value="In-Stock">In-Stock</option>
                  <option value="Complete">Complete</option>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      splitProduct(editIndex);
                    }}
                  >
                    Split Product
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      removeProduct(editIndex);
                      toggleModal('product');
                    }}
                  >
                    Delete Product
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                label="Color"
                variant="outlined"
                name="color"
                value={products[editIndex].color}
                onChange={editProduct}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                label="Product Price"
                variant="outlined"
                name="price"
                value={products[editIndex].price}
                onChange={editProduct}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            {products[editIndex].notes.map((note, i) => {
              let name = `Note-${i}`;
              return (
                <Grid item xs={12} key={name}>
                  <Grid container spacing={3}>
                    <Grid item xs={9}>
                      <TextField
                        fullWidth={true}
                        label="Note"
                        variant="outlined"
                        value={note}
                        name={name}
                        onChange={editNote}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          deleteNote(i);
                        }}
                      >
                        Delete
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              );
            })}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  addNote(editIndex);
                }}
              >
                Add Note
              </Button>
            </Grid>
          </Grid>
        </SlideModal>
      )}
      {/* Custom Product Modal */}
      <SlideModal
        open={customProductModal}
        close={() => {
          toggleModal('custom');
        }}
        title="Add Custom Product"
      >
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth={true}
              label="Product Title"
              variant="outlined"
              name="title"
              value={customProduct.title}
              onChange={editCustomProduct}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth={true}
              label="Product SKU"
              variant="outlined"
              name="sku"
              value={customProduct.sku}
              onChange={editCustomProduct}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth={true}
              label="Product Color"
              variant="outlined"
              name="color"
              value={customProduct.color}
              onChange={editCustomProduct}
            />
          </Grid>
          <Grid item xs={12}>
            <Select
              native
              variant="outlined"
              fullWidth={true}
              name="vendor"
              value={customProduct.vendor.name}
              onChange={editCustomVendor}
            >
              <option value="">Select a Value</option>
              {vendors.map((vendor, i) => {
                return (
                  <option key={vendor._id} value={vendor.name}>
                    {vendor.name}
                  </option>
                );
              })}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth={true}
              label="Product Collection"
              variant="outlined"
              name="vendorCollection"
              value={customProduct.vendorCollection}
              onChange={editCustomProduct}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Quantity</Typography>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                editCustomProductQuantity('-', editIndex);
              }}
            >
              -
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h6">{customProduct.quantity}</Typography>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                editCustomProductQuantity('+', editIndex);
              }}
            >
              +
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {customProduct.notes.map((note, i) => {
            let name = `Note-${i}`;
            return (
              <Grid item xs={12} key={name}>
                <Grid container spacing={3}>
                  <Grid item xs={9}>
                    <TextField
                      fullWidth={true}
                      label="Note"
                      variant="outlined"
                      value={note}
                      name={name}
                      onChange={editCustomNote}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        deleteCustomNote(i);
                      }}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addCustomNote();
              }}
            >
              Add Note
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth={true}
              label="Product Price"
              variant="outlined"
              name="price"
              value={customProduct.price}
              onChange={editCustomProduct}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={addCustomProduct}>Add Product</Button>
          </Grid>
        </Grid>
      </SlideModal>
    </React.Fragment>
  );
}
