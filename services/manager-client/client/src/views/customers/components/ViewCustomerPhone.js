import React, { useEffect, useState } from 'react';

import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Divider,
  Card,
  CardActions,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Modal,
  Snackbar,
  Grid,
  Paper
} from '@material-ui/core';

import MuiAlert from '@material-ui/lab/Alert';

import DeleteIcon from '@material-ui/icons/Delete';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

export default function ViewCustomerPhone(props) {
  const classes = useStyles();

  const toggleModal = () => {
    setOpenPhoneModal(!openPhoneModal);
  };

  // Error Alert
  const [error, setError] = useState({ message: '', show: false });

  // Confirm Modal
  const [confirm, setConfirm] = useState({ array: '', index: undefined });
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  // Phone State
  const [openPhoneModal, setOpenPhoneModal] = useState(false);
  const [phone, setPhone] = useState({ number: '', comment: '' });

  const [customer, setCustomer] = useState({
    _id: '',
    name: '',
    phone: [],
    addresses: [],
    notes: [],
    orders: []
  });

  useEffect(() => {
    setCustomer(props.customer);
  }, []);

  const handlePhoneInput = (e) => {
    setPhone({
      ...phone,
      [e.target.name]: e.target.value
    });
  };

  const pushPhone = () => {
    let editedCustomer = customer;
    editedCustomer.phone.unshift(phone);
    submitCustomer(editedCustomer);
  };

  const submitCustomer = (updatedCustomer) => {
    axios
      .put(`/api/customers/${props.match.params.id}`, updatedCustomer)
      .then((res) => {
        window.location.reload(true);
      })
      .catch((err) => {
        setError({ message: 'Something Went Wrong', show: true });
      });
  };

  const removeItem = () => {
    let editedCustomer = customer;
    let newArray = customer[confirm.array];
    newArray.splice(confirm.index, 1);

    editedCustomer[confirm.array] = newArray;
    submitCustomer(editedCustomer);
  };

  const areYouSure = (array, i) => {
    setConfirm({
      array,
      index: i
    });
    setOpenConfirmModal(!openConfirmModal);
  };

  const closeAlert = (event, reason) => {
    setError({ message: '', show: false });
  };

  return (
    <React.Fragment>
      <Card className={classes.paper}>
        <h3>Phone Numbers</h3>
        <Divider />
        {customer.phone.length > 0 && (
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {customer.phone.map((item, i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {item.comment}
                  </TableCell>
                  <TableCell align="left">{item.number}</TableCell>
                  <TableCell align="right" className="TableStaffCell">
                    <DeleteIcon
                      color="secondary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        areYouSure('phone', i);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <CardActions style={{ justifyContent: 'Center' }}>
          <Button size="small" onClick={toggleModal}>
            New a Phone Number
          </Button>
        </CardActions>
      </Card>
      {/* Add Phone Modal */}
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={openPhoneModal}
        onClose={toggleModal}
        className="modalContainer"
      >
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                label="Phone Number"
                variant="outlined"
                name="number"
                value={phone.number}
                onChange={handlePhoneInput}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                label="Comment"
                variant="outlined"
                name="comment"
                value={phone.comment}
                onChange={handlePhoneInput}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={pushPhone}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
      <Snackbar open={error.show} autoHideDuration={6000} onClose={closeAlert}>
        <Alert onClose={closeAlert} severity="error">
          {error.message}
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
