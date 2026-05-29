# Backend Status — Origen Magdalena
> Generado: 2026-05-28 | Rama: backend

---

## Flujo completo implementado

El backend implementa un monolito modular en capas. Cada actor del sistema tiene su módulo, y todos convergen en el lote (`ProductLot`) como entidad central de trazabilidad.

```
PRODUCTOR
  └─ Registra productor (ProducerService)
  └─ Registra finca (FarmService)
  └─ Crea lote → estado: CERTIFICATION_PENDING (ProductLotService)
       │
       ├─ Sube evidencia de certificación (CertificationService.attachToLot)
       │       └─ LotCertification: PENDING_VALIDATION
       │       └─ TraceEvent: "Certification submitted"
       │
       ├─ Genera solicitud PDF (CertificationApplicationService.submit)
       │       └─ Builds CertificationApplicationPayload (4 bloques)
       │       └─ Serializa como JSON → BD
       │       └─ Genera PDF con Thymeleaf + Flying Saucer
       │
       └─ Admin valida certificación (CertificationService.validateCertification)
               └─ LotCertification: VALIDATED / CONDITIONALLY_VALID
               └─ Lote → AVAILABLE (exportable)
               └─ TraceEvent: "Certification validated"

OPERADOR TURÍSTICO
  └─ Crea operador (TourismService.createOperator)
  └─ Crea experiencia con qr_slug (TourismService.createExperience)
  └─ Vincula lote a experiencia (TourismService.linkLot)
       └─ TraceEvent: TOURISM_LINKED

TURISTA / COMPRADOR
  └─ Escanea QR → PublicTraceService.getByQrCode(qrSlug)
       └─ Retorna: productor + finca + producto + certificaciones + timeline
  └─ Registra escaneo → TraceEvent: QR_SCANNED
  └─ Crea lead → PurchaseLeadService.createPublicLead
       └─ findOrCreate Buyer por email
       └─ PurchaseLead: status=NEW
       └─ TraceEvent: PURCHASE_INTENT_CREATED

EXPORTADOR
  └─ Ve leads (PurchaseLeadService.findAll)
  └─ Crea revisión (ExportReviewService.createReview)
       └─ ExportReview con incoterm + estimated delivery
       └─ Lead → IN_EXPORT_REVIEW
       └─ Lote → IN_EXPORT_REVIEW
       └─ TraceEvent: EXPORT_REVIEWED
```

---

## Máquinas de estado

### LotStatus
```
CERTIFICATION_PENDING ──► AVAILABLE ──► RESERVED ──► IN_EXPORT_REVIEW ──► SOLD
                                                                       └──► INACTIVE
```
Transiciones automáticas:
- Creación del lote → `CERTIFICATION_PENDING`
- Admin valida certificación → `AVAILABLE`
- Exportador crea revisión → `IN_EXPORT_REVIEW`

### LeadStatus
```
NEW ──► CONTACTED ──► QUALIFIED ──► IN_EXPORT_REVIEW ──► CLOSED_WON
                                                     └──► CLOSED_LOST
```

### CertificationValidationStatus
```
PENDING_VALIDATION ──► CONDITIONALLY_VALID ──► VALIDATED
                   └──► REJECTED
                         EXPIRED
```

### CertificationApplicationStatus
```
DRAFT ──► SUBMITTED ──► UNDER_REVIEW ──► APPROVED
                                    └──► REJECTED
```

---

## Cobertura vs MVP requerido

### P0 — Debe existir

| Requisito MVP | Estado backend | Estado controller |
|--------------|----------------|-------------------|
| Backend arranca | ✅ | — |
| Login funciona | ✅ | ✅ `POST /api/v1/auth/login` |
| Schema PostgreSQL | ✅ V1 migración existe | ⚠ falta tabla `certification_application` en Flyway |
| Crear lote | ✅ `ProductLotService.create()` | ❌ sin controller |
| Eventos de trazabilidad | ✅ `TraceEventService.record()` | ❌ sin controller |
| Vista pública QR | ✅ `PublicTraceService.getByQrCode()` | ❌ sin controller |
| Crear lead desde QR | ✅ `PurchaseLeadService.createPublicLead()` | ❌ sin controller |

### P1 — Recomendado

