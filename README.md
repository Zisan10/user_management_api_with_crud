User Management API

A RESTful User Management API built with Node.js, Express.js, TypeScript, Prisma ORM, and MongoDB.

This project provides CRUD (Create, Read, Update, Delete) operations for managing users, including input validation, duplicate email handling, error handling, and database integration.

Table of Contents
Features
Technologies Used
Project Structure
Prerequisites
Installation and Setup
Environment Variables
Database Setup
Run the Project
API Documentation
Postman Testing
Validation Rules
Error Handling
Build for Production
Troubleshooting
Security Notes
Future Improvements
Author
License
Features
Create a new user.
Retrieve all users.
Retrieve a single user by ID.
Update user information using PATCH.
Delete a user.
Validate required fields.
Validate user IDs.
Prevent duplicate email addresses.
Handle missing users and invalid requests.
Connect to MongoDB using Prisma ORM.
Use TypeScript for type safety.
Return consistent JSON responses.
Support environment variables for configuration.
Technologies Used
Technology	Purpose
Node.js	JavaScript runtime
Express.js	Backend web framework
TypeScript	Static typing
Prisma ORM	Database access and queries
MongoDB	Database
dotenv	Environment variable management
Postman	API testing
Project Structure
user-management-api/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   └── prisma.ts
│   ├── controllers/
│   │   └── user.controller.ts
│   ├── routes/
│   │   └── user.routes.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md


Note: The project structure may vary depending on your configuration. The dist/ directory may be generated after building the project.

Prerequisites

Make sure you have installed:

Node.js
npm (included with Node.js)
MongoDB Atlas account or another supported MongoDB deployment
Postman for testing
Visual Studio Code or another code editor

Check your installed versions:

node -v
npm -v

Installation and Setup
1. Clone the repository
git clone YOUR_GITHUB_REPOSITORY_URL
cd user-management-api


Replace YOUR_GITHUB_REPOSITORY_URL with your actual GitHub repository URL.

If you have not uploaded the project to GitHub, create the project folder and open it in your code editor.

2. Install dependencies
npm install


If you are creating the project from scratch, install the required packages according to your Prisma version and configuration.

For a Prisma 6 project using the prisma-client-js generator:

npm install express @prisma/client dotenv
npm install -D typescript tsx prisma @types/node @types/express


Initialize TypeScript if necessary:

npx tsc --init


Important: Prisma 7 has configuration differences from Prisma 6, including database adapter and configuration requirements. Follow the setup instructions for the Prisma version installed in your project.

3. Configure TypeScript

Make sure your tsconfig.json is configured to compile your TypeScript source files. For example:

{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}


Use a configuration compatible with your installed Prisma version and module system.

Environment Variables

Create a .env file in the project root:

PORT=5000
DATABASE_URL="YOUR_MONGODB_CONNECTION_STRING"


Replace YOUR_MONGODB_CONNECTION_STRING with your actual MongoDB connection string.

Example format:

DATABASE_URL="mongodb+srv://USERNAME:PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE?retryWrites=true&w=majority"


The example is a template, not a working connection string.

MongoDB Atlas setup
Create a MongoDB Atlas account.
Create a cluster.
Create a database user with an appropriate password.
Configure Network Access to allow your development machine.
Get your MongoDB connection string.
Add the connection string to your .env file.

Do not publish your actual database credentials.

Database Setup
Prisma schema

Define your User model in prisma/schema.prisma. The following is an example schema for MongoDB:

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  name      String
  email     String   @unique
  age       Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}


This schema uses MongoDB ObjectIds for user IDs and makes email unique.

Important: If your existing Prisma schema is different, keep it consistent with your current application and Prisma version.

Generate Prisma Client

For a Prisma version and schema configuration that use prisma-client-js, run:

npx prisma generate

Synchronize the schema with MongoDB

For Prisma 6 configurations that support this workflow, run:

npx prisma db push


MongoDB does not use Prisma's traditional SQL migration workflow in the same way as relational databases.

For Prisma 7, follow the database configuration and schema synchronization workflow for your installed version.

Prisma client configuration

Example src/config/prisma.ts for a standard Prisma Client setup:

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;


Use the generated client's actual import path if your project uses a different generator or Prisma version.

