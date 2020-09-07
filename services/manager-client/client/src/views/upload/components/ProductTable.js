import React, { useEffect, useMemo } from 'react';

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
  Button,
  AppBar,
  Tabs,
  Tab,
  Box
} from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

export default function ProductTable(props) {
  const classes = useStyles();

  let { products, vendor, value, position } = props;

  const productList = useMemo(() => {
    console.log('Product Change');
    return products;
  }, [products]);

  let className = useMemo(() => {
    return value !== position ? 'ProductTable Hidden' : 'ProductTable';
  }, [props]);

  return (
    <Grid container spacing={3} className={className}>
      <Grid item xs={12}>
        <TableContainer>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Include</TableCell>
                <TableCell align="left">Vendor</TableCell>
                <TableCell align="left">SKU</TableCell>
                <TableCell align="left">Collection</TableCell>
                <TableCell align="left">Title</TableCell>
                <TableCell align="left">Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productList.map((element, i) => {
                return (
                  <TableRow key={'delete' + i}>
                    <TableCell component="th" scope="row"></TableCell>
                    <TableCell align="left">{vendor.name}</TableCell>
                    <TableCell align="left">{element.sku}</TableCell>
                    <TableCell align="left">
                      {element.vendorCollection}
                    </TableCell>
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
  );
}
