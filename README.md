# Keshavakiranam - E-commerce Platform

This is a professional e-commerce application built for a client as a freelance project. The platform provides a seamless shopping experience for customers and a robust management system for administrators.

## Project Overview

Keshavakiranam is a full-stack e-commerce solution designed with a focus on modern aesthetics, performance, and user experience. It features a premium emerald green theme and a responsive design that works across all devices.

## Key Features

### Customer Experience
- Product Discovery: Browse products by categories with an intuitive interface.
- Advanced Search and Filtering: Find products quickly using dynamic filters.
- Shopping Cart: Manage items with real-time updates and persistence.
- Secure Checkout: Streamlined process for placing orders.
- Order History: Registered users can track and view their past purchases.
- Special Offers: Dedicated section for promotional deals and discounted items.

### Administration
- Secure Admin Dashboard: Restricted access for authorized personnel.
- Content Management: Create, update, and delete products and categories.
- Order Management: Oversee customer orders and process fulfillment.
- Coupon System: Generate and manage discount codes for promotional campaigns.
- Admin Access Control: Manage the list of administrators with access to the backend.

## Technical Stack

- Frontend: Next.js (App Router), React, TypeScript
- Styling: Tailwind CSS 4, Lucide React (Icons)
- Backend: Next.js API Routes
- Database: MongoDB via Mongoose ODM
- Authentication: Clerk for secure user and admin management
- Notifications: Sonner for elegant toast notifications

## Getting Started

### Prerequisites
- Node.js (Latest stable version)
- MongoDB account or local instance
- Clerk account for authentication

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (refer to .env.local section below).

4. Run the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env.local` file in the root directory and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

## Disclaimer

This project was developed strictly for client use as part of a freelance engagement. All rights to the branding and specific business logic are reserved.

