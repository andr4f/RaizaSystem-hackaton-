-- =====================================================================
-- V3 — Datos de demo para visualizar el flujo completo en la app
-- Escenario Magdalena: 3 productores (café, banano, cacao), lotes en
-- distintos estados, certificaciones, solicitudes, leads, revisión
-- exportadora y experiencia turística con QR.
--
-- Todos los usuarios tienen la contraseña: demo123
-- =====================================================================

-- ---------------------------------------------------------------------
-- Productos (destacados para el onboarding)
-- ---------------------------------------------------------------------
INSERT INTO product (id, name, category, unit_of_measure, description, featured, created_at, updated_at)
VALUES (1, 'Café Pergamino Seco', 'Café',   'kg',    'Café de altura de la Sierra Nevada de Santa Marta', true, NOW(), NOW()),
       (2, 'Banano de Exportación', 'Banano', 'cajas', 'Banano tipo exportación de la Zona Bananera',       true, NOW(), NOW()),
       (3, 'Cacao Seco',            'Cacao',  'kg',    'Cacao fino de aroma fermentado',                    true, NOW(), NOW());

-- ---------------------------------------------------------------------
-- Productores (3 municipios / productos distintos)
-- ---------------------------------------------------------------------
INSERT INTO producer (id, name, document_type, document_number, producer_type, phone, email, municipality, department, community_name, main_product, certification_awareness, created_at, updated_at)
VALUES (1, 'Asociación de Caficultores de Minca', 'NIT', '900123456-7', 'ASOCIACION', '3001234567', 'productor@magdalena.co',  'Minca',         'Magdalena', 'Vereda La Tagua',     'Café',   'HAS', NOW(), NOW()),
       (2, 'Cooperativa Bananera del Magdalena',  'NIT', '900234567-8', 'COOPERATIVA','3002345678', 'banano@magdalena.co',     'Zona Bananera', 'Magdalena', 'Vereda La Unión',     'Banano', 'HAS', NOW(), NOW()),
       (3, 'Cacaocultores de Fundación',          'NIT', '900345678-9', 'ASOCIACION', '3003456789', 'cacao@magdalena.co',      'Fundación',     'Magdalena', 'Vereda El Cacao',     'Cacao',  'UNKNOWN', NOW(), NOW());

-- ---------------------------------------------------------------------
-- Fincas
-- ---------------------------------------------------------------------
INSERT INTO farm (id, producer_id, name, municipality, corregimiento, latitude, longitude, altitude_meters, area_hectares, connectivity_level, notes, created_at, updated_at)
VALUES (1, 1, 'Finca El Mirador',      'Minca',         'La Tagua',  11.1445, -74.1202, 1450,  5.50, 'media',  'Cultivo de café bajo sombra',              NOW(), NOW()),
       (2, 2, 'Finca La Palmera',      'Zona Bananera', 'La Unión',  10.8234, -74.1523,   45, 12.00, 'alta',   'Plantación de banano para exportación',    NOW(), NOW()),
       (3, 3, 'Finca Cacao Dorado',    'Fundación',     'El Cacao',  10.5201, -74.1856,  120,  8.00, 'baja',   'Cacao fino de aroma con fermentación controlada', NOW(), NOW());

-- ---------------------------------------------------------------------
-- Certificaciones de finca (modelo por finca)
-- ---------------------------------------------------------------------
INSERT INTO certifications (id, farm_id, certifier, name, certificate_number, issued_at, expires_at, verification_url, document_path, status, registered_at, registered_by, created_at, updated_at)
VALUES (1, 1, 'FAIRTRADE',           'Fairtrade',           'FT-2026-001', '2026-01-01', '2027-01-01', NULL, NULL, 'ACTIVE', NOW(), 'admin@magdalena.co', NOW(), NOW()),
       (2, 1, 'RAINFOREST_ALLIANCE', 'Rainforest Alliance',   'RA-2026-001', '2026-01-01', '2027-01-01', NULL, NULL, 'ACTIVE', NOW(), 'admin@magdalena.co', NOW(), NOW()),
       (3, 2, 'UTZ',                   'UTZ Certified',       'UTZ-2026-001', '2026-01-15', '2027-01-15', NULL, NULL, 'ACTIVE', NOW(), 'admin@magdalena.co', NOW(), NOW()),
       (4, 3, 'FAIRTRADE',             'Fairtrade Cacao',     'FT-2026-002', '2026-02-01', '2027-02-01', NULL, NULL, 'ACTIVE', NOW(), 'admin@magdalena.co', NOW(), NOW());

