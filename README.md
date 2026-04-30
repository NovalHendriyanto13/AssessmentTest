# 🚀 Laravel 13 Docker Development Stack

A modern, scalable Laravel 13 development environment using Docker with PHP 8.3, MySQL, Redis, Queue Worker, and Scheduler support.

---

## 👤 Author

**Name:** Noval Hendriyanto  
**Role:** Senior Backend Developer  
**Stack:** Laravel, PHP, Docker, Node.js, Microservices  

---

## 📦 Tech Stack

- Laravel 13
- PHP 8.3
- MySQL 8
- Redis
- Docker & Docker Compose
- Queue Worker
- Task Scheduler
- Makefile Automation

---

## 🛠 Requirements
Docker
Docker Compose
Make (optional but recommended)

## 🧱 System Architecture

This project uses a container-based architecture:

| Service | Purpose |
|--------|--------|
| app | Laravel HTTP server |
| queue | Background job processing |
| scheduler | Cron job handler |
| mysql | Database |
| redis | Cache + queue driver |

---

## 🚀 Quick Start

### 1. Clone repository

```bash
git clone https://github.com/NovalHendriyanto13/AssessmentTest.git NovalHendriyanto
cd NovalHendriyanto
```
### 2. Set up Environment

```bash
cp .env.example .env
```
### 3. Running Application

```bash
make dev
```
### 4. Install dependencies

```bash
make sh
composer install
exit
```

### 5. Run Migration

```bash
make sh
php artisan migrate
php artisan db:seed --class=UserSeeder
exit
```

### 6. Run Migration

```bash
make sh
php artisan migrate
exit
```
## Application

http://localhost:8000

## 🧪 Features Included
✔ Laravel 13 ready
✔ Dockerized environment
✔ Redis cache & queue support
✔ Background job processing
✔ Scheduler automation
✔ MySQL integration
✔ Makefile automation
✔ Clean architecture separation

## 🧠 Architecture Philosophy

This setup follows:

Single responsibility containers
Stateless application design
Scalable queue workers
Service isolation
Developer productivity focus

## 💬 Support

For issues or improvements, open a pull request or issue.

---

# 🔥 If you want next upgrade

I can also generate:

- ⚡ full `Makefile`
- ⚡ production Docker (Nginx + PHP-FPM + Redis + Supervisor)
- ⚡ Laravel Horizon setup
- ⚡ CI/CD GitHub Actions pipeline

Just say 👍
