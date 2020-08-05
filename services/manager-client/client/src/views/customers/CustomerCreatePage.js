import React, { useState, useContext } from 'react';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Modal,
  Select,
  FormControl
} from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';

import ListLink from '../../components/ListLink';
import ListItem from '../../components/ListItem';

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

export default function CustomerCreatePage() {
  const { enqueueSnackbar } = useSnackbar();
  const { makeRequest } = useContext(StoreContext);

  const commonCities = [
    'Vancouver',
    'Portland',
    'Ridgefield',
    'Battle Ground',
    'Camas',
    'Washougal'
  ];

  const classes = useStyles();

  // Phone State
  const [openPhoneModal, setOpenPhoneModal] = useState(false);
  const [phone, setPhone] = useState({ number: '', comment: '' });
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
    name: '',
    phone: [],
    addresses: []
  });

  const toggleModal = (modal) => {
    switch (modal) {
      case 'phone':
        setOpenPhoneModal(!openPhoneModal);
        break;
      case 'address':
        setOpenAddressModal(!openAddressModal);
        break;
      default:
        break;
    }
  };

  const updateField = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoneInput = (e) => {
    setPhone({
      ...phone,
      [e.target.name]: e.target.value
    });
  };

  const pushPhone = () => {
    setCustomer({
      ...customer,
      phone: [...customer.phone, phone]
    });
    setPhone({ number: '', comment: '' });
    setOpenPhoneModal(!openPhoneModal);
  };

  const handleAddressInput = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value
    });
  };

  const pushAddress = () => {
    setCustomer({
      ...customer,
      addresses: [...customer.addresses, address]
    });
    setAddress({
      street: '',
      city: '',
      state: 'Washington',
      zip: undefined,
      comment: ''
    });
    setOpenAddressModal(!openAddressModal);
  };

  const setCity = (e, value) => {
    setAddress({
      ...address,
      city: value
    });
  };

  const submitCustomer = () => {
    makeRequest('post', 'api', '/customers/', customer)
      .then((res) => {
        let customer = res.data;
        window.location = `/Customers/View/${customer._id}`;
      })
      .catch((error) => {
        error.errors.forEach((err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        });
      });
  };

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item className="flex flexBaseline" xs={12}>
          <h2 className="flexSpacer">New Customer</h2>
          <Button variant="contained" color="primary" onClick={submitCustomer}>
            Submit
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth={true}
                      id="standard-basic"
                      label="Name"
                      variant="outlined"
                      name="name"
                      onChange={updateField}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        toggleModal('phone');
                      }}
                    >
                      Add Phone Number
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <ListLink>
                      {customer.phone.map((item, i) => (
                        <ListItem key={i}>
                          <p>{item.number}</p>
                          <p>{item.comment}</p>
                        </ListItem>
                      ))}
                    </ListLink>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper className={classes.paper}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        toggleModal('address');
                      }}
                    >
                      Add Address
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <ListLink>
                      {customer.addresses.map((item, i) => (
                        <ListItem key={i}>
                          <p>
                            {item.street}, {item.city}, {item.state} {item.zip}
                          </p>
                          <p>{item.comment}</p>
                        </ListItem>
                      ))}
                    </ListLink>
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
        open={openPhoneModal}
        onClose={() => {
          toggleModal('phone');
        }}
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
                inputProps={{ pattern: '[0-9]*' }}
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
                type="number"
                inputProps={{ pattern: '[0-9]*' }}
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
    </React.Fragment>
  );
}
