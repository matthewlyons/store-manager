export default function useOrder() {
  const getValues = (staticValues, products) => {
    let {
      deliveryFee,
      taxRate,
      deposit,
      delivery,
      militaryDiscount
    } = staticValues;

    let salesTax;
    let subTotal;
    let discount = 0;

    deliveryFee = Number(deliveryFee);
    deposit = Number(deposit);

    let itemTotal = products.reduce((total, product) => {
      return total + Number(product.price) * product.quantity;
    }, 0);

    if (militaryDiscount) {
      discount = Number((itemTotal * 0.03).toFixed(2));
    }

    if (delivery) {
      salesTax = Number(
        ((itemTotal - discount + deliveryFee) * taxRate).toFixed(2)
      );
      subTotal = Number(
        (itemTotal - discount + deliveryFee + salesTax).toFixed(2)
      );
    } else {
      salesTax = Number(((itemTotal - discount) * taxRate).toFixed(2));
      subTotal = Number((itemTotal - discount + salesTax).toFixed(2));
    }

    let totalDue = Number((subTotal - deposit).toFixed(2));
    return { itemTotal, discount, salesTax, subTotal, totalDue };
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
      militaryDiscount: staticValues.militaryDiscount,
      deposit: staticValues.deposit,
      customer: customer._id,
      employee,
      note
    };

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
    } else if (customer.addresses?.length > 0) {
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