Run the Project

Add the appropriate scripts to your package.json. For example, in a compatible TypeScript project:

{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}


If your package.json already contains other scripts, add these without deleting the existing required configuration.

Start the development server:

npm run dev


Expected terminal output:

MongoDB connected successfully
Server running at http://localhost:5000


The exact output depends on your server implementation and database connection.

Open this URL in your browser:

http://localhost:5000


Expected response:

{
  "success": true,
  "message": "User Management API is running"
}

API Documentation
Base URL
http://localhost:5000/api/users

Available endpoints
Method	Endpoint	Description
POST	/api/users	Create a user
GET	/api/users	Get all users
GET	/api/users/:id	Get a user by ID
PATCH	/api/users/:id	Update a user
DELETE	/api/users/:id	Delete a user

All request and response bodies use JSON where applicable.

1. Create User

Endpoint

POST /api/users


Request body

{
  "name": "Rahim Ahmed",
  "email": "rahim@example.com",
  "age": 25
}


The age field is optional.

Success response — 201 Created

{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "GENERATED_USER_ID",
    "name": "Rahim Ahmed",
    "email": "rahim@example.com",
    "age": 25
  }
}


The returned user ID and timestamps are generated or populated by the database and Prisma according to your schema.

Possible errors

400 Bad Request — missing or invalid name/email, or invalid age.
409 Conflict — email already exists.
500 Internal Server Error — unexpected server or database error.
2. Get All Users

Endpoint

GET /api/users


Returns all users ordered by creation date, newest first, according to the controller implementation.

Success response — 200 OK

{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": "USER_ID_1",
      "name": "Rahim Ahmed",
      "email": "rahim@example.com",
      "age": 25
    },
    {
      "id": "USER_ID_2",
      "name": "Karim Hasan",
      "email": "karim@example.com",
      "age": 30
    }
  ]
}


The IDs and data above are examples. The actual response depends on the stored records and schema.

Possible error

500 Internal Server Error — unable to retrieve users.
3. Get a Single User

Endpoint

GET /api/users/:id


Example

GET /api/users/507f1f77bcf86cd799439011


Replace the example ID with an actual user ID returned by your API.

Success response — 200 OK

{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Rahim Ahmed",
    "email": "rahim@example.com",
    "age": 25
  }
}


Possible errors

400 Bad Request — ID does not match the expected 24-character hexadecimal ObjectId format.
404 Not Found — no user exists with that valid ID.
500 Internal Server Error — unexpected server or database error.
4. Update User

Endpoint

PATCH /api/users/:id


PATCH updates only the fields supplied in the request.

Request body

{
  "name": "Rahim Hasan",
  "age": 26
}


You may provide one or more supported fields: name, email, and age.

Success response — 200 OK

{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "USER_ID",
    "name": "Rahim Hasan",
    "email": "rahim@example.com",
    "age": 26
  }
}


The response contains the updated user. Unchanged fields retain their previous values.

Possible errors

400 Bad Request — invalid ID, invalid field value, or no fields supplied.
404 Not Found — user does not exist.
409 Conflict — email already belongs to another user.
500 Internal Server Error — unexpected server or database error.

Clearing age

If your controller permits null for age, the following request clears the age field's value:

{
  "age": null
}


This works when the Prisma schema defines age as optional, such as Int?.

5. Delete User

Endpoint

DELETE /api/users/:id


Example

DELETE /api/users/507f1f77bcf86cd799439011


Replace the example ID with the ID of the user you want to delete.

Success response — 200 OK

{
  "success": true,
  "message": "User deleted successfully"
}


Possible errors

400 Bad Request — invalid user ID.
404 Not Found — user does not exist.
500 Internal Server Error — unexpected server or database error.
Postman Testing

You can test all endpoints using Postman.

Step 1: Create a user
Method: POST
URL: http://localhost:5000/api/users
Select Body → raw → JSON.
Enter:
{
  "name": "Rahim Ahmed",
  "email": "rahim@example.com",
  "age": 25
}


Click Send.

Expected status: 201 Created.

Copy the generated user ID from the response.

Step 2: Get all users
Method: GET
URL: http://localhost:5000/api/users

Expected status: 200 OK.

