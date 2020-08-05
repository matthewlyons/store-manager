import React from 'react';
import { Link } from 'react-router-dom';

export default function HomeIcon(props) {
  return (
    <React.Fragment>
      {props.HomeFunction ? (
        <div id='HomeIcon' onClick={props.HomeFunction} className='Icon'>
          <svg>
            <path d='M61.53,46.08V61.51a2.58,2.58,0,0,1-2.59,2.58H46.46a1.3,1.3,0,0,1-1.3-1.29v-12a1.3,1.3,0,0,0-1.29-1.3H36.12a1.3,1.3,0,0,0-1.29,1.3v12a1.29,1.29,0,0,1-1.29,1.29H21.05a2.57,2.57,0,0,1-2.58-2.58V46.08a1.31,1.31,0,0,1,.47-1L39.18,28.42a1.31,1.31,0,0,1,1.65,0L61.06,45.08a1.34,1.34,0,0,1,.47,1Zm9-6.55-9-7.42V17.2a1.3,1.3,0,0,0-1.3-1.29h-6a1.3,1.3,0,0,0-1.3,1.29V25l-9.63-7.94a5.17,5.17,0,0,0-6.57,0L9.47,39.53a1.29,1.29,0,0,0-.17,1.82L12,44.69a1.31,1.31,0,0,0,1.82.17L39.18,24a1.31,1.31,0,0,1,1.65,0L66.14,44.86A1.31,1.31,0,0,0,68,44.69l2.75-3.34A1.3,1.3,0,0,0,70.53,39.53Z' />
            <path d='M77.5,80H2.5A2.5,2.5,0,0,1,0,77.5V2.5A2.5,2.5,0,0,1,2.5,0h75A2.5,2.5,0,0,1,80,2.5v75A2.5,2.5,0,0,1,77.5,80ZM5,75H75V5H5Z' />
          </svg>
        </div>
      ) : (
        <div id='HomeIcon' className='Icon Linked'>
          <Link to='/'>
            <svg>
              <path d='M61.53,46.08V61.51a2.58,2.58,0,0,1-2.59,2.58H46.46a1.3,1.3,0,0,1-1.3-1.29v-12a1.3,1.3,0,0,0-1.29-1.3H36.12a1.3,1.3,0,0,0-1.29,1.3v12a1.29,1.29,0,0,1-1.29,1.29H21.05a2.57,2.57,0,0,1-2.58-2.58V46.08a1.31,1.31,0,0,1,.47-1L39.18,28.42a1.31,1.31,0,0,1,1.65,0L61.06,45.08a1.34,1.34,0,0,1,.47,1Zm9-6.55-9-7.42V17.2a1.3,1.3,0,0,0-1.3-1.29h-6a1.3,1.3,0,0,0-1.3,1.29V25l-9.63-7.94a5.17,5.17,0,0,0-6.57,0L9.47,39.53a1.29,1.29,0,0,0-.17,1.82L12,44.69a1.31,1.31,0,0,0,1.82.17L39.18,24a1.31,1.31,0,0,1,1.65,0L66.14,44.86A1.31,1.31,0,0,0,68,44.69l2.75-3.34A1.3,1.3,0,0,0,70.53,39.53Z' />
              <path d='M77.5,80H2.5A2.5,2.5,0,0,1,0,77.5V2.5A2.5,2.5,0,0,1,2.5,0h75A2.5,2.5,0,0,1,80,2.5v75A2.5,2.5,0,0,1,77.5,80ZM5,75H75V5H5Z' />
            </svg>
          </Link>
        </div>
      )}
    </React.Fragment>
  );
}
