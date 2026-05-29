-- ====================================================================
-- Semilla única de desarrollo para Raíza.
-- Crea datos de referencia + un productor de demo con lotes, leads,
-- certificación y eventos de trazabilidad, para ver el dashboard completo.
--
-- Requiere el esquema ya creado por Flyway (V1__init_schema.sql).
-- Ejecutar sobre una BD ya migrada (copiar al contenedor preserva el UTF-8;
-- el pipe por stdin en PowerShell corrompe las tildes):
--   docker cp demo/dev-seed.sql magdalena_trace_db:/tmp/seed.sql
--   docker exec magdalena_trace_db psql -U postgres -d magdalena_trace_db -f /tmp/seed.sql
--
-- Login resultante:  productor@raiza.co  /  password
-- ====================================================================
BEGIN;

-- ── Municipios del Magdalena (catálogo del onboarding) ──────────────
INSERT INTO municipality (name, department, subregion, dane_code) VALUES
('Santa Marta','Magdalena','Norte','47001'),
('Ciénaga','Magdalena','Norte','47189'),
('Pueblo Viejo','Magdalena','Norte','47570'),
('Zona Bananera','Magdalena','Norte','47980'),
('Aracataca','Magdalena','Río y Norte','47053'),
('Fundación','Magdalena','Río y Norte','47288'),
('El Retén','Magdalena','Río y Norte','47268'),
('Plato','Magdalena','Centro','47555'),
('Pivijay','Magdalena','Río','47551'),
('El Banco','Magdalena','Sur','47245')
ON CONFLICT (name, department) DO NOTHING;

-- ── Productos destacados ────────────────────────────────────────────
INSERT INTO product (id, name, category, unit_of_measure, description, featured) VALUES
(1, 'Café Arábica', 'CAFE',   'kg', 'Café de la Sierra Nevada', true),
(2, 'Cacao Fino',   'CACAO',  'kg', 'Cacao fino de aroma',      true),
(3, 'Banano Hartón','BANANO', 'kg', 'Banano de la Zona Bananera', true);

-- ── Productor de demo ───────────────────────────────────────────────
INSERT INTO producer (id, name, document_type, document_number, producer_type,
                      phone, email, municipality, department, community_name,
                      main_product, certification_awareness)
VALUES (1, 'Juan Pérez', 'CC', '123456789', 'INDIVIDUAL',
        '3001234567', 'productor@raiza.co', 'Santa Marta', 'Magdalena', 'Vereda El Mirador',
        'cafe', 'HAS');

-- ── Usuario de login (bcrypt real de "password", generado por el encoder de la app) ──
INSERT INTO app_user (id, name, email, password, role, active, onboarding_completed, profile_id, profile_type)
VALUES (1, 'Juan Pérez', 'productor@raiza.co',
        '$2a$10$FZJN2GPrrI.BD01MrDHy/uLe.4la4O/stY720d93.W4wenM76nsqe',
        'PRODUCER', true, true, 1, 'PRODUCER');

-- ── Finca ───────────────────────────────────────────────────────────
INSERT INTO farm (id, producer_id, name, municipality, corregimiento,
                  latitude, longitude, altitude_meters, area_hectares, connectivity_level)
VALUES (1, 1, 'Finca La Esperanza', 'Santa Marta', 'Minca',
        11.1445, -74.1202, 1200, 12.0, 'MEDIUM');

-- ── Lotes ───────────────────────────────────────────────────────────
INSERT INTO product_lot (id, lot_code, producer_id, farm_id, product_id, harvest_date,
                         available_quantity, unit_of_measure, process_type, cultivation_conditions,
                         quality_grade, status, qr_code_value)
VALUES
 (1, 'LOT-CAFE-001', 1, 1, 1, '2026-05-12', 1200, 'kg', 'WASHED',  'Sombra, 1200 msnm', 'A', 'AVAILABLE',             'qr-cafe-001'),
 (2, 'LOT-CAFE-002', 1, 1, 1, '2026-05-05', 800,  'kg', 'NATURAL', 'Sombra, 1100 msnm', 'B', 'CERTIFICATION_PENDING', 'qr-cafe-002'),
 (3, 'LOT-CACAO-001',1, 1, 2, '2026-04-28', 450,  'kg', 'FERMENTED','Plena exposición', 'A', 'RESERVED',              'qr-cacao-001');

