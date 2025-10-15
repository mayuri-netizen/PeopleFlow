#!/bin/bash
echo "Installing root dependencies..."
npm install

echo "Building client..."
cd client
npm install
npm run build

echo "Installing server dependencies..."
cd ../server
npm install

echo "Build complete!"
