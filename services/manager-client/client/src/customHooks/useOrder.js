export default function useOrder() {
  const getValues = (staticValues, products) => {
    let { deliveryFee, taxRate, deposit, delivery } = staticValues;

    deliveryFee = Number(deliveryFee);
    deposit = Number(deposit);

    let itemTotal = products.reduce((total, product) => {
      return total + parseInt(product.price) * product.quantity;
    }, 0);

    let salesTax;
    let subTotal;
    if (delivery) {
      salesTax = parseFloat(((itemTotal + deliveryFee) * taxRate).toFixed(2));
      subTotal = parseFloat((itemTotal + deliveryFee + salesTax).toFixed(2));
    } else {
      salesTax = parseFloat((itemTotal * taxRate).toFixed(2));
      subTotal = parseFloat((itemTotal + salesTax).toFixed(2));
    }

    let totalDue = parseFloat((subTotal - deposit).toFixed(2));
    return { itemTotal, salesTax, subTotal, totalDue };
  };
  const getOrder = ({
    customer,
    products,
    staticValues,
    orderValues,
    employee,
    note,
    driversLicense,
    address
  }) => {
    let orderObj = {
      products: products,
      delivery: staticValues.delivery,
      salesTaxRate: staticValues.taxRate,
      ...orderValues,
      deposit: staticValues.deposit,
      customer: customer._id,
      employee,
      note
    };

    console.log(products);

    let customProducts = products.filter((product) => {
      return product.status === 'Special Order';
    });

    if (customProducts.length > 0) {
      orderObj.estimatedStoreArrival = staticValues.storeArrival;
    }

    if (staticValues.delivery) {
      orderObj.deliveryFee = staticValues.deliveryFee;
      orderObj.address = address;
      if (address.state === 'Oregon') {
        orderObj.driversLicense = driversLicense;
      }
    } else if (customer.addresses.length > 0) {
      let orderAddress = {
        street: customer.addresses[0].street,
        city: customer.addresses[0].city,
        state: customer.addresses[0].state,
        zip: customer.addresses[0].zip
      };
      orderObj.address = orderAddress;
    }
    return orderObj;
  };

  return { getValues, getOrder };
}
