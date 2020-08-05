require('dotenv').config();
let createQueue = [];
let deleteQueue = [];
let updateQueue = [];

// Function Flow:
// Create Product
// 1) Product Created In DB
// 2) processProduct() adds product image to download queue
// 3) Image downloads to static assets server
// 4) Product is handed to createProduct() to add to Shopify Create Queue
// 5) createRequest() runs through queue and creates Shopify Products

module.exports = {
  // Add Product To Create Queue
  createProduct(product) {
    let start = false;
    if (createQueue.length == 0) {
      start = true;
    }
    createQueue.push(product);
    if (start) {
      module.exports.createRequest();
    }
  },
  // Loop Through Create Queue
  async createRequest(index = 0) {
    console.log(index);
    if (createQueue.length == index) {
      createQueue = [];
      return;
    }
    let product = createQueue[index];

    // Send Request to shopify
    let shopifyProduct = await axios.post('shopify url', product);
    let shopifyID = shopifyProduct.product.id;
    // Update MongoDB product with Shopify ID
    await Product.updateOne({ _id: product._id }, { $set: { shopifyID } });
    return module.exports.createRequest(index + 1);
  },
  // Add Product To Update Queue
  updateProduct() {},
  // Loop Though Update Queue
  updateRequest(index = 0) {},
  // Add Product To Remove Queue
  deleteProduct() {
    console.log('Delete Product');
  },
  // Loop Through Remove Queue
  deleteRequest(index = 0) {
    console.log('Removing');
  },
  // Download Images
  async processProduct(product) {
    let start = false;
    if (imageQueue.length == 0) {
      start = true;
    }
    imageQueue.push(product);
    if (start) {
      module.exports.downloadImages();
    }
  },
  async downloadImages(index = 0) {
    console.log(index);
    if (imageQueue.length == index) {
      imageQueue = [];
      return;
    }
    let product = imageQueue[index];

    let url = product.imageURL;
    let fileName = product.image;

    let writer = fs.createWriteStream(
      path.resolve(__dirname + `../../assets/original${fileName}`)
    );

    let response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    writer.on('finish', () => {
      module.exports.createProduct(product);
      return module.exports.downloadImages(index + 1);
    });

    writer.on('error', () => {
      return module.exports.downloadImages(index + 1);
    });
  },
};
