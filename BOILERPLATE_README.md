# Next.js Boilerplate

A comprehensive Next.js boilerplate with React Query, Ant Design, and Axios for rapid development.

## 🚀 Features

- **Next.js 14** - Stable version with App Router
- **React 18** - Compatible with Ant Design v5
- **React Query 5** - Powerful data synchronization
- **Ant Design 5** - Beautiful UI components
- **Axios** - HTTP client with interceptors
- **TypeScript** - Full type safety
- **Error Boundaries** - Comprehensive error handling
- **Responsive Design** - Mobile-first approach
- **Best Practices** - Code organization and performance

## 📦 What's Included

### Core Setup

- ✅ Axios configuration with interceptors
- ✅ React Query provider with optimized settings
- ✅ Ant Design theme configuration
- ✅ Error boundary components
- ✅ TypeScript configuration
- ✅ ESLint and Prettier setup

### API Layer

- ✅ Generic API service class
- ✅ Type-safe API interfaces
- ✅ Request/response interceptors
- ✅ Error handling middleware
- ✅ Authentication token management

### React Query Integration

- ✅ Custom hooks for queries and mutations
- ✅ Optimistic updates
- ✅ Cache management
- ✅ Background refetching
- ✅ Query key organization

### UI Components

- ✅ Responsive layout system
- ✅ Navigation and breadcrumbs
- ✅ Data tables with CRUD operations
- ✅ Forms with validation
- ✅ Loading states and error handling

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ErrorBoundary.tsx  # Error boundary component
│   ├── Layout/            # Layout components
│   ├── Users/             # User-related components
│   └── Posts/             # Post-related components
├── hooks/                 # Custom React Query hooks
│   ├── useUsers.ts        # User data hooks
│   └── usePosts.ts        # Post data hooks
├── lib/                   # Core configurations
│   └── axios.ts           # Axios configuration
├── providers/             # Context providers
│   ├── QueryProvider.tsx  # React Query provider
│   └── AntdProvider.tsx   # Ant Design provider
├── services/              # API services
│   └── api.ts             # API service classes
└── utils/                 # Utility functions
    ├── constants.ts       # Application constants
    └── helpers.ts         # Helper functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone or use this boilerplate:

```bash
# If cloning
git clone <your-repo-url>
cd nextjs-boilerplate

# Install dependencies
npm install
```

2. Set up environment variables:

```bash
# Copy the example env file (if available)
cp .env.example .env.local

# Edit .env.local with your configuration
NEXT_PUBLIC_API_BASE_URL=https://your-api-url.com
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to see your app.

## 🔧 Configuration

### API Configuration

Edit `src/lib/axios.ts` to customize:

- Base URL
- Request/response interceptors
- Error handling
- Authentication logic

### React Query Settings

Modify `src/providers/QueryProvider.tsx` for:

- Cache times
- Retry logic
- Background refetch settings
- Dev tools configuration

### Ant Design Theme

Customize `src/providers/AntdProvider.tsx` for:

- Color scheme
- Component styling
- Dark mode support
- Responsive breakpoints

## 📝 Usage Examples

### Creating API Services

```typescript
// Define your data types
interface MyData {
  id: number
  name: string
}

// Create API service
export const myService = new ApiService('/my-endpoint')

// Use in components
export const myApi = {
  getItems: () => myService.get<MyData[]>(''),
  getItem: (id: number) => myService.get<MyData>(`/${id}`),
  createItem: (data: Partial<MyData>) => myService.post<MyData>('', data),
  updateItem: (id: number, data: Partial<MyData>) =>
    myService.put<MyData>(`/${id}`, data),
  deleteItem: (id: number) => myService.delete(`/${id}`)
}
```

### Creating React Query Hooks

```typescript
// Query keys
export const myKeys = {
  all: ['my-data'] as const,
  lists: () => [...myKeys.all, 'list'] as const,
  detail: (id: number) => [...myKeys.all, 'detail', id] as const
}

// Query hook
export const useMyData = () => {
  return useQuery({
    queryKey: myKeys.lists(),
    queryFn: myApi.getItems
  })
}

// Mutation hook
export const useCreateMyData = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: myApi.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myKeys.lists() })
    }
  })
}
```

### Using in Components

```typescript
export default function MyComponent() {
  const { data, isLoading, error } = useMyData()
  const createMutation = useCreateMyData()

  const handleCreate = (values: any) => {
    createMutation.mutate(values)
  }

  if (isLoading) return <Spin />
  if (error) return <Alert type="error" message="Failed to load data" />

  return <div>{/* Your component JSX */}</div>
}
```

## 🎨 Customization

### Adding New Pages

1. Create page in `src/app/`
2. Add route to navigation in `src/components/Layout/AppLayout.tsx`
3. Update breadcrumb mapping if needed

### Adding New API Endpoints

1. Define types in `src/services/api.ts`
2. Create service instance
3. Create React Query hooks in `src/hooks/`
4. Use in components

### Styling Components

- Use Ant Design's theme system for global styles
- Add custom CSS for component-specific styling
- Utilize CSS variables for consistent theming

## 🔒 Authentication

The boilerplate includes basic authentication setup:

1. Token storage in localStorage
2. Automatic token injection in requests
3. Token refresh handling
4. Logout on 401 responses

Customize in `src/lib/axios.ts` for your auth provider.

## 📱 Responsive Design

- Mobile-first approach
- Ant Design's responsive grid system
- Adaptive navigation and layouts
- Touch-friendly interactions

## 🐛 Error Handling

- Global error boundary
- API error interceptors
- User-friendly error messages
- Development error details

## 🚀 Production Deployment

### Build

```bash
npm run build
```

### Environment Variables

Set production environment variables:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXTAUTH_SECRET` (if using NextAuth)
- Other API keys and configurations

### Deployment Platforms

This boilerplate works with:

- Vercel (recommended)
- Netlify
- AWS Amplify
- Docker containers

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Ant Design Documentation](https://ant.design/docs/react/introduce)
- [Axios Documentation](https://axios-http.com/docs/intro)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use this boilerplate for your projects!

---

**Happy coding! 🎉**
