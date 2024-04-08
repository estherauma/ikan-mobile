DROP TABLE  workorder_clauses_details;

ALTER TABLE workorder_clauses ADD explainer_text TEXT;
ALTER TABLE workorder_clauses ADD display_order INTEGER;
ALTER TABLE workorder_clauses ADD condition_title VARCHAR(255);
ALTER TABLE workorder_clauses ADD condition_details TEXT;
