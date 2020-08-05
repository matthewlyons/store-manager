import React, { useEffect, useState } from 'react';

import axios from 'axios';
import Moment from 'moment';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Grid,
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
  Select,
  FormControl,
  Snackbar
} from '@material-ui/core';

import MuiAlert from '@material-ui/lab/Alert';

import DeleteIcon from '@material-ui/icons/Delete';

import Autocomplete from '@material-ui/lab/Autocomplete';

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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ViewCustomerAddress(props) {
  const commonCities = [
    'Vancouver',
    'Portland',
    'Ridgefield',
    'Battle Ground',
    'Camas',
    'Washougal'
  ];

  const classes = useStyles();

  // Error Alert
  const [error, setError] = useState({ message: '', show: false });

  // Confirm Modal
  const [confirm, setConfirm] = useState({ array: '', index: undefined });
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  // Address State
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: 'Washington',
    zip: undefined,
    comment: ''
  });

  const [customer, setCustomer] = useState({
    _id: '',
    name: '',
    phone: [],
    addresses: [],
    notes: [],
    orders: []
  });

  const toggleModal = () => {
    setOpenAddressModal(!openAddressModal);
  };

  const handleAddressInput = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const pushAddress = () => {
    let editedCustomer = customer;
    editedCustomer.addresses.unshift(address);
    submitCustomer(editedCustomer);
  };

  const setCity = (e, value) => {
    setAddress({
      ...address,
      city: value
    });
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

  useEffect(() => {
    setCustomer(props.customer);
  });

  return (
    <React.Fragment>
      <Card className={classes.paper}>
        <h3>Addresses</h3>
        <Divider />
        {customer.addresses.length > 0 && (
          <Table className={classes.table} aria-label="simple table">
            <TableBody>
              {customer.addresses.map((item, i) => (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {item.comment}
                  </TableCell>
                  <TableCell align="left">
                    {item.street}, {item.city}, {item.state} {item.zip}
                  </TableCell>
                  <TableCell align="right" className="TableStaffCell">
                    <DeleteIcon
                      color="secondary"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        areYouSure('addresses', i);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <CardActions style={{ justifyContent: 'Center' }}>
          <Button
            size="small"
            onClick={() => {
              toggleModal('address');
            }}
          >
            Add an Address
          </Button>
        </CardActions>
      </Card>
      {/* Add Address Modal */}
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={openAddressModal}
        onClose={() => {
          toggleModal('address');
        }}
        className="modalContainer"
      >
        <Paper className={classes.paper + ' FormMaxWidth'}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                label="Street"
                variant="outlined"
                name="street"
                value={address.street}
                onChange={handleAddressInput}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                autoSelect
                options={commonCities}
                onInputChange={setCity}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="City"
                    variant="outlined"
                    fullWidth
                    name="city"
                    value={address.city}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl variant="outlined" fullWidth={true}>
                <Select
                  native
                  name="state"
                  value={address.state}
                  onChange={handleAddressInput}
                >
                  <option value="Washington">Washington</option>
                  <option value="Oregon">Oregon</option>
                  <option value="Idaho">Idaho</option>
                  <option value="Alabama">Alabama</option>
                  <option value="Alaska">Alaska</option>
                  <option value="Arizona">Arizona</option>
                  <option value="Arkansas">Arkansas</option>
                  <option value="California">California</option>
                  <option value="Colorado">Colorado</option>
                  <option value="Connecticut">Connecticut</option>
                  <option value="Delaware">Delaware</option>
                  <option value="District of Columbia">
                    District of Columbia
                  </option>
                  <option value="Florida">Florida</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Guam">Guam</option>
                  <option value="Hawaii">Hawaii</option>
                  <option value="Illinois">Illinois</option>
                  <option value="Indiana">Indiana</option>
                  <option value="Iowa">Iowa</option>
                  <option value="Kansas">Kansas</option>
                  <option value="Kentucky">Kentucky</option>
                  <option value="Louisiana">Louisiana</option>
                  <option value="Maine">Maine</option>
                  <option value="Maryland">Maryland</option>
                  <option value="Massachusetts">Massachusetts</option>
                  <option value="Michigan">Michigan</option>
                  <option value="Minnesota">Minnesota</option>
                  <option value="Mississippi">Mississippi</option>
                  <option value="Missouri">Missouri</option>
                  <option value="Montana">Montana</option>
                  <option value="Nebraska">Nebraska</option>
                  <option value="Nevada">Nevada</option>
                  <option value="New Hampshire">New Hampshire</option>
                  <option value="New Jersey">New Jersey</option>
                  <option value="New Mexico">New Mexico</option>
                  <option value="New York">New York</option>
                  <option value="North Carolina">North Carolina</option>
                  <option value="North Dakota">North Dakota</option>
                  <option value="Ohio">Ohio</option>
                  <option value="Oklahoma">Oklahoma</option>

                  <option value="Pennsylvania">Pennsylvania</option>
                  <option value="Rhode Island">Rhode Island</option>
                  <option value="South Carolina">South Carolina</option>
                  <option value="South Dakota">South Dakota</option>
                  <option value="Tennessee">Tennessee</option>
                  <option value="Texas">Texas</option>
                  <option value="Utah">Utah</option>
                  <option value="Vermont">Vermont</option>
                  <option value="Virginia">Virginia</option>
                  <option value="Virgin Islands">Virgin Islands</option>

                  <option value="West Virginia">West Virginia</option>
                  <option value="Wisconsin">Wisconsin</option>
                  <option value="Wyoming">Wyoming</option>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth={true}
                label="Zip Code"
                variant="outlined"
                name="zip"
                value={address.zip}
                onChange={handleAddressInput}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                label="Comment"
                variant="outlined"
                name="comment"
                value={address.comment}
                onChange={handleAddressInput}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={pushAddress}>
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
