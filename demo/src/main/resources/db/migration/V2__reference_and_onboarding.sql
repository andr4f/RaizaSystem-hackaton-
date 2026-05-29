-- =====================================================================
-- V2 — Datos de referencia (municipios) + respuestas del onboarding
-- =====================================================================

-- ---------------------------------------------------------------------
-- municipality — catálogo de municipios (seed: 30 del Magdalena)
-- ---------------------------------------------------------------------
CREATE TABLE municipality (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(120) NOT NULL,
    department VARCHAR(80)  NOT NULL,
    subregion  VARCHAR(80),
    dane_code  VARCHAR(10),
    UNIQUE (name, department)
);
CREATE INDEX idx_municipality_department ON municipality (department);
CREATE INDEX idx_municipality_name       ON municipality (name);

-- 30 municipios del departamento del Magdalena (código DANE oficial)
INSERT INTO municipality (name, department, subregion, dane_code) VALUES
-- Subregión Norte (Área Metropolitana)
('Santa Marta',                  'Magdalena', 'Norte',        '47001'),
('Ciénaga',                      'Magdalena', 'Norte',        '47189'),
('Pueblo Viejo',                 'Magdalena', 'Norte',        '47570'),
('Zona Bananera',                'Magdalena', 'Norte',        '47980'),
-- Subregión Río y Norte
('Algarrobo',                    'Magdalena', 'Río y Norte',  '47030'),
('Aracataca',                    'Magdalena', 'Río y Norte',  '47053'),
('El Retén',                     'Magdalena', 'Río y Norte',  '47268'),
('Fundación',                    'Magdalena', 'Río y Norte',  '47288'),
-- Subregión Centro
('Ariguaní',                     'Magdalena', 'Centro',       '47058'),
('Chibolo',                      'Magdalena', 'Centro',       '47170'),
('Nueva Granada',                'Magdalena', 'Centro',       '47460'),
('Plato',                        'Magdalena', 'Centro',       '47555'),
('Sabanas de San Ángel',         'Magdalena', 'Centro',       '47660'),
('Tenerife',                     'Magdalena', 'Centro',       '47798'),
-- Subregión Río
('Cerro de San Antonio',         'Magdalena', 'Río',          '47161'),
('Concordia',                    'Magdalena', 'Río',          '47205'),
('El Piñón',                     'Magdalena', 'Río',          '47258'),
('Pedraza',                      'Magdalena', 'Río',          '47541'),
('Pivijay',                      'Magdalena', 'Río',          '47551'),
('Remolino',                     'Magdalena', 'Río',          '47605'),
('Salamina',                     'Magdalena', 'Río',          '47675'),
('Sitionuevo',                   'Magdalena', 'Río',          '47745'),
('Zapayán',                      'Magdalena', 'Río',          '47960'),
-- Subregión Sur
('El Banco',                     'Magdalena', 'Sur',          '47245'),
('Guamal',                       'Magdalena', 'Sur',          '47318'),
('Pijiño del Carmen',            'Magdalena', 'Sur',          '47545'),
('Santa Bárbara de Pinto',       'Magdalena', 'Sur',          '47720'),
('San Sebastián de Buenavista',  'Magdalena', 'Sur',          '47692'),
('San Zenón',                    'Magdalena', 'Sur',          '47703'),
('Santa Ana',                    'Magdalena', 'Sur',          '47707');

-- ---------------------------------------------------------------------
-- product — destacado para el onboarding
-- ---------------------------------------------------------------------
ALTER TABLE product ADD COLUMN featured BOOLEAN NOT NULL DEFAULT FALSE;

-- ---------------------------------------------------------------------
-- producer — respuestas del onboarding
-- ---------------------------------------------------------------------
ALTER TABLE producer ADD COLUMN main_product            VARCHAR(50);
ALTER TABLE producer ADD COLUMN certification_awareness VARCHAR(20);

-- ---------------------------------------------------------------------
-- tourism_operator — respuestas del onboarding
-- ---------------------------------------------------------------------
ALTER TABLE tourism_operator ADD COLUMN experience_types           VARCHAR(255);
ALTER TABLE tourism_operator ADD COLUMN works_with_local_producers VARCHAR(20);
ALTER TABLE tourism_operator ADD COLUMN monthly_visitors_range     VARCHAR(40);

-- ---------------------------------------------------------------------
-- exporter — respuestas del onboarding
-- ---------------------------------------------------------------------
ALTER TABLE exporter ADD COLUMN markets              VARCHAR(255);
ALTER TABLE exporter ADD COLUMN handled_products     VARCHAR(255);
ALTER TABLE exporter ADD COLUMN monthly_volume_range VARCHAR(40);
