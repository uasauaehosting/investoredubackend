#!/bin/bash

echo "🚀 Setting up UASA Portal Backend..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH. Please make sure MongoDB is installed and running."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p uploads

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "✅ Environment file created. Please update the values in .env file."
fi

# Build the project
echo "🔨 Building the project..."
npm run build

# Seed the database
echo "🌱 Seeding the database..."
npm run seed

echo "✅ Setup completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Make sure MongoDB is running"
echo "2. Update .env file with your configuration"
echo "3. Run 'npm run dev' to start the development server"
echo "4. Visit http://localhost:5000 to check the API"
echo "5. Visit http://localhost:5173/admin/login to access the admin dashboard"
echo ""
echo "🔐 Default admin credentials:"
echo "   Username: superadmin"
echo "   Password: admin123"
