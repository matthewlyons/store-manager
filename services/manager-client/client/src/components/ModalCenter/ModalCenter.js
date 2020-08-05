import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Modal } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));

export default function ModalCenter(props) {
  const classes = useStyles();
  let { children, open, close } = props;
  return (
    <Modal open={open} onBackdropClick={close} className="modalContainer">
      <Paper className={classes.paper}>{children}</Paper>
    </Modal>
  );
}
