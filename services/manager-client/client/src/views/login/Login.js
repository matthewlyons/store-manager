/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, TextField, Button } from '@material-ui/core';

// Components
import CenterCard from '../../components/CenterCard';
import MultiStep from '../../components/MultiStep';

// Context
import { StoreContext } from '../../context/StoreContext';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing.unit * 2
  },
  padding: {
    padding: theme.spacing.unit
  }
}));

export default function Login() {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const classes = useStyles();
  const { makeRequest, setUser } = useContext(StoreContext);

  useEffect(() => {
    makeRequest('get', 'auth', '/users/')
      .then((res) => {
        setData({ ...data, users: res.data });
      })
      .catch((error) => {
        error.errors.forEach((err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        });
      });
  }, []);

  const [data, setData] = useState({
    step: 0,
    users: [],
    employee: undefined,
    password: ''
  });

  const updateField = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    });
  };

  const submit = () => {
    let payload = { name: data.employee, password: data.password };
    makeRequest('post', 'auth', '/auth/', payload)
      .then((res) => {
        setUser(res.data);
        history.push('/');
      })
      .catch((error) => {
        error.errors.forEach((err) => {
          enqueueSnackbar(err.message, { variant: 'error' });
        });
      });
  };

  const detectEnter = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    }
  };

  const handleNext = (key, value) => {
    setData({ ...data, step: data.step + 1, [key]: value });
  };

  // const handleBack = () => {
  //   setData({ ...data, step: data.step - 1 });
  // };

  return (
    <CenterCard>
      <Paper className={classes.padding}>
        <div className={classes.margin}>
          <MultiStep index={data.step}>
            <div className="visitForm">
              <h3>Select Your Name</h3>
              <div className="formContainer">
                {data.users.map((employee, i) => (
                  <Button
                    key={i}
                    variant="contained"
                    onClick={() => {
                      handleNext('employee', employee.name);
                    }}
                  >
                    {employee.name}
                  </Button>
                ))}
              </div>
            </div>
            <Grid container spacing={3} alignItems="flex-end">
              <Grid item xs={12}>
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  value={data.password}
                  name="password"
                  onChange={updateField}
                  onKeyPress={detectEnter}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={submit}>
                  Login
                </Button>
              </Grid>
            </Grid>
          </MultiStep>
        </div>
      </Paper>
    </CenterCard>
  );
}
