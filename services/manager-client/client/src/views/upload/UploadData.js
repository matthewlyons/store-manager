import React, { useState } from 'react';
import UploadDataForm from './components/UploadDataForm';
import UploadDataConfirm from './components/UploadDataConfirm';

export default function UploadData() {
  const [productData, setProductData] = useState([]);

  return (
    <div>
      {productData.length < 1 ? (
        <UploadDataForm setProductData={setProductData} />
      ) : (
        <UploadDataConfirm productData={productData} />
      )}
    </div>
  );
}
