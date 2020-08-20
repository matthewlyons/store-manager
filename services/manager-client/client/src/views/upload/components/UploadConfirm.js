import React, { useEffect, useState, useContext } from 'react';
import { useAlert } from '../../../customHooks';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow,
  Grid,
  Typography,
  Divider,
  Button
} from '@material-ui/core';

import { StoreContext } from '../../../context/StoreContext';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

export default function UploadConfirm(props) {
  const { createAlert } = useAlert();
  const classes = useStyles();

  let { currentProducts, uploadedProducts } = props;

  const { setError, setSuccess, makeRequest } = useContext(StoreContext);

  const [createProducts, setCreateProducts] = useState([]);
  const [deleteProducts, setDeleteProducts] = useState([]);
  const [updateProducts, setUpdateProducts] = useState([]);

  const stringContains = (title, query) => {
    return title.toLowerCase().includes(query.toLowerCase());
  };

  const getCollection = (title) => {
    // Bedroom
    if (stringContains(title, 'Bed')) {
      return ['Bed', 'Bedroom'];
    } else if (stringContains(title, 'Chest')) {
      return ['Chest', 'Bedroom'];
    } else if (stringContains(title, 'Dresser')) {
      return ['Dresser', 'Bedroom'];
    } else if (stringContains(title, 'Armoire')) {
      return ['Armoire', 'Bedroom'];
    } else if (stringContains(title, 'Trundle')) {
      return ['Trundle', 'Bedroom'];
    } else if (stringContains(title, 'Nightstand') || stringContains(title, 'Night')) {
      return ['Nightstand', 'Bedroom'];
    } else if (stringContains(title, 'Mirror')) {
      return ['Mirror', 'Bedroom'];
      // Occasional
    } else if (stringContains(title, 'Sofa')) {
      return ['Sofa Table', 'Occasional'];
    } else if (stringContains(title, 'Coffee')) {
      return ['Coffee Table', 'Occasional'];
    } else if (stringContains(title, 'End')) {
      return ['End Table', 'Occasional'];
      // Living Room
    } else if (stringContains(title, 'Wall')) {
      return ['Wall Unit', 'Living Room'];
    } else if (
      stringContains(title, 'Media') ||
      stringContains(title, 'Entertainment') ||
      stringContains(title, 'Stand') ||
      stringContains(title, 'Console')
    ) {
      return ['TV Cabinet', 'Living Room'];
    } else if (stringContains(title, 'Clock')) {
      return ['Clock', 'Living Room'];
    } else if (stringContains(title, 'Curio')) {
      return ['Curio', 'Living Room'];
      // Office
    } else if (
      stringContains(title, 'Desk') ||
      stringContains(title, 'ROLLTOP') ||
      stringContains(title, 'Flattop') ||
      stringContains(title, 'CREDENZA')
    ) {
      return ['Desk', 'Office'];
    } else if (stringContains(title, 'Hutch')) {
      return ['Hutch', 'Office'];
    } else if (stringContains(title, 'Bookcase')) {
      return ['Bookcase', 'Office'];
    } else if (stringContains(title, 'File')) {
      return ['File Cabinet', 'Office'];
    } else if (stringContains(title, 'Office Chair')) {
      return ['Office Chair', 'Office'];
      // Dining
    } else if (stringContains(title, 'Table') || stringContains(title, 'TBL')) {
      return ['Table', 'Dining'];
    } else if (stringContains(title, 'Bench') || stringContains(title, 'Trunk')) {
      return ['Bench', 'Bedroom'];
    } else if (stringContains(title, 'Chair')) {
      return ['Chair', 'Dining'];
    } else if (stringContains(title, 'Stool')) {
      return ['Stool', 'Dining'];
    } else if (stringContains(title, 'Wine')) {
      return ['Wine', 'Dining'];
    } else if (
      stringContains(title, 'Server') ||
      stringContains(title, 'Buffet') ||
      stringContains(title, 'Sideboard') ||
      stringContains(title, 'Side') ||
      stringContains(title, 'China') ||
      stringContains(title, 'Cabinet')
    ) {
      return ['Buffet', 'Dining'];
      // Misc
    } else if (stringContains(title, 'Futon')) {
      return ['Futon', 'Misc'];
    } else if (stringContains(title, 'Rocker')) {
      return ['Rocking Chair', 'Misc'];
    } else {
      return ['Uncategorized', 'Uncategorized'];
    }
  };

  const findUpdateDeleteProducts = (currentProducts, newProducts) => {
    let deleteProducts = [];
    let updateProducts = [];
    currentProducts.forEach((product) => {
      let item = newProducts.find((x) => x.sku === product.sku);
      if (!item) {
        deleteProducts.push(product);
      } else {
        updateProducts.push(product);
      }
    });
    return { deleteProducts, updateProducts };
  };

  const findCreateUpdateProducts = (currentProducts, newProducts) => {
    let createProducts = [];
    newProducts.forEach((product) => {
      let item = currentProducts.find((x) => x.sku === product.sku);
      if (!item) {
        createProducts.push(product);
      }
    });
    return createProducts;
  };

  useEffect(() => {
    let data = JSON.parse(uploadedProducts);
    console.log(data);
    let filterData = data.map((obj) => {
      let [subCategory, category] = getCollection(obj.title);
      return {
        sku: obj.sku,
        price: Math.round(obj['our price']),
        compare_at_price: Math.round(obj['list price']),
        title: obj.title,
        vendor: props.vendor._id,
        vendorCollection: obj.vendorCollection,
        subCategory,
        category
      };
    });
    let createProducts = findCreateUpdateProducts(currentProducts, filterData);
    let { deleteProducts, updateProducts } = findUpdateDeleteProducts(currentProducts, filterData);

    setCreateProducts([...createProducts]);
    setDeleteProducts([...deleteProducts]);
    setUpdateProducts([...updateProducts]);
  }, [uploadedProducts]);

  useEffect(() => {
    console.log(props);
  }, [props]);

  const submitData = () => {
    makeRequest('post', 'bulk', '/Pricing', {
      Create: createProducts,
      Delete: deleteProducts,
      Update: updateProducts
    })
      .then((res) => {
        setSuccess('Success');
      })
      .catch((error) => {
        createAlert(error);
      });
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item className="flex flexBaseline" xs={12}>
          <h2 className="flexSpacer">Upload Products</h2>

          <Button variant="contained" color="primary" onClick={submitData}>
            Submit
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography style={{ textAlign: 'center' }}>New Products</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <TableContainer>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Include</TableCell>
                        <TableCell align="left">Vendor!</TableCell>
                        <TableCell align="left">SKU</TableCell>
                        <TableCell align="left">Collection</TableCell>
                        <TableCell align="left">Title</TableCell>
                        <TableCell align="left">Category</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {createProducts.map((element, i) => {
                        return (
                          <TableRow key={'delete' + i}>
                            <TableCell component="th" scope="row"></TableCell>
                            <TableCell align="left">{props.vendor.name}</TableCell>
                            <TableCell align="left">{element.sku}</TableCell>
                            <TableCell align="left">{element.vendorCollection}</TableCell>
                            <TableCell align="left">{element.title}</TableCell>
                            <TableCell align="left">{element.subCategory}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography style={{ textAlign: 'center' }}>Old Products</Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <TableContainer>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Include</TableCell>
                        <TableCell align="left">Vendor!</TableCell>
                        <TableCell align="left">SKU</TableCell>
                        <TableCell align="left">Collection</TableCell>
                        <TableCell align="left">Title</TableCell>
                        <TableCell align="left">Category</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {deleteProducts.map((element, i) => {
                        return (
                          <TableRow key={'delete' + i}>
                            <TableCell component="th" scope="row"></TableCell>
                            <TableCell align="left">{props.vendor.name}</TableCell>
                            <TableCell align="left">{element.sku}</TableCell>
                            <TableCell align="left">{element.vendorCollection}</TableCell>
                            <TableCell align="left">{element.title}</TableCell>
                            <TableCell align="left">{element.subCategory}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}
