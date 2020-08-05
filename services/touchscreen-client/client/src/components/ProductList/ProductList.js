import React, { useState, useEffect } from 'react';

import ProductPage from './sub components/ProductPage';
import ListPage from './sub components/ListPage';

import './style.scss';

export default function ProductList(props) {
  const [product, setProduct] = useState({});

  useEffect(() => {
    if (props.product === false) {
      setProduct({});
    }
  }, [props.product]);

  let productEmpty =
    Object.keys(product).length === 0 && product.constructor === Object;

  function selectProduct(selected) {
    props.addProduct();
    setProduct(selected);
  }

  return (
    <React.Fragment>
      {!productEmpty && <ProductPage product={product} />}
      <ListPage
        selectProduct={selectProduct}
        products={props.products}
        visible={!productEmpty}
      />
    </React.Fragment>
  );
}
