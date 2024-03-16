-- reset the internal sequence Postgres sequence to avoid unique constraint violation on INSERT

SELECT setval(pg_get_serial_sequence('"Users"', 'id'), coalesce(max(id)+1, 1), false) FROM "Users";
SELECT setval(pg_get_serial_sequence('"Collections"', 'id'), coalesce(max(id)+1, 1), false) FROM "Collections";
SELECT setval(pg_get_serial_sequence('"Bids"', 'id'), coalesce(max(id)+1, 1), false) FROM "Bids";
