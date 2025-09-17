# Astro SSR Registration Example with React 19

A comprehensive example demonstrating Astro's Server-Side Rendering (SSR) capabilities with React 19's latest features, including modern hooks like `useTransition`, `useActionState`, and `useOptimistic`.

## 🚀 Features

- **Server-Side Rendering (SSR)** with Astro
- **React 19** with latest hooks and features
- **TypeScript** for type safety
- **Modern UI/UX** with responsive design
- **Form validation** with real-time feedback
- **Optimistic updates** for better user experience
- **API routes** for backend functionality
- **Accessibility** features and keyboard navigation

## 🛠️ Tech Stack

- **Astro** v5.13.5 - The web framework for content-driven websites
- **React** v19.0.0 - The UI library with latest features
- **TypeScript** v5.0.0 - Type-safe JavaScript
- **@astrojs/node** v8.0.0 - Node.js adapter for SSR
- **@astrojs/react** v4.3.0 - React integration for Astro

## 📦 Installation

1. **Clone or navigate to the example directory:**
   ```bash
   cd examples/astro-ssr-registration
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to see the application.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── RegistrationForm.tsx    # Main React component with React 19 hooks
│   └── RegistrationForm.css    # Component-specific styles
├── layouts/
│   └── Layout.astro           # Base layout with global styles
├── pages/
│   ├── index.astro           # Home page with registration form
│   ├── about.astro           # About page with feature explanations
│   └── api/
│       └── register.ts       # API endpoint for user registration
├── astro.config.mjs          # Astro configuration for SSR
├── package.json              # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

## ⚛️ React 19 Features Demonstrated

### 1. useTransition
Manages loading states during async operations:
```tsx
const [isPending, startTransition] = useTransition();

startTransition(async () => {
  // Async operation with loading state
});
```

### 2. useActionState
Handles form state management with built-in pending states:
```tsx
const [state, formAction, isPendingAction] = useActionState(
  async (prevState, formData) => {
    return await registerUser(formData);
  },
  { message: '', errors: {}, success: false }
);
```

### 3. useOptimistic
Provides optimistic updates for immediate UI feedback:
```tsx
const [optimisticUsers, addOptimisticUser] = useOptimistic(
  users,
  (state, newUser) => [...state, newUser]
);
```

## 🌟 Key Features Explained

### Server-Side Rendering (SSR)
- **Initial Load**: Pages are rendered on the server for fast initial load times
- **SEO Friendly**: Search engines can crawl and index server-rendered content
- **Hydration Control**: Only React components with `client:load` are hydrated

### Form Handling
- **Real-time Validation**: Form validation happens on both client and server
- **Error Handling**: Comprehensive error messages with field-specific feedback
- **Loading States**: Visual feedback during form submission
- **Optimistic Updates**: Immediate UI updates while server processes the request

### API Integration
- **RESTful API**: Clean API endpoints for user registration
- **Type Safety**: Full TypeScript support for API requests and responses
- **Error Handling**: Proper HTTP status codes and error messages

### Responsive Design
- **Mobile First**: Optimized for all screen sizes
- **Modern UI**: Clean, accessible design with smooth animations
- **Accessibility**: Keyboard navigation, focus management, and screen reader support

## 🚀 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run Astro CLI commands
npm run astro -- --help
```

## 🔧 Configuration

### Astro Configuration (`astro.config.mjs`)
```javascript
export default defineConfig({
  output: "server",           // Enable SSR
  adapter: node({
    mode: "standalone"        // Node.js adapter
  }),
  integrations: [react()],    // React integration
  server: {
    port: 3000,
    host: true
  }
});
```

### TypeScript Configuration
- Strict type checking enabled
- React JSX transform configured
- Modern ES2022 target
- Path mapping for clean imports

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 480px - 767px
- **Small Mobile**: Below 480px

## 🎨 Styling Approach

- **CSS Custom Properties**: Consistent design tokens
- **Component-scoped Styles**: Isolated component styling
- **Responsive Design**: Mobile-first approach
- **Accessibility**: High contrast and reduced motion support
- **Modern CSS**: Flexbox, Grid, and modern selectors

## 🔒 Security Considerations

This example includes basic security practices:

- **Input Validation**: Both client and server-side validation
- **Error Handling**: Proper error messages without exposing internals
- **Type Safety**: TypeScript prevents many runtime errors

**Note**: This is a demonstration example. For production use, consider:
- Password hashing (bcrypt, argon2)
- Rate limiting
- CSRF protection
- Input sanitization
- Database integration
- Authentication/authorization

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npx vercel
```

### Deploy to Netlify
```bash
npx netlify deploy
```

### Deploy to Node.js Server
```bash
npm run build
node dist/server/entry.mjs
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This example is part of the Astro examples collection and follows the same license terms.

## 🔗 Related Resources

- [Astro Documentation](https://docs.astro.build/)
- [React 19 Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Astro React Integration](https://docs.astro.build/en/guides/integrations-guide/react/)

## 💡 Tips for Development

1. **Use the Astro Dev Tools**: The built-in dev tools provide excellent debugging capabilities
2. **Leverage TypeScript**: Take advantage of type safety for better development experience
3. **Test Responsive Design**: Always test on multiple screen sizes
4. **Monitor Performance**: Use browser dev tools to monitor bundle size and performance
5. **Accessibility First**: Ensure your components are accessible from the start

---

**Happy coding!** 🎉