import React from 'react';
import PropTypes from 'prop-types';

import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import { NavLink as RouterLink } from 'react-router-dom';

export default function ListItemLink(props) {
  const { icon, primary, to, exact = false } = props;

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem
        button
        component={renderLink}
        activeClassName="activeLink"
        exact={exact}
        className="standardLink"
      >
        {icon ? (
          <ListItemIcon style={{ color: 'White' }}>{icon}</ListItemIcon>
        ) : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

ListItemLink.propTypes = {
  icon: PropTypes.element,
  to: PropTypes.string.isRequired,
  exact: PropTypes.bool,
  primary: PropTypes.string.isRequired
};
