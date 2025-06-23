
# 🛍️ E-Commerce React App

A simplified e-commerce product listing page built with React, TypeScript, Tailwind CSS, and DummyJSON API. Users can filter, sort, search for products, and manage their shopping cart with responsive UI and pagination.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js (v14 or higher)** and **npm** installed.

### 1. Clone the repo

git clone https://github.com/yourusername/ecommerce-app.git
cd ecommerce-app

### 2. Install dependencies

npm install

### 3. Start the development server

npm start


✨ Features
✅ Product listing from DummyJSON API

🔍 Filter by category, rating, and price range

⬆️ Sort by name, price, and rating

🔎 Search products by title

📄 Pagination 

🛒 Add to cart, update quantity, and remove products

🧾 Cart total price and item count shown in header

📱 Fully responsive design using Tailwind CSS

🔁 Modular, reusable components



## 🧠 Approach & Challenges

### 📌 Approach

This project was built using **React**, **TypeScript**, and **Tailwind CSS** to simulate a simplified e-commerce web application with a clean UI and good performance.

#### Key decisions:

- **Project setup**:
  - Initialized with Create React App using the TypeScript template.
  - Tailwind CSS was configured for fast and responsive UI development.
  - Organized code into modular folders: `components/`, `pages/`, `context/`, and `types/`.

- **Product listing**:
  - Fetched products from [DummyJSON](https://dummyjson.com/products) API.
  - Used a grid layout for displaying product image, name, price, category, and rating.

- **Filtering, sorting, and search**:
  - Created a separate `<Filters />` component with category, price range, and rating filters.
  - Sorting options by price, rating, and name using `useMemo` for performance.
  - Search bar filters products by keyword in real-time.

- **Shopping cart**:
  - Global cart state is managed using React Context API.
  - Cart supports add, update quantity, remove item, and view total price.
  - Toast notification is shown when a product is added to the cart.

- **Performance optimizations**:
  - Applied `useCallback` and `useMemo` to reduce unnecessary re-renders.

- **Pagination**:
  - Products are paginated.
  - Page state is decoupled from filtering and searching.

---

### ✅ Result

The final app is modular, efficient, and scalable. It follows React best practices, is responsive, and handles hundreds of items with fast performance — all while maintaining a clean and user-friendly UI.

Link: https://ecommerce-app-simple.netlify.app/