-- =====================================================================
-- Magdalena Agro-Trace — V1 init schema
-- Layered modular monolith. snake_case tables, bigserial PKs,
-- audit timestamps, mandatory FKs.
-- =====================================================================

-- ---------------------------------------------------------------------
-- app_user (internal dashboard users)
-- ---------------------------------------------------------------------
CREATE TABLE app_user (
    id                    BIGSERIAL PRIMARY KEY,
    name                  VARCHAR(150) NOT NULL,
    email                 VARCHAR(120) NOT NULL UNIQUE,
    password              VARCHAR(255) NOT NULL,
    role                  VARCHAR(30)  NOT NULL,
    active                BOOLEAN      NOT NULL DEFAULT TRUE,
    onboarding_completed  BOOLEAN      NOT NULL DEFAULT FALSE,
    profile_id            BIGINT,
    profile_type          VARCHAR(30),
    created_at            TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at            TIMESTAMP
);

-- ---------------------------------------------------------------------
-- producer
-- ---------------------------------------------------------------------
CREATE TABLE producer (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    document_type   VARCHAR(20),
    document_number VARCHAR(50),
    producer_type   VARCHAR(30)  NOT NULL,
    phone           VARCHAR(30),
    email           VARCHAR(120),
    municipality    VARCHAR(80)  NOT NULL,
    department      VARCHAR(80)  DEFAULT 'Magdalena',
    community_name  VARCHAR(120),
    created_at      TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP
);

-- ---------------------------------------------------------------------
-- product (catalog)
-- ---------------------------------------------------------------------
CREATE TABLE product (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    category        VARCHAR(50)  NOT NULL,
    unit_of_measure VARCHAR(20)  NOT NULL,
    description     TEXT,
    created_at      TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP
);

-- ---------------------------------------------------------------------
-- certification (catalog)
-- ---------------------------------------------------------------------
CREATE TABLE certification (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    issuer      VARCHAR(120),
    description TEXT,
    created_at  TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP
);

-- ---------------------------------------------------------------------
-- buyer
-- ---------------------------------------------------------------------
CREATE TABLE buyer (
    id                 BIGSERIAL PRIMARY KEY,
    buyer_type         VARCHAR(30)  NOT NULL,
    name               VARCHAR(120) NOT NULL,
    company_name       VARCHAR(150),
    country            VARCHAR(80),
    phone              VARCHAR(30),
    email              VARCHAR(120),
    preferred_language VARCHAR(20),
    created_at         TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at         TIMESTAMP
);

-- ---------------------------------------------------------------------
-- exporter
-- ---------------------------------------------------------------------
CREATE TABLE exporter (
    id                BIGSERIAL PRIMARY KEY,
    name              VARCHAR(150) NOT NULL,
    company_name      VARCHAR(150),
    registration_code VARCHAR(80),
    contact_name      VARCHAR(120),
    phone             VARCHAR(30),
    email             VARCHAR(120),
    municipality      VARCHAR(80),
    created_at        TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at        TIMESTAMP
);

-- ---------------------------------------------------------------------
-- tourism_operator
-- ---------------------------------------------------------------------
CREATE TABLE tourism_operator (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(150) NOT NULL,
    operator_type VARCHAR(50)  NOT NULL,
    contact_name  VARCHAR(120),
    phone         VARCHAR(30),
    email         VARCHAR(120),
    municipality  VARCHAR(80),
    website       VARCHAR(200),
    created_at    TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP
);

-- ---------------------------------------------------------------------
-- farm (-> producer)
-- ---------------------------------------------------------------------
CREATE TABLE farm (
    id                 BIGSERIAL PRIMARY KEY,
    producer_id        BIGINT       NOT NULL REFERENCES producer (id),
    name               VARCHAR(150) NOT NULL,
    municipality       VARCHAR(80)  NOT NULL,
    corregimiento      VARCHAR(80),
    latitude           NUMERIC(10, 7),
    longitude          NUMERIC(10, 7),
    altitude_meters    INTEGER,
    area_hectares      NUMERIC(10, 2),
    connectivity_level VARCHAR(20),
    notes              TEXT,
    created_at         TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at         TIMESTAMP
);
CREATE INDEX idx_farm_producer_id ON farm (producer_id);

