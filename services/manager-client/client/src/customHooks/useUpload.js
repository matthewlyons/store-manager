export default function useUpload() {
  const stringContains = (title, query) => {
    return title.toLowerCase().includes(query.toLowerCase());
  };

  const getCollection = (title) => {
    // Bedroom
    if (stringContains(title, 'Bed')) {
      return ['Bed', 'Bedroom'];
    } else if (stringContains(title, 'Chest')) {
      return ['Chest', 'Bedroom'];
    } else if (stringContains(title, 'Dresser')) {
      return ['Dresser', 'Bedroom'];
    } else if (stringContains(title, 'Armoire')) {
      return ['Armoire', 'Bedroom'];
    } else if (stringContains(title, 'Trundle')) {
      return ['Trundle', 'Bedroom'];
    } else if (
      stringContains(title, 'Nightstand') ||
      stringContains(title, 'Night')
    ) {
      return ['Nightstand', 'Bedroom'];
    } else if (stringContains(title, 'Mirror')) {
      return ['Mirror', 'Bedroom'];
      // Occasional
    } else if (stringContains(title, 'Sofa')) {
      return ['Sofa Table', 'Occasional'];
    } else if (stringContains(title, 'Coffee')) {
      return ['Coffee Table', 'Occasional'];
    } else if (stringContains(title, 'End')) {
      return ['End Table', 'Occasional'];
      // Living Room
    } else if (stringContains(title, 'Wall')) {
      return ['Wall Unit', 'Living Room'];
    } else if (
      stringContains(title, 'Media') ||
      stringContains(title, 'Entertainment') ||
      stringContains(title, 'Stand') ||
      stringContains(title, 'Console')
    ) {
      return ['TV Cabinet', 'Living Room'];
    } else if (stringContains(title, 'Clock')) {
      return ['Clock', 'Living Room'];
    } else if (stringContains(title, 'Curio')) {
      return ['Curio', 'Living Room'];
      // Office
    } else if (
      stringContains(title, 'Desk') ||
      stringContains(title, 'ROLLTOP') ||
      stringContains(title, 'Flattop') ||
      stringContains(title, 'CREDENZA')
    ) {
      return ['Desk', 'Office'];
    } else if (stringContains(title, 'Hutch')) {
      return ['Hutch', 'Office'];
    } else if (stringContains(title, 'Bookcase')) {
      return ['Bookcase', 'Office'];
    } else if (stringContains(title, 'File')) {
      return ['File Cabinet', 'Office'];
    } else if (stringContains(title, 'Office Chair')) {
      return ['Office Chair', 'Office'];
      // Dining
    } else if (stringContains(title, 'Table') || stringContains(title, 'TBL')) {
      return ['Table', 'Dining'];
    } else if (
      stringContains(title, 'Bench') ||
      stringContains(title, 'Trunk')
    ) {
      return ['Bench', 'Bedroom'];
    } else if (stringContains(title, 'Chair')) {
      return ['Chair', 'Dining'];
    } else if (stringContains(title, 'Stool')) {
      return ['Stool', 'Dining'];
    } else if (stringContains(title, 'Wine')) {
      return ['Wine', 'Dining'];
    } else if (
      stringContains(title, 'Server') ||
      stringContains(title, 'Buffet') ||
      stringContains(title, 'Sideboard') ||
      stringContains(title, 'Side') ||
      stringContains(title, 'China') ||
      stringContains(title, 'Cabinet')
    ) {
      return ['Buffet', 'Dining'];
      // Misc
    } else if (stringContains(title, 'Futon')) {
      return ['Futon', 'Misc'];
    } else if (stringContains(title, 'Rocker')) {
      return ['Rocking Chair', 'Misc'];
    } else {
      return ['Uncategorized', 'Uncategorized'];
    }
  };

  const findUpdateDeleteProducts = ({ currentProducts, newProducts }) => {
    console.log({ currentProducts, newProducts });
    let deleteProducts = [];
    let updateProducts = [];
    currentProducts.forEach((product) => {
      let item = newProducts.find((x) => x.sku == product.sku);
      if (!item) {
        deleteProducts.push(product);
      } else {
        updateProducts.push(item);
      }
    });
    return { deleteProducts, updateProducts };
  };

  const findCreateUpdateProducts = ({ currentProducts, newProducts }) => {
    let createProducts = [];
    newProducts.forEach((product) => {
      let item = currentProducts.find((x) => x.sku == product.sku);
      if (!item) {
        createProducts.push(product);
      }
    });
    return createProducts;
  };

  const formatProducts = (uploadedProducts, vendor) => {
    let result = uploadedProducts.map((obj) => {
      let [subCategory, category] = getCollection(obj.title);
      return {
        sku: obj.sku,
        price: Math.round(obj['our price']),
        compare_at_price: Math.round(obj['list price']),
        title: obj.title,
        vendor,
        vendorCollection: obj.vendorCollection,
        subCategory,
        category
      };
    });
    return result;
  };

  const getProducts = (currentProducts, newProducts, vendor) => {
    let formattedProducts = formatProducts(newProducts, vendor);
    let createProducts = findCreateUpdateProducts({
      currentProducts,
      newProducts: formattedProducts
    });
    let { deleteProducts, updateProducts } = findUpdateDeleteProducts({
      currentProducts,
      newProducts: formattedProducts
    });
    console.log({ createProducts, deleteProducts, updateProducts });
    return { createProducts, deleteProducts, updateProducts };
  };

  const getCustomers = (customers) => {
    let formattedCustomers = customers.map((customer) => {
      // If phone number
      let phoneArray;
      if (customer['Ship to 1']) {
        let phone = customer['Ship to 1'].split(' ');
        let number = phone[0].split('-');
        number[0] = `(${number[0]})`;
        number = number.join('-');
        phoneArray = [{ number, comment: phone[1] }];
      }

      let phone = phoneArray ? phoneArray : [];

      // If Address
      let addresses = [];
      if (customer['Bill to 3']) {
        let addressArray = customer['Bill to 3']
          .replace(',', '')
          .replace('.', '')
          .replace(/  +/g, ' ')
          .split(' ');

        if (
          customer['Bill to 2'] &&
          addressArray[0] &&
          addressArray[1] &&
          addressArray[2]
        ) {
          let address = {
            street: customer['Bill to 2'],
            city: addressArray[0],
            state: addressArray[1],
            zip: addressArray[2],
            unit: customer['Bill to 4']
          };
          addresses = [{ ...address }];
        }
      }

      return {
        name: customer.Customer,
        addresses,
        phone
      };
    });

    return { formattedCustomers };
  };

  return { getProducts, getCollection, getCustomers };
}
