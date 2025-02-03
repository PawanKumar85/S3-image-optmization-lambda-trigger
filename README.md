# Image Optimization API

This project provides an API for image upload, storage, and optimization using **AWS S3** and **MongoDB**. The API allows users to upload images, store them in S3, and manage them (view, delete, update, and download). Images are stored in separate folders for raw and optimized images.

## Features

- **Upload Images**: Upload images to AWS S3 in the `Raw-images` folder.
- **Optimize Images**: Convert image URLs to an optimized folder for easier access and management.
- **Manage Images**: List, get, update, and delete images stored in MongoDB and S3.
- **Download Images**: Allow users to download images from S3.
- **Validation**: The API validates file size and type before uploading.
- **AWS S3 Integration**: Upload, list, get, delete, and download images from AWS S3.

## Tech Stack

- **Node.js**: JavaScript runtime for the server.
- **Express.js**: Web framework to handle API routes.
- **AWS SDK**: For interacting with AWS S3.
- **Mongoose**: For MongoDB interaction.
- **Multer**: Middleware for handling `multipart/form-data` (file uploads).
- **dotenv**: For loading environment variables.
- **Docker**: For providing run time environment.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/PawanKumar85/S3-image-optmization-lambda-trigger.git
   cd S3-image-optmization-lambda-trigger
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:

   - Create a `.env` file in the root directory.
   - Add the following variables:

   ```env
   PORT=3000
   MONGODB_URL=your-mongodb-connection-string
   AWS_ACCESS_KEY_ID=your-aws-access-key-id
   AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
   AWS_REGION=your-aws-region
   S3_BUCKET_NAME=your-s3-bucket-name
   NAME = your-s3-name
   ```

4. Run the server:
   ```bash
   npm start
   ```

The server will be running on `http://localhost:3000`.

## API Endpoints

### 1. **POST /api/images/upload**

- Uploads an image to AWS S3 and stores it in MongoDB.
- **Form Field**: `logo`
- **Request**:
  - A file (image) sent via form data under the field name `logo`.
- **Response**:
  - `200 OK`: Image successfully uploaded.
  - `400 Bad Request`: If validation fails (e.g., wrong file type or size).
  - `500 Internal Server Error`: If upload fails.

### 2. **GET /api/images/list**

- Retrieves all images from MongoDB.
- **Response**:
  - `200 OK`: Returns an array of image URLs stored in MongoDB.

### 3. **GET /api/images/list/:id**

- Retrieves a specific image by ID from MongoDB.
- **Response**:
  - `200 OK`: Returns the image data.
  - `404 Not Found`: If image does not exist.

### 4. **PUT /api/images/image/:id**

- Updates an existing image by ID.
- **Request**:
  - A new image file sent via form data under the field name `logo`.
- **Response**:
  - `200 OK`: Image successfully updated.
  - `400 Bad Request`: If the ID is invalid.
  - `500 Internal Server Error`: If upload fails.

### 5. **DELETE /api/images/delete/:id**

- Deletes an image by ID from both MongoDB and AWS S3.
- **Response**:
  - `200 OK`: Image successfully deleted.
  - `404 Not Found`: If image does not exist.
  - `500 Internal Server Error`: If deletion fails.

### 6. **GET /api/images/download/:id**

- Downloads an image from S3.
- **Response**:
  - `200 OK`: Image file will be returned as a downloadable attachment.
  - `404 Not Found`: If image does not exist.

### 7. **GET /api/images/AWS/S3/list**

- Lists all images stored in the `Optimize-images` folder in AWS S3.
- **Response**:
  - `200 OK`: Returns an array of image URLs from S3.

## Middlewares

- **File Validation**: Ensures the uploaded file is an image and does not exceed 10MB.
- **File Query**: Adds file extension, size, and filesize to the original filename for consistency.
- **Multer**: Handles file uploads using `multer` with memory storage.

## File Structure

```
/image-optimization-api
│
├── /controllers         # Contains API route handlers
│   ├── image.controller.js
│
├── /middlewares         # Contains middlewares like validation, query, and file upload
│   ├── addQuery.js
│   ├── fileValidationMiddleware.js
│   ├── multerConfig.js
│
├── /models              # Mongoose models (e.g., Image schema)
│   ├── image.model.js
│
├── /routes              # Express router for API endpoints
│   ├── image.routes.js
│
├── /services            # AWS S3 service and file operations
│   ├── imageService.service.js
│
├── /config              # Configuration files (e.g., AWS S3 and MongoDB setup)
│   ├── mongoDbConfig.js
│   ├── s3Config.js
│
├── /utils               # Utility functions (e.g., formatting file names)
│   ├── renamefile.js
│
├── server.js            # Entry point to start the API
├── .env                 # Environment variables for setup
├── package.json         # Project metadata and dependencies
└── README.md            # Project documentation
├── Dockerfile
└── docker-compose.yml
```

## Docker Compose Configuration

The `docker-compose.yml` file defines the following services:

- **MongoDB**: Uses the official MongoDB image and persists data in the `mongo-data` volume.
- **API**: Built using the Dockerfile from the current directory. It uses the `pawan630703/s3-image-storage:v2` image for deployment.

## Docker Compose Example

```bash

services:
  express-api:
    build: .
    container_name: express-api
    environment:
      - MONGODB_URL=mongodb://mongo:27017/${NAME}
      - AWS_REGION=${AWS_REGION}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - S3_BUCKET_NAME=${S3_BUCKET_NAME}
      - PORT=5000
    ports:
      - "5000:5000"
    depends_on:
      - mongo
    networks:
      - app-network
    volumes:
      - ./app:/usr/src/app
      - /usr/src/app/node_modules

  mongo:
    image: mongo:latest
    container_name: mongo
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network

volumes:
  mongo-data:

networks:
  app-network:
    driver: bridge

```

## Docker Push

To pull the `s3-image-storage:v2` Docker image from Docker Hub:

#### Pull the Docker image:

```bash
docker pull pawan630703/s3-image-storage:v2
```

## Contributing

Feel free to fork the repository and submit issues or pull requests if you have any improvements or bug fixes.

