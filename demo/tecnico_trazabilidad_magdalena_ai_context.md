# Technical Documentation — Magdalena Agro-Trace Platform

> Generado: 2026-05-28 | Proyecto: Sistema de Trazabilidad Agro-Turística del Magdalena

---

## Table of Contents

1. [Purpose of this document](#1-purpose-of-this-document)
2. [Project context](#2-project-context)
3. [Stack overview](#3-stack-overview)
4. [Global architecture pattern](#4-global-architecture-pattern)
5. [Core engineering principles](#5-core-engineering-principles)
6. [Backend — Spring Boot](#6-backend--spring-boot)
   - 6.1 [Versions and dependencies](#61-versions-and-dependencies)
   - 6.2 [Application properties](#62-application-properties)
   - 6.3 [Backend package structure](#63-backend-package-structure)
   - 6.4 [Layered architecture](#64-layered-architecture)
   - 6.5 [Security model](#65-security-model)
   - 6.6 [DTO and mapper strategy](#66-dto-and-mapper-strategy)
   - 6.7 [Error handling](#67-error-handling)
   - 6.8 [Enums and constants](#68-enums-and-constants)
   - 6.9 [Configuration beans](#69-configuration-beans)
7. [Frontend — React + Vite](#7-frontend--react--vite)
   - 7.1 [Versions and dependencies](#71-versions-and-dependencies)
   - 7.2 [Frontend structure](#72-frontend-structure)
   - 7.3 [Routing model](#73-routing-model)
   - 7.4 [State management](#74-state-management)
   - 7.5 [API client strategy](#75-api-client-strategy)
   - 7.6 [UI principles](#76-ui-principles)
8. [Database — PostgreSQL](#8-database--postgresql)
   - 8.1 [Database principles](#81-database-principles)
   - 8.2 [Naming conventions](#82-naming-conventions)
   - 8.3 [Migration strategy](#83-migration-strategy)
9. [Integration points](#9-integration-points)
10. [Testing strategy](#10-testing-strategy)
11. [Development workflow](#11-development-workflow)
12. [Coding standards](#12-coding-standards)
13. [AI implementation rules](#13-ai-implementation-rules)
14. [Out of scope for hackathon](#14-out-of-scope-for-hackathon)
15. [Delivery priorities](#15-delivery-priorities)
16. [Architecture summary](#16-architecture-summary)

---

## 1. Purpose of this document

This markdown file defines the **technical operating context** for any AI or developer working on the Magdalena Agro-Trace project. It should be used together with the functional MVP document.

This file answers:
- which technologies must be used,
- how the codebase must be structured,
- which architectural decisions are mandatory,
- which libraries are preferred,
- what implementation rules must be followed,
- and what should be avoided during the hackathon.

This document is not the functional specification. It is the **technical execution guide** for implementation.

---

## 2. Project context

The project is a web platform for agricultural traceability, tourism linkage, and export-oriented commercial flow for products from Magdalena, especially coffee, banana, and cacao. The system must connect producers, farms, traceable lots, tourism operators, public QR experiences, buyers, leads, and exporters.

The solution is optimized for hackathon execution, so the architecture must balance:
- clarity,
- delivery speed,
- demo reliability,
- clean separation of concerns,
- and future extensibility.

The product is **not** designed as a multi-tenant SaaS in this first hackathon version. It is a **single-tenant domain platform prototype**.

---

## 3. Stack overview

| Layer | Technology | Version / Decision |
|------|-----------|--------------------|
| Backend Framework | Spring Boot | 4.0.6 |
| Backend Language | Java | 21 LTS |
| Backend Build Tool | Maven | Wrapper required |
| API Style | REST JSON | `/api/v1` |
| ORM | Spring Data JPA + Hibernate | Managed by Spring Boot |
| Validation | Jakarta Validation | Starter Validation |
| Mapping | MapStruct | 1.6.3 |
| Boilerplate Reduction | Lombok | Latest compatible |
| Database | PostgreSQL | 15+ |
| DB Migration | Flyway | Mandatory |
| Security | Spring Security + JWT | Simple stateless auth |
| Token Library | JJWT | 0.11.5 |
| Frontend Framework | React | 19.x |
| Frontend Build Tool | Vite | 8.x |
| Routing | react-router-dom | 7.x |
| HTTP Client | fetch or axios | Prefer fetch for simplicity |
| Forms | react-hook-form | Recommended |
| Validation frontend | zod or native validation | Prefer zod if time allows |
| Icons | lucide-react | Recommended |
| Styling | CSS Modules or plain modular CSS | No UI framework required |
| Charts / timeline support | Custom components or lightweight charting | Optional |
| Dev database container | Docker Compose | Recommended |
| Testing backend | JUnit 5 + Spring Boot Test + Testcontainers | Recommended |
| Testing frontend | Vitest + Testing Library | Optional for hackathon |

---

## 4. Global architecture pattern

### Global Pattern: **Layered Monolith + Modular Domain Design**

The system must be built as a **modular monolith**, not as microservices.

Reasons:
- fastest delivery for hackathon,
- easier debugging,
- lower operational overhead,
- one deployment unit,
- enough structure for future extraction if needed.

### High-level architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React + Vite)                   │
│        Public QR views · Internal dashboard views          │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP/REST JSON
                           │ Bearer JWT for protected routes
┌──────────────────────────▼──────────────────────────────────┐
│                    SPRING BOOT BACKEND                     │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Security Layer                                        │  │
│  │ JWT filter · SecurityConfig                           │  │
│  └──────────────────────┬────────────────────────────────┘  │
│                         │                                   │
│  ┌──────────────────────▼────────────────────────────────┐  │
│  │ API Layer                                             │  │
│  │ Controllers · Request DTOs · Response DTOs            │  │
│  └──────────────────────┬────────────────────────────────┘  │
│                         │                                   │
│  ┌──────────────────────▼────────────────────────────────┐  │
│  │ Application / Service Layer                           │  │
│  │ Use cases · business rules · orchestration            │  │
│  └──────────────────────┬────────────────────────────────┘  │
│                         │                                   │
│  ┌──────────────────────▼────────────────────────────────┐  │
│  │ Domain / Persistence Layer                            │  │
│  │ Entities · repositories · mappers                     │  │
│  └──────────────────────┬────────────────────────────────┘  │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │ JDBC
┌─────────────────────────▼───────────────────────────────────┐
│                     PostgreSQL Database                     │
│         producers · farms · lots · events · leads          │
└─────────────────────────────────────────────────────────────┘
```

### Architectural style by module

The backend should be organized by **business domain modules**, while each module still follows layered architecture.

Example modules:
- auth
- producer
- farm
- lot
- certification
- traceability
- tourism
- buyer
- lead
- exporter
- publicview
- shared

---

## 5. Core engineering principles

1. **Build only what is needed for the MVP.**
2. **Prefer explicitness over abstraction.**
3. **Prefer reliability over sophistication.**
4. **Use one backend, one frontend, one database.**
5. **Every screen must map to one real use case in the business flow.**
6. **Public QR flow must be frictionless and readable on mobile.**
7. **Backend must be demo-safe:** if a feature is incomplete, fallback mock responses are acceptable.
8. **Internal admin complexity must stay minimal.**
9. **No unnecessary generic frameworks, no overengineering.**
10. **Domain naming must reflect agricultural traceability, not generic e-commerce naming.**

---

## 6. Backend — Spring Boot

### 6.1 Versions and dependencies

#### Required Maven parent and properties

```xml
<parent>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-parent</artifactId>
  <version>4.0.6</version>
  <relativePath/>
</parent>

<properties>
  <java.version>21</java.version>
  <org.mapstruct.version>1.6.3</org.mapstruct.version>
  <jjwt.version>0.11.5</jjwt.version>
</properties>
```

#### Required backend dependencies

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
  </dependency>

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
  </dependency>

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
  </dependency>

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
  </dependency>

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-restclient</artifactId>
  </dependency>

  <dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
  </dependency>

  <dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
  </dependency>

  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
  </dependency>

  <dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>${org.mapstruct.version}</version>
  </dependency>

  <dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>${jjwt.version}</version>
  </dependency>
  <dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>${jjwt.version}</version>
    <scope>runtime</scope>
  </dependency>
  <dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>${jjwt.version}</version>
    <scope>runtime</scope>
  </dependency>

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
  </dependency>

  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-testcontainers</artifactId>
    <scope>test</scope>
  </dependency>

  <dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>postgresql</artifactId>
    <scope>test</scope>
  </dependency>

  <dependency>
    <groupId>org.testcontainers</groupId>
    <artifactId>junit-jupiter</artifactId>
    <scope>test</scope>
  </dependency>
</dependencies>
```

#### Annotation processors

```xml
<build>
  <plugins>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
      <configuration>
        <excludes>
          <exclude>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
          </exclude>
        </excludes>
      </configuration>
    </plugin>

    <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-compiler-plugin</artifactId>
      <configuration>
        <annotationProcessorPaths>
          <path>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
          </path>
          <path>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok-mapstruct-binding</artifactId>
            <version>0.2.0</version>
          </path>
          <path>
            <groupId>org.mapstruct</groupId>
            <artifactId>mapstruct-processor</artifactId>
            <version>${org.mapstruct.version}</version>
          </path>
        </annotationProcessorPaths>
      </configuration>
    </plugin>
  </plugins>
</build>
```

### 6.2 Application properties

```properties
spring.application.name=magdalena-agro-trace

# datasource
spring.datasource.url=jdbc:postgresql://localhost:5432/magdalena_trace_db
spring.datasource.username=postgres
spring.datasource.password=postgres

# jpa
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# flyway
spring.flyway.enabled=true
spring.flyway.locations=classpath:db/migration

# server
server.port=8080

# jwt
security.jwt.secret=CHANGE_THIS_TO_A_LONG_RANDOM_SECRET
security.jwt.expiration-seconds=86400

# cors
app.cors.allowed-origins=http://localhost:5173,http://localhost:3000
```

#### Environment policy

Use environment variables or `.env`-style local config for real secrets. Never hardcode secrets in source code.

### 6.3 Backend package structure

```text
com.magdalena.trace
│
├── MagdalenaTraceApplication.java
│
├── shared/
│   ├── config/
│   ├── exception/
│   ├── response/
│   ├── util/
│   └── enums/
│
├── security/
│   ├── config/
│   ├── jwt/
│   ├── service/
│   └── model/
│
├── auth/
│   ├── api/
│   ├── service/
│   ├── dto/
│   └── entity/
│
├── producer/
│   ├── api/
│   ├── service/
│   ├── repository/
│   ├── dto/
│   ├── entity/
│   └── mapper/
│
├── farm/
├── product/
├── lot/
├── certification/
├── traceability/
├── tourism/
├── buyer/
├── lead/
├── exporter/
└── publicview/
```

### 6.4 Layered architecture

Every domain module should follow this pattern:

```text
api/controller -> service -> repository -> database
                   |
                   -> mapper -> dto
```

#### Layer rules

**Controller layer**
- only request parsing, response building, validation orchestration,
- no business logic,
- returns DTOs only,
- no entities exposed to frontend.

**Service layer**
- owns business rules,
- coordinates repositories,
- creates trace events,
- manages transactional use cases,
- can call external AI endpoints if needed.

**Repository layer**
- extends `JpaRepository`,
- uses explicit queries when needed,
- should not implement business logic.

**Mapper layer**
- MapStruct preferred,
- entity ↔ DTO conversion only.

### 6.5 Security model

#### Security decision for hackathon

Use **simple JWT auth** for internal dashboard routes only.

Public QR routes must be accessible **without authentication**.

#### Protected domains
- internal admin dashboard
- lot management
- event creation
- lead management
- exporter review
- operator management

#### Public domains
- QR public lot traceability page
- QR scan event registration
- purchase lead form
- public lot history view

#### Authentication flow

```text
POST /api/v1/auth/login
        │
        ▼
AuthController -> AuthService
        │
        ▼
validate user/password
        │
        ▼
generate JWT
        │
        ▼
return token + user context
```

#### Security classes

| Class | Responsibility |
|------|----------------|
| `JwtService` | Token generation and validation |
| `JwtAuthenticationFilter` | Extracts and validates bearer token |
| `JpaUserDetailsService` | Loads internal user by username/email |
| `SecurityConfig` | Public/protected route rules |
| `SecurityBeans` | Password encoder bean |

#### Security simplification rule

Do **not** implement advanced RBAC, refresh tokens, password reset, email verification, or OAuth during the hackathon unless the core MVP is already complete.

### 6.6 DTO and mapper strategy

#### Required pattern

```text
Request DTO -> service -> entity persistence -> response DTO
```

#### Mandatory rules
- No entity must be returned directly from controller.
- Every create/update endpoint must receive a request DTO.
- Every read endpoint must return a response DTO.
- Public QR responses should be optimized for consumption, not mirror DB shape.

#### Typical DTO groups
- `CreateProducerRequest`, `ProducerResponse`
- `CreateFarmRequest`, `FarmResponse`
- `CreateLotRequest`, `LotResponse`, `LotDetailResponse`
- `CreateTraceEventRequest`, `TraceEventResponse`
- `CreateTourismOperatorRequest`, `TourismOperatorResponse`
- `CreateExperienceRequest`, `ExperienceResponse`
- `CreatePublicLeadRequest`, `LeadResponse`
- `ExporterReviewRequest`, `ExporterReviewResponse`
- `LoginRequest`, `TokenResponse`

### 6.7 Error handling

Use a global exception handling strategy.

#### Mandatory custom exceptions

```java
ResourceNotFoundException
BusinessRuleException
DuplicateResourceException
UnauthorizedException
ForbiddenException
```

Use `@RestControllerAdvice` to map exceptions into a consistent API response structure:

```json
{
  "timestamp": "2026-05-28T00:00:00",
  "status": 404,
  "error": "Not Found",
  "message": "Lot not found",
  "path": "/api/v1/lots/99"
}
```

### 6.8 Enums and constants

#### Recommended enums

**LotStatus**
- AVAILABLE
- RESERVED
- IN_EXPORT_REVIEW
- SOLD
- INACTIVE

**TraceEventType**
- LOT_CREATED
- CULTIVATION_UPDATED
- CERTIFICATION_VALIDATED
- HARVEST_COMPLETED
- QUALITY_CHECKED
- TOURISM_LINKED
- QR_SCANNED
- PURCHASE_INTENT_CREATED
- EXPORT_REVIEWED
- LOT_RESERVED

**ActorType**
- PRODUCER
- TOURISM_OPERATOR
- EXPORTER
- BUYER
- SYSTEM
- ADMIN

**LeadStatus**
- NEW
- CONTACTED
- QUALIFIED
- IN_EXPORT_REVIEW
- CLOSED_WON
- CLOSED_LOST

**BuyerType**
- TOURIST
- IMPORTER
- ROASTER
- DISTRIBUTOR
- HOTEL

### 6.9 Configuration beans

| Class | Purpose |
|------|---------|
| `JpaConfig` | Enables JPA auditing |
| `SecurityBeans` | BCryptPasswordEncoder bean |
| `SecurityConfig` | Security filter chain and route rules |
| `DatabaseSeeder` | Optional seed data for products/certifications |
| `RestClientConfig` | Optional external AI integration client |

---

## 7. Frontend — React + Vite

### 7.1 Versions and dependencies

#### Recommended dependencies

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "lucide-react": "^0.500.0",
    "react-hook-form": "^7.56.0",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "vite": "^8.0.0",
    "@vitejs/plugin-react": "^6.0.0",
    "eslint": "^9.0.0",
    "@eslint/js": "^9.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0"
  }
}
```

#### Frontend dependency policy

- Keep frontend dependencies minimal.
- Avoid heavy UI frameworks if not already standardized.
- Prefer custom components and CSS modules.
- Avoid Redux unless absolutely required; local state is enough.

### 7.2 Frontend structure

```text
frontend/src/
│
├── main.jsx
├── App.jsx
├── styles/
│   ├── globals.css
│   ├── variables.css
│   └── utilities.css
│
├── app/
│   ├── router/
│   ├── providers/
│   └── layout/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── api/
│
├── features/
│   ├── auth/
│   ├── producers/
│   ├── farms/
│   ├── lots/
│   ├── traceability/
│   ├── tourism/
│   ├── leads/
│   ├── exporters/
│   └── public-trace/
│
└── pages/
    ├── LoginPage.jsx
    ├── DashboardPage.jsx
    ├── LotDetailPage.jsx
    ├── PublicTracePage.jsx
    ├── PublicLeadPage.jsx
    └── NotFoundPage.jsx
```

### 7.3 Routing model

#### Internal routes

```text
/login
/dashboard
/lots
/lots/:id
/experiences
/leads
/export-reviews
```

#### Public routes

```text
/trace/:qrSlug
```

The public trace route is the most important route in the project because it represents the QR-based tourism and buyer experience.

### 7.4 State management

#### State strategy

Use the simplest possible approach:
- local component state,
- custom hooks,
- context only for auth/session,
- no Redux for hackathon scope.

#### Suggested contexts
- `AuthContext`
- optional `AppContext` for shared UI state

### 7.5 API client strategy

Centralize API calls under `shared/api`.

Example modules:
- `authApi.js`
- `lotApi.js`
- `traceabilityApi.js`
- `tourismApi.js`
- `leadApi.js`
- `exporterApi.js`

#### API rules
- one file per domain,
- reusable `BASE_URL`,
- bearer token added centrally,
- throw normalized errors,
- public and protected endpoints separated clearly.

### 7.6 UI principles

1. Mobile-first for public QR page.
2. Desktop-friendly for internal dashboard.
3. Clean timeline visualization for traceability.
4. Readability over decoration.
5. Avoid complex animations.
6. Public trace page must clearly show:
   - producer,
   - farm,
   - product,
   - certifications,
   - timeline,
   - call to action.
7. Dashboard can remain simple table + cards layout.

---

## 8. Database — PostgreSQL

### 8.1 Database principles

Use PostgreSQL as the only relational database.

#### Core rules
- snake_case table names,
- singular or plural naming must remain consistent,
- foreign keys are mandatory,
- audit timestamps on all business tables,
- use numeric for quantities,
- use text/varchar for flexible notes,
- no JSONB unless a real use case exists.

### 8.2 Naming conventions

#### Tables
- `producer`
- `farm`
- `product`
- `product_lot`
- `certification`
- `lot_certification`
- `trace_event`
- `tourism_operator`
- `tourism_experience`
- `experience_lot`
- `buyer`
- `purchase_lead`
- `exporter`
- `export_review`
- `app_user`

#### Columns
- `id`
- `created_at`
- `updated_at`
- `producer_id`
- `lot_code`
- `event_timestamp`
- `hash_value`
- `previous_hash`

### 8.3 Migration strategy

Use **Flyway** from day one.

#### Rules
- never rely on `ddl-auto=create-drop` as the main source of truth,
- keep schema in `src/main/resources/db/migration`,
- migration naming: `V1__init_schema.sql`, `V2__seed_catalogs.sql`, etc.

#### Hackathon approach
- `V1__init_schema.sql` -> core schema
- `V2__seed_catalogs.sql` -> products, certifications, sample users
- `V3__sample_demo_data.sql` -> optional demo data

---

## 9. Integration points

### AI integration

AI is part of the hackathon context, so the system should allow one lightweight AI capability.

#### Recommended AI use cases
- explain certification meaning,
- explain producer story from structured data,
- answer “what does this lot represent?”
- explain why this product is export-ready.

#### Technical recommendation

Do **not** deeply couple the whole system to an LLM.

Instead, isolate AI behind one service:

```text
AiExplanationService
```

Possible endpoint:
- `GET /api/v1/lots/{id}/ai-summary`
- or `GET /public/trace/{qrSlug}/ai-summary`

### Blockchain simulation

Do not implement real blockchain for hackathon scope.

Use:
- `hash_value`
- `previous_hash`
- optional hash generation service

This is enough to demonstrate immutable-chain logic in the pitch.

### QR integration

QR is a business entry point, not just a visual asset.

- Every public traceable lot or experience should have a `qr_slug` or `qr_code_value`.
- QR points to `/trace/{qrSlug}`.

---

## 10. Testing strategy

### Backend

#### Minimum required
- service tests for critical use cases,
- repository integration tests for key queries,
- controller test for at least auth and public trace flow.

#### Recommended stack
- JUnit 5
- Spring Boot Test
- Testcontainers PostgreSQL

#### Critical test targets
- create lot
- create trace event
- public trace retrieval
- create purchase lead
- assign exporter review

### Frontend

Testing is optional if time is limited, but if included:
- test public trace page rendering,
- test lead form validation,
- test login flow.

---

## 11. Development workflow

### Recommended workflow

1. Generate Flyway schema.
2. Implement entities and repositories.
3. Implement core services.
4. Implement DTOs and mappers.
5. Implement controllers.
6. Implement frontend routes and pages.
7. Connect frontend to backend.
8. Seed demo data.
9. Add AI summary and hash mock.
10. Polish public QR demo.

### Branching recommendation

If using git:
- `main`
- `backend-core`
- `frontend-ui`
- `integration-demo`

But for hackathon, a simple trunk-based workflow is acceptable if the team is small.

---

## 12. Coding standards

### Java
- Use constructor injection only.
- Use `@RequiredArgsConstructor` when appropriate.
- No field injection.
- Keep services focused.
- Prefer explicit method names: `createLot`, `addTraceEvent`, `createPurchaseLead`.
- Avoid god services.
- Use transactions only where business consistency matters.

### SQL / DB
- Primary keys can be `bigserial` for speed and simplicity.
- Do not optimize prematurely.
- Add indexes on foreign keys and `lot_code`, `qr_slug`, `lead_status`.

### React
- One component per file.
- Separate feature components from shared UI components.
- Avoid giant pages with all logic inline.
- Use custom hooks when form or data logic becomes repetitive.

### Naming
- Use English for code-level naming.
- Use domain-meaningful names, not generic placeholders.
- Avoid abbreviations unless obvious.

---

## 13. AI implementation rules

This section is the most important when this file is passed to an AI coding assistant.

### Mandatory AI rules

1. Respect the stack exactly as defined in this document.
2. Do not replace Spring Boot with Node, Nest, Django, or Firebase.
3. Do not replace PostgreSQL with MongoDB.
4. Do not introduce microservices.
5. Do not introduce event brokers like Kafka or RabbitMQ.
6. Do not introduce advanced DDD boilerplate unless explicitly requested.
7. Do not add unnecessary SaaS features such as billing, subscription plans, organizations, or multitenancy.
8. Do not expose entities directly from controllers.
9. Always create DTOs for request/response.
10. Always preserve the layered modular monolith architecture.
11. Keep the public QR flow simple and robust.
12. Prioritize demo readiness over abstraction purity.
13. If a feature is incomplete, implement the simplest viable version that preserves the architecture.
14. Prefer explicit SQL/Flyway + JPA over dynamic schema generation.
15. Keep authentication simple: JWT for internal routes only.

### Preferred AI behavior during implementation

When generating code, the AI should:
- start from schema and entities,
- generate repositories second,
- services third,
- controllers fourth,
- frontend pages after API contracts are stable,
- and only then generate extras such as AI summary or hash chaining.

### AI response style for this project

When suggesting changes, the AI should always explain:
- what module is affected,
- what files must be created,
- what dependencies are required,
- and whether the change impacts schema, API, or UI.

---

## 14. Out of scope for hackathon

The following items are intentionally out of scope unless the MVP is already complete:

- real blockchain network integration,
- payment gateway integration,
- full role matrix and RBAC,
- refresh tokens,
- password recovery,
- file storage platform integration,
- geospatial analytics,
- drone live streams,
- offline sync engine,
- multilingual i18n framework,
- message queues,
- microservices,
- Kubernetes,
- advanced CI/CD pipelines,
- observability stack like Prometheus/Grafana/ELK.

---

## 15. Delivery priorities

### P0 — Must exist
- backend project boots,
- frontend project boots,
- PostgreSQL schema works,
- login works for internal dashboard,
- create lot works,
- trace events work,
- public QR trace page works,
- lead creation works.

### P1 — Strongly recommended
- tourism experience linkage,
- exporter review flow,
- status changes,
- seeded demo data,
- better timeline UI.

### P2 — Nice to have
- AI summary endpoint,
- hash chain generation,
- dashboard metrics,
- map display,
- richer validations.

---

## 16. Architecture summary

This project must be implemented as a **React + Spring Boot + PostgreSQL modular monolith**, with:
- JWT-secured internal routes,
- public QR-based traceability views,
- Flyway-managed schema,
- JPA entities and repositories,
- DTO-based REST APIs,
- simple service-driven business logic,
- and minimal dependencies for fast, safe hackathon delivery.

The goal is not to build the most complex platform. The goal is to build the most understandable, presentable, and extensible MVP under hackathon constraints.
