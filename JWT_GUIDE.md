# JWT_SECRET Guide

## What is JWT_SECRET?
JWT_SECRET is a private key used to sign (create) and verify JWT tokens. It should be kept secure and never exposed.

## How to Generate JWT_SECRET?

### Option 1: Using Node.js (Recommended)
```javascript
// Run this in Node terminal or create a temp file
const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('hex');
console.log(secret);
// Output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f
```

### Option 2: Using OpenSSL (Terminal/WSL)
```bash
openssl rand -hex 32
# Output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f
```

### Option 3: Using Online Generator
- Visit: https://www.random.org/strings/
- Generate a random string of 32-64 characters

## How to Use JWT_SECRET?

### 1. Add to .env file:
```env
JWT_SECRET="your-generated-secret-here"
JWT_EXPIRES_IN="7d"
```

### 2. Access in your code:
```javascript
const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET,  // ← Your secret
  { expiresIn: process.env.JWT_EXPIRES_IN }  // ← Expiration time
);
```

## Current .env Setup:
```env
DB_NAME="trend_hub"
DB_USER="deepu"
DB_PASS="Deepu@612"
DB_HOST=localhost
PORT=3000
JWT_SECRET="your-super-secret-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
```

## Production Security Tips:
1. **Never commit .env to Git** - Add to .gitignore
2. **Use strong random secrets** - At least 32 characters
3. **Change in production** - Different secret for each environment
4. **Rotate periodically** - Change JWT_SECRET every 3-6 months
5. **Use environment variables** - Never hardcode secrets

## Generate a Better Secret Now:

Run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then replace the value in your .env file with the output.
