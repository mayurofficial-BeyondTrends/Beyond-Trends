# ShopLux — Full eCommerce App (Next.js + Firebase + Tailwind CSS)

A production-ready full-stack eCommerce application with a public storefront and an admin panel, built with Next.js 14, Firebase, and Tailwind CSS.

---

## ✅ Features

### Public Storefront
- **Home page** — Hero, categories, featured products, trust badges, CTA
- **Products page** — Search, filter by category, sort, availability filter
- **Product detail page** — Image gallery, quantity selector, add to cart, reviews display
- **Cart** — Add/remove/update items, apply coupon codes, order summary
- **Checkout** — Multi-step form (shipping address → payment method), order placement
- **My Orders** — View order history with status tracking
- **Auth** — Sign in / sign up with email+password or Google OAuth

### Admin Panel (`/admin/dashboard`)
- **Dashboard** — Revenue stats, order count, customer count, product count, recent orders
- **Products** — List, search, filter; create/edit with image upload; delete
- **Orders** — View all orders, update order status inline, view order details modal
- **Customers** — List all users, grant/revoke admin role
- **Coupons** — Create percentage or fixed-amount coupons, enable/disable, delete
- **Settings** — Store info, shipping/tax rates, admin profile, password change, notifications

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

Open `src/lib/firebase.ts` and replace the placeholder values with your Firebase project credentials:

```ts
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",
}
```

**Where to find these:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create or open your project
3. Click **Project Settings** (gear icon) → **Your apps** → **Web app**
4. Copy the `firebaseConfig` object values

### 3. Enable Firebase Services

In your Firebase project console, enable:

| Service | Steps |
|---|---|
| **Authentication** | Build → Authentication → Get started → Enable **Email/Password** and **Google** |
| **Firestore** | Build → Firestore Database → Create database → Start in **test mode** (then apply rules below) |
| **Storage** | Build → Storage → Get started → Start in **test mode** (then apply rules below) |

### 4. Deploy Firestore Rules & Indexes

```bash
# Install Firebase CLI if needed
npm install -g firebase-tools

firebase login
firebase init  # select Firestore + Storage for your project

# Deploy rules and indexes
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
firebase deploy --only storage
```

Or paste `firestore.rules` and `storage.rules` content directly in the Firebase console.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — storefront  
Open [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard) — admin panel

---

## 👑 Making Yourself an Admin

1. Sign up / sign in on the storefront
2. In Firebase Console → Firestore → `users` collection → find your user document
3. Set the `role` field to `"admin"`
4. Refresh the app — you'll see the Admin Panel link in the user menu

---

## 📁 Project Structure

```
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
│   └── shop/                 # Storefront UI components
├── context/
│   ├── AuthContext.tsx        # Firebase auth context
│   └── CartContext.ts         # Zustand cart store
├── lib/
│   ├── firebase.ts            # Firebase config (⚠ add your credentials here)
│   ├── services.ts            # Firestore CRUD operations
│   └── utils.ts               # Helper functions
└── types/
    └── index.ts               # TypeScript interfaces
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14** | React framework with App Router |
| **Firebase Auth** | User authentication (email + Google) |
| **Firestore** | NoSQL database for products, orders, users |
| **Firebase Storage** | Product image uploads |
| **Tailwind CSS** | Utility-first styling |
| **Zustand** | Cart state management (persisted) |
| **React Hook Form** | Form handling and validation |
| **react-hot-toast** | Toast notifications |
| **lucide-react** | Icon library |
| **date-fns** | Date formatting |

---

## 🔧 Environment Variables (Optional)

Create a `.env.local` file to keep credentials out of source code:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Then update `src/lib/firebase.ts`:

```ts
const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add your Firebase credentials as environment variables in the Vercel dashboard.

### Build for production

```bash
npm run build
npm start
```

---

## 📝 Notes

- **Payment Integration**: The checkout currently accepts order placement without a real payment gateway. Integrate Razorpay, Stripe, or PayU by adding a payment step before order creation in `src/app/(shop)/checkout/page.tsx`.
- **Image Uploads**: Product images are uploaded to Firebase Storage. Ensure Storage rules are deployed.
- **Cart Persistence**: Cart is stored in `localStorage` via Zustand persist middleware and survives page refreshes.
- **Admin Protection**: The admin layout checks the user's `role` field from Firestore. Always keep Firestore rules deployed to enforce server-side security.
