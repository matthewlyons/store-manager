import React, { useState } from 'react';

import _ from 'lodash';

// Import Slick Slider
import Slider from 'react-slick';

import ProductThumbnail from '../../ProductThumbnail';

import { LeftArrow, RightArrow } from '../../Icons';

export default function ListPage(props) {

  

  const [end, setEnd] = useState(false);
  const [start, setStart] = useState(true);

  const Collection = props.products;

  var ProductSelect = Collection.filter((e) => e.imgTitle !== '');

  ProductSelect.length = Math.ceil(ProductSelect.length / 6) * 6;

  var products = _.chunk(ProductSelect, 2);

  let leftArrow, rightArrow;

  if (props.visible) {
    rightArrow = null;
    leftArrow = null;
  } else {
    if (end) {
      rightArrow = null;
    } else {
      rightArrow = <RightArrow />;
    }

    if (start) {
      leftArrow = null;
    } else {
      leftArrow = <LeftArrow />;
    }
  }

  var settings = {
    centerPadding: '60px',
    slidesToShow: 3,
    speed: 500,
    slidesToScroll: 3,
    arrows: true,
    variableWidth: true,
    nextArrow: rightArrow,
    prevArrow: leftArrow,
    beforeChange: (current, next) => sliderMove(next, products.length)
  };

  function sliderMove(after, total) {
    setStart(after >= total - 3);
    setEnd(after + 3 >= total);
  }
  return (
    <React.Fragment>
      {ProductSelect.length < 7 ? (
        <div className='CollectionContainer ContainerWidth IndexGrid'>
          {ProductSelect.map((Product, i) => (
            <div
              key={i}
              onClick={() => {
                props.selectProduct(Product);
              }}
            >
              <div className='Item Product'>
                <ProductThumbnail product={Product} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Slider {...settings} className='SliderContainer ContainerWidth '>
          {products.map((Product, i) => (
            <div key={i}>
              {Product[0] && (
                <div
                  className='Item Product'
                  onClick={() => {
                    props.selectProduct(Product[0]);
                  }}
                >
                  <ProductThumbnail product={Product[0]} />
                </div>
              )}
              {Product[1] && (
                <div
                  className='Item Product Bottom'
                  onClick={() => {
                    props.selectProduct(Product[1]);
                  }}
                >
                  <ProductThumbnail product={Product[1]} />
                </div>
              )}
            </div>
          ))}
        </Slider>
      )}
    </React.Fragment>
  );
}
