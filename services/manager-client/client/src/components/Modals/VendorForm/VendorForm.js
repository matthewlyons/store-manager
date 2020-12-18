/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import SlideModal from '../../SlideModal';

import { makeStyles } from '@material-ui/core/styles';

import {
  Grid,
  Button,
  Divider,
  FormControl,
  Select,
  TextField,
  ListItem,
  Typography,
  InputLabel
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  buttonGroup: {
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}));

export default function VendorForm({ open, close }) {
  const [vendor, setVendor] = useState({ vendorCodes: [] });

  const handleInputChange = (field) => {
    return (value) => {
      setVendor({ ...vendor, [field]: value.target.value });
    };
  };

  const addVendorCode = () => {
    setVendor({
      ...vendor,
      vendorCodes: [...vendor.vendorCodes, { code: '', type: 'Bedroom' }]
    });
  };

  return (
    <SlideModal open={open} close={close} title={'Create Vendor'}>
      <form>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth={true}
              label="Vendor Name"
              value={vendor.name || ''}
              onChange={handleInputChange('name')}
              variant="outlined"
              name="name"
              inputProps={{ autoCorrect: 'off', spellCheck: false }}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth={true}
              label="Base Vendor Code"
              value={vendor.baseVendorCode || ''}
              onChange={handleInputChange('baseVendorCode')}
              variant="outlined"
              name="baseVendorCode"
              inputProps={{ autoCorrect: 'off', spellCheck: false }}
            />
          </Grid>
          {vendor.vendorCodes?.map((code, i) => {
            return (
              <React.Fragment key={i}>
                <Grid item xs={6}>
                  <FormControl variant="outlined" fullWidth={true}>
                    <InputLabel id="label">Product Group</InputLabel>
                    <Select
                      labelId="label"
                      label="Product Group"
                      native
                      name="code type"
                      value={vendor.vendorCodes[i].type}
                    >
                      <optgroup label="Bedroom">
                        <option value={1}>Option 1</option>
                        <option value={2}>Option 2</option>
                      </optgroup>
                      <optgroup label="Dining">
                        <option value={3}>Option 3</option>
                        <option value={4}>Option 4</option>
                      </optgroup>
                      <optgroup label="Living">
                        <option value={3}>Option 3</option>
                        <option value={4}>Option 4</option>
                      </optgroup>
                      <optgroup label="Office">
                        <option value={3}>Option 3</option>
                        <option value={4}>Option 4</option>
                      </optgroup>
                      <optgroup label="Misc">
                        <option value={3}>Option 3</option>
                        <option value={4}>Option 4</option>
                      </optgroup>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth={true}
                    label="Vendor Code"
                    value={vendor.vendorCodes[i].code || ''}
                    variant="outlined"
                    name="vendorCode"
                    inputProps={{ autoCorrect: 'off', spellCheck: false }}
                  />
                </Grid>
              </React.Fragment>
            );
          })}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={addVendorCode}>
              Add Vendor Code
            </Button>
          </Grid>
        </Grid>
      </form>
    </SlideModal>
  );
}
