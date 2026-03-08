const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const colors = require('colors');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const products = [
  { name: 'Samsung 4K Smart TV 55"', description: 'Crystal clear 4K display with Smart Hub, HDR10+, and built-in streaming apps. Perfect for home entertainment.', price: 45999, originalPrice: 55999, category: 'Electronics', brand: 'Samsung', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=400', images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f4834e?w=400'], stock: 15, rating: 4.5, numReviews: 128, isFeatured: true, sold: 89, tags: ['tv', '4k', 'smart'] },
  { name: 'Apple iPhone 15 Pro', description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, and pro camera system.', price: 134900, originalPrice: 134900, category: 'Electronics', brand: 'Apple', image: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400', images: ['https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400'], stock: 30, rating: 4.8, numReviews: 256, isFeatured: true, sold: 210, tags: ['iphone', 'apple', 'smartphone'] },
  { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise canceling with 30hr battery life and multipoint connection.', price: 29990, originalPrice: 34990, category: 'Electronics', brand: 'Sony', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'], stock: 40, rating: 4.7, numReviews: 89, isFeatured: true, sold: 145, tags: ['headphones', 'sony', 'wireless'] },
  { name: 'Nike Air Max 270', description: 'Iconic Nike Air Max 270 with large Air unit for all-day comfort. Available in multiple colors.', price: 9995, originalPrice: 11995, category: 'Clothing', brand: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'], stock: 60, rating: 4.4, numReviews: 203, isFeatured: true, sold: 320, tags: ['shoes', 'nike', 'running'] },
  { name: 'Organic Basmati Rice 5kg', description: 'Premium long-grain basmati rice, naturally aged for superior aroma and taste.', price: 599, originalPrice: 699, category: 'Food & Grocery', brand: 'Nature Fresh', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', stock: 200, rating: 4.3, numReviews: 67, sold: 450, tags: ['rice', 'organic', 'grocery'] },
  { name: 'Instant Pot Duo 7-in-1', description: 'Multi-use pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and warmer.', price: 8499, originalPrice: 10999, category: 'Home & Kitchen', brand: 'Instant Pot', image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400', stock: 25, rating: 4.6, numReviews: 145, isFeatured: true, sold: 178, tags: ['cooking', 'kitchen', 'pressure cooker'] },
  { name: 'MacBook Air M2', description: 'Supercharged by the M2 chip, MacBook Air has a thin and light design, 18-hour battery life.', price: 114900, originalPrice: 119900, category: 'Electronics', brand: 'Apple', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', stock: 20, rating: 4.9, numReviews: 312, isFeatured: true, sold: 95, tags: ['laptop', 'apple', 'macbook'] },
  { name: 'Levi\'s 511 Slim Jeans', description: 'Classic slim-fit jeans with a modern silhouette. Made from stretch denim for comfort.', price: 3499, originalPrice: 4999, category: 'Clothing', brand: 'Levis', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', stock: 80, rating: 4.2, numReviews: 178, sold: 567, tags: ['jeans', 'levis', 'clothing'] },
  { name: 'Yoga Mat Premium', description: 'Eco-friendly, non-slip yoga mat with alignment lines. 6mm thick for joint protection.', price: 1299, originalPrice: 1799, category: 'Sports', brand: 'FitPro', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', stock: 100, rating: 4.5, numReviews: 94, sold: 234, tags: ['yoga', 'fitness', 'sports'] },
  { name: 'Bosch Coffee Maker', description: 'Brew perfect coffee every morning with 12-cup capacity, programmable timer and aroma system.', price: 5999, originalPrice: 7499, category: 'Home & Kitchen', brand: 'Bosch', image: 'https://images.unsplash.com/photo-1570286424717-86d8a0082d8e?w=400', stock: 35, rating: 4.4, numReviews: 112, sold: 189, tags: ['coffee', 'kitchen', 'bosch'] },
  { name: 'The Psychology of Money', description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel. A must-read for everyone.', price: 399, originalPrice: 599, category: 'Books', brand: 'Jaico Publishing', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', stock: 150, rating: 4.8, numReviews: 423, sold: 890, tags: ['book', 'finance', 'self-help'] },
  { name: 'L\'Oreal Revitalift Serum', description: 'Anti-aging face serum with 1.5% pure hyaluronic acid for deep hydration and wrinkle reduction.', price: 849, originalPrice: 1099, category: 'Beauty', brand: 'LOreal', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', stock: 75, rating: 4.3, numReviews: 167, sold: 312, tags: ['skincare', 'serum', 'beauty'], isNew: true },
  { name: 'LEGO Technic Set', description: 'Build and rebuild your favorite LEGO Technic model. 1500+ pieces with realistic details.', price: 4999, originalPrice: 5999, category: 'Toys', brand: 'LEGO', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400', stock: 45, rating: 4.7, numReviews: 89, sold: 134, tags: ['lego', 'toys', 'kids'], isNew: true },
  { name: 'OnePlus 12 5G', description: 'Flagship killer with Snapdragon 8 Gen 3, 50MP Hasselblad camera, and 100W fast charging.', price: 64999, originalPrice: 69999, category: 'Electronics', brand: 'OnePlus', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', stock: 50, rating: 4.5, numReviews: 198, sold: 267, tags: ['phone', 'oneplus', 'android'], isNew: true },
  { name: 'Adidas Ultraboost 22', description: 'Premium running shoe with responsive Boost cushioning and Primeknit+ upper for natural fit.', price: 13999, originalPrice: 16999, category: 'Sports', brand: 'Adidas', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400', stock: 55, rating: 4.6, numReviews: 145, sold: 289, tags: ['running', 'adidas', 'shoes'] },
  { name: 'Himalayan Pink Salt 1kg', description: 'Pure Himalayan pink salt with 84+ minerals. Perfect for cooking, baking and food seasoning.', price: 299, originalPrice: 399, category: 'Food & Grocery', brand: 'Himalayan Gold', image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400', stock: 300, rating: 4.1, numReviews: 45, sold: 678, tags: ['salt', 'organic', 'himalayan'] }
];

const seedDB = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    const hashedAdminPass = await bcrypt.hash('Admin@123', 12);
    const hashedCustPass = await bcrypt.hash('Customer@123', 12);

    const admin = await User.create({
      name: 'Admin User', email: 'admin@localmart.com',
      password: hashedAdminPass, role: 'admin'
    });

    const customer = await User.create({
      name: 'John Customer', email: 'customer@localmart.com',
      password: hashedCustPass, role: 'customer',
      phone: '9876543210',
      address: { street: '123 MG Road', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600001' }
    });

    const createdProducts = await Product.insertMany(products);

    // Create sample orders
    const sampleOrder = await Order.create({
      user: customer._id,
      items: [{ product: createdProducts[0]._id, name: createdProducts[0].name, image: createdProducts[0].image, price: createdProducts[0].price, quantity: 1 }],
      shippingAddress: { fullName: 'John Customer', phone: '9876543210', street: '123 MG Road', city: 'Chennai', state: 'Tamil Nadu', zipCode: '600001' },
      paymentMethod: 'COD', itemsPrice: 45999, shippingPrice: 0, taxPrice: 4600, totalPrice: 50599,
      status: 'Delivered', isPaid: true, isDelivered: true,
      statusHistory: [{ status: 'Pending' }, { status: 'Processing' }, { status: 'Shipped' }, { status: 'Delivered' }]
    });

    console.log('✅ Database seeded successfully!'.green.bold);
    console.log('👤 Admin: admin@localmart.com / Admin@123'.cyan);
    console.log('👤 Customer: customer@localmart.com / Customer@123'.cyan);
    process.exit();
  } catch (err) {
    console.error('❌ Seed error:'.red, err);
    process.exit(1);
  }
};

seedDB();