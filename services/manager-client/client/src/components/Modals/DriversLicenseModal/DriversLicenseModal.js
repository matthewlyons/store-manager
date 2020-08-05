import React from 'react';

import { Grid, Button, TextField } from '@material-ui/core';

import ModalCenter from '../../ModalCenter/ModalCenter';

export default function DriversLicenseModal(props) {
  let { open, close, driversLicense, setDriversLicense } = props;

  const editLicense = (event) => {
    let updatedLicense = driversLicense;
    updatedLicense[event.target.name] = event.target.value;
    setDriversLicense({ ...updatedLicense });
  };

  return (
    <ModalCenter open={open} close={close}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth={true}
            label="License Number"
            variant="outlined"
            value={driversLicense.number}
            name={'number'}
            onChange={editLicense}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth={true}
            label="Exp Date"
            variant="outlined"
            value={driversLicense.experationDate}
            name={'experationDate'}
            onChange={editLicense}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    </ModalCenter>
  );
}
