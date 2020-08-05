import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

export default function ItemLink(props) {
  let { to, propClasses, children } = props;

  let classes = 'flexContainer ' + propClasses;
  return (
    <React.Fragment>
      {to ? (
        <li>
          <Link to={to} className={classes}>
            {children}
          </Link>
        </li>
      ) : (
        <li className={classes}>{children}</li>
      )}
    </React.Fragment>
  );
}

ItemLink.propTypes = {
  to: PropTypes.string,
  propClasses: PropTypes.string,
  children: PropTypes.array.isRequired
};
