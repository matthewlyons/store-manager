import React, { useEffect, useState } from 'react';
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

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

export default function UploadConfirmPricing(props) {
  let { submit, data } = props;
  let { vendor, createProducts, deleteProducts } = data;

  const { createAlert } = useAlert();
  const classes = useStyles();

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item className="flex flexBaseline" xs={12}>
          <h2 className="flexSpacer">Upload Products</h2>

          <Button variant="contained" color="primary" onClick={submit}>
            Submit
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Paper>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography style={{ textAlign: 'center' }}>
                  New Products
                </Typography>
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
                        <TableCell align="left">Vendor</TableCell>
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
                            <TableCell align="left">{vendor.name}</TableCell>
                            <TableCell align="left">{element.sku}</TableCell>
                            <TableCell align="left">
                              {element.vendorCollection}
                            </TableCell>
                            <TableCell align="left">{element.title}</TableCell>
                            <TableCell align="left">
                              {element.subCategory}
                            </TableCell>
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
                <Typography style={{ textAlign: 'center' }}>
                  Old Products
                </Typography>
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
                        <TableCell align="left">Vendor</TableCell>
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
                            <TableCell align="left">{vendor.name}</TableCell>
                            <TableCell align="left">{element.sku}</TableCell>
                            <TableCell align="left">
                              {element.vendorCollection}
                            </TableCell>
                            <TableCell align="left">{element.title}</TableCell>
                            <TableCell align="left">
                              {element.subCategory}
                            </TableCell>
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