-- ---------------------------------------------------------------------
-- Lotes de producto (distintos estados del ciclo de vida)
-- ---------------------------------------------------------------------
INSERT INTO product_lot (id, lot_code, producer_id, farm_id, product_id, harvest_date, available_quantity, unit_of_measure, process_type, cultivation_conditions, quality_grade, status, qr_code_value, created_at, updated_at)
VALUES
-- Lote 1: café exportable (AVAILABLE)
(1, 'CAF-MINCA-2026-DEMO01', 1, 1, 1, '2026-05-15', 250.00, 'kg',    'lavado',      'Cultivo bajo sombra, secado solar, altura 1450 msnm', 'EXPORT', 'AVAILABLE',             'qr-demo-cafe-minca',  NOW(), NOW()),
-- Lote 2: café pendiente de certificación (CERTIFICATION_PENDING)
(2, 'CAF-MINCA-2026-DEMO02', 1, 1, 1, '2026-05-20', 180.00, 'kg',    'natural',     'Proceso natural, secado en camas africanas',          'SPECIALTY', 'CERTIFICATION_PENDING', 'qr-demo-cafe-minca-02', NOW(), NOW()),
-- Lote 3: banano exportable (AVAILABLE)
(3, 'BAN-ZBAN-2026-DEMO01',  2, 2, 2, '2026-05-10', 500.00, 'cajas', 'convencional','Cultivo certificado UTZ',                             'EXPORT', 'AVAILABLE',             'qr-demo-banano-zb',   NOW(), NOW()),
-- Lote 4: cacao reservado por lead turístico (RESERVED)
(4, 'CAC-FUND-2026-DEMO01',  3, 3, 3, '2026-04-28', 450.00, 'kg',    'fermentado',  'Fermentación 6 días, secado solar',                   'FINE',   'RESERVED',              'qr-demo-cacao-fund',  NOW(), NOW()),
-- Lote 5: banano en revisión exportadora (IN_EXPORT_REVIEW)
(5, 'BAN-ZBAN-2026-DEMO02',  2, 2, 2, '2026-05-18', 300.00, 'cajas', 'convencional','Segunda cosecha de la temporada',                     'EXPORT', 'IN_EXPORT_REVIEW',      'qr-demo-banano-zb-02', NOW(), NOW());

-- Certificaciones de lote
INSERT INTO lot_certification (id, lot_id, certification_id, certificate_code, valid_from, valid_to, status, evidence_url, validation_notes, validated_by, validated_at, created_at, updated_at)
VALUES
-- Lote 1: certificaciones validadas → exportable
(1, 1, 1, 'FT-2026-001', '2026-01-01', '2027-01-01', 'VALIDATED',           NULL, 'Documentación verificada', 1, NOW(), NOW(), NOW()),
(2, 1, 2, 'RA-2026-001', '2026-01-01', '2027-01-01', 'VALIDATED',           NULL, 'Documentación verificada', 1, NOW(), NOW()),
-- Lote 2: certificación pendiente de validación
(3, 2, 1, 'FT-2026-003', '2026-05-01', '2027-05-01', 'PENDING_VALIDATION',  NULL, NULL,                       NULL, NULL,  NOW(), NOW()),
-- Lote 3: banano con UTZ validado
(4, 3, 3, 'UTZ-2026-001', '2026-01-15', '2027-01-15', 'VALIDATED',          NULL, 'Inspección aprobada',       1, NOW(), NOW(), NOW()),
-- Lote 4: cacao con certificación condicional
(5, 4, 4, 'FT-2026-002', '2026-02-01', '2027-02-01', 'CONDITIONALLY_VALID', NULL, 'Aprobación provisional IA', 1, NOW(), NOW(), NOW()),
-- Lote 5: banano en revisión exportadora
(6, 5, 3, 'UTZ-2026-002', '2026-01-15', '2027-01-15', 'VALIDATED',          NULL, 'Documentación verificada',  1, NOW(), NOW(), NOW());