-- ── Certificación de la finca + adjunta a un lote ───────────────────
INSERT INTO certifications (id, farm_id, certifier, name, certificate_number,
                            issued_at, expires_at, status, registered_at, registered_by)
VALUES (1, 1, 'FAIRTRADE', 'Fairtrade Café', 'FT-2026-001',
        '2026-01-15', '2027-01-15', 'ACTIVE', now(), 'seed');

INSERT INTO lot_certification (id, lot_id, certification_id, certificate_code,
                               valid_from, valid_to, status)
VALUES (1, 1, 1, 'FT-LOT-001', '2026-01-15', '2027-01-15', 'VALIDATED');

-- ── Solicitud de certificación (para la sección Certificaciones) ────
INSERT INTO certification_application (id, application_code, producer_id, farm_id, lot_id,
                                       certification_id, status, payload_json, recommended_by_ai)
VALUES (1, 'CERT-APP-001', 1, 1, 2, 1, 'SUBMITTED', '{}', true);

-- ── Compradores ─────────────────────────────────────────────────────
INSERT INTO buyer (id, buyer_type, name, company_name, country, email, preferred_language) VALUES
 (1, 'IMPORTER', 'Nordic Coffee Co.', 'Nordic Coffee Co.', 'Suecia',   'buyer@nordic.se', 'en'),
 (2, 'TOURIST',  'María López',        NULL,                'Colombia', 'maria@mail.co',   'es');

-- ── Leads / oportunidades ───────────────────────────────────────────
INSERT INTO purchase_lead (id, lot_id, buyer_id, source_type, source_reference,
                           requested_quantity, unit_of_measure, destination_country, message, lead_status)
VALUES
 (1, 1, 1, 'DIRECT',    'feria-2026',  500, 'kg', 'Suecia',   'Interesados en compra recurrente de café lavado.', 'NEW'),
 (2, 3, 2, 'PUBLIC_QR', 'qr-cacao-001', 20, 'kg', 'Colombia', 'Escaneé el QR en la finca, quiero comprar.',        'CONTACTED');

-- ── Eventos de trazabilidad del lote 1 ──────────────────────────────
INSERT INTO trace_event (lot_id, event_type, event_timestamp, actor_type, actor_id,
                         title, description, latitude, longitude, metric_name, metric_value, metric_unit)
VALUES
 (1, 'LOT_CREATED',       '2026-05-12T08:00:00', 'PRODUCER', 1, 'Lote registrado',  'Se registró el lote de café pergamino seco', 11.1445, -74.1202, NULL, NULL, NULL),
 (1, 'HARVEST_COMPLETED', '2026-05-13T10:30:00', 'PRODUCER', 1, 'Cosecha finalizada','Recolección completada en Finca La Esperanza', 11.1445, -74.1202, 'humidity', '63', '%'),
 (1, 'QR_SCANNED',        '2026-05-20T16:05:00', 'BUYER',    NULL, 'QR escaneado',   'Un comprador escaneó el QR del lote',         NULL, NULL, NULL, NULL, NULL);

-- ── Alinear secuencias con los IDs explícitos ───────────────────────
SELECT setval('product_id_seq',                    (SELECT MAX(id) FROM product));
SELECT setval('producer_id_seq',                   (SELECT MAX(id) FROM producer));
SELECT setval('app_user_id_seq',                   (SELECT MAX(id) FROM app_user));
SELECT setval('farm_id_seq',                       (SELECT MAX(id) FROM farm));
SELECT setval('product_lot_id_seq',                (SELECT MAX(id) FROM product_lot));
SELECT setval('certifications_id_seq',             (SELECT MAX(id) FROM certifications));
SELECT setval('lot_certification_id_seq',          (SELECT MAX(id) FROM lot_certification));
SELECT setval('certification_application_id_seq',  (SELECT MAX(id) FROM certification_application));
SELECT setval('buyer_id_seq',                      (SELECT MAX(id) FROM buyer));
SELECT setval('purchase_lead_id_seq',              (SELECT MAX(id) FROM purchase_lead));

COMMIT;
