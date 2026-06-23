-- Enable trigram extension for efficient ILIKE search on 200k+ rows
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS products (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT           NOT NULL,
  category   TEXT           NOT NULL,
  price      NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  created_at TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- Primary covering index: category filter + cursor pagination
CREATE INDEX IF NOT EXISTS idx_products_covering
  ON products (category, updated_at DESC, id DESC)
  INCLUDE (name, price);

-- Fallback covering index: no category filter
CREATE INDEX IF NOT EXISTS idx_products_no_category
  ON products (updated_at DESC, id DESC)
  INCLUDE (name, price, category);

-- Trigram GIN index for ILIKE search
CREATE INDEX IF NOT EXISTS idx_products_name_trgm
  ON products USING gin(name gin_trgm_ops);
