-- Seed data for repository integration tests
-- Use explicit IDs so that FK references remain valid even after transaction rollbacks (sequences don't roll back).

-- Products  (featured: café/banano/cacao destacados)
INSERT INTO product (id, name, category, unit_of_measure, description, featured, created_at, updated_at)
VALUES (1, 'Café Pergamino Seco', 'Café', 'kg', 'Café pergamino seco de altura', true, NOW(), NOW()),
       (2, 'Banano de Exportación', 'Banano', 'cajas', 'Banano tipo exportación', true, NOW(), NOW()),
       (3, 'Cacao Seco', 'Cacao', 'kg', 'Cacao seco fermentado', true, NOW(), NOW());

-- Producer
INSERT INTO producer (id, name, document_type, document_number, producer_type, phone, email, municipality, department, community_name, created_at, updated_at)
VALUES (1, 'Asociación de Caficultores de Minca', 'NIT', '900123456-7', 'ASOCIACION', '3001234567', 'contacto@cafeminca.co', 'Minca', 'Magdalena', 'Asociación de productores de Minca', NOW(), NOW());

-- Farm
INSERT INTO farm (id, producer_id, name, municipality, corregimiento, latitude, longitude, altitude_meters, area_hectares, connectivity_level, notes, created_at, updated_at)
VALUES (1, 1, 'Finca El Mirador', 'Minca', 'La Tagua', 11.1445, -74.1202, 1450, 5.50, 'media', 'Finca principal con cultivo de café bajo sombra', NOW(), NOW());

-- Certifications  (modelo nuevo: certificación específica emitida a una finca)
INSERT INTO certifications (id, farm_id, certifier, name, certificate_number, issued_at, expires_at, status, registered_at, registered_by, created_at, updated_at)
VALUES (1, 1, 'FAIRTRADE', 'Fairtrade', 'FT-2026-001', '2026-01-01', '2027-01-01', 'ACTIVE', NOW(), 'system', NOW(), NOW()),
       (2, 1, 'RAINFOREST_ALLIANCE', 'Rainforest Alliance', 'RA-2026-001', '2026-01-01', '2027-01-01', 'ACTIVE', NOW(), 'system', NOW(), NOW());

-- Product Lot
INSERT INTO product_lot (id, lot_code, producer_id, farm_id, product_id, harvest_date, available_quantity, unit_of_measure, process_type, cultivation_conditions, quality_grade, status, qr_code_value, created_at, updated_at)
VALUES (1, 'CAF-MINCA-001', 1, 1, 1, '2026-05-15', 250.00, 'kg', 'lavado', 'Cultivo bajo sombra, secado solar, altura 1450 msnm', 'EXPORT', 'AVAILABLE', 'qr-caf-minca-001', NOW(), NOW());

-- Lot Certification  (status usa CertificationValidationStatus)
INSERT INTO lot_certification (id, lot_id, certification_id, certificate_code, valid_from, valid_to, status, created_at, updated_at)
VALUES (1, 1, 1, 'FT-2026-001', '2026-01-01', '2027-01-01', 'VALIDATED', NOW(), NOW()),
       (2, 1, 2, 'RA-2026-001', '2026-01-01', '2027-01-01', 'VALIDATED', NOW(), NOW());

-- Certification Application  (solicitud histórica aprobada del lote 1)
INSERT INTO certification_application (id, application_code, producer_id, farm_id, lot_id, certification_id, status, payload_json, recommended_by_ai, review_notes, reviewed_by, created_at, updated_at)
VALUES (1, 'CERT-APP-001', 1, 1, 1, 1, 'APPROVED', '{"certifier":"FAIRTRADE","lotCode":"CAF-MINCA-001"}', true, 'Documentación verificada', 1, NOW(), NOW());

-- Trace Events
INSERT INTO trace_event (id, lot_id, event_type, event_timestamp, actor_type, actor_id, title, description, latitude, longitude, metric_name, metric_value, metric_unit, hash_value, previous_hash, created_at)
VALUES (1, 1, 'LOT_CREATED', '2026-05-15T08:00:00', 'PRODUCER', 1, 'Lote registrado', 'Se registró el lote de café pergamino seco', 11.1445, -74.1202, NULL, NULL, NULL, 'abc123def', NULL, NOW()),
       (2, 1, 'HARVEST_COMPLETED', '2026-05-20T10:30:00', 'PRODUCER', 1, 'Cosecha finalizada', 'Se completó la recolección del lote en la finca El Mirador', 11.1445, -74.1202, 'humidity', '63', '%', 'def456ghi', 'abc123def', NOW()),
       (3, 1, 'QUALITY_CHECKED', '2026-05-22T14:00:00', 'SYSTEM', NULL, 'Control de calidad aprobado', 'El lote superó el control de calidad para exportación', 11.1445, -74.1202, 'quality_score', '88', 'points', 'ghi789jkl', 'def456ghi', NOW());

-- Tourism Operator
INSERT INTO tourism_operator (id, name, operator_type, contact_name, phone, email, municipality, website, created_at, updated_at)
VALUES (1, 'EcoTur Minca', 'OPERADOR_LOCAL', 'Carlos Pérez', '3007654321', 'info@ecoturminca.co', 'Minca', 'https://ecoturminca.co', NOW(), NOW());

-- Tourism Experience
INSERT INTO tourism_experience (id, operator_id, title, location_name, description, qr_slug, created_at, updated_at)
VALUES (1, 1, 'Cata de Café en Minca', 'Finca El Mirador - Minca', 'Experiencia de cata de café orgánico con visita a la finca', 'cata-cafe-minca', NOW(), NOW());

-- Experience Lot
INSERT INTO experience_lot (id, experience_id, lot_id, display_priority, notes, created_at, updated_at)
VALUES (1, 1, 1, 1, 'Lote principal para la experiencia de cata', NOW(), NOW());

-- Buyer
INSERT INTO buyer (id, buyer_type, name, company_name, country, phone, email, preferred_language, created_at, updated_at)
VALUES (1, 'IMPORTER', 'Laura Jensen', 'Nordic Green Coffee', 'Denmark', '+45-00000000', 'laura@nordicgreen.dk', 'en', NOW(), NOW());

-- Purchase Lead
INSERT INTO purchase_lead (id, lot_id, buyer_id, source_type, source_reference, requested_quantity, unit_of_measure, destination_country, message, lead_status, created_at, updated_at)
VALUES (1, 1, 1, 'QR_SCAN', 'qr-caf-minca-001', 50.00, 'kg', 'Denmark', 'Interesada en muestra y condiciones de exportación', 'NEW', NOW(), NOW());

-- Exporter
INSERT INTO exporter (id, name, company_name, registration_code, contact_name, phone, email, municipality, created_at, updated_at)
VALUES (1, 'Exportadores del Magdalena', 'ExportMagdalena SAS', 'EXP-001', 'María Rodríguez', '3011112233', 'maria@exportmagdalena.co', 'Santa Marta', NOW(), NOW());

-- Export Review
INSERT INTO export_review (id, lead_id, exporter_id, review_status, notes, incoterm, created_at, updated_at)
VALUES (1, 1, 1, 'PENDING_REVIEW', 'Revisar disponibilidad y documentación del lote', 'FOB', NOW(), NOW());

-- App User  (onboarding_completed es NOT NULL)
INSERT INTO app_user (id, name, email, password, role, active, onboarding_completed, created_at, updated_at)
VALUES (1, 'Admin Magdalena', 'admin@magdalena.co', '$2a$10$dummy_hash_for_testing', 'ADMIN', true, true, NOW(), NOW());

-- Push sequences past explicit IDs so entity saves don't conflict
ALTER SEQUENCE product_id_seq RESTART WITH 100;
ALTER SEQUENCE certifications_id_seq RESTART WITH 100;
ALTER SEQUENCE producer_id_seq RESTART WITH 100;
ALTER SEQUENCE farm_id_seq RESTART WITH 100;
ALTER SEQUENCE product_lot_id_seq RESTART WITH 100;
ALTER SEQUENCE lot_certification_id_seq RESTART WITH 100;
ALTER SEQUENCE certification_application_id_seq RESTART WITH 100;
ALTER SEQUENCE trace_event_id_seq RESTART WITH 100;
ALTER SEQUENCE tourism_operator_id_seq RESTART WITH 100;
ALTER SEQUENCE tourism_experience_id_seq RESTART WITH 100;
ALTER SEQUENCE experience_lot_id_seq RESTART WITH 100;
ALTER SEQUENCE buyer_id_seq RESTART WITH 100;
ALTER SEQUENCE purchase_lead_id_seq RESTART WITH 100;
ALTER SEQUENCE exporter_id_seq RESTART WITH 100;
ALTER SEQUENCE export_review_id_seq RESTART WITH 100;
ALTER SEQUENCE app_user_id_seq RESTART WITH 100;
