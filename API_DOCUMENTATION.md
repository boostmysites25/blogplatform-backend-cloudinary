# Blog Platform API Documentation

This document provides detailed information about the Blog Platform API endpoints, request/response formats, and usage examples.

## Table of Contents

1. [Authentication](#authentication)
2. [Blogs](#blogs)
3. [Categories](#categories)
4. [Authors](#authors)
5. [Users](#users)
6. [Comments](#comments)
7. [Error Handling](#error-handling)
8. [Data Models](#data-models)

## Authentication

### Register a New User

**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2023-06-22T10:30:40.123Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Verify Token

**Endpoint:** `GET /api/auth/verify`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

## Blogs

### Get All Blogs

**Endpoint:** `GET /api/blogs`

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of blogs per page (default: 100)
- `status` (optional): Filter by status ('published', 'draft', etc.)
- `search` (optional): Search term for blog title and content

**Response (200 OK):**
```json
{
  "success": true,
  "blogs": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Getting Started with Node.js",
      "slug": "getting-started-with-nodejs",
      "excerpt": "Learn the basics of Node.js development",
      "status": "published",
      "imageUrl": "/uploads/blog-image-1.jpg",
      "imageAlt": "Node.js logo",
      "categoryId": {
        "_id": "60d21b4667d0d8992e610c90",
        "name": "Web Development"
      },
      "authorId": {
        "_id": "60d21b4667d0d8992e610c95",
        "name": "Jane Smith"
      },
      "createdAt": "2023-06-22T10:30:40.123Z",
      "updatedAt": "2023-06-22T10:30:40.123Z"
    },
    // More blogs...
  ],
  "totalCount": 42,
  "currentPage": 1,
  "totalPages": 5
}
```

### Get Blog by ID

**Endpoint:** `GET /api/blogs/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "blog": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Getting Started with Node.js",
    "slug": "getting-started-with-nodejs",
    "content": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine...",
    "excerpt": "Learn the basics of Node.js development",
    "status": "published",
    "imageUrl": "/uploads/blog-image-1.jpg",
    "imageAlt": "Node.js logo",
    "categoryId": {
      "_id": "60d21b4667d0d8992e610c90",
      "name": "Web Development"
    },
    "authorId": {
      "_id": "60d21b4667d0d8992e610c95",
      "name": "Jane Smith"
    },
    "tags": ["nodejs", "javascript", "backend"],
    "createdAt": "2023-06-22T10:30:40.123Z",
    "updatedAt": "2023-06-22T10:30:40.123Z"
  }
}
```

### Get Blog by Slug

**Endpoint:** `GET /api/blogs/slug/:slug`

**Response (200 OK):**
```json
{
  "success": true,
  "blog": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Getting Started with Node.js",
    "slug": "getting-started-with-nodejs",
    "content": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine...",
    "excerpt": "Learn the basics of Node.js development",
    "status": "published",
    "imageUrl": "/uploads/blog-image-1.jpg",
    "imageAlt": "Node.js logo",
    "categoryId": {
      "_id": "60d21b4667d0d8992e610c90",
      "name": "Web Development"
    },
    "authorId": {
      "_id": "60d21b4667d0d8992e610c95",
      "name": "Jane Smith"
    },
    "tags": ["nodejs", "javascript", "backend"],
    "createdAt": "2023-06-22T10:30:40.123Z",
    "updatedAt": "2023-06-22T10:30:40.123Z"
  }
}
```

### Get Featured Blogs

**Endpoint:** `GET /api/blogs/featured`

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of blogs per page
- `status` (optional): Filter by status (default: 'published')

**Response (200 OK):**
```json
{
  "success": true,
  "blogs": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Getting Started with Node.js",
      "slug": "getting-started-with-nodejs",
      "excerpt": "Learn the basics of Node.js development",
      "status": "published",
      "imageUrl": "/uploads/blog-image-1.jpg",
      "imageAlt": "Node.js logo",
      "isFeatured": true,
      "categoryId": {
        "_id": "60d21b4667d0d8992e610c90",
        "name": "Web Development"
      },
      "authorId": {
        "_id": "60d21b4667d0d8992e610c95",
        "name": "Jane Smith"
      },
      "createdAt": "2023-06-22T10:30:40.123Z",
      "updatedAt": "2023-06-22T10:30:40.123Z"
    },
    // More featured blogs...
  ],
  "totalCount": 5,
  "currentPage": 1,
  "totalPages": 1
}
```

### Get Published Blogs

**Endpoint:** `GET /api/blogs/published`

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of blogs per page
- `search` (optional): Search term for blog title and content

**Response (200 OK):**
```json
{
  "success": true,
  "blogs": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Getting Started with Node.js",
      "slug": "getting-started-with-nodejs",
      "excerpt": "Learn the basics of Node.js development",
      "status": "published",
      "imageUrl": "/uploads/blog-image-1.jpg",
      "imageAlt": "Node.js logo",
      "categoryId": {
        "_id": "60d21b4667d0d8992e610c90",
        "name": "Web Development"
      },
      "authorId": {
        "_id": "60d21b4667d0d8992e610c95",
        "name": "Jane Smith"
      },
      "createdAt": "2023-06-22T10:30:40.123Z",
      "updatedAt": "2023-06-22T10:30:40.123Z"
    },
    // More published blogs...
  ],
  "totalCount": 35,
  "currentPage": 1,
  "totalPages": 4
}
```

### Get Scheduled Blogs (Admin Only)

**Endpoint:** `GET /api/blogs/scheduled`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of blogs per page

**Response (200 OK):**
```json
{
  "success": true,
  "blogs": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Getting Started with Node.js",
      "slug": "getting-started-with-nodejs",
      "excerpt": "Learn the basics of Node.js development",
      "status": "published",
      "publishDate": "2023-12-25T00:00:00.000Z",
      "imageUrl": "/uploads/blog-image-1.jpg",
      "imageAlt": "Node.js logo",
      "categoryId": {
        "_id": "60d21b4667d0d8992e610c90",
        "name": "Web Development"
      },
      "authorId": {
        "_id": "60d21b4667d0d8992e610c95",
        "name": "Jane Smith"
      },
      "createdAt": "2023-06-22T10:30:40.123Z",
      "updatedAt": "2023-06-22T10:30:40.123Z"
    },
    // More scheduled blogs...
  ],
  "totalCount": 7,
  "currentPage": 1,
  "totalPages": 1
}
```

### Get Blogs by Category Slug

**Endpoint:** `GET /api/blogs/category/:slug`

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of blogs per page
- `status` (optional): Filter by status (default: 'published')
- `search` (optional): Search term for blog title and content

**Response (200 OK):**
```json
{
  "success": true,
  "category": {
    "name": "Web Development",
    "slug": "web-development",
    "id": "60d21b4667d0d8992e610c90"
  },
  "blogs": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "title": "Getting Started with Node.js",
      "slug": "getting-started-with-nodejs",
      "excerpt": "Learn the basics of Node.js development",
      "status": "published",
      "imageUrl": "/uploads/blog-image-1.jpg",
      "imageAlt": "Node.js logo",
      "categoryId": {
        "_id": "60d21b4667d0d8992e610c90",
        "name": "Web Development",
        "slug": "web-development"
      },
      "authorId": {
        "_id": "60d21b4667d0d8992e610c95",
        "name": "Jane Smith"
      },
      "createdAt": "2023-06-22T10:30:40.123Z",
      "updatedAt": "2023-06-22T10:30:40.123Z"
    },
    // More blogs in this category...
  ],
  "totalCount": 12,
  "currentPage": 1,
  "totalPages": 2
}
```

### Create a New Blog (Admin Only)

**Endpoint:** `POST /api/blogs`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

**Form Data:**
- `title` (required): Blog title
- `content` (required): Blog content
- `excerpt` (required): Blog excerpt/summary
- `image` (required): Blog featured image file
- `imageAlt` (required): Alt text for the image
- `categoryId` (required): Category ID
- `authorId` (optional): Author ID (defaults to current user)
- `metaDescription` (optional): SEO meta description
- `metaKeywords` (optional): SEO meta keywords
- `status` (optional): Blog status (default: 'draft')
- `tags` (optional): Array of tags
- `isFeatured` (optional): Whether the blog is featured (default: false)
- `publishDate` (optional): Date to publish the blog
- `slug` (optional): Custom slug (generated from title if not provided)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Blog created successfully",
  "blog": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Getting Started with Node.js",
    "slug": "getting-started-with-nodejs",
    "content": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine...",
    "excerpt": "Learn the basics of Node.js development",
    "status": "published",
    "imageUrl": "/uploads/blog-image-1.jpg",
    "imageAlt": "Node.js logo",
    "categoryId": "60d21b4667d0d8992e610c90",
    "authorId": "60d21b4667d0d8992e610c95",
    "tags": ["nodejs", "javascript", "backend"],
    "createdAt": "2023-06-22T10:30:40.123Z",
    "updatedAt": "2023-06-22T10:30:40.123Z"
  }
}
```

### Update a Blog (Admin Only)

**Endpoint:** `PUT /api/blogs/:id`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

**Form Data:**
- `title` (optional): Blog title
- `content` (optional): Blog content
- `excerpt` (optional): Blog excerpt/summary
- `image` (optional): Blog featured image file
- `imageAlt` (optional): Alt text for the image
- `categoryId` (optional): Category ID
- `authorId` (optional): Author ID
- `metaDescription` (optional): SEO meta description
- `metaKeywords` (optional): SEO meta keywords
- `status` (optional): Blog status
- `tags` (optional): Array of tags
- `isFeatured` (optional): Whether the blog is featured
- `publishDate` (optional): Date to publish the blog
- `slug` (optional): Custom slug

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Blog updated successfully",
  "blog": {
    "_id": "60d21b4667d0d8992e610c85",
    "title": "Updated: Getting Started with Node.js",
    "slug": "updated-getting-started-with-nodejs",
    "content": "Updated content: Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine...",
    "excerpt": "Updated excerpt: Learn the basics of Node.js development",
    "status": "published",
    "imageUrl": "/uploads/blog-image-1-updated.jpg",
    "imageAlt": "Updated Node.js logo",
    "categoryId": "60d21b4667d0d8992e610c90",
    "authorId": "60d21b4667d0d8992e610c95",
    "tags": ["nodejs", "javascript", "backend", "tutorial"],
    "createdAt": "2023-06-22T10:30:40.123Z",
    "updatedAt": "2023-06-23T15:45:22.456Z"
  }
}
```

### Delete a Blog (Admin Only)

**Endpoint:** `DELETE /api/blogs/:id`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

## Categories

### Get All Categories

**Endpoint:** `GET /api/categories`

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of categories per page

**Response (200 OK):**
```json
{
  "success": true,
  "categories": [
    {
      "_id": "60d21b4667d0d8992e610c90",
      "name": "Web Development",
      "slug": "web-development",
      "description": "Articles about web development technologies and practices",
      "createdAt": "2023-06-22T10:30:40.123Z",
      "updatedAt": "2023-06-22T10:30:40.123Z"
    },
    // More categories...
  ],
  "totalCount": 8
}
```

### Get Category by ID

**Endpoint:** `GET /api/categories/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "category": {
    "_id": "60d21b4667d0d8992e610c90",
    "name": "Web Development",
    "slug": "web-development",
    "description": "Articles about web development technologies and practices",
    "createdAt": "2023-06-22T10:30:40.123Z",
    "updatedAt": "2023-06-22T10:30:40.123Z"
  }
}
```

### Get Category by Slug

**Endpoint:** `GET /api/categories/slug/:slug`

**Response (200 OK):**
```json
{
  "success": true,
  "category": {
    "_id": "60d21b4667d0d8992e610c90",
    "name": "Web Development",
    "slug": "web-development",
    "description": "Articles about web development technologies and practices",
    "createdAt": "2023-06-22T10:30:40.123Z",
    "updatedAt": "2023-06-22T10:30:40.123Z"
  }
}
```

### Create a New Category (Admin Only)

**Endpoint:** `POST /api/categories`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Mobile Development",
  "description": "Articles about mobile app development for iOS and Android"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "category": {
    "_id": "60d21b4667d0d8992e610c91",
    "name": "Mobile Development",
    "slug": "mobile-development",
    "description": "Articles about mobile app development for iOS and Android",
    "createdAt": "2023-06-23T11:20:30.456Z",
    "updatedAt": "2023-06-23T11:20:30.456Z"
  }
}
```

### Update a Category (Admin Only)

**Endpoint:** `PUT /api/categories/:id`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Mobile App Development",
  "description": "Updated description: Articles about mobile app development for iOS and Android platforms"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "category": {
    "_id": "60d21b4667d0d8992e610c91",
    "name": "Mobile App Development",
    "slug": "mobile-app-development",
    "description": "Updated description: Articles about mobile app development for iOS and Android platforms",
    "createdAt": "2023-06-23T11:20:30.456Z",
    "updatedAt": "2023-06-23T12:15:45.789Z"
  }
}
```

### Delete a Category (Admin Only)

**Endpoint:** `DELETE /api/categories/:id`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

## Authors

### Get All Authors

**Endpoint:** `GET /api/authors`

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of authors per page

**Response (200 OK):**
```json
{
  "success": true,
  "authors": [
    {
      "_id": "60d21b4667d0d8992e610c95",
      "name": "Jane Smith",
      "bio": "Senior web developer with 10 years of experience",
      "imageUrl": "/uploads/author-jane.jpg",
      "createdAt": "2023-06-22T10:30:40.123Z",
      "updatedAt": "2023-06-22T10:30:40.123Z"
    },
    // More authors...
  ],
  "totalCount": 5
}
```

### Get Author by ID

**Endpoint:** `GET /api/authors/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "author": {
    "_id": "60d21b4667d0d8992e610c95",
    "name": "Jane Smith",
    "bio": "Senior web developer with 10 years of experience",
    "imageUrl": "/uploads/author-jane.jpg",
    "createdAt": "2023-06-22T10:30:40.123Z",
    "updatedAt": "2023-06-22T10:30:40.123Z"
  }
}
```

### Create a New Author (Admin Only)

**Endpoint:** `POST /api/authors`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (required): Author name
- `bio` (required): Author biography
- `image` (optional): Author profile image

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Author created successfully",
  "author": {
    "_id": "60d21b4667d0d8992e610c96",
    "name": "John Doe",
    "bio": "Full-stack developer specializing in React and Node.js",
    "imageUrl": "/uploads/author-john.jpg",
    "createdAt": "2023-06-23T14:25:10.789Z",
    "updatedAt": "2023-06-23T14:25:10.789Z"
  }
}
```

### Update an Author (Admin Only)

**Endpoint:** `PUT /api/authors/:id`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (optional): Author name
- `bio` (optional): Author biography
- `image` (optional): Author profile image

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Author updated successfully",
  "author": {
    "_id": "60d21b4667d0d8992e610c96",
    "name": "John Doe",
    "bio": "Updated bio: Senior full-stack developer specializing in React, Node.js, and cloud architecture",
    "imageUrl": "/uploads/author-john-updated.jpg",
    "createdAt": "2023-06-23T14:25:10.789Z",
    "updatedAt": "2023-06-23T16:40:22.345Z"
  }
}
```

### Delete an Author (Admin Only)

**Endpoint:** `DELETE /api/authors/:id`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Author deleted successfully"
}
```

## Users

### Get Current User Profile

**Endpoint:** `GET /api/users/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2023-06-22T10:30:40.123Z",
    "updatedAt": "2023-06-22T10:30:40.123Z"
  }
}
```

### Update User Profile

**Endpoint:** `PUT /api/users/profile`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "currentPassword": "securepassword123",
  "newPassword": "newSecurePassword456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "role": "user",
    "createdAt": "2023-06-22T10:30:40.123Z",
    "updatedAt": "2023-06-23T09:15:30.456Z"
  }
}
```

### Get All Users (Admin Only)

**Endpoint:** `GET /api/users`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of users per page

**Response (200 OK):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "60d21b4667d0d8992e610c85",
      "name": "John Smith",
      "email": "johnsmith@example.com",
      "role": "user",
      "createdAt": "2023-06-22T10:30:40.123Z",
      "updatedAt": "2023-06-23T09:15:30.456Z"
    },
    // More users...
  ],
  "totalCount": 15,
  "currentPage": 1,
  "totalPages": 2
}
```

### Update a User (Admin Only)

**Endpoint:** `PUT /api/users/:id`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "admin"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "_id": "60d21b4667d0d8992e610c85",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "role": "admin",
    "createdAt": "2023-06-22T10:30:40.123Z",
    "updatedAt": "2023-06-23T11:20:15.789Z"
  }
}
```

