# River App Backend

A robust backend service for the River mobile app with authentication, virtual currency management, and payment processing capabilities.

## 🌟 Features

- **User Authentication**
  - Registration with email verification
  - Login/logout system with JWT
  - Password reset functionality
  - Email verification with OTP

- **Virtual Currency System**
  - Coin management
  - Daily login rewards with streak tracking
  - Referral system with bonuses

- **Payment Processing**
  - Stripe integration for purchasing coins
  - Secure payment intent creation
  - Customer management

## 🚀 Tech Stack

- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password encryption
- Nodemailer for email services
- Stripe API for payment processing

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB
- MailHog or SMTP server for email testing
- Stripe account

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdelahdia72/river-backend.git
   cd river-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/river-app
   EMAIL=noreply@riverapp.com
   EMAIL_PASS=your_email_password
   JWT_SECRET=your_secret_key
   SMTP_HOST=localhost
   SMTP_PORT=1025
   NODE_ENV=development
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 🔌 API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user
- **POST /api/auth/login** - Login user
- **POST /api/auth/verify-email** - Verify email with OTP
- **POST /api/auth/forget-password** - Request password reset
- **POST /api/auth/reset-password** - Reset password with OTP
- **POST /api/auth/logout** - Logout user
- **GET /api/auth/me** - Get current user details
- **GET /api/auth/check** - Check authentication status

### Coins

- **POST /api/coins/add** - Add coins to user account
- **POST /api/coins/daily-reward** - Claim daily login reward

### Payments

- **POST /api/stripe/payment-sheet** - Create Stripe payment sheet
- **POST /api/stripe/process-payment** - Process completed payment

## 📚 Usage Examples

### Registration Flow

1. Register a user: `POST /api/auth/register`
   ```json
   {
     "email": "user@example.com",
     "password": "securePassword",
     "referralCode": "optional-referral-code"
   }
   ```

2. Verify email: `POST /api/auth/verify-email`
   ```json
   {
     "email": "user@example.com",
     "verificationCode": "123456"
   }
   ```

### Daily Reward System

Claim daily reward: `POST /api/coins/daily-reward`
- No request body needed, user is identified by JWT

### Payments

Create payment sheet: `POST /api/stripe/payment-sheet`
```json
{
  "amount": 1000,
  "currency": "usd",
  "name": "John Doe",
  "email": "john@example.com",
  "description": "Purchase 1000 coins",
  "metadata": {
    "packageType": "standard",
    "coins": "1000"
  }
}
```

## 🧪 Testing

For testing email functionality, you can use MailHog:

```bash
# Run the test mail script
node test-mail.js
```

## 🔒 Security Notes

- JWT tokens are HTTP-only and expire after 10 minutes
- Passwords are hashed using bcrypt
- Email verification is required for full account access
- Stripe API keys should be kept secure

## 📁 Project Structure

```
river-backend/
├── controllers/        # Request handlers
├── db/                 # Database connection
├── middleware/         # Express middleware
├── models/             # Mongoose models
├── routes/             # API routes
├── utils/              # Helper functions
├── .env                # Environment variables
├── server.js           # Application entry point
└── package.json        # Dependencies
```

## 📝 License

This project is licensed under the MIT License

---
