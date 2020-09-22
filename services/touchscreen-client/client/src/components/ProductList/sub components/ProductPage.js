import React from 'react';

import QR from '../../QR';

export default function ProductPage(props) {
  let product = props.product;
  return (
    <div>
      <div className="screen" id="Screen1">
        <div className="container ContainerWidth ProductGrid">
          <div>
            <img
              src={props.product.img}
              className="FullWidth"
              alt={product.title}
            />
          </div>
          <div>
            <h1 className="h1 PB10">{product.title}</h1>
            <h3 className="h3 PB10">Sku: {product.sku}</h3>
            <div className="Flex FlexCenter PB10">
              <h2 className="h2 TextBold">
                Our Price:
                <span className="TextRed">{product.price}</span>
              </h2>
              <p className="h5 TextCrossed PL40">
                Regular List: {product.compareAt}
              </p>
            </div>
            {product.description && (
              <div>
                <div className="Divider" />
                <p className="h5 l5 TextJustify PB10">{product.description}</p>
              </div>
            )}
            <div className="Divider" />
            <div className=" PB10">
              <h4 className="h4">Features </h4>
              <ul className="h5 FeatureList">
                {product.feature1 && <li>{product.feature1}</li>}
                {product.feature2 && <li>{product.feature2}</li>}
                {product.feature3 && <li>{product.feature3}</li>}
                {product.feature4 && <li>{product.feature4}</li>}
                {product.feature5 && <li>{product.feature5}</li>}
              </ul>
            </div>
            <div className=" PB10">
              <h4 className="h4">Important Information </h4>
              <ul className="h5 FeatureList">
                {product.vendor && <p>-Vendor: {product.vendor}</p>}
                {product.collection && <p>-Collection: {product.collection}</p>}
                {product.color && <p>-Finish: {product.color}</p>}
                {product.hardware && <p>-Hardware: {product.hardware}</p>}
                {product.width && <li>-Width: {product.width}"</li>}
                {product.length && <li>-Length: {product.length}"</li>}
                {product.height && <li>-Height: {product.height}"</li>}
              </ul>
            </div>
          </div>
          {product.url && <QR url={product.url} />}
        </div>
      </div>
    </div>
  );
}
