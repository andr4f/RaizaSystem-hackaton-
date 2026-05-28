ALTER TABLE lot_certification ADD COLUMN validation_notes TEXT;
ALTER TABLE lot_certification ADD COLUMN validated_by BIGINT;
ALTER TABLE lot_certification ADD COLUMN validated_at TIMESTAMP;
ALTER TABLE lot_certification ALTER COLUMN status SET NOT NULL;
ALTER TABLE lot_certification ALTER COLUMN status SET DEFAULT 'PENDING_VALIDATION';
