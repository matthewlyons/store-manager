import React from 'react';
import { Link } from 'react-router-dom';

export default function BackIcon(props) {
  return (
    <React.Fragment>
      {props.BackFunction ? (
        <div onClick={props.BackFunction} id='BackIcon' className='Icon'>
          <svg>
            <path d='M54.09,55.36a3.62,3.62,0,0,1,0,5.13l-2.57,2.57a3.61,3.61,0,0,1-5.12,0L25.91,42.57a3.63,3.63,0,0,1,0-5.14L46.4,16.94a3.61,3.61,0,0,1,5.12,0l2.57,2.57a3.62,3.62,0,0,1,0,5.13L38.73,40Z' />
            <path d='M77.5,80H2.5A2.5,2.5,0,0,1,0,77.5V2.5A2.5,2.5,0,0,1,2.5,0h75A2.5,2.5,0,0,1,80,2.5v75A2.5,2.5,0,0,1,77.5,80ZM5,75H75V5H5Z' />
          </svg>
        </div>
      ) : (
        <div onClick={props.BackLocation} id='BackIcon' className='Icon'>
          <svg>
            <path d='M54.09,55.36a3.62,3.62,0,0,1,0,5.13l-2.57,2.57a3.61,3.61,0,0,1-5.12,0L25.91,42.57a3.63,3.63,0,0,1,0-5.14L46.4,16.94a3.61,3.61,0,0,1,5.12,0l2.57,2.57a3.62,3.62,0,0,1,0,5.13L38.73,40Z' />
            <path d='M77.5,80H2.5A2.5,2.5,0,0,1,0,77.5V2.5A2.5,2.5,0,0,1,2.5,0h75A2.5,2.5,0,0,1,80,2.5v75A2.5,2.5,0,0,1,77.5,80ZM5,75H75V5H5Z' />
          </svg>
        </div>
      )}
    </React.Fragment>
  );
}
