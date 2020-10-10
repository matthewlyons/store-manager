const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Order and Draft Order Schema
const OrderSchema = new Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'product'
        },
        vendor: {
          type: String,
          required: true
        },
        vendorCollection: {
          type: String
        },
        sku: {
          type: String,
          required: true
        },
        price: {
          type: String,
          required: true
        },
        title: {
          type: String
        },
        quantity: {
          type: Number,
          required: true
        },
        purchased: {
          type: Boolean,
          default: () => {
            if (this.status === 'Special Order') {
              return false;
            } else {
              return true;
            }
          }
        },
        status: {
          type: String
        },
        color: {
          type: String,
          required: true,
          validate: (v) => {
            return v !== '';
          }
        },
        custom: {
          type: Boolean,
          default: false
        },
        notes: [
          {
            type: String
          }
        ]
      }
    ],
    validate: (v) => {
      return Array.isArray(v) && v.length > 0;
    }
  },
  phone: [
    {
      number: {
        type: String,
        required: true
      },
      comment: {
        type: String
      }
    }
  ],
  address: {
    type: {
      street: {
        type: String,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      state: {
        type: String,
        required: true
      },
      zip: {
        type: Number,
        required: true
      },
      unit: {
        type: String
      },
      comment: {
        type: String
      }
    },
    required: () => {
      return this.delivery;
    }
  },
  driversLicense: {
    type: {
      number: {
        type: String,
        required: true
      },
      experationDate: {
        type: String,
        required: true
      }
    },
    required: () => {
      if (this.delivery) {
        return this.address.state === 'Oregon';
      } else {
        return false;
      }
    }
  },

  delivery: {
    type: Boolean
  },
  itemTotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    required: function () {
      return this.delivery;
    }
  },
  subTotal: {
    type: Number,
    required: true
  },
  salesTax: {
    type: Number,
    required: true
  },
  salesTaxRate: {
    type: Number,
    required: true
  },
  militaryDiscount: {
    type: Boolean
  },
  discount: {
    type: Number
  },
  deposit: {
    type: Number,
    required: true
  },
  totalDue: {
    type: Number,
    required: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'customer'
  },
  employee: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String
  },
  estimatedStoreArrival: {
    type: String
  }
});

let Order = mongoose.model('order', OrderSchema);
let DraftOrder = mongoose.model('draftOrder', OrderSchema);

module.exports = { Order, DraftOrder };
