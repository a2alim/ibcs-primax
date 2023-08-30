INSERT INTO assign_permission_to_role (id, is_active, permission_id, role_id) VALUES
(1, true, 1, 1),
(2, true, 2, 1),
(3, true, 3, 1),
(4, true, 4, 1),
(5, true, 5, 1),
(6, true, 6, 1),
(7, true, 7, 1),
(8, true, 8, 1),
(9, true, 9, 1)
ON CONFLICT DO NOTHING;