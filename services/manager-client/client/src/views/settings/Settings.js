import React, { useEffect, useContext, useState } from 'react';
import { useAlert } from '../../customHooks';
import { StoreContext } from '../../context/StoreContext';
import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Divider,
  MenuItem,
  InputLabel,
  TextField,
  Modal,
  FormControl,
  Select,
  FormControlLabel,
  Switch
} from '@material-ui/core';

import SlideModal from '../../components/SlideModal/SlideModal';

import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary
  },
  buttonGroup: {
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}));

export default function Settings() {
  const { createAlert } = useAlert();
  const classes = useStyles();
  const { setSuccess, makeRequest, state, signOut } = useContext(StoreContext);
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', password: '' });
  const [newVendor, setNewVendor] = useState('');
  const [vendorModal, setVendorModal] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [password, setPassword] = useState({
    current_password: '',
    new_password_1: '',
    new_password_2: ''
  });

  const openChangePassword = (event) => {
    let updatedPassword = password;
    updatedPassword[event.target.name] = event.target.value;
    setPassword({ ...updatedPassword });
  };

  const submitPassword = () => {
    makeRequest('post', 'auth', `/users/${state.apiAuth.user._id}`, password)
      .then((res) => {
        setSuccess('Success');
      })
      .catch((error) => {
        createAlert(error);
      });
  };

  const toggleModal = (modal) => {
    switch (modal) {
      case 'vendor':
        setVendorModal(!vendorModal);
        break;
      case 'user':
        setUserModal(!userModal);
        break;
      case 'password':
        setPasswordModal(!passwordModal);
        break;
      default:
        break;
    }
  };

  // const deleteVendor = (e) => {
  //   makeRequest('delete', 'api', `/vendor/${e}`)
  //     .then((res) => {
  //       let vendors = vendors.filter((element) => {
  //         return element._id != e;
  //       });
  //       setVendors(vendors);
  //       setSuccess('Success');
  //     })
  //     .catch((error) => {
  // createAlert(error);
  //     });
  // };

  const areYouSure = (vendor) => {
    // setReadyDeleteVendor(vendor);
  };

  const addVendor = () => {
    makeRequest('post', 'api', '/vendor/', { name: newVendor })
      .then((res) => {
        setVendorModal(false);
        setVendors([...vendors, res.data]);
        setNewVendor('');
        setSuccess('Success');
      })
      .catch((error) => {
        createAlert(error);
      });
  };
  const addUser = () => {
    makeRequest('post', 'auth', '/admin/', newUser)
      .then((res) => {
        setUserModal(false);
        setUsers([...users, res.data]);
        setNewUser({ name: '', password: '' });
        setSuccess('Success');
      })
      .catch((error) => {
        createAlert(error);
      });
  };
  const setVisible = (e) => {
    // let vendor = vendors.find((element) => (element._id = e));
    // makeRequest('put', `/api/vendor/${e}`, { visible: vendor.visible })
    //   .then((res) => {
    //     setSuccess('Success');
    //   })
    //   .catch((error) => {
    // createAlert(error);
    //   });
  };
  const handleInput = (e) => {
    setNewVendor(e.target.value);
  };

  // const changePassword = (e) => {
  //   setNewVendor(e.target.value);
  // };

  const updateField = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    makeRequest('get', 'api', '/vendor/')
      .then((res) => {
        setVendors(res.data);
      })
      .catch((error) => {
        createAlert(error);
      });
    makeRequest('get', 'auth', '/users/')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        createAlert(error);
      });
  }, [state]);
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item className="flex flexBaseline" xs={12}>
          <h2 className="flexSpacer">Settings</h2>
          <div className={classes.buttonGroup}>
            <Button variant="contained" color="secondary" onClick={signOut}>
              Sign Out
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                toggleModal('password');
              }}
            >
              Change Password
            </Button>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={classes.paper}>
            <CardHeader subheader="Vendors" style={{ textAlign: 'center' }} />
            <Divider />
            <CardContent>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="center">Visible On Shopify</TableCell>
                    <TableCell align="right">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vendors.map((vendor, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell component="th" scope="row">
                          {vendor.name}
                        </TableCell>
                        <TableCell align="center">
                          <FormControlLabel
                            control={
                              <Switch
                                checked={vendor.visible}
                                onChange={() => {
                                  setVisible(vendor._id);
                                }}
                                name="delivery"
                                value={vendor.visible}
                                color="primary"
                              />
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          <DeleteIcon
                            color="secondary"
                            style={{ cursor: 'pointer' }}
                            onClick={areYouSure}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                style={{ margin: 'auto' }}
                size="small"
                onClick={() => {
                  toggleModal('vendor');
                }}
              >
                Add Vendor
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card className={classes.paper}>
            <CardHeader subheader="Users" style={{ textAlign: 'center' }} />
            <Divider />
            <CardContent>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell align="center">Password Reset</TableCell>
                    <TableCell align="right">Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, i) => {
                    return (
                      <TableRow key={i}>
                        <TableCell component="th" scope="row">
                          {user.name}
                        </TableCell>
                        <TableCell align="center">
                          <EditIcon
                            color="primary"
                            style={{ cursor: 'pointer' }}
                            onClick={areYouSure}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <DeleteIcon
                            color="secondary"
                            style={{ cursor: 'pointer' }}
                            onClick={areYouSure}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                style={{ margin: 'auto' }}
                size="small"
                onClick={() => {
                  toggleModal('user');
                }}
              >
                Add User
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      <Modal
        open={vendorModal}
        onClose={() => {
          toggleModal('vendor');
        }}
        className="modalContainer"
      >
        <Card className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                label="Vendor"
                variant="outlined"
                value={newVendor}
                onChange={handleInput}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={addVendor}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Modal>
      <Modal
        open={userModal}
        onClose={() => {
          toggleModal('user');
        }}
        className="modalContainer"
      >
        <Card className={classes.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                label="User"
                variant="outlined"
                name="name"
                value={newUser.name}
                onChange={updateField}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth={true}
                label="Password"
                variant="outlined"
                name="password"
                value={newUser.password}
                onChange={updateField}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl variant="filled" fullWidth={true}>
                <InputLabel id="demo-simple-select-label">Access</InputLabel>
                <Select
                  name="access"
                  value={newUser.access}
                  onChange={updateField}
                >
                  <MenuItem value="0">Admin</MenuItem>
                  <MenuItem value="1">Manager</MenuItem>
                  <MenuItem value="2">Employee</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" onClick={addUser}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Modal>
      <SlideModal
        open={passwordModal}
        close={() => {
          toggleModal('password');
        }}
        title="Change Your Password"
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth={true}
              id="standard-basic"
              label="Current Password"
              name="current_password"
              onChange={openChangePassword}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth={true}
              id="standard-basic"
              label="New Password"
              name="new_password_1"
              onChange={openChangePassword}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth={true}
              id="standard-basic"
              label="Confirm New Password"
              name="new_password_2"
              onChange={openChangePassword}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={submitPassword}
            >
              Change Password
            </Button>
          </Grid>
        </Grid>
      </SlideModal>
    </React.Fragment>
  );
}
