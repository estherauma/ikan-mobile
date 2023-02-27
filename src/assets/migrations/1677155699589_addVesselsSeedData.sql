INSERT INTO vessels (reg_no, name, type, status, capacity, online_ref, commissioning_date, created_at, updated_at, created_by, updated_by) 
VALUES 
  ('ABC123', 'Sea Voyager', 'Cargo Ship', 'Active Duty', '500 tons', 'https://example.com/sea-voyager', '2022-01-01', '2022-02-23 13:00:00', '2022-02-23 13:00:00', 'Alice', 'Alice'),
  ('DEF456', 'Air Cruiser', 'Passenger Plane', 'Decommissioned', '150 passengers', 'https://example.com/air-cruiser', '2022-02-15', '2022-02-23 14:00:00', '2022-02-23 14:00:00', 'Bob', 'Bob');


INSERT INTO vessel_images (vessel_id, image_url, description, online_ref, created_at, updated_at, created_by, updated_by) 
VALUES 
  (1, 'https://picsum.photos/500/300', 'Front view of the vessel', 'https://example.com/vessel-image-1', '2022-02-23 13:00:00', '2022-02-23 13:00:00', 'Alice', 'Alice'),
  (2, 'https://picsum.photos/600/400', 'Aerial view of the vessel', 'https://example.com/vessel-image-2', '2022-02-23 14:00:00', '2022-02-23 14:00:00', 'Bob', 'Bob');
