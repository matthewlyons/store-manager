const osmosis = require('osmosis');

module.exports = {
  stringContains(title, query) {
    console.log(title.toLowerCase());
    console.log(query.toLowerCase());
    console.log(title.toLowerCase().includes(query.toLowerCase()));
    return title.toLowerCase().includes(query.toLowerCase());
  },
  getSubCategory(category, title) {
    switch (category) {
      case 'Bedroom':
        switch (title) {
          case module.exports.stringContains(title, 'Bed'):
            return 'Bed';
          case module.exports.stringContains(title, 'Chest'):
            return 'Chest';
          case module.exports.stringContains(title, 'Dresser'):
            return 'Dresser';
          case module.exports.stringContains(title, 'Nightstand'):
            return 'Nightstand';
          case module.exports.stringContains(title, 'Mirror'):
            return 'Mirror';
          case module.exports.stringContains(title, 'Bench'):
            return 'Bench';
          default:
            return 'Uncategoriezed';
        }
      case 'Dining':
        switch (title) {
          case module.exports.stringContains(title, 'Table'):
            return 'Table';
          case module.exports.stringContains(title, 'Chair'):
            return 'Chair';
          case module.exports.stringContains(title, 'Stool'):
            return 'Stool';
          case module.exports.stringContains(title, 'Wine'):
            return 'Wine';
          case module.exports.stringContains(title, 'Buffet'):
          case module.exports.stringContains(title, 'Server'):
            return 'Buffet';
          case module.exports.stringContains(title, 'Table'):
            return 'Table';
          default:
            return 'Uncategoriezed';
        }
      case 'Occasional':
        switch (title) {
          case module.exports.stringContains(title, 'Coffee'):
            return 'Coffeetable';
          default:
            return 'Uncategoriezed';
        }
      case 'Office':
        switch (title) {
          case module.exports.stringContains(title, 'Desk'):
            return 'Desk';
          default:
            return 'Uncategoriezed';
        }

      default:
        break;
    }
  },
  aamerica() {
    return new Promise((resolve, reject) => {
      let savedData = [];
      const url = 'https://www.a-america.com/wp-admin/admin-ajax.php';
      osmosis
        .post(url, { action: 'load_products' })
        .find('article')
        .set({
          collection: '.maintitle',
          category: '.subtitle',
          url: 'a@href',
        })
        .delay(2000)
        .follow('a@href')
        .set({
          title: '.entry-title',
          image: '#horizontal-list .caroimage@data-src:first',
          sku: '.scrollbar-products div[2]',
          height: 'tr[1] td:last',
          width: 'tr[2] td:last',
          depth: 'tr[3] td:last',
          wood: 'tr[4] td:last',
          finish: 'tr[5] td:last',
        })
        .delay(2000)
        .data(function (data) {
          if (data.image) {
            var img = data.image.substring(
              data.image.lastIndexOf('ret_img/') + 8,
              data.image.length
            );
          }

          if (data.sku) {
            var collection = data.sku.substring(data.sku.lastIndexOf(': ') + 2);
            var sku = data.sku.substring(
              data.sku.indexOf(': ') + 2,
              data.sku.lastIndexOf('Collection: ') - 1
            );
            data.sku = sku;
          }

          data.vendor = 'A-America';
          data.productCollection = collection;
          data.vendorCollection = (data.vendor + collection).replace(/\s/g, '');

          data.subCategory = module.exports.getSubCategory(
            data.category,
            data.title
          );

          data.image = img;
          console.log(data);
          savedData.push(data);
          console.log(savedData.length);
        })
        .done((e) => {
          resolve(savedData);
        });
    });
  },
  craigslist() {
    return new Promise((resolve, reject) => {
      console.log('Running Craigslist');
      let savedData = [];
      osmosis
        .get('www.craigslist.org/about/sites')
        .find('h1 + div a')
        .set('location')
        .data((listing) => {
          console.log(listing);
          savedData.push(listing);
        })
        .done((e) => {
          console.log(e);
          resolve(savedData);
        });
    });
  },
};
