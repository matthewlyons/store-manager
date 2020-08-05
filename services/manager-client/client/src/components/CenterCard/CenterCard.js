import React from 'react';

import { Grid } from '@material-ui/core';

export default function CenterCard(props) {
  return (
    <Grid
      container
      spacing={3}
      direction='column'
      alignItems='center'
      justify='center'
      style={{ paddingTop: '10%' }}
    >
      {props.children}
    </Grid>
  );
}
