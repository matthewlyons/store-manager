import React, { useEffect, useState, useContext } from 'react';
import { useSnackbar } from 'notistack';
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
  FormControl
} from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';

import ListLink from '../../components/ListLink';
import ListItem from '../../components/ListItem';

import Autocomplete from '@material-ui/lab/Autocomplete';

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

export default function CustomerViewPage(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { setSuccess, makeRequest } = useContext(StoreContext);

  const commonCities = [
    'Vancouver',
    'Portland',
    'Ridgefield',
    'Battle Ground',
    'Camas',
    'Washougal'
  ];

  const classes = useStyles();

  // Confirm Modal
  const [confirm, setConfirm] = useState({ array: '', index: undefined });
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  // Name Modal
  const [openNameModal, setOpenNameModal] = useState(false);

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

  // Note State
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [note, setNote] = useState({ comment: '', staff: '' });

  const [customer, setCustomer] = useState({
    _id: '',
    name: '',
    phone: [],
    addresses: [],
    email: [],
    notes: [],
    orders: [],
    draftorders: []
  });

  useEffect(() => {
    makeRequest('get', 'api', `/customers/${props.match.params.id}`)
      .then((res) => {
        setCustomer(res.data);
      })
      .catch((error) => {
        error.errors.forEach((err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        });
      });
  }, []);

  const toggleModal = (modal) => {
    switch (modal) {
      case 'phone':
        setOpenPhoneModal(!openPhoneModal);
        break;
      case 'address':
        setOpenAddressModal(!openAddressModal);
        break;
      case 'confirm':
        setOpenConfirmModal(!openConfirmModal);
        break;
      case 'name':
        setOpenNameModal(!openNameModal);
        break;
      case 'note':
        setOpenNoteModal(!openNoteModal);
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
    let editedCustomer = customer;
    editedCustomer.phone.unshift(phone);

    submitCustomer(editedCustomer);
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

  const handleNoteInput = (e) => {
    setNote({
      ...note,
      [e.target.name]: e.target.value
    });
  };

  const pushNote = () => {
    let editedCustomer = customer;
    editedCustomer.notes.unshift(note);
    submitCustomer(editedCustomer);
  };

  const submitCustomer = (updatedCustomer) => {
    makeRequest(
      'put',
      'api',
      `/customers/${props.match.params.id}`,
      updatedCustomer
    )
      .then((res) => {
        setOpenNameModal(false);
        setOpenConfirmModal(false);
        setOpenAddressModal(false);
        setOpenPhoneModal(false);
        setOpenNoteModal(false);
        setSuccess('Success');
      })
      .catch((error) => {
        error.errors.forEach((err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        });
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

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item className="flex flexBaseline" xs={12}>
          <h2 className="flexSpacer">{customer.name}</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              toggleModal('name');
            }}
          >
            Edit Customer
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {customer.draftorders.length > 0 && (
          <Grid item xs={12}>
            <Card className={classes.paper}>
              <h3>Draft Orders</h3>
              <Divider />
              <ListLink>
                {customer.draftorders.map((order, i) => {
                  let products;
                  if (order.order) {
                    products = order.order.products
                      .map((element) => {
                        return element.title ? element.title : element.sku;
                      })
                      .join(', ');
                  }
                  return (
                    <ListItem
                      key={i}
                      to={`/DraftOrders/View/${order.order._id}`}
                    >
                      <p>{Moment(order.order.date).format('MM/DD/YYYY')}</p>
                      <p>{products}</p>
                    </ListItem>
                  );
                })}
              </ListLink>
            </Card>
          </Grid>
        )}
        <Grid item xs={12}>
          <Card className={classes.paper}>
            <h3>Orders</h3>
            <Divider />
            {customer.orders.length > 0 && (
              <ListLink>
                {customer.orders.map((order, i) => {
                  let products;
                  if (order.order) {
                    products = order.order.products
                      .map((element) => {
                        return element.title ? element.title : element.sku;
                      })
                      .join(', ');
                  }
                  return (
                    <ListItem key={i} to={`/Orders/View/${order.order._id}`}>
                      <p>{Moment(order.order.date).format('MM/DD/YYYY')}</p>
                      <p>{products}</p>
                    </ListItem>
                  );
                })}
              </ListLink>
            )}
            <CardActions style={{ justifyContent: 'Center' }}>
              <Button
                size="small"
                component={Link}
                to={`/Orders/New/${props.match.params.id}`}
              >
                Add an Order
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
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
              <Button
                size="small"
                onClick={() => {
                  toggleModal('phone');
                }}
              >
                Add a Phone Number
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={classes.paper}>
            <h3>Email Addresses</h3>
            <Divider />
            {customer.email.length > 0 && (
              <Table className={classes.table} aria-label="simple table">
                <TableBody>
                  {customer.email.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">
                        {item}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
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
        </Grid>

        <Grid item xs={12}>
          <Card className={classes.paper}>
            <h3>Notes</h3>
            <Divider />
            {customer.notes.length > 0 && (
              <Table className={classes.table} aria-label="simple table">
                <TableBody>
                  {customer.notes.map((note, i) => (
                    <TableRow key={i}>
                      <TableCell component="th" scope="row">
                        {Moment(note.date).format('MM/DD/YYYY')}
                      </TableCell>
                      <TableCell align="left">{note.comment}</TableCell>
                      <TableCell align="right" className="TableStaffCell">
                        {note.staff}
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
                  toggleModal('note');
                }}
              >
                Add a Note
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      {/* Delete Entry Modal */}
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={openConfirmModal}
        onClose={() => {
          toggleModal('confirm');
        }}
        className="modalContainer"
      >
        <Paper className={classes.paper}>
          <h3>Are you sure?</h3>
          <Button variant="contained" color="secondary" onClick={removeItem}>
            Yes, delete.
          </Button>
        </Paper>
      </Modal>
      {/* Edit Name Modal */}
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={openNameModal}
        onClose={() => {
          toggleModal('name');
        }}
        className="modalContainer"
      >
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                label="Name"
                variant="outlined"
                name="name"
                value={customer.name}
                onChange={updateField}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  submitCustomer(customer);
                }}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
      {/* Add Phone Modal */}
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
      {/* Add Note Modal */}
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={openNoteModal}
        onClose={() => {
          toggleModal('note');
        }}
        className="modalContainer"
      >
        <Paper className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                id="outlined-multiline-static"
                label="Comment"
                fullWidth={true}
                multiline
                rows="4"
                variant="outlined"
                name="comment"
                value={note.comment}
                onChange={handleNoteInput}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                label="Employee"
                variant="outlined"
                name="staff"
                value={note.staff}
                onChange={handleNoteInput}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={pushNote}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Modal>
    </React.Fragment>
  );
}
