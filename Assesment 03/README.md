# Inventory Management System

A backend-based Inventory Management System developed using Node.js, Express.js, MongoDB, and Mongoose.

## Features

- Create, view, update, and delete products.
- Product schema validation.
- Search products by name.
- Filter products by category.
- Sort products using different fields.
- Pagination for product listings.
- Safe stock increment and decrement operations.
- Low-stock alert report.
- Category-wise inventory summary using MongoDB aggregation.
- Centralized error handling and input validation.

## Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv

## Project Structure

```text
assessment-3-web-dev-3/
├── config/
│   └── db.js
├── middleware/
│   ├── errorMiddleware.js
│   └── validateProduct.js
├── models/
│   └── Product.js
├── routes/
│   └── productRoutes.js
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## Installation

Clone the repository:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Navigate into the project folder:

```bash
cd assessment-3-web-dev-3
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
```

Start the development server:

```bash
npm run dev
```

The server runs at:

```text
http://localhost:3000
```

## API Base URL

```text
http://localhost:3000/api/products
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/products | Create product |
| GET | /api/products | Get all products |
| GET | /api/products/:id | Get single product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| PATCH | /api/products/:id/stock | Adjust stock |
| GET | /api/products/reports/low-stock | Low-stock report |
| GET | /api/products/reports/category-summary | Category-wise summary |

## Database

The application uses MongoDB Atlas for storing product information.

## Author

Developed as a Web Development III assignment.