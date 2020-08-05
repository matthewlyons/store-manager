import React from 'react';

export default function MultiStep(props) {
  return <React.Fragment>{props.children[props.index]}</React.Fragment>;
}
