# RevoBank API

RevoBank is a secure and scalable banking API designed for a fictional financial institution. This API provides essential banking operations, user authentication, and a robust database design using Prisma ORM and PostgreSQL.

## Features

- User registration and authentication
- Account management (create, retrieve, update, delete)
- Transaction management (deposit, withdraw, transfer, retrieve)
- Secure JWT-based authentication
- Scalable architecture using NestJS

## Technologies Used

- NestJS: A progressive Node.js framework for building efficient and scalable server-side applications.
- Prisma: A modern database toolkit that simplifies database access and management.
- PostgreSQL: A powerful, open-source relational database system.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- PostgreSQL (version 12 or higher)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/revo-bank-api.git
   ```

2. Navigate to the project directory:

   ```
   cd revo-bank-api
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Set up the database:

   - Create a PostgreSQL database for RevoBank.
   - Update the database connection string in the `.env` file (create one based on `.env.example`).

5. Run the Prisma migrations:

   ```
   npx prisma migrate dev --name init
   ```

### Running the Application

To start the application, run:

```
npm run start:dev
```

The API will be available at `http://localhost:3000`.

### API Documentation

Refer to the API documentation for details on available endpoints and usage.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.