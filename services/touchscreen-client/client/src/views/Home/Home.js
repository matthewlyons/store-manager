import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import Header from '../../components/Header';

const Data = require('./Data.json');

export default function Home() {
  return (
    <React.Fragment>
      <Header HideHome={true} HideBack={true} ShowSearch={true} />
      <main className='container ContainerWidth IndexGrid' id='MainScreen'>
        {Data.map((room, i) => {
          return (
            <div className='Item' key={i}>
              <Link
                to={{
                  pathname: '/Room',
                  state: { categories: room.categories }
                }}
              >
                <img
                  className='BackgroundImage'
                  src={process.env.PUBLIC_URL + '/img/Index/' + room.image}
                  alt={room.room}
                />
              </Link>
            </div>
          );
        })}
        <div className='Item'>
          <Link to='/About'>
            <img
              className='BackgroundImage'
              src={process.env.PUBLIC_URL + '/img/Index/Main 6.jpg'}
              alt='About Us'
            />
          </Link>
        </div>
      </main>
    </React.Fragment>
  );
}