-- ---------------------------------------------------------------------
-- Solicitudes de certificación (certification_application)
-- ---------------------------------------------------------------------
INSERT INTO certification_application (id, application_code, producer_id, farm_id, lot_id, certification_id, status, payload_json, pdf_path, destination_email, recommended_by_ai, review_notes, reviewed_by, created_at, updated_at)
VALUES
-- Borrador sin enviar (productor café)
(1, 'CERT-APP-2026-001', 1, 1, 2, 1, 'DRAFT',
 '{"certifier":"FAIRTRADE","lotCode":"CAF-MINCA-2026-DEMO02","farmName":"Finca El Mirador","product":"Café Pergamino Seco"}',
 NULL, 'productor@magdalena.co', NULL, NULL, NULL, NOW(), NOW()),
-- Enviada y en revisión (productor cacao)
(2, 'CERT-APP-2026-002', 3, 3, 4, 4, 'SUBMITTED',
 '{"certifier":"FAIRTRADE","lotCode":"CAC-FUND-2026-DEMO01","farmName":"Finca Cacao Dorado","product":"Cacao Seco","harvestDate":"2026-04-28"}',
 NULL, 'cacao@magdalena.co', true, NULL, NULL, NOW(), NOW()),
-- Aprobada por admin (referencia histórica del lote 1)
(3, 'CERT-APP-2026-003', 1, 1, 1, 1, 'APPROVED',
 '{"certifier":"FAIRTRADE","lotCode":"CAF-MINCA-2026-DEMO01","farmName":"Finca El Mirador","product":"Café Pergamino Seco"}',
 NULL, 'productor@magdalena.co', true, 'Documentación completa y verificada', 1, NOW(), NOW());

