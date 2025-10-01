# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Firefly III is a free and open-source personal finance manager built on Laravel. It features a double-entry bookkeeping system, budgeting tools, transaction management, and comprehensive financial reporting.

## Architecture

- **Backend**: Laravel 12 with PHP 8.4+
- **Frontend**: Dual UI system
  - **v1**: Laravel Mix + Vue 2 + Bootstrap 3
  - **v2**: Vite + AlpineJS + Bootstrap 5
- **Database**: Supports MySQL, PostgreSQL, SQLite
- **Authentication**: Laravel Sanctum + Passport
- **API**: Comprehensive REST JSON API

## Development Setup

### Prerequisites
- PHP 8.4+ with required extensions
- Composer
- Node.js + npm
- Database (MySQL/PostgreSQL/SQLite)

### Installation
1. Clone the repository
2. Copy `.env.example` to `.env` and configure
3. Run `composer install`
4. Run `npm install` in both frontend directories:
   ```bash
   cd resources/assets/v1 && npm install
   cd ../v2 && npm install
   ```
5. Generate application key: `php artisan key:generate`
6. Run database migrations: `php artisan migrate`
7. Build frontend assets

### Building Frontend Assets

**v1 (Legacy UI):**
```bash
cd resources/assets/v1
npm run development  # Development build
npm run production   # Production build
npm run watch        # Watch for changes
```

**v2 (Modern UI):**
```bash
cd resources/assets/v2
npm run dev    # Development server
npm run build  # Production build
```

## Development Commands

### Running Tests
```bash
# Unit tests
php artisan test --testsuite=unit

# Integration tests
php artisan test --testsuite=integration

# Feature tests
php artisan test --testsuite=feature

# All tests
php artisan test

# Specific test file
php artisan test --filter=TestClassName
```

### Code Quality
```bash
# PHPStan static analysis
./vendor/bin/phpstan analyse -c .ci/phpstan.neon

# PHP CS Fixer
./vendor/bin/php-cs-fixer fix

# Run all code quality checks
.ci/all.sh
```

### Database Operations
```bash
# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Seed database
php artisan db:seed

# Refresh database
php artisan migrate:refresh --seed
```

### Artisan Commands
Key custom commands:
- `php artisan firefly-iii:upgrade-database` - Upgrade database schema
- `php artisan firefly-iii:set-latest-version` - Set latest version
- `php artisan system:create-first-user` - Create first user (testing)

## Project Structure

```
app/
├── Api/           # API controllers and resources
├── Console/       # Artisan commands
├── Enums/         # PHP enumerations
├── Events/        # Laravel events
├── Exceptions/    # Custom exceptions
├── Http/          # Controllers, middleware, requests
├── Jobs/          # Queueable jobs
├── Models/        # Eloquent models
├── Repositories/  # Data access layer
├── Rules/         # Validation rules
├── Services/      # Business logic services
├── Support/       # Helper functions and utilities
└── Transformers/   # API response transformers

domain/           # Domain-specific logic
resources/
├── assets/
│   ├── v1/       # Legacy frontend (Vue 2)
│   └── v2/       # Modern frontend (Vite + AlpineJS)
└── lang/         # Translations

tests/
├── unit/         # Unit tests
├── integration/  # Integration tests
└── feature/      # Feature tests
```

## Key Features

- **Double-entry bookkeeping** with transaction journals
- **Budget management** with categories and tags
- **Recurring transactions** with rule-based handling
- **Piggy banks** for savings goals
- **Financial reports** and charts
- **REST API** covering all functionality
- **Import tools** for bank data
- **Multi-currency support**
- **Two-factor authentication**

## Development Notes

- The codebase uses a repository pattern for data access
- API responses use Fractal transformers
- Frontend has two parallel UIs (v1 legacy, v2 modern)
- Extensive use of Laravel events and listeners
- Comprehensive test suite with unit, integration, and feature tests
- Code quality enforced with PHPStan, PHP CS Fixer, and PHPMD

## Common Tasks

### Adding New API Endpoint
1. Create controller in `app/Http/Controllers/Api/`
2. Add route in `routes/api.php`
3. Create transformer in `app/Transformers/`
4. Add validation rules in `app/Validation/`
5. Write tests in `tests/feature/`

### Adding Frontend Component (v2)
1. Create component in `resources/assets/v2/src/components/`
2. Add to Vite config in `resources/assets/v2/vite.config.js`
3. Build with `npm run build`

### Database Changes
1. Create migration: `php artisan make:migration`
2. Update relevant model in `app/Models/`
3. Run migration: `php artisan migrate`
4. Update database upgrade command if needed

## Testing Guidelines

- Write tests for all new functionality
- Use database transactions for test cleanup
- Follow existing patterns in test directories
- Run all code quality checks before committing

## Deployment

- Production builds use `composer install --no-dev`
- Frontend assets are built with production flags
- Database upgrades are handled automatically
- Environment configuration is critical for security

## Troubleshooting

- Check `.env` configuration for database and app settings
- Ensure all PHP extensions are installed
- Run `composer dump-autoload` after adding classes
- Clear caches: `php artisan config:clear && php artisan cache:clear`