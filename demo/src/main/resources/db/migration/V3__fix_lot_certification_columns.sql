ALTER TABLE lot_certification ADD COLUMN IF NOT EXISTS validation_notes TEXT;
ALTER TABLE lot_certification ADD COLUMN IF NOT EXISTS validated_by BIGINT;
ALTER TABLE lot_certification ADD COLUMN IF NOT EXISTS validated_at TIMESTAMP;
ALTER TABLE lot_certification ALTER COLUMN status SET NOT NULL;
ALTER TABLE lot_certification ALTER COLUMN status SET DEFAULT 'PENDING_VALIDATION';