| Requisito MVP | Estado backend | Estado controller |
|--------------|----------------|-------------------|
| Crear productor y finca | ✅ servicios completos | ❌ sin controller |
| Vincular lote a experiencia turística | ✅ `TourismService.linkLot()` | ❌ sin controller |
| Flujo exportador | ✅ `ExportReviewService` | ❌ sin controller |
| Cambiar estado lote | ✅ `changeStatus()` | ❌ sin controller |
| Datos de demo seeded | ❌ no existe V2/V3 Flyway | — |
| Validación de certificaciones | ✅ `validateCertification()` | ❌ sin controller |

### P2 — Nice to have

| Requisito MVP | Estado backend | Notas |
|--------------|----------------|-------|
| Hash chain blockchain | ✅ SHA256 en `TraceEventService` | Funciona al crear eventos |
| PDF solicitud certificación | ✅ `CertificationPdfService` | Thymeleaf + Flying Saucer |
| AI summary del lote | ❌ no implementado | Endpoint pendiente |
| AI guía de certificación | ❌ no implementado | Onboarding pendiente |
| Datos de demo | ❌ no existe | V3 Flyway pendiente |

---

## Inventario de servicios implementados

| Módulo | Servicio | Métodos clave |
|--------|---------|---------------|
| `auth` | `AuthService` | `login()` |
| `producer` | `ProducerService` | `findAll`, `findById`, `create`, `getProducerOrThrow` |
| `farm` | `FarmService` | `findByProducer`, `findById`, `create`, `getFarmOrThrow` |
| `product` | `ProductService` | `findAll`, `findById`, `create`, `getProductOrThrow` |
| `lot` | `ProductLotService` | `findAll`, `findByStatus`, `findByProducer`, `findById`, `getDetail`, `create`, `changeStatus` |
| `certification` | `CertificationService` | `findAll`, `create`, `findByLot`, `attachToLot`, `validateCertification` |
| `certification` | `CertificationApplicationService` | `submit`, `findByProducer`, `findByStatus`, `regeneratePdf` |
| `certification` | `CertificationPdfService` | `generate`, `store` |
| `traceability` | `TraceEventService` | `createTraceEvent`, `record` (interno), `getTimeline` |
| `tourism` | `TourismService` | `createOperator`, `findAllOperators`, `createExperience`, `linkLot`, `findLotsForExperience` |
| `buyer` | `BuyerService` | `findOrCreate` (upsert por email) |
| `lead` | `PurchaseLeadService` | `findAll`, `findByStatus`, `findByLot`, `createPublicLead`, `updateStatus` |
| `exporter` | `ExporterService` | `findAll`, `findById`, `create` |
| `exporter` | `ExportReviewService` | `findByLead`, `findByExporter`, `createReview` |
| `publicview` | `PublicTraceService` | `getByQrCode`, `getByLotCode`, `getExperienceBySlug` |

**Total: 16 servicios, ~60 métodos de negocio**

---

## Lo que falta en el backend

### 🔴 Crítico — bloquea la demo

#### 1. Controllers REST (todos los módulos excepto auth)
**El cuello de botella principal.** Todos los servicios están listos, ninguno está expuesto por HTTP.

| Controller a crear | Endpoints mínimos |
|-------------------|-------------------|
| `ProducerController` | `POST /api/v1/producers`, `GET /api/v1/producers`, `GET /api/v1/producers/{id}` |
| `FarmController` | `POST /api/v1/farms`, `GET /api/v1/producers/{id}/farms` |
| `ProductController` | `GET /api/v1/products` |
| `LotController` | `POST /api/v1/lots`, `GET /api/v1/lots`, `GET /api/v1/lots/{id}`, `PATCH /api/v1/lots/{id}/status`, `POST /api/v1/lots/{id}/certifications`, `GET /api/v1/lots/{id}/traceability` |
| `TraceEventController` | `POST /api/v1/lots/{id}/events`, `GET /api/v1/lots/{id}/events` |
| `PublicTraceController` | `GET /public/trace/{qrSlug}`, `POST /public/trace/{qrSlug}/scan`, `POST /public/trace/{qrSlug}/lead` |
| `LeadController` | `GET /api/v1/leads`, `GET /api/v1/leads/{id}`, `PATCH /api/v1/leads/{id}/status` |
| `ExporterController` | `POST /api/v1/exporters`, `GET /api/v1/exporters` |
| `ExportReviewController` | `POST /api/v1/leads/{id}/export-review`, `GET /api/v1/leads/{id}/export-review` |
| `TourismController` | `POST /api/v1/tourism/operators`, `GET /api/v1/tourism/operators`, `POST /api/v1/tourism/experiences`, `POST /api/v1/tourism/experiences/{id}/lots/{lotId}` |
| `CertificationController` | `GET /api/v1/certifications`, `POST /api/v1/lots/{id}/certifications`, `POST /api/v1/certification-applications`, `GET /api/v1/certification-applications/{id}/pdf`, `PATCH /api/v1/lot-certifications/{id}/validate` |

