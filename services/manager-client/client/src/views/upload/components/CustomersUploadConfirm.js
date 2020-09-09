import React, { useEffect, useState } from 'react';
import { useAlert } from '../../../customHooks';
import { makeStyles } from '@material-ui/core/styles';

import {
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableHead,
  TableCell,
  TableContainer,
  TableRow
} from '@material-ui/core';

import ProductTable from './ProductTable';

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

export default function CustomersUploadConfirm(props) {
  const classes = useStyles();

  let { submit, data } = props;
  let { formattedCustomers } = data;

  useEffect(() => {
    console.log(data);
    console.log(data.formattedCustomers);
  }, [data]);

  const { createAlert } = useAlert();

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item className="flex flexBaseline" xs={12}>
          <h2 className="flexSpacer">Uploaded Customers</h2>

          <Button variant="contained" color="primary" onClick={submit}>
            Submit
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TableContainer>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Customer Name</TableCell>
                        <TableCell align="left">Address</TableCell>
                        <TableCell align="left">Phone</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formattedCustomers.map((element, i) => {
                        let { name, addresses, phone } = element;
                        let street = addresses[0]?.street;
                        let city = addresses[0]?.city;
                        let state = addresses[0]?.state;
                        let zip = addresses[0]?.zip;
                        let unit = addresses[0]?.unit;

                        let number = phone[0]?.number;
                        let comment = phone[0]?.comment;

                        return (
                          <TableRow key={i}>
                            <TableCell align="left">{name}</TableCell>
                            <TableCell align="left">
                              {street} {city}, {state} {zip}, {unit}
                            </TableCell>

                            <TableCell align="left">
                              {number} | {comment}
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