-- ---------------------------------------------------------------------
-- product_lot (-> producer, farm, product)
-- ---------------------------------------------------------------------
CREATE TABLE product_lot (
    id                     BIGSERIAL PRIMARY KEY,
    lot_code               VARCHAR(50)    NOT NULL UNIQUE,
    producer_id            BIGINT         NOT NULL REFERENCES producer (id),
    farm_id                BIGINT         NOT NULL REFERENCES farm (id),
    product_id             BIGINT         NOT NULL REFERENCES product (id),
    harvest_date           DATE,
    available_quantity     NUMERIC(12, 2) NOT NULL,
    unit_of_measure        VARCHAR(20)    NOT NULL,
    process_type           VARCHAR(50),
    cultivation_conditions TEXT,
    quality_grade          VARCHAR(50),
    status                 VARCHAR(30)    NOT NULL DEFAULT 'AVAILABLE',
    blockchain_reference   VARCHAR(120),
    qr_code_value          VARCHAR(150),
    created_at             TIMESTAMP      NOT NULL DEFAULT now(),
    updated_at             TIMESTAMP
);
CREATE INDEX idx_product_lot_producer_id   ON product_lot (producer_id);
CREATE INDEX idx_product_lot_farm_id       ON product_lot (farm_id);
CREATE INDEX idx_product_lot_product_id    ON product_lot (product_id);
CREATE INDEX idx_product_lot_status        ON product_lot (status);
CREATE INDEX idx_product_lot_qr_code_value ON product_lot (qr_code_value);

-- ---------------------------------------------------------------------
-- lot_certification (-> product_lot, certification)
-- ---------------------------------------------------------------------
CREATE TABLE lot_certification (
    id               BIGSERIAL PRIMARY KEY,
    lot_id           BIGINT NOT NULL REFERENCES product_lot (id),
    certification_id BIGINT NOT NULL REFERENCES certification (id),
    certificate_code VARCHAR(80),
    valid_from       DATE,
    valid_to         DATE,
    status           VARCHAR(30) NOT NULL DEFAULT 'PENDING_VALIDATION',
    evidence_url     TEXT,
    validation_notes TEXT,
    validated_by     BIGINT,
    validated_at     TIMESTAMP,
    created_at       TIMESTAMP NOT NULL DEFAULT now(),
    updated_at       TIMESTAMP
);
CREATE INDEX idx_lot_certification_lot_id           ON lot_certification (lot_id);
CREATE INDEX idx_lot_certification_certification_id ON lot_certification (certification_id);

-- ---------------------------------------------------------------------
-- trace_event (-> product_lot). No updated_at by design.
-- ---------------------------------------------------------------------
CREATE TABLE trace_event (
    id              BIGSERIAL PRIMARY KEY,
    lot_id          BIGINT       NOT NULL REFERENCES product_lot (id),
    event_type      VARCHAR(50)  NOT NULL,
    event_timestamp TIMESTAMP    NOT NULL,
    actor_type      VARCHAR(30)  NOT NULL,
    actor_id        BIGINT,
    title           VARCHAR(150) NOT NULL,
    description     TEXT,
    latitude        NUMERIC(10, 7),
    longitude       NUMERIC(10, 7),
    metric_name     VARCHAR(80),
    metric_value    VARCHAR(80),
    metric_unit     VARCHAR(20),
    hash_value      VARCHAR(128),
    previous_hash   VARCHAR(128),
    created_at      TIMESTAMP    NOT NULL DEFAULT now()
);
CREATE INDEX idx_trace_event_lot_id ON trace_event (lot_id);

-- ---------------------------------------------------------------------
-- tourism_experience (-> tourism_operator)
-- ---------------------------------------------------------------------
CREATE TABLE tourism_experience (
    id            BIGSERIAL PRIMARY KEY,
    operator_id   BIGINT       NOT NULL REFERENCES tourism_operator (id),
    title         VARCHAR(150) NOT NULL,
    location_name VARCHAR(150),
    description   TEXT,
    qr_slug       VARCHAR(120) UNIQUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP
);
CREATE INDEX idx_tourism_experience_operator_id ON tourism_experience (operator_id);

