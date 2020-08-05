import React from 'react';

export default function LeftArrow(props) {
  return (
    <div id='LeftArrow' onClick={props.onClick}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'>
        <path
          d='M51,55.36a3.62,3.62,0,0,1,0,5.13l-2.57,2.57a3.61,3.61,0,0,1-5.12,0L22.78,42.57a3.63,3.63,0,0,1,0-5.14L43.27,16.94a3.61,3.61,0,0,1,5.12,0L51,19.51a3.62,3.62,0,0,1,0,5.13L35.6,40Z'
          style={{ fill: 'white' }}
        />
        <circle
          cx='40'
          cy='40'
          r='37.5'
          style={{ fill: 'none', stroke: 'white', strokeWidth: '5px' }}
        />
      </svg>
    </div>
  );
}
