CREATE INDEX IF NOT EXISTS note_search_idx
ON "Note"
USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '')));
