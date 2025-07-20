# ✈️ Travel Packages Project

This is a Laravel + Inertia.js + React-based application for creating and managing travel packages with integrated payment gateways (Stripe, Paystack, Espees) and email notifications.

## 🧰 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP >= 8.2** with required extensions (OpenSSL, PDO, Mbstring, Tokenizer, XML, BCMath, Ctype, Fileinfo, JSON)
- **Composer** - PHP dependency manager
- **Node.js >= 22.16.x** and **NPM** - JavaScript runtime and package manager
- **MySQL** - Database server
- **Laravel CLI** (optional): `composer global require laravel/installer`

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git https://github.com/Blue-Tisi/AirTravel-Agent-Sellercentral.git
cd AirTravel-Agent-Sellercentral
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
```

### 3. Environment Setup

```bash
# Copy environment configuration
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Configure Environment Variables

Edit your `.env` file and configure the following sections:

#### Database Configuration
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=travel_packages_db
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
```

#### Mail Configuration
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=noreply@travelpackages.com
MAIL_FROM_NAME="${APP_NAME}"

```

#### Stripe Payment Gateway
```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### Paystack Payment Gateway
```env
PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_public_key
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
```

#### Espees Payment Gateway
```env
ESPEES_API_KEY=your_espees_api_key
ESPEES_SECRET_KEY=your_espees_secret_key
ESPEES_BASE_URL=https://api.espees.com
ESPEES_MERCHANT_WALLET=your_merchant_id
```

#### Additional Configuration
```env
# Application
APP_NAME="Travel Packages"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Session & Cache
SESSION_DRIVER=file
CACHE_DRIVER=file

# Queue (set to 'database' for production)
QUEUE_CONNECTION=database


### 5. Database Setup

```bash
# Create database tables and seed with sample data
php artisan migrate --seed

# If you want to reset and reseed the database
php artisan migrate:fresh --seed
```

### 6. Build Frontend Assets

```bash
# For development (with hot reloading)
npm run dev

# For production
npm run build

# To watch for changes during development
npm run watch
```

### 7. Start the Application

```bash
# Start Laravel development server
php artisan serve

# The application will be available at http://localhost:8000
```

## ⚙️ Development Setup

### Running in Development Mode

For the best development experience, run both the Laravel server and Vite dev server:

```bash
# Terminal 1: Start Laravel server
php artisan serve

# Terminal 2: Start Vite dev server for hot reloading
npm run dev
```

### Queue Workers (if using background jobs)

```bash
# Start queue worker
php artisan queue:work

# For development, use this to restart workers on code changes
php artisan queue:listen
```

## 🛠️ Useful Artisan Commands

```bash
# Clear and cache configuration
php artisan config:clear
php artisan config:cache

# Clear and cache routes
php artisan route:clear
php artisan route:cache

# Clear application cache
php artisan cache:clear

# Clear view cache
php artisan view:clear


# Run tests
php artisan test
```

## 📂 Project Structure

```
travel-packages/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   ├── Services/           ← Feature services
│   └── Mail/              ← Email templates
├── bootstrap/
├── config/
├── database/
│   ├── migrations/        ← Database schema
│   ├── seeders/          ← Sample data
│   └── factories/        ← Model factories
├── public/
├── resources/
│   ├── js/               ← React + Inertia frontend
│   │   ├── Components/
│   │   ├── Pages/
│   │   └── Layouts/
│   ├── css/              ← Stylesheets
│   └── views/            ← Blade templates
├── routes/
│   ├── web.php           ← Web routes
│   └── api.php           ← API routes
├── storage/
├── tests/
└── vendor/
```

## 🚨 Troubleshooting

### Common Issues

**Permission Errors:**
```bash
# Fix storage and cache permissions
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache
```

**Composer Issues:**
```bash
# Clear Composer cache
composer clear-cache

# Update Composer
composer self-update
```

**NPM Issues:**
```bash
# Clear NPM cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

**Database Connection Issues:**
- Verify database credentials in `.env`
- Ensure database server is running
- Check if database exists: `CREATE DATABASE travel_packages_db;`

## 🔐 Security Notes

- Never commit your `.env` file to version control
- Use strong, unique keys for all payment gateways
- Enable 2FA on all service accounts (Stripe, Paystack, etc.)
- Use HTTPS in production
- Regularly update dependencies: `composer update` and `npm update`

## 📝 Additional Setup for Production

```bash
# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
composer install --optimize-autoloader --no-dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

If you encounter any issues or have questions:

- Check the [Laravel Documentation](https://laravel.com/docs)
- Check the [Inertia.js Documentation](https://inertiajs.com/)
- Create an issue in this repository
- Contact the development team

---

**Happy Setup! ✈️🚀**