-- ---------------------------------------------------------------------
-- experience_lot (-> tourism_experience, product_lot)
-- ---------------------------------------------------------------------
CREATE TABLE experience_lot (
    id               BIGSERIAL PRIMARY KEY,
    experience_id    BIGINT  NOT NULL REFERENCES tourism_experience (id),
    lot_id           BIGINT  NOT NULL REFERENCES product_lot (id),
    display_priority INTEGER DEFAULT 1,
    notes            TEXT,
    created_at       TIMESTAMP NOT NULL DEFAULT now(),
    updated_at       TIMESTAMP
);
CREATE INDEX idx_experience_lot_experience_id ON experience_lot (experience_id);
CREATE INDEX idx_experience_lot_lot_id        ON experience_lot (lot_id);

-- ---------------------------------------------------------------------
-- purchase_lead (-> product_lot, buyer)
-- ---------------------------------------------------------------------
CREATE TABLE purchase_lead (
    id                  BIGSERIAL PRIMARY KEY,
    lot_id              BIGINT         NOT NULL REFERENCES product_lot (id),
    buyer_id            BIGINT         NOT NULL REFERENCES buyer (id),
    source_type         VARCHAR(30)    NOT NULL,
    source_reference    VARCHAR(120),
    requested_quantity  NUMERIC(12, 2),
    unit_of_measure     VARCHAR(20),
    destination_country VARCHAR(80),
    message             TEXT,
    lead_status         VARCHAR(30)    NOT NULL DEFAULT 'NEW',
    created_at          TIMESTAMP      NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP
);
CREATE INDEX idx_purchase_lead_lot_id      ON purchase_lead (lot_id);
CREATE INDEX idx_purchase_lead_buyer_id    ON purchase_lead (buyer_id);
CREATE INDEX idx_purchase_lead_lead_status ON purchase_lead (lead_status);

-- ---------------------------------------------------------------------
-- export_review (-> purchase_lead, exporter)
-- ---------------------------------------------------------------------
CREATE TABLE export_review (
    id                      BIGSERIAL PRIMARY KEY,
    lead_id                 BIGINT      NOT NULL REFERENCES purchase_lead (id),
    exporter_id             BIGINT      NOT NULL REFERENCES exporter (id),
    review_status           VARCHAR(30) NOT NULL,
    notes                   TEXT,
    estimated_delivery_date DATE,
    incoterm                VARCHAR(20),
    created_at              TIMESTAMP   NOT NULL DEFAULT now(),
    updated_at              TIMESTAMP
);
CREATE INDEX idx_export_review_lead_id     ON export_review (lead_id);
CREATE INDEX idx_export_review_exporter_id ON export_review (exporter_id);

-- ---------------------------------------------------------------------
-- certification_application (-> producer, farm, product_lot, certification)
-- Solicitud de certificación con payload JSON para regenerar el PDF.
-- ---------------------------------------------------------------------
CREATE TABLE certification_application (
    id                BIGSERIAL PRIMARY KEY,
    application_code  VARCHAR(40)  NOT NULL UNIQUE,
    producer_id       BIGINT       NOT NULL REFERENCES producer (id),
    farm_id           BIGINT       NOT NULL REFERENCES farm (id),
    lot_id            BIGINT       NOT NULL REFERENCES product_lot (id),
    certification_id  BIGINT       NOT NULL REFERENCES certification (id),
    status            VARCHAR(30)  NOT NULL DEFAULT 'DRAFT',
    payload_json      TEXT         NOT NULL,
    pdf_path          VARCHAR(255),
    destination_email VARCHAR(120),
    recommended_by_ai BOOLEAN,
    review_notes      TEXT,
    reviewed_by       BIGINT,
    created_at        TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at        TIMESTAMP
);
CREATE INDEX idx_certification_application_producer_id      ON certification_application (producer_id);
CREATE INDEX idx_certification_application_lot_id           ON certification_application (lot_id);
CREATE INDEX idx_certification_application_certification_id ON certification_application (certification_id);
CREATE INDEX idx_certification_application_status           ON certification_application (status);
