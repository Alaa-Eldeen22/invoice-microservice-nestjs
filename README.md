# 📄 Invoice Microservice

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10+-red.svg)](https://nestjs.com/)
[![Architecture](https://img.shields.io/badge/Architecture-Hexagonal%20%2B%20DDD-blue.svg)](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software))
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)

> **An enterprise-grade invoice management microservice showcasing modern TypeScript architecture, domain-driven design, and seamless event-driven integration with payment systems.**

This microservice demonstrates professional-level software architecture in the Node.js ecosystem, handling invoice creation, lifecycle management, and payment coordination while maintaining clean separation of concerns and implementing SOLID principles.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Domain Model](#-domain-model)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Design Patterns](#-design-patterns)
- [What I Learned](#-what-i-learned)
- [Future Enhancements](#-future-enhancements)

---

## 🎯 Overview

The Invoice Service is a **domain-centric microservice** that manages invoice creation, item management, and payment status tracking. It demonstrates:

- **Hexagonal Architecture (Ports & Adapters)** - Business logic isolated from frameworks and databases
- **Domain-Driven Design (DDD)** - Rich domain model with aggregates, entities, and value objects
- **Event-Driven Architecture** - Bidirectional communication with Payment Service via RabbitMQ
- **TypeScript Best Practices** - Type-safe code with strict null checks and modern ES features

### Business Context

In an e-commerce/billing system:
1. **Invoice Service** creates invoice with line items → publishes `InvoiceCreatedEvent`
2. **Payment Service** receives event → initiates automatic payment authorization
3. **Payment Service** sends back `PaymentSucceededEvent` or `PaymentFailedEvent`
4. **Invoice Service** updates invoice status accordingly
5. On failure: Customer can retry payment → Invoice Service publishes `InvoiceRetriedEvent`

This simulates real-world billing systems used by companies like Stripe Billing, QuickBooks, and FreshBooks.

---

## 🏗 Architecture

### Hexagonal Architecture (Clean Architecture)

```
┌───────────────────────────────────────────────────────────────┐
│                     Interfaces Layer                          │
│  ┌────────────────────────────────────────────────────────┐   │
│  │         Inbound Adapters (Driving Side)               │   │
│  │  • REST API (InvoiceController)                       │   │
│  │  • Message Consumers (PaymentEventConsumer)           │   │
│  └────────────────────────────────────────────────────────┘   │
│                           ▲                                    │
│                           │                                    │
│  ┌────────────────────────┴───────────────────────────────┐   │
│  │              Application Layer                         │   │
│  │  • Use Cases (CreateInvoice, CancelInvoice...)        │   │
│  │  • Application Services                                │   │
│  │  • DTOs & Commands                                     │   │
│  │  • Ports (Interfaces)                                  │   │
│  └────────────────────────┬───────────────────────────────┘   │
│                           │                                    │
│                           ▼                                    │
│  ┌────────────────────────────────────────────────────────┐   │
│  │              Domain Layer (Pure Business Logic)        │   │
│  │  • Invoice Aggregate (Root)                            │   │
│  │  • InvoiceItem Entity                                  │   │
│  │  • Value Objects (Money, DueDate)                      │   │
│  │  • Domain Events                                       │   │
│  │  • Business Rules & Invariants                         │   │
│  └────────────────────────┬───────────────────────────────┘   │
│                           │                                    │
│                           ▼                                    │
│  ┌────────────────────────────────────────────────────────┐   │
│  │        Infrastructure Layer (Driven Side)              │   │
│  │  • Database (TypeORM Repository)                       │   │
│  │  • Event Publisher (RabbitMQ)                          │   │
│  │  • UUID Generator                                      │   │
│  └────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────┘
```

### Why This Architecture?

**Traditional MVC:**
```
Controller → Service → Repository → Database
```
❌ Problem: Business logic scattered, hard to test, coupled to framework

**Hexagonal Architecture:**
```
Adapters → Use Cases → Domain (Pure) ← Infrastructure
```
✅ Solution: Domain is framework-agnostic, testable, and focused on business rules

---

## ✨ Key Features

### 1. **Complete Invoice Lifecycle Management**
- Create invoices with multiple line items
- Add/remove items dynamically
- Track invoice status through its lifecycle
- Automatic payment coordination

### 2. **Event-Driven Payment Integration**
- Publishes `InvoiceCreatedEvent` → triggers automatic payment
- Consumes `PaymentSucceededEvent` → marks invoice as paid
- Consumes `PaymentFailedEvent` → allows retry
- Publishes `InvoiceRetriedEvent` → triggers payment retry

### 3. **Rich Domain Model**
- **Invoice Aggregate**: Enforces business rules and maintains consistency
- **InvoiceItem Entity**: Line items with quantity, price, and totals
- **Value Objects**: Money (currency-aware), DueDate (validation)
- **Domain Events**: Track all state changes

### 4. **Invoice Status State Machine**
```
PENDING → PAYMENT_PENDING → PAID
              ↓
         PAYMENT_FAILED → (retry) → PAYMENT_PENDING
              ↓
          CANCELED
```

### 5. **Bidirectional Microservice Communication**
- **Outbound**: Publishes events for Payment Service
- **Inbound**: Consumes events from Payment Service
- **Eventual Consistency**: Services stay synchronized via events

### 6. **Type-Safe Implementation**
- Full TypeScript with strict mode
- Domain-driven types (no primitives obsession)
- Compile-time safety for business rules

---

## 🛠 Technology Stack

### Core Framework
- **Node.js 20+** - JavaScript runtime
- **NestJS 10+** - Progressive Node.js framework
- **TypeScript 5.0+** - Type-safe JavaScript

### Database & ORM
- **PostgreSQL 15+** - Relational database
- **TypeORM** - Object-Relational Mapping
- **Migrations** - Database version control

### Messaging & Events
- **RabbitMQ** - Message broker for event-driven architecture
- **AMQP** - Advanced Message Queuing Protocol

### Architecture & Design
- **Hexagonal Architecture** - Ports & Adapters pattern
- **Domain-Driven Design (DDD)** - Tactical patterns (aggregates, entities, value objects)
- **CQRS Principles** - Separation of commands and queries
- **Event Sourcing** (Light) - Domain events for audit trail


---

## 📁 Project Structure

```
invoice_service/
├── 📂 src/
│   ├── 📂 domain/                      # Pure business logic (framework-agnostic)
│   │   ├── entities/                   # Domain entities
│   │   │   ├── Invoice.ts              # Aggregate root
│   │   │   └── InvoiceItem.ts          # Entity (line item)
│   │   ├── value-objects/              # Immutable value objects
│   │   │   ├── Money.ts                # Currency + amount
│   │   │   └── DueDate.ts              # Date with validation
│   │   ├── events/                     # Domain events
│   │   │   ├── DomainEvent.ts          # Base event
│   │   │   ├── invoice-created.event.ts
│   │   │   ├── invoice-paid.event.ts
│   │   │   └── invoice-failed.event.ts
│   │   ├── enums/
│   │   │   └── InvoiceStatus.ts        # Status enum
│   │   └── repositories/               # Repository interfaces (ports)
│   │       └── InvoiceRepository.ts
│   │
│   ├── 📂 application/                 # Use cases & orchestration
│   │   ├── ports/                      # Ports (interfaces)
│   │   │   ├── in/                     # Inbound ports (driving)
│   │   │   │   └── use-cases/          # Use case interfaces
│   │   │   │       ├── create-invoice.use-case.ts
│   │   │   │       ├── cancel-invoice.use-case.ts
│   │   │   │       ├── add-invoice-item.use-case.ts
│   │   │   │       ├── retry-invoice.use-case.ts
│   │   │   │       └── mark-invoice-as-paid.use-case.ts
│   │   │   └── out/                    # Outbound ports (driven)
│   │   │       ├── event-bus.port.ts   # Event publishing
│   │   │       └── id-generator.port.ts
│   │   ├── services/                   # Use case implementations
│   │   │   ├── create-invoice.service.ts
│   │   │   ├── cancel-invoice.service.ts
│   │   │   ├── add-invoice-item.service.ts
│   │   │   ├── retry-invoice.service.ts
│   │   │   └── mark-invoice-as-paid.service.ts
│   │   └── events/                     # Integration events
│   │       ├── invoice-created-integration.event.ts
│   │       └── invoice-retried-integration.event.ts
│   │
│   ├── 📂 infrastructure/              # Framework & external concerns
│   │   ├── database/                   # Database implementation
│   │   │   ├── entities/               # TypeORM entities
│   │   │   │   ├── invoice.entity.ts   # ORM entity
│   │   │   │   └── invoice-item.entity.ts
│   │   │   ├── repositories/           # Repository implementations
│   │   │   │   └── invoice.repository.ts
│   │   │   └── mappers/                # Domain ↔ ORM mapping
│   │   │       └── invoice.mapper.ts
│   │   └── messaging/                  # Event bus implementation
│   │       └── rabbitmq-event-bus.ts
│   │
│   ├── 📂 interfaces/                  # External interfaces
│   │   ├── http/                       # REST API
│   │   │   ├── controllers/
│   │   │   │   └── invoice.controller.ts
│   │   │   ├── dtos/                   # Request/response DTOs
│   │   │   │   ├── create-invoice.dto.ts
│   │   │   │   ├── add-invoice-item.dto.ts
│   │   │   │   └── invoice-response.dto.ts
│   │   │   └── mappers/                # DTO ↔ Domain mapping
│   │   │       └── invoice.mapper.ts
│   │   └── messaging/                  # Message consumers
│   │       ├── consumers/
│   │       │   └── rabbit-payment-event.consumer.ts
│   │       └── events/                 # Integration event DTOs
│   │           ├── payment-succeeded.event.ts
│   │           └── payment-failed.event.ts
│   │
│   ├── 📂 modules/                     # NestJS modules
│   │   ├── invoice.module.ts
│   │   └── messaging.module.ts
│   │
│   ├── 📂 config/                      # Configuration
│   │   ├── database.config.ts
│   │   └── rabbitmq.config.ts
│   │
│   └── main.ts                         # Application entry point
│
├── test/                               # Tests
├── .env.example                        # Environment variables template
├── package.json
├── tsconfig.json
└── nest-cli.json
```

### Layer Responsibilities

| Layer | Purpose | Dependencies | Examples |
|-------|---------|--------------|----------|
| **Domain** | Business logic, rules | **NONE** | Invoice, Money, DomainEvent |
| **Application** | Use cases, orchestration | Domain only | CreateInvoiceService |
| **Infrastructure** | Database, messaging | Application + Domain | TypeORM, RabbitMQ |
| **Interfaces** | API, consumers | Application + Domain | Controllers, DTOs |

---

## 🎨 Domain Model

### Invoice Aggregate

```typescript
Invoice (Aggregate Root)
├── id: string (UUID)
├── customerId: string
├── status: InvoiceStatus
│   ├── PENDING
│   ├── PAYMENT_PENDING
│   ├── PAID
│   ├── PAYMENT_FAILED
│   └── CANCELED
├── items: InvoiceItem[]
│   ├── id: string
│   ├── description: string
│   ├── quantity: number
│   ├── unitPrice: Money
│   └── total: Money (calculated)
├── subtotal: Money (calculated)
├── tax: Money
├── total: Money (calculated)
├── dueDate: DueDate (value object)
├── paymentMethodId?: string
├── timestamps
│   ├── createdAt: Date
│   ├── updatedAt: Date
│   └── paidAt?: Date
└── domainEvents: DomainEvent[]
```

### Value Objects

**Money**
```typescript
class Money {
  amount: number;
  currency: string; // ISO 4217 (USD, EUR, etc.)
  
  add(other: Money): Money
  subtract(other: Money): Money
  multiply(factor: number): Money
  equals(other: Money): boolean
}
```

**DueDate**
```typescript
class DueDate {
  value: Date;
  
  isOverdue(): boolean
  daysUntilDue(): number
}
```

### State Machine

```
PENDING ──createInvoice()──> PENDING
   │
   └──publish InvoiceCreatedEvent──> PAYMENT_PENDING
                                           │
                   ┌───────────────────────┴────────────────────┐
                   │                                             │
            PaymentSucceededEvent                      PaymentFailedEvent
                   │                                             │
                   ▼                                             ▼
                 PAID                                    PAYMENT_FAILED
                                                                 │
                                                                 │ retry()
                                                                 ▼
                                                         PAYMENT_PENDING
                                                                 
PENDING/PAYMENT_PENDING ──cancel()──> CANCELED
```

### Domain Events

Events published when state changes occur:

```typescript
InvoiceCreatedEvent      // Invoice created, triggers payment
InvoicePaidEvent         // Payment successful
InvoiceFailedEvent       // Payment failed
InvoiceRetriedEvent      // Customer retries payment
InvoiceCanceledEvent     // Invoice cancelled
InvoiceItemAddedEvent    // Item added to invoice
InvoiceItemRemovedEvent  // Item removed from invoice
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm/yarn
- PostgreSQL 15+
- RabbitMQ

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/invoice-service.git
cd invoice-service
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Start Dependencies (Docker)

```bash
# Start RabbitMQ
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management

# Start PostgreSQL
docker run -d --name postgres \
  -e POSTGRES_DB=invoice_db \
  -e POSTGRES_USER=invoice_user \
  -e POSTGRES_PASSWORD=invoice_pass \
  -p 5432:5432 \
  postgres:15
```

### 4. Configure Environment

Create `.env` file:

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=invoice_user
DATABASE_PASSWORD=invoice_pass
DATABASE_NAME=invoice_db

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672
RABBITMQ_INVOICE_EXCHANGE=invoice_events
RABBITMQ_PAYMENT_EXCHANGE=payment_events

# Application
PORT=3000
NODE_ENV=development
```

### 5. Run Database Migrations

```bash
npm run migration:run
```

### 6. Start the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### 7. Verify Installation

```bash
# Health check
curl http://localhost:3000/health

# Create invoice
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "cust-123",
    "items": [
      {
        "description": "Product A",
        "quantity": 2,
        "unitPrice": 50.00
      }
    ],
    "taxRate": 0.08,
    "dueDate": "2025-11-30",
    "paymentMethodId": "pm_card_visa"
  }'
```

---

## 💡 What I Learned

### Technical Skills

#### Modern TypeScript & Node.js
- **TypeScript 5.0**: Advanced types, strict null checks, discriminated unions
- **NestJS Framework**: Modular architecture, dependency injection, decorators
- **Async/Await**: Proper async handling, error boundaries
- **ES Modules**: Modern JavaScript module system

#### Software Architecture
- **Hexagonal Architecture**: Isolating business logic from frameworks
- **Domain-Driven Design**: Modeling complex business domains
- **Event-Driven Architecture**: Loose coupling via asynchronous events
- **Clean Architecture**: Dependency rule, separation of concerns

#### Database & ORM
- **TypeORM**: Entity mapping, relations, migrations, query builder
- **PostgreSQL**: Relational database design, transactions, constraints
- **Repository Pattern**: Data access abstraction
- **Database Migrations**: Version-controlled schema changes

#### Messaging & Integration
- **RabbitMQ**: Message broker, exchanges, queues, routing
- **Event-Driven Patterns**: Publish/Subscribe, event choreography
- **Eventual Consistency**: Managing distributed data
- **Integration Events**: Cross-service communication

### Business Domain Knowledge

#### Invoice Management
- **Invoice Lifecycle**: Creation → Authorization → Payment → Closure
- **Line Items**: Quantity, unit price, totals, tax calculation
- **Payment Coordination**: Automatic payment initiation, retry logic
- **Status Management**: State transitions, business rule enforcement

#### Real-World Scenarios
- **Failed Payments**: Handling payment failures, enabling retries
- **Invoice Modifications**: Adding/removing items, recalculating totals
- **Audit Trail**: Complete history via domain events
- **Idempotency**: Preventing duplicate invoice creation

### Design Principles

1. **Domain First**: Model business concepts before technical implementation
2. **Type Safety**: Leverage TypeScript to prevent runtime errors
3. **Immutability**: Value objects are immutable, prevent unexpected mutations
4. **Explicit State Transitions**: State machine prevents invalid states
5. **Event-First**: Communicate via events, not direct calls

---

## 🔮 Future Enhancements

- [ ] Add comprehensive unit and integration tests (80%+ coverage)
- [ ] Implement invoice PDF generation
- [ ] Implement request correlation IDs for distributed tracing
- [ ] Add health checks and metrics (Prometheus)
- [ ] **Multi-Currency Support**: Handle different currencies, exchange rates
- [ ] **Recurring Invoices**: Subscription billing, auto-generation
- [ ] **Invoice Templates**: Customizable invoice layouts
- [ ] **Email Notifications**: Send invoice creation/payment confirmations
- [ ] **Invoice History**: Track all changes and modifications

---


## 🤝 Contributing

This is a learning project, but feedback is always welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---



<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

Built with 💙 and lots of ☕ to master TypeScript microservices architecture

**Part of a microservices ecosystem:**
- **Invoice Service** (This repo) - TypeScript/NestJS
- **Payment Service** - Java/Spring Boot you can find the repo [HERE](https://github.com/Alaa-Eldeen22/payment-microservice-spring-boot)


</div>