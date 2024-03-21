-- reset the internal sequence Postgres sequence to avoid unique constraint violation on INSERT

SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max(id)+1, 1), false) FROM "User";
SELECT setval(pg_get_serial_sequence('"Ride"', 'id'), coalesce(max(id)+1, 1), false) FROM "Ride";
SELECT setval(pg_get_serial_sequence('"Driver"', 'id'), coalesce(max(id)+1, 1), false) FROM "Driver";
