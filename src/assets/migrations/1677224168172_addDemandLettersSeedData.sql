INSERT INTO demand_letters (name, app_ref, internal_ref, date_opened, status, online_ref, created_by, updated_by) 
VALUES 
  ('Demand Letter 1', 'ABC123', 'INT456', '2022-01-15', 'Active', 'XYZ789', 'Jane Doe', 'Jane Doe'),
  ('Demand Letter 1', 'DEF456', 'INT789', '2022-02-10', 'In-progress', 'LMN123', 'John Smith', 'John Smith');


INSERT INTO demand_letter_details (demand_letter_id, name, detail, online_ref, created_by, updated_by) 
VALUES 
  (1, 'Demand Letter 1 Details', 'Total fee due is $1000', 'https://www.example.com/payments', 'Jane Doe', 'Jane Doe'),
  (2, 'Demand Letter 2 Details', 'Payment can be made online or at our office', 'https://www.example.com/payments', 'John Smith', 'John Smith');


INSERT INTO demand_letter_workorders (demand_letter_id, workorder_id, online_ref, created_by, updated_by) 
VALUES 
  (1, 1, 'https://www.example.com/workorders/1001', 'Jane Doe', 'Jane Doe'),
  (2, 2, 'https://www.example.com/workorders/1002', 'John Smith', 'John Smith');
