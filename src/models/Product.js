const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: 0,
  },
  discountPrice: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['salwar', 'suit', 'maxi', 'gown', 'legging', 'kurti', 'dupatta', 'other'],
  },
  images: [{
    url: String,
    publicId: String,
  }],
  sizes: [{
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    },
    stock: {
      type: Number,
      default: 0,
    },
  }],
  colors: [{
    name: String,
    hexCode: String,
  }],
  fabric: {
    type: String,
    default: '',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  totalStock: {
    type: Number,
    default: 0,
  },
  soldCount: {
    type: Number,
    default: 0,
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  returnPolicy: {
    returnAllowed: {
      type: Boolean,
      default: true,
    },
    replacementAllowed: {
      type: Boolean,
      default: true,
    },
    returnWindow: {
      type: Number,
      enum: [7, 10, 15],
      default: 7,
    },
    conditions: {
      type: String,
      default: 'Product must be unused with original tags intact',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create slug before saving
productSchema.pre('save', function() {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
  // Calculate total stock
  if (this.sizes && this.sizes.length > 0) {
    this.totalStock = this.sizes.reduce((acc, size) => acc + (size.stock || 0), 0);
  }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
module.exports = Product;
