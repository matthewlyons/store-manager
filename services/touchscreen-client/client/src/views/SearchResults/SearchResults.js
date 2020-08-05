import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Header from '../../components/Header';
import ProductList from '../../components/ProductList';

export default function SearchResults(props) {
  let query = new RegExp(props.match.params.query);

  // const Data = require('../../All.json');
  // let products = Data.filter(function(el) {
  //   return (
  //     query.test(el.title) ||
  //     query.test(el.vendor) ||
  //     query.test(el.sku) ||
  //     query.test(el.collection)
  //   );
  // });

  // const history = useHistory();
  // const [product, setProduct] = useState(false);
  // function handleBack() {
  //   if (product) {
  //     setProduct(false);
  //   } else {
  //     history.goBack();
  //   }
  // }
  // function addProduct() {
  //   setProduct(true);
  // }
  return (
    <React.Fragment>
      <Header />
      <main>
        {/* <ProductList
          products={products}
          product={product}
          addProduct={addProduct}
        /> */}
      </main>
    </React.Fragment>
  );
}
