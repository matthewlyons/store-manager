import React from 'react';

export default function RightArrow(props) {
  return (
    <div id='RightArrow' onClick={props.onClick}>
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'>
        <path
          d='M29,24.64a3.62,3.62,0,0,1,0-5.13l2.57-2.57a3.61,3.61,0,0,1,5.12,0L57.22,37.43a3.63,3.63,0,0,1,0,5.14L36.73,63.06a3.61,3.61,0,0,1-5.12,0L29,60.49a3.62,3.62,0,0,1,0-5.13L44.4,40Z'
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
