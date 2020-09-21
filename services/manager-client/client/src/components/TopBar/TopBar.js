import React from 'react';

import { NavLink as RouterLink, useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

import PersonIcon from '@material-ui/icons/Person';
import FolderIcon from '@material-ui/icons/Folder';
import HomeIcon from '@material-ui/icons/Home';
import BackupIcon from '@material-ui/icons/Backup';
import KingBedIcon from '@material-ui/icons/KingBed';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ImageIcon from '@material-ui/icons/Image';

import { ListItem, ListItemIcon } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#08543F',
    color: 'white',
    display: 'flex'
  },
  flexFull: {
    flex: 1
  },
  iconContainer: {
    display: 'flex'
  },
  icon: { margin: 10 }
}));

function ListItemLink(props) {
  const { icon, to, exact } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <ListItem
      button
      component={renderLink}
      activeClassName="activeLink"
      exact={exact}
      className="standardLink"
    >
      <ListItemIcon style={{ color: 'White', minWidth: 'auto' }}>
        {icon}
      </ListItemIcon>
    </ListItem>
  );
}

export default function TopBar(props) {
  let history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  const classes = useStyles();
  return (
    <section className={classes.root}>
      <div className={classes.iconContainer}>
        <ListItemLink to="/" primary="Home" icon={<HomeIcon />} exact={true} />
        <ListItemLink to="/Orders" primary="Orders" icon={<FolderIcon />} />
        <ListItemLink
          to="/Customers"
          primary="Customers"
          icon={<PersonIcon />}
        />
        <ListItemLink
          to="/Products"
          primary="Products"
          icon={<KingBedIcon />}
        />
        <ListItemLink to="/Upload" primary="Upload" icon={<BackupIcon />} />
        <ListItemLink to="/Images" primary="Images" icon={<ImageIcon />} />
        <ListItemLink
          to="/Settings"
          primary="Settings"
          icon={<SettingsIcon />}
        />
      </div>
      <div className={classes.flexFull} />
      <div className={classes.iconContainer}>
        <ArrowBackIcon className={classes.icon} onClick={goBack} />
      </div>
    </section>
  );
}