Step 3: Get one user
Method: GET
URL: http://localhost:5000/api/users/PASTE_USER_ID_HERE

Replace PASTE_USER_ID_HERE with the ID obtained from the create response.

Expected status: 200 OK if the user exists.

Step 4: Update a user
Method: PATCH
URL: http://localhost:5000/api/users/PASTE_USER_ID_HERE
Body → raw → JSON:
{
  "name": "Rahim Hasan",
  "age": 26
}


Expected status: 200 OK.

Step 5: Delete a user
Method: DELETE
URL: http://localhost:5000/api/users/PASTE_USER_ID_HERE

Expected status: 200 OK.

Try fetching the same ID afterward. If the user was successfully deleted, the API should return 404 Not Found.

Note: Use a different email address for each successful create test because email addresses must be unique.

Validation Rules

The controller validates the following inputs:

Field	Rules
name	Must be a non-empty string
email	Must be a non-empty string and must be unique
age	Must be a non-negative integer or null during updates, if permitted
id	Must match a 24-character hexadecimal ObjectId format

Additional validation, such as checking whether an email is syntactically valid, can be implemented separately.

Error Handling

The API uses appropriate HTTP status codes and JSON responses to communicate errors.

Status code	Meaning
200 OK	Request completed successfully
201 Created	User created successfully
400 Bad Request	Invalid input or user ID
404 Not Found	Requested user or route not found
409 Conflict	Duplicate unique field, such as email
500 Internal Server Error	Unexpected server or database error
Prisma error codes
P2002: A unique constraint failed, such as a duplicate email address.
P2025: A required record was not found for an operation such as update or delete.

The controller catches these known Prisma errors and returns appropriate HTTP responses.

Build for Production

Compile the TypeScript project:

npm run build


If the build succeeds, compiled JavaScript should be available in the configured output directory, such as dist/.

Start the compiled server:

npm start


This assumes the start script points to the correct compiled entry point.

Before deploying, verify your environment variables, database connectivity, build output, and Prisma configuration.

Troubleshooting
1. MongoDB connection failed
Verify the DATABASE_URL in .env.
Check your MongoDB Atlas database username and password.
Confirm that your current IP address is allowed in Atlas Network Access.
Check whether special characters in your password require URL encoding.
Verify that your database cluster is available.
2. Prisma Client cannot be found

For a project using the standard prisma-client-js generator, try:

npx prisma generate


Confirm that the Prisma package and generated client match the versions and configuration used by your project.

3. TypeScript type errors
Check the types defined in schema.prisma.
Use primitive TypeScript types such as string, number, and boolean instead of wrapper types such as String, Number, and Boolean.
Make sure your update data matches the generated Prisma input types.
Check that your TypeScript configuration matches your module system.
4. Duplicate email error

If you receive 409 Conflict, the email may already exist. Use a different email or update the intended user's existing record.

5. Invalid user ID

The controller expects a 24-character hexadecimal MongoDB ObjectId. Copy the ID directly from a successful API response.

6. Build fails

Run:

npm run build


Review the reported file path and line number. Check imports, file names, TypeScript types, Prisma Client generation, and tsconfig.json.

Security Notes
Never commit your .env file or database credentials.
Add .env and other sensitive local files to .gitignore.
Use strong database credentials.
Restrict database network access to trusted addresses.
Validate and sanitize user input.
Use appropriate database permissions.
Configure CORS, rate limiting, authentication, and authorization before exposing the API publicly.
Do not expose sensitive error details in production responses.
Future Improvements

Possible improvements for future versions include:

User authentication with JWT.
Password hashing and secure login.
Pagination and filtering.
Search users by name or email.
Request validation with Zod or another validation library.
Centralized error-handling middleware.
Automated tests with Jest or Vitest.
API documentation with Swagger/OpenAPI.
Docker support.
Deployment to a cloud platform.
Author

Your Name

GitHub: YOUR_GITHUB_PROFILE_URL
Project: YOUR_GITHUB_REPOSITORY_URL

Replace these placeholders with your actual details.

License

This project is currently provided for learning and educational purposes.

If you intend to distribute or publish it, choose a license appropriate for your project and add a corresponding LICENSE file.

Built with Node.js, Express.js, TypeScript, Prisma ORM, and MongoDB.
