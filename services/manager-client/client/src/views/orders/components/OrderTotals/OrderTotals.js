import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  Grid,
  Divider,
  Card,
  CardHeader,
  Typography,
  IconButton,
  CardContent,
  TextField,
  FormControlLabel,
  Switch
} from '@material-ui/core';

import MoreVertIcon from '@material-ui/icons/MoreVert';

// Components
import SlideModal from '../../../../components/SlideModal/SlideModal';

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

export default function OrderTotals(props) {
  let { staticValues, setStaticValues, orderValues, note, setNote } = props;

  const classes = useStyles();

  const [salesTaxModal, setSalesTaxModal] = useState(false);

  const toggleModal = (modal) => {
    switch (modal) {
      case 'tax':
        setSalesTaxModal(!salesTaxModal);
        break;
      default:
        break;
    }
  };

  const editRate = (e) => {
    setStaticValues({ ...staticValues, taxRate: e.target.value });
  };

  const editDiscount = () => {
    setStaticValues({
      ...staticValues,
      militaryDiscount: !staticValues.militaryDiscount
    });
  };

  return (
    <Grid item xs={12}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card className={classes.root}>
            <CardHeader
              subheader="Order Summary"
              style={{ textAlign: 'center' }}
              action={
                <IconButton
                  onClick={() => {
                    toggleModal('tax');
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <Divider />
            <CardContent>
              <Grid container>
                <Grid item xs={6}>
                  <Typography gutterBottom>Item Total</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>${orderValues.itemTotal}</Typography>
                </Grid>
                {staticValues.delivery && (
                  <React.Fragment>
                    <Grid item xs={6}>
                      <Typography gutterBottom>Delivery Fee</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography gutterBottom>
                        ${staticValues.deliveryFee}
                      </Typography>
                    </Grid>
                  </React.Fragment>
                )}
                {staticValues.militaryDiscount && (
                  <React.Fragment>
                    <Grid item xs={6}>
                      <Typography gutterBottom>Military Discount</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography gutterBottom>
                        -${orderValues.discount}
                      </Typography>
                    </Grid>
                  </React.Fragment>
                )}
                <Grid item xs={6}>
                  <Typography gutterBottom>Sales Tax</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>${orderValues.salesTax}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>Sub Total</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>${orderValues.subTotal}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>Deposit</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>
                    ${staticValues.deposit || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider />
                  <Typography gutterBottom />
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>Total</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>${orderValues.totalDue}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <SlideModal
        open={salesTaxModal}
        close={() => {
          toggleModal('tax');
        }}
        title="Edit Sales Tax"
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth={true}
              label="Sales Tax Rate"
              variant="outlined"
              name="taxRate"
              value={staticValues.taxRate}
              onChange={editRate}
              type="number"
              inputProps={{ pattern: '[0-9]*' }}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth={true}
              id="outlined-multiline-static"
              label="Order Note"
              name="Order Note"
              multiline
              rows={4}
              variant="outlined"
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={staticValues.militaryDiscount}
                  name="militaryDiscount"
                  onChange={editDiscount}
                  value={staticValues.militaryDiscount}
                  color="primary"
                />
              }
              label="Military Discount"
            />
          </Grid>
        </Grid>
      </SlideModal>
    </Grid>
  );
}
