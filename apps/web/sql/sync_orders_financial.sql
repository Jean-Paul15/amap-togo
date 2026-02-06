-- Migration: Sync Orders with Financial Management
-- Adds bidirectional linking between commandes and financial_records tables

-- Add column to commandes table to reference financial record
ALTER TABLE commandes 
ADD COLUMN IF NOT EXISTS financial_record_id UUID REFERENCES financial_records(id) ON DELETE SET NULL;

-- Add column to financial_records table to reference order
ALTER TABLE financial_records
ADD COLUMN IF NOT EXISTS commande_id UUID REFERENCES commandes(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_commandes_financial_record 
ON commandes(financial_record_id);

CREATE INDEX IF NOT EXISTS idx_financial_records_commande 
ON financial_records(commande_id);

-- Add unique constraint to prevent duplicate syncs
-- One order can only have one financial record
CREATE UNIQUE INDEX IF NOT EXISTS idx_commandes_financial_unique 
ON commandes(financial_record_id) 
WHERE financial_record_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON COLUMN commandes.financial_record_id IS 'Reference to the financial record created when order is confirmed';
COMMENT ON COLUMN financial_records.commande_id IS 'Reference to the order that generated this financial record';

-- Grant permissions (adjust based on your RLS policies)
-- Authenticated users should be able to read these columns
-- Only admins should be able to modify them

COMMENT ON TABLE commandes IS 'Orders table with financial sync capability';
COMMENT ON TABLE financial_records IS 'Financial operations table with order tracking';
