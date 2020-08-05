import React from 'react';
import PropTypes from 'prop-types';

export default function ListLink(props) {
  return (
    <div className="ListLink">
      <ul>{props.children}</ul>
    </div>
  );
}

ListLink.propTypes = {
  children: PropTypes.array.isRequired
};
