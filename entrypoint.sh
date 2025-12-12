#!/bin/sh
set -e

echo "🚀 Starting KelolaAja Backend..."

# Run database migrations
echo "📦 Running database migrations..."
npx prisma migrate deploy

# Check if seeding is enabled
if [ "$RUN_SEED" = "true" ]; then
  echo "🌱 Seeding database..."
  npm run seed
  echo "✅ Database seeded successfully"
else
  echo "⏭️  Skipping database seeding (RUN_SEED not set to 'true')"
fi

# Start the application
echo "🎯 Starting application on port ${PORT:-8080}..."
exec node dist/app.js
