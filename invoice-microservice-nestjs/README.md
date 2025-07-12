# 🚀 Invoice Microservice (NestJS)

Welcome to the **Invoice Microservice** — a modern, event-driven backend service dedicated to managing invoices as part of a distributed architecture.

Built with **Node.js**, **NestJS**, **PostgreSQL**, **TypeORM**, and **RabbitMQ**, it follows **Domain-Driven Design (DDD)** and **Clean Architecture** principles to ensure scalability, testability, and maintainability.

---

## 📅 Tech Stack

* **Node.js**
* **NestJS** (Modular architecture, DI)
* **PostgreSQL** (Relational database)
* **TypeORM** (ORM for PostgreSQL)
* **RabbitMQ** (Asynchronous event communication)

---

## 📁 Folder Structure Overview

```
src/
├── app.module.ts                # Main NestJS module
├── main.ts                      # Entry point
│
├── config/                      # Config loaders for .env (RabbitMQ, DB)
│
├── domain/                      # 💡 Business logic (DDD)
│   ├── entities/                # Aggregates: Invoice, InvoiceItem
│   ├── value-objects/           # Immutable concepts: Money, DueDate
│   ├── enums/                   # Domain enums like InvoiceStatus
│   ├── repositories/            # Repository interfaces
│   └── events/                  # Domain events
│
├── application/                 # 🚦 Use cases & service ports
│   ├── use-cases/               # Business rules: Create, Cancel, etc.
│   └── ports/                   # Interfaces like EventBus, IdGenerator
│
├── infrastructure/              # 🌐 Integration/adapters
│   ├── database/                # TypeORM setup
│   ├── messaging/               # RabbitMQ integration
│   └── services/                # Utility services (e.g., UUID)
│
├── interfaces/                  # 📱 REST & messaging interfaces
│   ├── http/                    # Controllers, DTOs, mappers
│   └── messaging/               # RabbitMQ listeners
│
├── modules/                     # NestJS modules
│   ├── invoice.module.ts
│   └── messaging.module.ts
```

---

## ⚙️ Getting Started

### 📓 1. Clone & Install

```bash
git clone https://github.com/your-username/invoice-microservice-nestjs.git
cd invoice-microservice-nestjs
npm install
```

### 🗄️ 2. Set Up PostgreSQL

```bash
sudo service postgresql start
psql -U postgres
CREATE DATABASE invoices;
```

### 📩 3. Set Up RabbitMQ

```bash
sudo service rabbitmq-server start
```

### 🚧 4. Configure Environment

```bash
cp .env.example .env
```

> All required variables are in `.env.example`. Customize them as needed.

---

## 🧪 Run the App

```bash
npm run start:dev
```

App runs on: [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Architecture

This project follows **DDD** and **Clean Architecture**. Each layer has its own responsibility:

### 🧠 Domain Layer

Core business rules with no external dependencies.

```ts
// domain/entities/Invoice.ts
invoice.addItem(item);
invoice.cancel(reason);
```

### 🚦 Application Layer

Use cases orchestrate domain logic.

```ts
// application/use-cases/cancel-invoice.use-case.ts
await cancelInvoiceUseCase.execute(invoiceId, reason);
```

### 🌍 Infrastructure Layer

Implements persistence, messaging, and utilities.

```ts
// infrastructure/database/repositories/invoice.repository.ts
save(invoice: Invoice): Promise<void>
```

### 📱 Interfaces Layer

Exposes APIs and listeners.

```ts
// interfaces/http/controllers/invoice.controller.ts
@Post('/invoices') createInvoice() { ... }
```

---

## 📩 REST API Endpoints

| Method | Endpoint                    | Description              |
| ------ | --------------------------- | ------------------------ |
| POST   | `/invoices`                 | Create a new invoice     |
| PATCH  | `/invoices/:id/add-item`    | Add an item              |
| PATCH  | `/invoices/:id/remove-item` | Remove an item           |
| PATCH  | `/invoices/:id/cancel`      | Cancel an invoice        |
| GET    | `/invoices/:id`             | Retrieve invoice details |

---

## 📢 Event Listeners (RabbitMQ)

* **`PaymentSucceededListener`**

  * `payment.succeeded` → Marks invoice as paid
  * Emits `invoice.paid` domain event

* **`PaymentFailedListener`**

  * `payment.failed` → Marks invoice as failed

---

## 📚 Features

* ✅ Domain-driven business logic
* ✅ Event-driven with RabbitMQ
* ✅ RESTful API
* ✅ Clean and testable architecture
* ✅ Easily extensible use cases
* ✅ Type-safe DTOs and mappers

---

## 🧰 Environment Variables Reference

| Variable                 | Description                     | Example                        |
| ------------------------ | ------------------------------- | ------------------------------ |
| `RABBITMQ_URI`           | RabbitMQ connection string      | `amqp://guest:guest@localhost` |
| `RABBITMQ_EXCHANGE_NAME` | Exchange name                   | `invoice_events`               |
| `RABBITMQ_EXCHANGE_TYPE` | Exchange type (`topic`, etc.)   | `topic`                        |
| `RABBITMQ_PREFETCH`      | Prefetch count for consumer     | `10`                           |
| `DB_HOST`                | PostgreSQL host                 | `localhost`                    |
| `DB_PORT`                | PostgreSQL port                 | `5432`                         |
| `DB_USERNAME`            | PostgreSQL user                 | `postgres`                     |
| `DB_PASSWORD`            | PostgreSQL password             | `postgres`                     |
| `DB_NAME`                | Database name                   | `invoices`                     |
| `DB_SYNC`                | Auto-sync schema (`true/false`) | `true`                         |

---

## 🤝 Contributing

Pull requests and feedback are welcome!
If you find this helpful or use it in your project, give it a ⭐ on GitHub!

---

**Crafted with ❤️ using NestJS, DDD & Event-Driven Design**
Feel free to fork, integrate, and extend this microservice!