-- ---------------------------------------------------------------------
-- Eventos de trazabilidad (cadena de hash encadenada)
-- ---------------------------------------------------------------------
INSERT INTO trace_event (id, lot_id, event_type, event_timestamp, actor_type, actor_id, title, description, latitude, longitude, metric_name, metric_value, metric_unit, hash_value, previous_hash, created_at)
VALUES
-- Lote 1 — café exportable
(1,  1, 'LOT_CREATED',             '2026-05-15T08:00:00', 'PRODUCER', 1, 'Lote registrado',            'Se registró el lote de café pergamino seco',                  11.1445, -74.1202, NULL,            NULL,  NULL,     'a1b2c3d4', 'GENESIS',  NOW()),
(2,  1, 'HARVEST_COMPLETED',       '2026-05-20T10:30:00', 'PRODUCER', 1, 'Cosecha finalizada',         'Se completó la recolección en la finca El Mirador',           11.1445, -74.1202, 'humidity',      '63',  '%',      'e5f6g7h8', 'a1b2c3d4', NOW()),
(3,  1, 'QUALITY_CHECKED',         '2026-05-22T14:00:00', 'SYSTEM',   NULL, 'Control de calidad',       'El lote superó el control de calidad para exportación',       11.1445, -74.1202, 'quality_score', '88',  'points', 'i9j0k1l2', 'e5f6g7h8', NOW()),
(4,  1, 'CERTIFICATION_VALIDATED', '2026-05-23T09:00:00', 'ADMIN',    1, 'Certificación validada',     'Fairtrade y Rainforest Alliance validadas — lote exportable', 11.1445, -74.1202, NULL,            NULL,  NULL,     'm3n4o5p6', 'i9j0k1l2', NOW()),
(5,  1, 'QR_SCANNED',              '2026-05-25T16:05:00', 'BUYER',    1, 'QR escaneado',               'Comprador internacional escaneó el QR del lote',              NULL,    NULL,     NULL,            NULL,  NULL,     'q7r8s9t0', 'm3n4o5p6', NOW()),
(6,  1, 'PURCHASE_INTENT_CREATED', '2026-05-25T16:06:00', 'BUYER',    1, 'Intención de compra',        'Lead registrado desde escaneo de QR',                          NULL,    NULL,     NULL,            NULL,  NULL,     'u1v2w3x4', 'q7r8s9t0', NOW()),
-- Lote 2 — certificación pendiente
(7,  2, 'LOT_CREATED',             '2026-05-20T09:00:00', 'PRODUCER', 1, 'Lote registrado',            'Nuevo lote de café natural registrado',                       11.1445, -74.1202, NULL,            NULL,  NULL,     'y5z6a7b8', 'GENESIS',  NOW()),
(8,  2, 'CERTIFICATION_SUBMITTED', '2026-05-21T11:00:00', 'PRODUCER', 1, 'Certificación solicitada',   'Solicitud Fairtrade en borrador',                             11.1445, -74.1202, NULL,            NULL,  NULL,     'c9d0e1f2', 'y5z6a7b8', NOW()),
-- Lote 3 — banano
(9,  3, 'LOT_CREATED',             '2026-05-10T07:30:00', 'PRODUCER', 2, 'Lote registrado',            'Lote de banano de exportación registrado',                    10.8234, -74.1523, NULL,            NULL,  NULL,     'g3h4i5j6', 'GENESIS',  NOW()),
(10, 3, 'CERTIFICATION_VALIDATED', '2026-05-12T10:00:00', 'ADMIN',    1, 'UTZ validado',               'Certificación UTZ aprobada',                                    10.8234, -74.1523, NULL,            NULL,  NULL,     'k7l8m9n0', 'g3h4i5j6', NOW()),
-- Lote 4 — cacao reservado
(11, 4, 'LOT_CREATED',             '2026-04-28T08:00:00', 'PRODUCER', 3, 'Lote registrado',            'Lote de cacao fino de aroma registrado',                       10.5201, -74.1856, NULL,            NULL,  NULL,     'o1p2q3r4', 'GENESIS',  NOW()),
(12, 4, 'QR_SCANNED',              '2026-05-01T14:20:00', 'BUYER',    2, 'QR escaneado en finca',      'Turista escaneó el QR durante visita agroecoturística',       10.5201, -74.1856, NULL,            NULL,  NULL,     's5t6u7v8', 'o1p2q3r4', NOW()),
(13, 4, 'LOT_RESERVED',            '2026-05-02T09:00:00', 'BUYER',    2, 'Lote reservado',             'Reserva confirmada por comprador turista',                     10.5201, -74.1856, 'quantity',      '20',  'kg',     'w9x0y1z2', 's5t6u7v8', NOW()),
-- Lote 5 — en revisión exportadora
(14, 5, 'LOT_CREATED',             '2026-05-18T07:00:00', 'PRODUCER', 2, 'Lote registrado',            'Segunda cosecha de banano registrada',                        10.8234, -74.1523, NULL,            NULL,  NULL,     'a3b4c5d6', 'GENESIS',  NOW()),
(15, 5, 'EXPORT_REVIEWED',         '2026-05-28T10:00:00', 'EXPORTER', 1, 'Revisión exportadora',       'Exportador inició revisión del lote para mercado europeo',    10.8234, -74.1523, NULL,            NULL,  NULL,     'e7f8g9h0', 'a3b4c5d6', NOW());

-- ---------------------------------------------------------------------
-- Operadores turísticos + experiencias con QR
-- ---------------------------------------------------------------------
INSERT INTO tourism_operator (id, name, operator_type, contact_name, phone, email, municipality, website, experience_types, works_with_local_producers, monthly_visitors_range, created_at, updated_at)
VALUES (1, 'EcoTur Minca',              'OPERADOR_LOCAL',  'Carlos Pérez',  '3007654321', 'operador@magdalena.co',  'Minca',         'https://ecoturminca.co',      'TOUR_FINCA,CATA',              'YES', '50-200',  NOW(), NOW()),
       (2, 'Magdalena AgroExperiencias','OPERADOR_REGIONAL','Ana García',   '3008765432', 'agroexp@magdalena.co',   'Fundación',     'https://magdalenaagro.co',    'TOUR_FINCA,DEGUSTACION',       'YES', '20-100',  NOW(), NOW());

INSERT INTO tourism_experience (id, operator_id, title, location_name, description, qr_slug, created_at, updated_at)
VALUES (1, 1, 'Cata de Café en Minca',        'Finca El Mirador - Minca',     'Visita a la finca con cata de café orgánico de altura',              'cata-cafe-minca',   NOW(), NOW()),
       (2, 2, 'Ruta del Cacao en Fundación',  'Finca Cacao Dorado',           'Recorrido por la finca cacaotera con degustación de chocolate artesanal', 'ruta-cacao-fundacion', NOW(), NOW());

