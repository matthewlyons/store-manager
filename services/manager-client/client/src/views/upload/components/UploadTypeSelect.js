import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Button,
  Divider,
  Card,
  CardHeader,
  CardContent
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  buttonGroup: {
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}));

export default function UploadTypeSelect(props) {
  const classes = useStyles();
  let { updateData } = props;
  return (
    <Grid
      container
      spacing={3}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ paddingTop: '10%' }}
    >
      <Grid item xs={12}>
        <Card className={classes.paper}>
          <CardHeader
            subheader="Bulk Upload Products"
            style={{ textAlign: 'center' }}
          />
          <Divider />
          <CardContent className={classes.buttonGroup}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                updateData('type', 'pricing');
              }}
            >
              Upload Pricing
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
