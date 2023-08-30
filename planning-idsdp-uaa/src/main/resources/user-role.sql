INSERT INTO assign_user_to_role (id, role_id, user_id)
VALUES (1, 1, 1) ON CONFLICT DO NOTHING;
