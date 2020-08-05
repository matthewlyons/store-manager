import React from 'react';
import QRCode from 'qrcode.react';

export default function QR(props) {
  return (
    <div id='QR'>
      <h2>Save this for later?</h2>
      <QRCode value={props.url} />
    </div>
  );
}
