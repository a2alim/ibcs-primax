INSERT INTO api_endpoints (id, api_type, type, name, url, permission_id, sub_module_id) VALUES
(1, 'PRIVATE', 'POST', 'Create-User', 1, 1, 4),
(2, 'PRIVATE', 'GET', 'Get-All-users', 1, 2, 4),
(3, 'PRIVATE', 'POST', 'Create-Role', 3, 3, 2),
(4, 'PRIVATE', 'GET', 'Get-Role-List', 4, 4, 2),
(5, 'PRIVATE', 'POST', 'Create-Api', 11, 5, 3),
(6, 'PRIVATE', 'GET', 'GET-API-List', 12, 6, 3),
(7, 'PRIVATE', 'GET', 'Get-All-Permissions', 5, 7, 5),
(8, 'PRIVATE', 'GET', 'Get-Project-Concept-List', 20, 8, 1),
(9, 'PRIVATE', 'GET', 'Get-All-Menus', 23, 6, 3),
(10, 'PRIVATE', 'GET', 'Create-Menus/Action', 22, 9, 3)
ON CONFLICT DO NOTHING;


