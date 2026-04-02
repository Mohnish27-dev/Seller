# Ladies Garments - E-Commerce Platform

A modern, full-featured e-commerce platform for women's ethnic and contemporary clothing built with Next.js 16, React 19, and MongoDB.

## Live Demo

https://seller-jade-six.vercel.app/

## Features

### Customer Features
- **Product Catalog** - Browse products by categories: Salwar, Suit, Kurti, Maxi, Gown, Legging, Dupatta
- **Product Search** - Search products by name, description, or category
- **Product Filtering** - Filter by category, price range, size, and color
- **Shopping Cart** - Add/remove items, update quantities (persisted with Zustand)
- **Wishlist** - Save favorite products for later
- **User Authentication** - Register/login with email or Google OAuth
- **User Profile** - Manage account details and saved addresses
- **Order Tracking** - Track order status and history
- **Secure Checkout** - Razorpay payment integration
- **Responsive Design** - Mobile-first design with Tailwind CSS

### Admin Panel
- **Dashboard Analytics** - Revenue, orders, products, and customer statistics
- **Product Management** - Add, edit, delete products with Cloudinary image uploads
- **Order Management** - View and update order status
- **Customer Management** - View registered customers
- **Settings** - Configure store settings

### Technical Features
- **Server-Side Rendering** - SEO-optimized pages with Next.js App Router
- **API Routes** - RESTful API endpoints for all operations
- **Database** - MongoDB with Mongoose ODM
- **State Management** - Zustand for cart and wishlist persistence
- **Image Optimization** - Cloudinary CDN for image storage and delivery
- **Toast Notifications** - React Hot Toast for user feedback
- **Icons** - React Icons (Feather icons)

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React framework with App Router |
| React 19 | UI library |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| NextAuth.js | Authentication |
| Razorpay | Payment gateway |
| Cloudinary | Image storage & CDN |
| Zustand | State management |
| Tailwind CSS 4 | Styling |
| React Hot Toast | Notifications |
| React Icons | Icon library |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── about/              # About page
│   ├── account/            # User account pages
│   ├── admin/              # Admin dashboard & management
│   │   ├── analytics/      # Analytics dashboard
│   │   ├── customers/      # Customer management
│   │   ├── orders/         # Order management
│   │   ├── products/       # Product management
│   │   └── settings/       # Admin settings
│   ├── api/                # API routes
│   │   ├── admin/          # Admin API endpoints
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── orders/         # Order API
│   │   ├── payment/        # Razorpay integration
│   │   ├── products/       # Product API
│   │   ├── upload/         # Cloudinary upload
│   │   ├── user/           # User API
│   │   └── wishlist/       # Wishlist API
│   ├── cart/               # Shopping cart
│   ├── checkout/           # Checkout flow
│   ├── login/              # Login page
│   ├── orders/             # Order history
│   ├── order-success/      # Order confirmation
│   ├── products/           # Product listing & details
│   ├── register/           # Registration page
│   ├── track-order/        # Order tracking
│   ├── wishlist/           # Wishlist page
│   ├── privacy-policy/     # Privacy policy
│   ├── return-policy/      # Return policy
│   ├── shipping-policy/    # Shipping policy
│   └── terms/              # Terms & conditions
├── components/             # Reusable components
│   ├── Footer.jsx          # Site footer
│   ├── HeroSection.jsx     # Homepage hero
│   ├── Navbar.jsx          # Navigation bar
│   ├── ProductCard.jsx     # Product card component
│   ├── Providers.jsx       # App providers wrapper
│   └── TrendyPairs.jsx     # Featured products section
├── data/                   # Static data & seeds
├── lib/                    # Utility libraries
│   └── mongodb.js          # Database connection
├── models/                 # Mongoose models
│   ├── Category.js         # Category schema
│   ├── Order.js            # Order schema
│   ├── Product.js          # Product schema
│   └── User.js             # User schema
├── scripts/                # Utility scripts
│   ├── createAdmin.js      # Create admin user
│   ├── seed-admin.js       # Seed admin account
│   └── seed-products.js    # Seed sample products
└── store/                  # Zustand stores
    ├── cartStore.js        # Shopping cart state
    └── wishlistStore.js    # Wishlist state
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Razorpay](https://razorpay.com/) account (for payments)
- [Cloudinary](https://cloudinary.com/) account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd garments
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

   Required environment variables:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/ladies-garments
   
   # NextAuth Configuration
   NEXTAUTH_SECRET=your-super-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # Razorpay (Get from razorpay.com dashboard)
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your-razorpay-secret-key
   
   # Cloudinary (Get from cloudinary.com dashboard)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Admin Credentials
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=admin123
   ```

4. **Seed the database (optional)**
   ```bash
   # Create admin user
   node src/scripts/seed-admin.js
   
   # Seed sample products
   node src/scripts/seed-products.js
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Access

Navigate to `/admin/login` and use the admin credentials configured in your `.env` file.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |

## Product Categories

- **Salwar** - Traditional salwar suits
- **Suit** - Designer suits
- **Kurti** - Casual and formal kurtis
- **Maxi** - Maxi dresses
- **Gown** - Party and occasion gowns
- **Legging** - Matching leggings
- **Dupatta** - Dupattas and stoles

## Product Sizes

- XS, S, M, L, XL, XXL, Free Size

## API Endpoints

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/[slug]` - Get product by slug
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order details

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/[id]` - Remove from wishlist

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Build the project and run the production server:
```bash
npm run build
npm run start
```

## Store Policies

The platform includes the following policy pages:
- `/privacy-policy` - Privacy Policy
- `/return-policy` - Return & Refund Policy (7 days)
- `/shipping-policy` - Shipping Policy (Free above ₹999)
- `/terms` - Terms & Conditions

## License

This project is private and proprietary.

## Support

For support, contact via WhatsApp (24/7 support available as mentioned on the platform).
