import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import ProductList from '../../components/ProductList';

import { useHistory } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Category(props) {
  const [product, setProduct] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    try {
      var Collection = require(`../../data/${props.match.params.id}.json`);
      console.log(Collection);
      setProducts(Collection);
      setLoading(false);
    } catch (error) {
      console.log("There was an error")
      console.log(error)
      setError(true);
      setLoading(false);
    }
    
  }, [props.match.params.id]);
  const history = useHistory();

  function handleBack() {
    if (product) {
      setProduct(false);
    } else {
      history.goBack();
    }
  }
  function addProduct() {
    setProduct(true);
  }

  let content;
    if (loading) {
      content = <LoadingSpinner />;
    } else if(error){
      content = <div className="LoadingSpinner"><h2 >There was an error</h2></div>;
    } else {
          content = <ProductList
            products={products}
            product={product}
            addProduct={addProduct}
          />;
    }

  return (
    <React.Fragment>
      <Header BackFunction={handleBack} />
      <main>
        {content}
      </main>
    </React.Fragment>
  );
}
