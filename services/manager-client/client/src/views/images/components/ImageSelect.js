import React, { useEffect, useState, useContext } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import {
  GridList,
  GridListTile,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button
} from '@material-ui/core';
import { useAlert, useUpload } from '../../../customHooks';
import { StoreContext } from '../../../context/StoreContext';
import LazyLoad from './LazyLoad';

const useStyles = makeStyles((theme) => ({
  gridList: {
    width: '100%',
    height: 450
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));

export default function ImageSelect(props) {
  const classes = useStyles();

  let [index, setIndex] = useState(0);

  const [selected, setSelector] = useState(0);

  const [images, setImages] = useState([]);

  const { createAlert } = useAlert();

  const { makeRequest } = useContext(StoreContext);

  useEffect(() => {
    if (props.products.length > 0) {
      makeRequest('post', 'static', '/Search', {
        query: props.products[index].sku
      })
        .then((res) => {
          console.log(res.data);
          if (res.data.length < 1) {
            setIndex(index + 1);
          } else {
            setImages(res.data);
          }
        })
        .catch((error) => {
          createAlert(error);
        });
    }
  }, [props, index]);

  const selectImage = () => {
    console.log();
    makeRequest('post', 'api', '/products/image', {
      fileName: images[selected],
      id: props.products[index]._id
    })
      .then((res) => {
        setIndex(index + 1);
      })
      .catch((error) => {
        createAlert(error);
      });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card className={classes.paper}>
          <GridList cellHeight={160} className={classes.gridList} cols={5}>
            {images.map((image, i) => {
              let selectClass = '';
              if (i === selected) {
                selectClass = 'Selected';
              }
              return (
                <GridListTile
                  key={image}
                  cols={1}
                  className={selectClass}
                  onClick={() => {
                    setSelector(i);
                  }}
                >
                  <LazyLoad
                    src={`http://localhost:5007/${encodeURIComponent(image)}`}
                  />
                </GridListTile>
              );
            })}
          </GridList>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card className={classes.paper} subheader="Select Vendor">
          <CardHeader
            title={props.products[index]?.title}
            subheader={props.products[index]?.sku}
            style={{ textAlign: 'center' }}
          />
          <Divider />
          <CardContent className={classes.buttonGroup}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    setIndex(index + 1);
                  }}
                >
                  Skip
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={selectImage}
                >
                  Select
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
