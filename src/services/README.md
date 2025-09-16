# API Services Architecture

This directory contains the API service layer for the Next.js boilerplate, organized to prevent circular dependencies and promote maintainability.

## Structure

```
src/services/api/
├── base.ts          # Core ApiService class
├── index.ts         # Main exports
├── user.ts          # User-related API services
├── post.ts          # Post-related API services
└── README.md        # This file
```

## Architecture Explanation

### Why This Structure?

The services are split into separate files to avoid circular dependency issues that can occur when:

1. `index.ts` exports everything from `user.ts` and `post.ts`
2. `user.ts` and `post.ts` try to import from `index.ts`

### Solution

1. **`base.ts`** - Contains the core `ApiService` class
2. **`user.ts` & `post.ts`** - Import `ApiService` from `./base`
3. **`index.ts`** - Re-exports everything for external consumption

## Usage

### Import the services in your components/hooks:

```typescript
import { userApi, postApi, User, Post } from '@/services/api'
```

### Available Services

#### User API (`userApi`)

- `getUsers()` - Fetch all users
- `getUser(id)` - Fetch single user
- `createUser(userData)` - Create new user
- `updateUser(id, userData)` - Update existing user
- `deleteUser(id)` - Delete user

#### Post API (`postApi`)

- `getPosts()` - Fetch all posts
- `getPost(id)` - Fetch single post
- `getPostsByUser(userId)` - Fetch posts by user
- `createPost(postData)` - Create new post
- `updatePost(id, postData)` - Update existing post
- `deletePost(id)` - Delete post

## Adding New Services

To add a new service (e.g., `comments.ts`):

1. Create the new service file:

```typescript
// src/services/api/comments.ts
import { ApiService } from './base'

export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}

export const commentService = new ApiService('/comments')

export const commentApi = {
  getComments: () => commentService.get<Comment[]>(''),
  getComment: (id: number) => commentService.get<Comment>(`/${id}`)
  // ... other methods
}
```

2. Export it from `index.ts`:

```typescript
// src/services/api/index.ts
export { ApiService } from './base'
export * from './user'
export * from './post'
export * from './comments' // Add this line
```

## Best Practices

1. **Always import ApiService from `./base`** in service files
2. **Define TypeScript interfaces** for all data models
3. **Use consistent naming** for service instances and API objects
4. **Group related endpoints** in the same service file
5. **Export everything through `index.ts`** for clean imports
