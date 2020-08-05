import React from 'react';
import { Link } from 'react-router-dom';

export default function LogoIcon() {
  return (
    <div className='Icon' id='LogoIcon'>
      <Link to='/'>
        <img
          src='https://cdn.shopify.com/s/files/1/2975/0102/files/LogoCrop.png?789572813361042968'
          id='Logo'
          alt='logo'
        />
      </Link>
    </div>
  );
}
