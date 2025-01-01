# To-Do List API with JWT Authentication

This project is a simple RESTful API built with Node.js to manage a to-do list application. The API allows users to create, update, view, and delete tasks. Authentication is handled using JSON Web Tokens (JWT) to ensure that only authorized users can interact with the API.

## Features
The following endpoints are available:

1. **POST /tasks**: Create a new task with title, description, and status (default: "pending").
2. **GET /tasks**: Fetch all tasks.
3. **GET /tasks/:id**: Fetch a task by its ID.
4. **PUT /tasks/:id**: Update the task status (valid statuses: "pending", "in-progress", "completed").
5. **DELETE /tasks/:id**: Delete a task by its ID.

## Requirements
- Node.js >= v21.6.2
- npm >= 10.2.4
- MongoDB 

## Installation

Follow these steps to set up the project:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/todo-list-api.git
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up environment variables**:
    - Create a `.env` file in the root directory of your project.
    - Add the following content to your `.env` file:

    ```plaintext
    # MongoDB connection URL (ensure this URL is correct, including the database name)
    MONGODB_URL=YOUR_MONGODB_URL

    # Port where the server will run
    PORT=YOUR_PORT_NUMBER

    # CORS settings, allowing requests from all origins (you may customize this based on your needs)
    CORS_ORIGIN=*

    # JWT access token configuration
    ACCESS_TOKEN_SECRET=your_jwt_access_token_secret
    ACCESS_TOKEN_EXPIRY=1d  # Token will expire in 1 day

    # JWT refresh token configuration
    REFRESH_TOKEN_SECRET=your_jwt_refresh_token_secret
    REFRESH_TOKEN_EXPIRY=10d  # Refresh token will expire in 10 days
    ```

    - **MONGODB_URL**: Replace `YOUR_MONGODB_URL` with your MongoDB connection string, which you can get from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) if you're using the cloud version.
    - **PORT**: Replace `YOUR_PORT_NUMBER` with the desired port number (default is `8000`).
    - **ACCESS_TOKEN_SECRET** and **REFRESH_TOKEN_SECRET**: Replace with a secret key of your choice for signing JWTs. For added security, make sure this key is complex and kept confidential.

4. **Start the server**:
    ```bash
    npm run dev
    ```

    The API will now be running at `http://localhost:YOUR_PORT_NUMBER` (replace with the port number you configured in `.env`).

