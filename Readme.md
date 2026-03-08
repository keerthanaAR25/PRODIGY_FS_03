# 🛒 LocalMart — Enterprise Full-Stack E-Commerce Platform

> **Production-ready** | **Full-stack** | **React + Node.js + MongoDB**

---

## 📁 Complete Project Structure

```
ecommerce-store/
├── backend/
│   ├── config/
│   │   └── db.js                    ← MongoDB connection
│   ├── controllers/
│   │   ├── authController.js        ← Register, Login, Profile
│   │   ├── productController.js     ← CRUD + Wishlist + Recently Viewed
│   │   ├── orderController.js       ← Create, Track, Update status
│   │   ├── reviewController.js      ← Add/Delete reviews
│   │   ├── adminController.js       ← Analytics, User Management
│   │   └── supportController.js     ← Tickets, FAQ
│   ├── middleware/
│   │   ├── authMiddleware.js        ← JWT protect, Admin guard
│   │   └── errorMiddleware.js       ← Centralized error handling
│   ├── models/
│   │   ├── User.js                  ← User schema + bcrypt
│   │   ├── Product.js               ← Product + Reviews schema
│   │   ├── Order.js                 ← Order + status history
│   │   └── Support.js               ← Support tickets
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── userRoutes.js
│   │   ├── adminRoutes.js
│   │   └── supportRoutes.js
│   ├── utils/
│   │   ├── generateToken.js         ← JWT token helper
│   │   └── seeder.js                ← 16 demo products + admin/customer accounts
│   ├── .env                         ← Environment config
│   ├── package.json
│   └── server.js                    ← Express entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── AnimatedBackground.js  ← Canvas particles + orbs
    │   │   │   ├── ProductCard.js         ← Product cards with hover
    │   │   │   ├── FlashCard.js           ← Animated stat cards
    │   │   │   └── StepCards.js           ← Toggle step workflow
    │   │   └── layout/
    │   │       ├── Navbar.js              ← Responsive nav + notifications
    │   │       └── Footer.js              ← Full footer with links
    │   ├── context/
    │   │   ├── AuthContext.js             ← Auth state management
    │   │   └── CartContext.js             ← Cart with localStorage persist
    │   ├── pages/
    │   │   ├── HomePage.js                ← Hero + Steps + Stats + Categories
    │   │   ├── ProductsPage.js            ← Filters + Sort + Search + Pagination
    │   │   ├── ProductDetailPage.js       ← Detail + Reviews + Related
    │   │   ├── CartPage.js                ← Cart summary + Order total
    │   │   ├── CheckoutPage.js            ← 3-step checkout flow
    │   │   ├── OrdersPage.js              ← Order list + Detail + Tracker
    │   │   ├── AuthPages.js               ← Login + Register
    │   │   ├── WishlistPage.js            ← Saved products
    │   │   ├── SupportPage.js             ← Contact + FAQ + Live Chat
    │   │   ├── ProfilePage.js             ← Profile + Recently Viewed + Notifs
    │   │   └── AdminDashboard.js          ← Full admin with analytics
    │   ├── utils/
    │   │   └── api.js                     ← Axios instance with auth
    │   ├── App.js                         ← Routes + Layout
    │   └── index.css                      ← Global styles + animations
    ├── tailwind.config.js
    └── package.json
```

---

#RUN COMMANDS
------

cd backend
npm install express mongoose bcryptjs jsonwebtoken cors helmet morgan express-rate-limit express-async-handler express-validator multer colors dotenv
npm install -D nodemon
npm run seed
npm run dev
cd frontend
npm install react@18 react-dom@18 react-router-dom@6 axios framer-motion@10 react-hot-toast react-icons recharts react-scripts@5
npm install -D tailwindcss@3 postcss autoprefixer
npm install react-scripts@5.0.1 --save --legacy-peer-deps
npm install ajv@^8.0.0 --save --legacy-peer-deps
npm start
-----


---

## 🔐 Login Credentials

| Role      | Email                       | Password      |
|-----------|-----------------------------|---------------|
| Admin     | admin@localmart.com         | Admin@123     |
| Customer  | customer@localmart.com      | Customer@123  |

---

## 🔗 API Endpoints Reference

### Auth
| Method | Endpoint                   | Auth     | Description        |
|--------|----------------------------|----------|--------------------|
| POST   | /api/auth/register         | Public   | Register user      |
| POST   | /api/auth/login            | Public   | Login              |
| GET    | /api/auth/profile          | User     | Get profile        |
| PUT    | /api/auth/profile          | User     | Update profile     |
| PUT    | /api/auth/notifications/read | User   | Mark notifs read   |

