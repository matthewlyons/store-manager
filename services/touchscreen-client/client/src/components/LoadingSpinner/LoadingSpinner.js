import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="LoadingSpinner">
      <div className="lds-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <h2>Loading</h2>
    </div>
  );
}