### Delete a User (Admin Only)

**Endpoint:** `DELETE /api/users/:id`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Comments

### Get Comments for a Blog

**Endpoint:** `GET /api/blogs/:blogId/comments`

**Query Parameters:**
- `page` (optional): Page number for pagination
- `limit` (optional): Number of comments per page

**Response (200 OK):**
```json
{
  "success": true,
  "comments": [
    {
      "_id": "60d21b4667d0d8992e610d00",
      "content": "Great article! Very informative.",
      "blogId": "60d21b4667d0d8992e610c85",
      "userId": {
        "_id": "60d21b4667d0d8992e610c86",
        "name": "Alice Johnson"
      },
      "createdAt": "2023-06-23T14:30:20.123Z",
      "updatedAt": "2023-06-23T14:30:20.123Z"
    },
    // More comments...
  ],
  "totalCount": 8,
  "currentPage": 1,
  "totalPages": 1
}
```

### Add a Comment to a Blog

**Endpoint:** `POST /api/blogs/:blogId/comments`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "This was exactly what I needed to understand Node.js better. Thanks!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "comment": {
    "_id": "60d21b4667d0d8992e610d01",
    "content": "This was exactly what I needed to understand Node.js better. Thanks!",
    "blogId": "60d21b4667d0d8992e610c85",
    "userId": "60d21b4667d0d8992e610c85",
    "createdAt": "2023-06-23T16:45:30.456Z",
    "updatedAt": "2023-06-23T16:45:30.456Z"
  }
}
```

### Update a Comment (Owner or Admin Only)

**Endpoint:** `PUT /api/comments/:id`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "Updated comment: This was exactly what I needed to understand Node.js better. The code examples were particularly helpful!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment updated successfully",
  "comment": {
    "_id": "60d21b4667d0d8992e610d01",
    "content": "Updated comment: This was exactly what I needed to understand Node.js better. The code examples were particularly helpful!",
    "blogId": "60d21b4667d0d8992e610c85",
    "userId": "60d21b4667d0d8992e610c85",
    "createdAt": "2023-06-23T16:45:30.456Z",
    "updatedAt": "2023-06-23T17:10:15.789Z"
  }
}
```

### Delete a Comment (Owner or Admin Only)

**Endpoint:** `DELETE /api/comments/:id`

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": "Detailed error information (only in development mode)"
}
```

### Common HTTP Status Codes

- **200 OK**: Request succeeded
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request parameters or data
- **401 Unauthorized**: Authentication required or failed
- **403 Forbidden**: Authenticated but not authorized to access the resource
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side error

## Data Models

### User Model

```javascript
{
  name: String,
  email: String,
  password: String,
  role: String, // "user" or "admin"
  createdAt: Date,
  updatedAt: Date
}
```

### Blog Model

```javascript
{
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  status: String, // "draft", "published", "archived"
  imageUrl: String,
  imageAlt: String,
  categoryId: ObjectId, // Reference to Category
  authorId: ObjectId, // Reference to User
  author: ObjectId, // Reference to Author
  tags: [String],
  metaDescription: String,
  metaKeywords: String,
  isFeatured: Boolean,
  publishDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model

```javascript
{
  name: String,
  slug: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Author Model

```javascript
{
  name: String,
  bio: String,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model

```javascript
{
  content: String,
  blogId: ObjectId, // Reference to Blog
  userId: ObjectId, // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```