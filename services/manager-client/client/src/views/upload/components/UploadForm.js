import React from 'react';
import XLSX from 'xlsx';

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
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

export default function UploadForm(props) {
  const classes = useStyles();
  const onChangeHandler = (event) => {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      var data = event.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
      workbook.SheetNames.forEach(function (sheetName) {
        // Here is your object
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheetName]
        );
        var json_object = JSON.stringify(XL_row_object);
        props.moveForward('uploadedProducts', json_object);
      });
    };
    reader.readAsBinaryString(file);
  };
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
            subheader="Select Vendor"
            style={{ textAlign: 'center' }}
          />
          <Divider />
          <CardContent className={classes.buttonGroup}>
            <h1>File Upload</h1>
            <input type="file" name="file" onChange={onChangeHandler} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