### Products
| Method | Endpoint                        | Auth     | Description              |
|--------|---------------------------------|----------|--------------------------|
| GET    | /api/products                   | Public   | List + filter + search   |
| GET    | /api/products/featured          | Public   | Featured products        |
| GET    | /api/products/:id               | Public   | Single product           |
| POST   | /api/products                   | Admin    | Create product           |
| PUT    | /api/products/:id               | Admin    | Update product           |
| DELETE | /api/products/:id               | Admin    | Delete product           |
| POST   | /api/products/:id/wishlist      | User     | Toggle wishlist          |

### Orders
| Method | Endpoint                   | Auth     | Description           |
|--------|----------------------------|----------|-----------------------|
| POST   | /api/orders                | User     | Place order           |
| GET    | /api/orders/my             | User     | My orders             |
| GET    | /api/orders/:id            | User     | Order detail          |
| GET    | /api/orders                | Admin    | All orders            |
| PUT    | /api/orders/:id/status     | Admin    | Update status         |

### Reviews
| Method | Endpoint                            | Auth     | Description      |
|--------|-------------------------------------|----------|------------------|
| POST   | /api/reviews/:productId             | User     | Add review       |
| DELETE | /api/reviews/:productId/:reviewId   | Admin    | Delete review    |

### Admin
| Method | Endpoint                    | Auth  | Description          |
|--------|-----------------------------|-------|----------------------|
| GET    | /api/admin/analytics        | Admin | Dashboard analytics  |
| GET    | /api/admin/users            | Admin | All users            |
| PUT    | /api/admin/users/:id/toggle | Admin | Toggle user status   |

### Support
| Method | Endpoint         | Auth   | Description       |
|--------|------------------|--------|-------------------|
| POST   | /api/support     | Public | Create ticket     |
| GET    | /api/support/my  | User   | My tickets        |
| GET    | /api/support     | Admin  | All tickets       |

---

## ✅ Features Checklist

### Core Features
- [x] Product Catalog with images, prices, ratings, availability
- [x] Product search by name + category
- [x] Category filtering + price range + rating filters
- [x] Sort by: price, popularity, newest, rating
- [x] Shopping Cart (localStorage persistent)
- [x] Cart quantity update + remove items
- [x] 3-Step Checkout (Address → Payment → Review)
- [x] Multiple payment methods (COD, Card, UPI, NetBanking)
- [x] Order confirmation with order number

### Additional Features
- [x] Order Tracking (Pending → Processing → Shipped → Delivered)
- [x] Status history with timeline UI
- [x] Product Reviews & Ratings (write/view)
- [x] Average rating calculation
- [x] Customer Support (contact form + FAQ accordion + live chat)
- [x] Wishlist (toggle save/remove)
- [x] Recently Viewed Products
- [x] Push Notifications (order placed, status updated)

### Authentication
- [x] JWT-based register/login/logout
- [x] Password hashing with bcrypt
- [x] Protected routes (customer + admin)
- [x] Role-based access control

### Admin Dashboard
- [x] Product CRUD (create, edit, delete, featured/new toggle)
- [x] Order management + status updates
- [x] Customer management (activate/deactivate)
- [x] Analytics: revenue, orders, customers, top products
- [x] Sales chart (last 7 days, area + bar charts)
- [x] Order status pie chart
- [x] Collapsible sidebar

### UI/UX
- [x] Animated canvas background (floating particles + orbs)
- [x] Toggle Step Cards (workflow showcase)
- [x] Animated Flash Cards (with counter animations)
- [x] Hover effects + micro-interactions
- [x] Framer Motion page transitions
- [x] Glass morphism cards
- [x] Mobile responsive (mobile-first)
- [x] Toast notifications
- [x] Loading skeletons
- [x] 404 page

---

## 🚀 Production Deployment

### Backend (e.g., Railway / Render)
1. Set environment variables in dashboard
2. Change `MONGO_URI` to MongoDB Atlas connection string
3. Set `NODE_ENV=production`
4. Deploy via GitHub integration

### Frontend (e.g., Vercel / Netlify)
1. Update `package.json` proxy to your backend URL, or:
2. Set `REACT_APP_API_URL=https://your-backend.com` and update `api.js` baseURL
3. Deploy `frontend/` folder

---

## 🛠️ Tech Stack
- **Frontend**: React 18, TailwindCSS, Framer Motion, Recharts, React Icons
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Auth**: JWT, bcryptjs
- **Security**: Helmet, CORS, Rate Limiting