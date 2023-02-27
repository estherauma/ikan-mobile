INSERT INTO workorder_clauses (name, workorder_id, created_at, updated_at, created_by, updated_by)
VALUES
  ('Clause 1', 1, '2023-02-23 14:00:00', '2023-02-23 14:00:00', 'John Doe', 'John Doe'),
  ('Clause 2', 2, '2023-02-23 15:00:00', '2023-02-23 15:00:00', 'Jane Smith', 'Jane Smith');


INSERT INTO workorder_clauses_details (workorder_clause_id, display_order, key, value, created_by, updated_by, created_at, updated_at)
VALUES
  (1, 1, 'key1', 'Clause Detail 1', 'John Doe', 'John Doe', '2023-02-23 14:00:00', '2023-02-23 14:00:00'),
  (2, 2, 'key2', 'Clause Detail 2', 'Jane Smith', 'Jane Smith', '2023-02-23 14:00:00', '2023-02-23 14:00:00');