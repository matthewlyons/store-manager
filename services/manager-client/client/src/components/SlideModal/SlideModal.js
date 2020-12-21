import React from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import {
  Paper,
  Dialog,
  Slide,
  Typography,
  Grid,
  Divider,
  Button
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  flexContainer: {
    display: 'flex'
  },
  fixedPosition: {
    position: 'fixed'
  },
  marginAuto: {
    margin: 'auto'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    position: 'fixed',
    top: 0,
    right: 0,
    width: '90%',
    maxWidth: '700px',
    height: '100%',
    overflow: 'scroll'
  }
}));

export default function SlideModal(props) {
  const { open, close, children, title, action } = props;
  const classes = useStyles();
  return (
    <Dialog open={open} onBackdropClick={close}>
      <Slide
        direction="left"
        in={open}
        mountOnEnter
        unmountOnExit
        style={{ zIndex: 10000 }}
      >
        <Paper elevation={4} className={classes.paper} square>
          <Grid container spacing={3}>
            {action ? (
              <Grid item className="flex flexBaseline" xs={12}>
                <Typography
                  variant="h6"
                  className="flexSpacer"
                  style={{ textAlign: 'left' }}
                >
                  {title}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={action.function}
                >
                  {action.title}
                </Button>
              </Grid>
            ) : (
              <Grid item xs={12}>
                <Typography variant="h6">{title}</Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>

          {children}
        </Paper>
      </Slide>
    </Dialog>
  );
}

SlideModal.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
};
