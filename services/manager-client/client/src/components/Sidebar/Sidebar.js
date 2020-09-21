import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from 'react-router-dom';

import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import FolderIcon from '@material-ui/icons/Folder';
import HomeIcon from '@material-ui/icons/Home';
import BackupIcon from '@material-ui/icons/Backup';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import KingBedIcon from '@material-ui/icons/KingBed';
import SettingsIcon from '@material-ui/icons/Settings';
import ImageIcon from '@material-ui/icons/Image';

import {
  Drawer,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';

import ListItemLink from '../ListItemLink';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    backgroundColor: '#08543F',
    color: 'white'
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1
    },
    backgroundColor: '#08543F',
    color: 'white'
  },
  multiDivider: {
    backgroundColor: 'white'
  }
}));

export default function Sidebar() {
  let history = useHistory();

  const goBack = () => {
    history.goBack();
  };

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    let newState = !open;
    setOpen(newState);
  };

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })
      }}
    >
      <List>
        <ListItem
          button
          key="Hello"
          color="inherit"
          onClick={handleDrawerToggle}
          edge="start"
          className={clsx(classes.menuButton)}
        >
          <ListItemIcon>
            <MenuIcon style={{ color: 'White' }} />
          </ListItemIcon>
        </ListItem>
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
      </List>
      <Divider style={{ backgroundColor: 'white' }} />
      <List>
        <li>
          <ListItem button className="standardLink" onClick={goBack}>
            <ListItemIcon style={{ color: 'White' }}>
              <ArrowBackIcon />
            </ListItemIcon>

            <ListItemText primary={'Go Back'} />
          </ListItem>
        </li>
      </List>
    </Drawer>
  );
}
