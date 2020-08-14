import React, { useState, useEffect, useContext } from 'react';
import { useAlert } from '../../customHooks';
import UploadForm from './components/UploadForm';
import UploadConfirm from './components/UploadConfirm';
import UploadStart from './components/UploadStart';
import UploadVendor from './components/UploadVendor';

import { StoreContext } from '../../context/StoreContext';

export default function UploadHomePage() {
  const { createAlert } = useAlert();
  const { setError, makeRequest } = useContext(StoreContext);

  const [data, setData] = useState({
    step: 0,
    type: undefined,
    vendor: undefined,
    currentProducts: [],
    uploadedProducts: []
  });
  const goForward = (key, value) => {
    setData({ ...data, step: data.step + 1, [key]: value });
  };

  useEffect(() => {
    if (data.vendor !== undefined) {
      makeRequest('post', 'api', '/products/Vendor', {
        vendor: data.vendor.name
      })
        .then((res) => {
          setData({ ...data, currentProducts: res.data });
        })
        .catch((error) => {
          createAlert(error);
        });
    }
  }, [data.vendor]);

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <UploadStart moveForward={goForward} />;
      case 1:
        return <UploadVendor moveForward={goForward} />;
      case 2:
        return <UploadForm moveForward={goForward} />;
      case 3:
        return (
          <UploadConfirm
            moveForward={goForward}
            currentProducts={data.currentProducts}
            uploadedProducts={data.uploadedProducts}
            vendor={data.vendor}
          />
        );
      default:
        return 'Error, Something went wrong';
    }
  };

  return <div>{getStepContent(data.step)}</div>;
}