INSERT INTO experience_lot (id, experience_id, lot_id, display_priority, notes, created_at, updated_at)
VALUES (1, 1, 1, 1, 'Lote principal de la experiencia de cata',       NOW(), NOW()),
       (2, 1, 2, 2, 'Lote de café natural para cata comparativa',    NOW(), NOW()),
       (3, 2, 4, 1, 'Lote de cacao vinculado a la ruta turística',   NOW(), NOW());

-- ---------------------------------------------------------------------
-- Compradores + leads (intenciones de compra)
-- ---------------------------------------------------------------------
INSERT INTO buyer (id, buyer_type, name, company_name, country, phone, email, preferred_language, created_at, updated_at)
VALUES (1, 'IMPORTER',   'Laura Jensen',  'Nordic Green Coffee', 'Denmark',  '+45-00000000', 'comprador@magdalena.co', 'en', NOW(), NOW()),
       (2, 'TOURIST',    'María López',   NULL,                  'Colombia', '+57-3009998877','turista@magdalena.co',  'es', NOW(), NOW()),
       (3, 'ROASTER',    'James Miller',  'Brooklyn Roasters',   'USA',      '+1-555-0100',  'roaster@magdalena.co',  'en', NOW(), NOW());

INSERT INTO purchase_lead (id, lot_id, buyer_id, source_type, source_reference, requested_quantity, unit_of_measure, destination_country, message, lead_status, created_at, updated_at)
VALUES
-- Lead 1: comprador internacional interesado en café (NEW → revisión exportadora)
(1, 1, 1, 'QR_SCAN',  'qr-demo-cafe-minca',  50.00,  'kg',    'Denmark',  'Interesada en muestra y condiciones de exportación',              'NEW',              NOW(), NOW()),
-- Lead 2: turista reservó cacao (CONTACTED)
(2, 4, 2, 'PUBLIC_QR','qr-demo-cacao-fund',  20.00,  'kg',    'Colombia', 'Escaneé el QR en la finca durante la ruta del cacao',             'CONTACTED',        NOW(), NOW()),
-- Lead 3: tostador interesado en banano (IN_EXPORT_REVIEW)
(3, 5, 3, 'DIRECT',   'feria-2026-bogota',  200.00,  'cajas', 'USA',      'Busco proveedor estable de banano certificado para cadena de distribución', 'IN_EXPORT_REVIEW', NOW(), NOW());

-- ---------------------------------------------------------------------
-- Exportador + revisiones de exportación
-- ---------------------------------------------------------------------
INSERT INTO exporter (id, name, company_name, registration_code, contact_name, phone, email, municipality, markets, handled_products, monthly_volume_range, created_at, updated_at)
VALUES (1, 'Exportadora del Caribe', 'Caribe Export SAS', 'EXP-001', 'María Rodríguez', '3011112233', 'exportador@magdalena.co', 'Santa Marta', 'EUROPA,ESTADOS_UNIDOS', 'CAFE,BANANO,CACAO', '10-50', NOW(), NOW());

INSERT INTO export_review (id, lead_id, exporter_id, review_status, notes, estimated_delivery_date, incoterm, created_at, updated_at)
VALUES
-- Revisión pendiente del lead de café
(1, 1, 1, 'PENDING_REVIEW',  'Revisar disponibilidad, certificaciones Fairtrade y documentación fitosanitaria', '2026-07-15', 'FOB', NOW(), NOW()),
-- Revisión en curso del lead de banano
(2, 3, 1, 'UNDER_REVIEW',    'Verificando volumen mensual y calendario de cosechas para mercado USA',           '2026-08-01', 'CIF', NOW(), NOW());

