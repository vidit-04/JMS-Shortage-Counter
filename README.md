# JMS Shortage Counter

A simple, mobile-first shortage tracking app designed for small and rural stores. No login required, shared data across devices.

## Features

- 📱 **Mobile-First Design**: Works perfectly on phones, tablets, and desktops
- 🏷️ **Category Organization**: Group products by supplier or type using tags
- 📊 **Status Tracking**: Track product status (Pending, Ordered, Delivered)
- 🔍 **Forgiving Search**: Find products even with spelling mistakes
- 💾 **Data Persistence**: All data is saved automatically
- 📈 **No Data Loss**: Users explicitly control deletion, nothing is automatic
- 🌐 **Shared Access**: All devices see the same data in real-time

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Storage**: JSON file-based persistence
- **Database**: In-memory with file persistence (can be upgraded to MongoDB)

## Development Setup

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev
```

The app will be available at `http://localhost:8080`

## Project Structure

```
.
├── client/                 # React frontend
│   ├── pages/             # Page components (Home, About)
│   ├── components/        # Reusable components
│   ├── services/          # API service layer
│   ├── utils/             # Utility functions (search, etc)
│   └── global.css         # Global styles and theme
├── server/                # Express backend
│   ├── index.ts           # Server setup
│   ├── db.ts              # Database operations
│   ├── storage.ts         # Persistence layer
│   └── routes/            # API endpoint handlers
├── shared/                # Shared types and interfaces
└── .data/                 # Data persistence (gitignored)
```

## API Documentation

### Tags Endpoints

- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create new tag
  - Body: `{ "name": "category name" }`
- `DELETE /api/tags/:id` - Delete tag (moves products to "All")

### Products Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
  - Body: `{ "name": "product name", "tagId": "tag_1", "status": "pending" }`
- `GET /api/products/:id` - Get product by ID
- `PATCH /api/products/:id` - Update product status
  - Body: `{ "status": "ordered" }`
- `DELETE /api/products/:id` - Delete product

## Data Model

### Tag
```typescript
{
  _id: string;           // Unique identifier
  name: string;          // Category/Supplier name
  createdAt: string;     // ISO timestamp
}
```

### Product
```typescript
{
  _id: string;           // Unique identifier
  name: string;          // Product name
  tagId: string | null;  // Reference to tag (null = "All" category)
  status: string;        // "pending" | "ordered" | "delivered"
  createdAt: string;     // ISO timestamp
  updatedAt: string;     // ISO timestamp
}
```

## Data Persistence

- All data is automatically saved to `.data/` directory
- JSON files are created on first run:
  - `.data/tags.json` - All categories/tags
  - `.data/products.json` - All products
- Data persists across server restarts
- The `.data/` directory is excluded from git commits

## Building for Production

```bash
# Build the application
pnpm run build

# Build client
pnpm run build:client

# Build server
pnpm run build:server

# Start production server
pnpm start
```

The production build will:
- Bundle React code with optimizations
- Create a distribution ready for deployment
- Maintain data persistence across restarts

## Deployment

### Option 1: Fly.io / Railway / Heroku

1. Build the project: `pnpm run build`
2. Create a `Procfile` (for Heroku):
   ```
   web: npm start
   ```
3. Push to deployment platform

### Option 2: Docker

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install
RUN pnpm run build
EXPOSE 8080
CMD ["pnpm", "start"]
```

Build and run:
```bash
docker build -t jms-shortage-counter .
docker run -p 8080:8080 jms-shortage-counter
```

### Option 3: VPS / Self-hosted

1. Clone repository on server
2. Install Node.js
3. Install dependencies: `pnpm install`
4. Build: `pnpm run build`
5. Use PM2 or similar to manage process:
   ```bash
   pm2 start pnpm -- start --name "jms-shortage"
   ```

## Production Considerations

### Data Backup
- Regularly backup the `.data/` directory
- Example: `cp -r .data/ backups/data-$(date +%Y%m%d)`

### Database Migration
To upgrade from JSON storage to MongoDB:
1. Update `server/storage.ts` to use MongoDB driver
2. Update `server/db.ts` if needed
3. Migration script can import from JSON files

### Performance
- The in-memory database with file persistence is suitable for small to medium stores
- For larger deployments (1000+ products), consider MongoDB
- Add caching layer if needed

### Security
- Current setup has no authentication (by design)
- For production in shared environments, consider:
  - Adding authentication
  - Implementing store/tenant isolation
  - Using HTTPS

## Troubleshooting

### "Failed to fetch" errors
- Check if server is running
- Ensure API endpoints are accessible
- Check browser console for specific error messages

### Data not persisting
- Verify `.data/` directory exists and is writable
- Check file permissions: `chmod 755 .data/`
- Look for error logs in console

### Build fails
- Clear cache: `rm -rf node_modules dist .data`
- Reinstall: `pnpm install`
- Check Node version: `node --version` (should be 18+)

## Contributing

Guidelines for contributing:
1. Keep UI simple and rural-friendly
2. Test on low-end devices
3. No authentication in core features
4. Maintain backward compatibility with existing data
5. Update README for new features

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or feedback:
- Check existing issues in the repository
- Create detailed bug reports with steps to reproduce
- Test on multiple browsers and devices
