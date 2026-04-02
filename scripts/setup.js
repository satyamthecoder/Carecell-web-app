#!/usr/bin/env node
/**
 * CareCell Network - Setup Script
 * Copies .env.example to .env and guides first-time setup
 */
const fs = require('fs');
const path = require('path');

console.log('\n🏥 CareCell Network - Setup\n');

const backendEnvExample = path.join(__dirname, '../backend/.env.example');
const backendEnv = path.join(__dirname, '../backend/.env');

if (!fs.existsSync(backendEnv)) {
  fs.copyFileSync(backendEnvExample, backendEnv);
  console.log('✅ Created backend/.env from .env.example');
  console.log('   ⚠️  Please edit backend/.env and add your:');
  console.log('      - ANTHROPIC_API_KEY (for AI features)');
  console.log('      - MONGO_URI (for persistent data)');
  console.log('      - JWT_SECRET (change from default)\n');
} else {
  console.log('ℹ️  backend/.env already exists (skipped)');
}

const frontendEnv = path.join(__dirname, '../frontend/.env');
if (!fs.existsSync(frontendEnv)) {
  fs.writeFileSync(frontendEnv,
`REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_key_here
`);
  console.log('✅ Created frontend/.env');
} else {
  console.log('ℹ️  frontend/.env already exists (skipped)');
}

console.log('\n📋 Next steps:');
console.log('  1. npm run install:all   → Install all dependencies');
console.log('  2. Edit backend/.env     → Add your API keys');
console.log('  3. npm run dev           → Start both servers\n');
console.log('🌐 The app will be at:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend:  http://localhost:5000/api/health\n');
console.log('💡 Demo mode works without MongoDB or API keys!');
console.log('   Use "Try Demo" button on the login page.\n');
