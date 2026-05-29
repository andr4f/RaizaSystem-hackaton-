-- =====================================================================
-- V2: update schema
-- =====================================================================

-- ---------------------------------------------------------------------
-- app_user: add onboarding_completed
-- ---------------------------------------------------------------------
ALTER TABLE app_user
    ADD COLUMN onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE;

-- ---------------------------------------------------------------------
-- lot_certification depends on certification — drop first
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS lot_certification;
DROP TABLE IF EXISTS certification;

-- ---------------------------------------------------------------------
-- certifications (new structure)
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
-- lot_certification (updated structure)
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