-- ---------------------------------------------------------------------
-- Usuarios de login (contraseña: demo123)  profile_id enlaza a su entidad
-- ---------------------------------------------------------------------
INSERT INTO app_user (id, name, email, password, role, active, onboarding_completed, profile_id, profile_type, created_at, updated_at)
VALUES (1,  'Admin Magdalena',       'admin@magdalena.co',       '$2a$10$Gpf9ND0qVdYQm02an5LdKuNSkoqM1wy78XP/bi9aRHxGaNdjgAWbW', 'ADMIN',            true, true, NULL, NULL,               NOW(), NOW()),
       (2,  'Carlos Mendoza',        'productor@magdalena.co',   '$2a$10$Gpf9ND0qVdYQm02an5LdKuNSkoqM1wy78XP/bi9aRHxGaNdjgAWbW', 'PRODUCER',         true, true, 1,    'PRODUCER',         NOW(), NOW()),
       (3,  'EcoTur Minca',          'operador@magdalena.co',    '$2a$10$Gpf9ND0qVdYQm02an5LdKuNSkoqM1wy78XP/bi9aRHxGaNdjgAWbW', 'TOURISM_OPERATOR', true, true, 1,    'TOURISM_OPERATOR', NOW(), NOW()),
       (4,  'Exportadora Caribe',    'exportador@magdalena.co',  '$2a$10$Gpf9ND0qVdYQm02an5LdKuNSkoqM1wy78XP/bi9aRHxGaNdjgAWbW', 'EXPORTER',         true, true, 1,    'EXPORTER',         NOW(), NOW()),
       (5,  'Laura Jensen',          'comprador@magdalena.co',   '$2a$10$Gpf9ND0qVdYQm02an5LdKuNSkoqM1wy78XP/bi9aRHxGaNdjgAWbW', 'BUYER',            true, true, 1,    'BUYER',            NOW(), NOW()),
       (6,  'Cooperativa Bananera',  'banano@magdalena.co',      '$2a$10$Gpf9ND0qVdYQm02an5LdKuNSkoqM1wy78XP/bi9aRHxGaNdjgAWbW', 'PRODUCER',         true, true, 2,    'PRODUCER',         NOW(), NOW()),
       (7,  'Cacaocultores Fundación','cacao@magdalena.co',      '$2a$10$Gpf9ND0qVdYQm02an5LdKuNSkoqM1wy78XP/bi9aRHxGaNdjgAWbW', 'PRODUCER',         true, true, 3,    'PRODUCER',         NOW(), NOW()),
       (8,  'María López',           'turista@magdalena.co',     '$2a$10$Gpf9ND0qVdYQm02an5LdKuNSkoqM1wy78XP/bi9aRHxGaNdjgAWbW', 'BUYER',            true, true, 2,    'BUYER',            NOW(), NOW()),
       (9,  'Magdalena AgroExp',     'agroexp@magdalena.co',     '$2a$10$Gpf9ND0qVdYQm02an5LdKuNSkoqM1wy78XP/bi9aRHxGaNdjgAWbW', 'TOURISM_OPERATOR', true, true, 2,    'TOURISM_OPERATOR', NOW(), NOW());

-- ---------------------------------------------------------------------
-- Avanzar las secuencias para que los inserts de la app no choquen
-- ---------------------------------------------------------------------
ALTER SEQUENCE product_id_seq                    RESTART WITH 100;
ALTER SEQUENCE producer_id_seq                   RESTART WITH 100;
ALTER SEQUENCE farm_id_seq                       RESTART WITH 100;
ALTER SEQUENCE certifications_id_seq             RESTART WITH 100;
ALTER SEQUENCE product_lot_id_seq                RESTART WITH 100;
ALTER SEQUENCE lot_certification_id_seq          RESTART WITH 100;
ALTER SEQUENCE certification_application_id_seq  RESTART WITH 100;
ALTER SEQUENCE trace_event_id_seq                RESTART WITH 100;
ALTER SEQUENCE tourism_operator_id_seq           RESTART WITH 100;
ALTER SEQUENCE tourism_experience_id_seq         RESTART WITH 100;
ALTER SEQUENCE experience_lot_id_seq             RESTART WITH 100;
ALTER SEQUENCE buyer_id_seq                      RESTART WITH 100;
ALTER SEQUENCE purchase_lead_id_seq              RESTART WITH 100;
ALTER SEQUENCE exporter_id_seq                   RESTART WITH 100;
ALTER SEQUENCE export_review_id_seq              RESTART WITH 100;
ALTER SEQUENCE app_user_id_seq                   RESTART WITH 100;
