-- =====================================================================
-- V2: Migrate certification catalog to full traceability structure
-- =====================================================================

-- Drop in dependency order
DROP TABLE IF EXISTS certification_application;
DROP TABLE IF EXISTS lot_certification;
DROP TABLE IF EXISTS certification;

-- ---------------------------------------------------------------------
-- certifications (new structure — replaces old certification catalog)
-- ---------------------------------------------------------------------
CREATE TABLE certifications (
    id                 BIGSERIAL    PRIMARY KEY,
    farm_id            BIGINT       NOT NULL REFERENCES farm (id),
    certifier          VARCHAR(50)  NOT NULL,
    name               VARCHAR(150) NOT NULL,
    certificate_number VARCHAR(100) NOT NULL,
    issued_at          DATE         NOT NULL,
    expires_at         DATE,
    verification_url   VARCHAR(500),
    document_path      VARCHAR(500),
    status             VARCHAR(20)  NOT NULL,
    registered_at      TIMESTAMP    NOT NULL,
    registered_by      VARCHAR(100) NOT NULL,
    created_at         TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at         TIMESTAMP
);
CREATE INDEX idx_certifications_farm_id ON certifications (farm_id);

-- ---------------------------------------------------------------------
-- lot_certification (referencing new certifications table)
-- ---------------------------------------------------------------------
CREATE TABLE lot_certification (
    id               BIGSERIAL   PRIMARY KEY,
    lot_id           BIGINT      NOT NULL REFERENCES product_lot (id),
    certification_id BIGINT      NOT NULL REFERENCES certifications (id),
    certificate_code VARCHAR(80),
    valid_from       DATE,
    valid_to         DATE,
    status           VARCHAR(30) NOT NULL DEFAULT 'PENDING_VALIDATION',
    evidence_url     TEXT,
    validation_notes TEXT,
    validated_by     BIGINT,
    validated_at     TIMESTAMP,
    created_at       TIMESTAMP   NOT NULL DEFAULT now(),
    updated_at       TIMESTAMP
);
CREATE INDEX idx_lot_certification_lot_id           ON lot_certification (lot_id);
CREATE INDEX idx_lot_certification_certification_id ON lot_certification (certification_id);

-- ---------------------------------------------------------------------
-- certification_application (referencing new certifications table)
-- ---------------------------------------------------------------------
CREATE TABLE certification_application (
    id                BIGSERIAL    PRIMARY KEY,
    application_code  VARCHAR(40)  NOT NULL UNIQUE,
    producer_id       BIGINT       NOT NULL REFERENCES producer (id),
    farm_id           BIGINT       NOT NULL REFERENCES farm (id),
    lot_id            BIGINT       NOT NULL REFERENCES product_lot (id),
    certification_id  BIGINT       NOT NULL REFERENCES certifications (id),
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
CREATE INDEX idx_cert_app_producer_id      ON certification_application (producer_id);
CREATE INDEX idx_cert_app_lot_id           ON certification_application (lot_id);
CREATE INDEX idx_cert_app_certification_id ON certification_application (certification_id);
CREATE INDEX idx_cert_app_status           ON certification_application (status);
