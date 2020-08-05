import React from 'react';
import { Link } from 'react-router-dom';

export default function SearchIcon() {
  return (
    <div id='SearchIcon' className='Icon'>
      <Link to='/Search'>
        <svg>
          <path d='M77.5,80H2.5A2.5,2.5,0,0,1,0,77.5V2.5A2.5,2.5,0,0,1,2.5,0h75A2.5,2.5,0,0,1,80,2.5v75A2.5,2.5,0,0,1,77.5,80ZM5,75H75V5H5Z' />
          <path d='M65.29,59,55.17,48.83a2.48,2.48,0,0,0-1.73-.71H51.78a21.06,21.06,0,1,0-3.65,3.66v1.66a2.41,2.41,0,0,0,.71,1.72L59,65.29a2.43,2.43,0,0,0,3.44,0l2.87-2.88A2.44,2.44,0,0,0,65.29,59ZM35.13,48.12a13,13,0,1,1,13-13A13,13,0,0,1,35.13,48.12Z' />
        </svg>
      </Link>
    </div>
  );
}
