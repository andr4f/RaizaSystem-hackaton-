-- =====================================================================
-- V5 — Trazabilidad pública demo (lote café Minca / qr-demo-cafe-minca)
-- Timeline completo + bio del productor para la página /trace/{slug}
-- =====================================================================

ALTER TABLE producer ADD COLUMN IF NOT EXISTS bio TEXT;

UPDATE producer SET bio =
  'Dedicado a cultivar café bajo sombra, protegiendo las fuentes de agua locales y promoviendo prácticas que nutren la tierra.'
WHERE id = 1;

UPDATE product SET
  name = 'Café Tabi Variedad Colombia',
  description = 'Este café nace en las montañas de la Sierra Nevada de Santa Marta, cultivado con prácticas sostenibles y respeto por la naturaleza. Cada grano cuenta la historia de familias productoras dedicadas a preservar la biodiversidad mientras entregan una calidad excepcional.'
WHERE id = 1;

UPDATE product_lot SET
  quality_grade = 'Tabi',
  cultivation_conditions = 'Cultivo bajo sombra, secado solar, altura 1450 msnm'
WHERE id = 1;

-- Reemplazar timeline del lote 1 con etapas visibles en la página pública
DELETE FROM trace_event WHERE lot_id = 1;

INSERT INTO trace_event (id, lot_id, event_type, event_timestamp, actor_type, actor_id, title, description, latitude, longitude, metric_name, metric_value, metric_unit, hash_value, previous_hash, created_at)
VALUES
(101, 1, 'LOT_CREATED',             '2023-11-12T08:00:00', 'PRODUCER', 1, 'Siembra',    'Finca El Mirador — Minca. Selección de semillas y preparación del terreno.', 11.1445, -74.1202, NULL, NULL, NULL,     'pt01a1b2', 'GENESIS',  NOW()),
(102, 1, 'HARVEST_COMPLETED',       '2024-02-20T10:30:00', 'PRODUCER', 1, 'Cosecha',    'Manual y selectiva. Cosecha selectiva de granos maduros.',                   11.1445, -74.1202, NULL, NULL, NULL,     'pt02c3d4', 'pt01a1b2', NOW()),
(103, 1, 'QUALITY_CHECKED',         '2024-02-21T14:00:00', 'PRODUCER', 1, 'Beneficio',  'Proceso lavado. Fermentación y lavado del grano.',                           11.1445, -74.1202, NULL, NULL, NULL,     'pt03e5f6', 'pt02c3d4', NOW()),
(104, 1, 'CULTIVATION_UPDATED',     '2024-02-25T09:00:00', 'PRODUCER', 1, 'Secado',     'Secado solar. Secado en camas elevadas.',                                    11.1445, -74.1202, NULL, NULL, NULL,     'pt04g7h8', 'pt03e5f6', NOW()),
(105, 1, 'CERTIFICATION_VALIDATED', '2024-03-05T11:00:00', 'PRODUCER', 1, 'Empaque',    'Empacado y sellado. Empacado en origen para mantener calidad.',              11.1445, -74.1202, NULL, NULL, NULL,     'pt05i9j0', 'pt04g7h8', NOW());

ALTER SEQUENCE trace_event_id_seq RESTART WITH 200;
