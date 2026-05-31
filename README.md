# ShopLux - Full eCommerce App (Next.js + Firebase + Tailwind CSS)

A production-ready full-stack eCommerce application with a public storefront and an admin panel, built with Next.js 14, Firebase, and Tailwind CSS.

## Features

### Public Storefront
- Home page: Hero, categories, featured products, trust badges, CTA
- Products page: Search, filter by category, sort, availability filter
- Product detail page: Image gallery, quantity selector, add to cart, reviews display
- Cart: Add/remove/update items, apply coupon codes, order summary
- Checkout: Multi-step form (shipping address -> payment method), order placement
- My Orders: View order history with status tracking
- Auth: Sign in / sign up with email+password or Google OAuth

### Admin Panel (`/admin/dashboard`)
- Dashboard: Revenue stats, order count, customer count, product count, recent orders
- Products: List, search, filter; create/edit with image upload; delete
- Orders: View all orders, update order status inline
- Customers: List all users, grant/revoke admin role
- Coupons: Create percentage or fixed-amount coupons, enable/disable, delete
- Settings: Store info, shipping/tax rates, admin profile, password change, notifications

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase
Use environment variables in `.env` / `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Then read these values in `src/lib/firebase.ts`.

### 3. Run development server
```bash
npm run dev
```

Open `http://localhost:3000`.

## Project Structure

```text
src/
├── app/
│   ├── (shop)/               # Public storefront routes
│   │   ├── page.tsx          # Home page
│   │   ├── products/         # Product listing + detail
│   │   ├── cart/             # Shopping cart
│   │   ├── checkout/         # Checkout flow
│   │   ├── orders/           # Customer orders
│   │   └── auth/             # Sign in / Sign up
│   ├── (admin)/              # Admin panel routes
│   │   └── admin/
│   │       ├── dashboard/    # Stats overview
│   │       ├── products/     # Product management
│   │       ├── orders/       # Order management
│   │       ├── customers/    # User management
│   │       ├── coupons/      # Discount codes
│   │       └── settings/     # Store & account settings
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── admin/                # Admin UI components
│   ├── shop/                 # Storefront UI components
│   └── layout/               # Shared layout wrappers (SiteShell)
├── context/
│   ├── AuthContext.tsx       # Firebase auth context
│   └── CartContext.ts        # Zustand cart store
├── lib/
│   ├── firebase.ts           # Firebase config
│   ├── services.ts           # Firestore CRUD operations
│   └── utils.ts              # Helper functions
└── types/
    └── index.ts              # TypeScript interfaces
```

## Tech Stack
- Next.js 14 (App Router)
- Firebase Auth
- Firestore
- Firebase Storage
- Tailwind CSS
- Zustand
- React Hook Form
- react-hot-toast
- lucide-react

