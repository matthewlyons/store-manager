/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import SlideModal from '../../SlideModal';
import * as yup from 'yup';

import { makeStyles } from '@material-ui/core/styles';

import {
  Grid,
  Button,
  Divider,
  FormControl,
  Select,
  TextField,
  ListItem
} from '@material-ui/core';

import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

import Autocomplete from '@material-ui/lab/Autocomplete';

import { format } from 'react-phone-input-auto-format';
import ListLink from '../../ListLink';

const useStyles = makeStyles((theme) => ({
  buttonGroup: {
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}));

let emailSchema = yup.string().email();

export default function CustomerForm(props) {
  const classes = useStyles();
  const commonCities = [
    'Vancouver',
    'Portland',
    'Ridgefield',
    'Battle Ground',
    'Camas',
    'Washougal'
  ];

  const { register, handleSubmit, errors } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  });

  let {
    customer,
    customerID,
    open,
    close,
    createCustomer,
    updateCustomer
  } = props;

  useEffect(() => {
    if (customerID) {
      setCustomerState({ ...customer });
    }
  }, [open]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  let title = customerID ? 'Edit Customer' : 'Create Customer';

  const [customerState, setCustomerState] = useState({
    addresses: [],
    phone: [],
    email: []
  });

  const [newAddress, setNewAddress] = useState(null);

  const editCustomer = (event) => {
    let updatedCustomer = customerState;
    updatedCustomer[event.target.name] = event.target.value;
    setCustomerState({ ...updatedCustomer });
  };

  const addNewPhone = () => {
    let updatedCustomer = customerState;
    updatedCustomer.phone.push({ number: '', comment: '' });
    setCustomerState({ ...updatedCustomer });
  };

  const deletePhone = (index) => {
    let updatedCustomer = customerState;
    updatedCustomer.phone.splice(index, 1);
    setCustomerState({ ...updatedCustomer });
  };

  const addNewAddress = () => {
    let updatedCustomer = customerState;
    updatedCustomer.addresses.push({
      street: '',
      city: '',
      state: 'Washington',
      zip: undefined,
      comment: ''
    });
    setCustomerState({ ...updatedCustomer });
  };

  const deleteAddress = (index) => {
    let updatedCustomer = customerState;
    updatedCustomer.addresses.splice(index, 1);
    setCustomerState({ ...updatedCustomer });
  };

  const editPhoneAddress = (event) => {
    let updatedCustomer = customerState;
    let str = event.target.name;
    let first = str.indexOf('-');
    let last = str.lastIndexOf('-');
    let length = str.length;
    let type = str.substring(0, first);
    let index = str.substring(first + 1, last);
    let field = str.substring(last + 1, length);
    updatedCustomer[type][index][field] = event.target.value;
    setCustomerState({ ...updatedCustomer });
  };

  const editPhone = (event) => {
    let updatedCustomer = customerState;
    let str = event.target.name;
    let phoneNumber = format(event.target.value);
    let first = str.indexOf('-');
    let last = str.lastIndexOf('-');
    let length = str.length;
    let type = str.substring(0, first);
    let index = str.substring(first + 1, last);
    let field = str.substring(last + 1, length);
    updatedCustomer[type][index][field] = phoneNumber;
    setCustomerState({ ...updatedCustomer });
  };

  const editCity = (i, value) => {
    let updatedCustomer = customerState;
    updatedCustomer.addresses[i].city = value;
    setCustomerState({ ...updatedCustomer });
  };

  const addNewEmail = () => {
    let updatedCustomer = customerState;
    updatedCustomer.email.push('');
    setCustomerState({ ...updatedCustomer });
  };

  const editEmail = (event) => {
    let str = event.target.name;
    let name = str.split('-');
    let index = Number(name[1]);
    let updatedCustomer = customerState;
    updatedCustomer.email[index] = event.target.value;
    setCustomerState({ ...updatedCustomer });
  };

  const deleteEmail = (index) => {
    let updatedCustomer = customerState;
    updatedCustomer.email.splice(index, 1);
    setCustomerState({ ...updatedCustomer });
  };

  const selectAddress = (place) => {
    let [
      city,
      state,
      country
    ] = place.structured_formatting.secondary_text.split(', ');
    const geocoder = new window.google.maps.Geocoder();
    let street = place.structured_formatting.main_text;

    geocoder.geocode({ placeId: place.place_id }, (res, status) => {
      if (status === 'OK') {
        const postalCode = res[0].address_components.find((component) =>
          component.types.some((type) => type === 'postal_code')
        );
        if (postalCode) {
          let zip = postalCode.short_name;
          let updatedCustomer = customerState;
          updatedCustomer.addresses.push({
            street,
            city,
            state,
            zip,
            comment: ''
          });
          setCustomerState({ ...updatedCustomer });
          setNewAddress(null);
        }
      } else {
        setNewAddress(null);
      }
    });
  };

  const onSubmit = () => {
    if (customerID) {
      updateCustomer(customerState);
    } else {
      createCustomer(customerState);
    }
  };

  return (
    <SlideModal open={open} close={close} title={title}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth={true}
              label="Customer Name"
              variant="outlined"
              name="name"
              value={customerState.name}
              onChange={editCustomer}
              inputRef={register({ required: 'Customer Name is required.' })}
              error={errors.name !== undefined}
              helperText={errors.name?.message}
              inputProps={{ autoCorrect: 'off', spellCheck: false }}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {customerState.email.map((email, i) => {
            let name = `email-${i}`;
            let errorText =
              errors[name]?.type === 'isEmail'
                ? 'Not an actual email.'
                : errors[name]?.message;
            return (
              <Grid item xs={12} key={name}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth={true}
                      label="Email Address"
                      variant="outlined"
                      value={email}
                      name={name}
                      onChange={editEmail}
                      inputRef={register({
                        required:
                          'An Email Address is required. Add an email address or delete this field.',
                        validate: {
                          isEmail: (value) => emailSchema.isValidSync(value)
                        }
                      })}
                      inputProps={{ autoCorrect: 'off', spellCheck: false }}
                      error={errors[name] !== undefined}
                      helperText={errorText}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        deleteEmail(i);
                      }}
                    >
                      Delete
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={addNewEmail}>
              Add Email
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {customerState.phone.map((phone, i) => {
            let name = `phone-${i}-`;
            return (
              <Grid item xs={12} key={name}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth={true}
                      label="Phone Number"
                      variant="outlined"
                      value={phone.number}
                      name={name + 'number'}
                      onChange={editPhone}
                      inputRef={register({
                        required:
                          'A Phone Number is required. Add a Phone Number or delete this field.'
                      })}
                      inputProps={{ autoCorrect: 'off', spellCheck: false }}
                      error={errors[name] !== undefined}
                      helperText={errors[name]?.message}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth={true}
                      label="Comment"
                      variant="outlined"
                      value={phone.comment}
                      name={name + 'comment'}
                      onChange={editPhoneAddress}
                      inputRef={register}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        deletePhone(i);
                      }}
                    >
                      Delete
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={addNewPhone}>
              Add Phone
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          {customerState.addresses.map((address, i) => {
            let name = `addresses-${i}-`;
            return (
              <Grid item xs={12} key={name}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth={true}
                      label="Street"
                      variant="outlined"
                      value={address.street}
                      name={name + 'street'}
                      onChange={editPhoneAddress}
                      inputRef={register}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Autocomplete
                      freeSolo
                      autoSelect
                      options={commonCities}
                      onInputChange={(_, value) => {
                        editCity(i, value);
                      }}
                      defaultValue={address.city}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="City"
                          variant="outlined"
                          fullWidth
                          name={name + 'city'}
                          value={address.city}
                          inputRef={register}
                          inputProps={{ autoCorrect: 'off', spellCheck: false }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl variant="outlined" fullWidth={true}>
                      <Select
                        native
                        value={address.state}
                        name={name + 'state'}
                        onChange={editPhoneAddress}
                        inputRef={register}
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
                      value={address.zip}
                      name={name + 'zip'}
                      onChange={editPhoneAddress}
                      type="number"
                      inputProps={{ pattern: '[0-9]*' }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth={true}
                      label="Comment"
                      variant="outlined"
                      value={address.comment}
                      name={name + 'comment'}
                      onChange={editPhoneAddress}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        deleteAddress(i);
                      }}
                    >
                      Delete
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
          {newAddress !== null ? (
            <React.Fragment>
              <Grid item xs={12}>
                <GooglePlacesAutocomplete
                  apiKey={process.env.REACT_APP_GOOGLE_API}
                  onSelect={console.log}
                  debounce={1000}
                  autocompletionRequest={{
                    componentRestrictions: {
                      country: ['us']
                    }
                  }}
                  renderInput={(props) => (
                    <TextField
                      fullWidth={true}
                      label="Address"
                      variant="outlined"
                      {...props}
                    />
                  )}
                  renderSuggestions={(active, suggestions) => (
                    <ListLink>
                      {suggestions.map((suggestion, i) => {
                        return (
                          <ListItem
                            key={i}
                            className="suggestion"
                            onClick={() => {
                              selectAddress(suggestion);
                            }}
                          >
                            {suggestion.description}
                          </ListItem>
                        );
                      })}
                    </ListLink>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setNewAddress(null);
                  }}
                >
                  Remove New Address
                </Button>
              </Grid>
            </React.Fragment>
          ) : (
            <Grid item xs={12}>
              <div className={classes.buttonGroup}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setNewAddress('');
                  }}
                >
                  Add Address
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addNewAddress}
                >
                  Add Custom Address
                </Button>
              </div>
            </Grid>
          )}

          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            {customerID ? (
              <Button variant="contained" color="primary" type="submit">
                Update Customer
              </Button>
            ) : (
              <Button variant="contained" color="primary" type="submit">
                Create Customer
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </SlideModal>
  );
}
