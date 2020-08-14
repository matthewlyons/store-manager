import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Grid, Divider, Card, CardActions, Button } from '@material-ui/core';

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

export default function TableCard(props) {
  const classes = useStyles();
  let { children, title, delimiter, link, linkTitle, xs = 12, md = 12 } = props;
  let visible = true;
  if (delimiter) {
    if (delimiter === 0) visible = false;
  }
  return (
    <React.Fragment>
      {visible ? (
        <Grid item xs={xs} md={md}>
          <Card className={classes.paper}>
            <h3>{title}</h3>
            <Divider />
            {children}
            {link && (
              <CardActions style={{ justifyContent: 'Center' }}>
                <Button size="small" component={Link} to={link}>
                  {linkTitle}
                </Button>
              </CardActions>
            )}
          </Card>
        </Grid>
      ) : null}
    </React.Fragment>
  );
}
