import React, { useState, useEffect } from 'react';
import SlideModal from '../../SlideModal/SlideModal';

export default function EditCustomerModal(props) {
  let { open, close, customer, editCustomer } = props;

  const [editedCustomer, setEditedCustomer] = useState({});

  useEffect(() => {
    setEditedCustomer({ ...customer });
  }, [customer]);

  const submitcustomer = () => {
    editCustomer({ ...editedCustomer });
  };

  return (
    <SlideModal open={open} close={close} title="Slide Modal">
      <h1>Slide Modal</h1>
    </SlideModal>
  );
}
