import React from 'react';

export default function VendorHomepage(props) {
  let { id } = props.match.params;
  console.log(id);
  return (
    <div>
      <h1>Vendor Home Page</h1>
    </div>
  );
}