#### 2. Flyway — tablas nuevas no están en la migración

Las siguientes columnas y tablas existen en el código pero NO en `V1__init_schema.sql`:

```sql
-- Falta en app_user:
ALTER TABLE app_user ADD COLUMN onboarding_completed boolean NOT NULL DEFAULT false;

-- Falta en lot_certification:
ALTER TABLE lot_certification ADD COLUMN validation_notes text;
ALTER TABLE lot_certification ADD COLUMN validated_by bigint;
ALTER TABLE lot_certification ADD COLUMN validated_at timestamp;
-- status ahora es enum, no varchar libre

-- Tabla nueva:
CREATE TABLE certification_application (...);
```

**Opciones:** actualizar `V1__init_schema.sql` (si la BD está vacía) o crear `V2__add_certification_application.sql`.

---

### 🟡 Importante — flujo incompleto sin esto

#### 3. Datos de demo seeded (Flyway V3)
Sin datos seed el jurado ve pantallas vacías.

```sql
-- V2__seed_catalogs.sql
INSERT INTO product (name, category, unit_of_measure) VALUES
  ('Café Pergamino Seco', 'CAFE', 'kg'),
  ('Banano Exportación', 'BANANO', 'cajas'),
  ('Cacao Seco', 'CACAO', 'kg');

INSERT INTO certification (name, issuer, description) VALUES
  ('Fairtrade', 'FLOCERT', '...'),
  ('Rainforest Alliance', 'Rainforest Alliance', '...');

INSERT INTO app_user (name, email, password, role) VALUES
  ('Admin', 'admin@magdalena.co', '{bcrypt}...', 'ADMIN'),
  ('Carlos Mendoza', 'carlos@finca.co', '{bcrypt}...', 'PRODUCER'),
  ('Exportaciones del Norte', 'export@norte.co', '{bcrypt}...', 'EXPORTER'),
  ('Minca Tours', 'tours@minca.co', '{bcrypt}...', 'TOURISM_OPERATOR');

-- V3__sample_demo_data.sql
-- 1 productor, 1 finca, 1 lote, 2 eventos, 1 experiencia, 1 QR
```

#### 4. AI endpoints (2 endpoints)
```
POST /api/v1/ai/certification-guide     → guía para el campesino
POST /api/v1/ai/onboarding              → wizard de onboarding por rol
```

Requieren integrar Anthropic Claude API. Pendiente pero de alto impacto para el pitch.

---

### 🟢 Opcional para el hackathon

#### 5. AI summary del lote
```
GET /api/v1/lots/{id}/ai-summary
```

#### 6. Hash anchor endpoint
```
POST /api/v1/lots/{id}/hash-anchor
```
El servicio de hash ya existe (`HashUtil`, `TraceEventService`). Solo falta exponerlo.

#### 7. Paginación en listados
Los `findAll()` actuales devuelven todo sin paginar. Para la demo está bien; en producción necesitaría `Pageable`.

---

## Resumen ejecutivo

```
Servicios y lógica de negocio   ████████████████████  100% ✅
Entidades y repositorios        ████████████████████  100% ✅
DTOs y mappers                  ████████████████░░░░   85% ✅ (buyer sin DTO)
Security (JWT + roles)          ████████████████████  100% ✅
Controllers REST                █░░░░░░░░░░░░░░░░░░░    5% ❌ solo auth
Flyway migrations               ████████████░░░░░░░░   65% ⚠ faltan tablas nuevas
Datos de demo                   ░░░░░░░░░░░░░░░░░░░░    0% ❌
AI endpoints                    ░░░░░░░░░░░░░░░░░░░░    0% ❌
Tests                           ████░░░░░░░░░░░░░░░░   20% ⚠ solo repositorios
```

**El backend tiene toda la lógica. El único bloqueante para la demo son los controllers REST y las migraciones Flyway actualizadas.**
