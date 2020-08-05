import React from 'react';

export default function ProductThumbnail(props) {
  return (
    <div className="FullHeight">
      <img
        className="CollectionImage"
        src={props.product.img}
        alt={props.product.title}
      />
      <h2 className="CollectionTitle">{props.product.title}</h2>
    </div>
  );
}
