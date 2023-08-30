INSERT INTO role (id, is_role_delete, role_description, role_name, priority) VALUES
(1, false, 'All read and write access of all modules.', 'SUPER_ADMIN', 1)
ON CONFLICT DO NOTHING;