INSERT INTO navigations (id, icon, title, type, api_endpoints_id, parent_id, menu_id, link, orders) VALUES
(1, 'heroicons_outline:home', 'Common Service', 'group', NULL, NULL, 'dashboards', NULL, NULL),
(2, 'heroicons_outline:cog', 'Access Control', 'collapsable', NULL, 1, 'navigation-features.level.0', NULL, 1),
(3, 'heroicons_outline:check-circle', 'Role List', 'basic', 4, 2, NULL, '/access-control/role-management', 1),
(4, 'heroicons_outline:user', 'User Management', 'collapsable', NULL, 1, NULL, NULL, 3),
(5, 'heroicons_outline:menu', 'Api Management', 'collapsable', NULL, 1, NULL, NULL, 2),
(6, 'heroicons_outline:check-circle', 'Api List', 'basic', 6, 5, NULL, '/api-management/api-list', 1),
(7, 'heroicons_outline:check-circle', 'Permission List', 'basic', 7, 5, NULL, '/api-management/permission-list', 2),
(8, 'heroicons_outline:check-circle', 'Menu Manage', 'basic', 9, 5, NULL, '/menu-management/menu-list', 3),
(9, 'heroicons_outline:mail', 'Notification Management', 'collapsable', NULL, 1, NULL, NULL, 4),
(10, 'heroicons_outline:check-circle', 'Notification Type', 'basic', 9, 9, NULL, '/notification-management', 1),
(11, 'heroicons_outline:check-circle', 'User List', 'basic', 2, 4, NULL, '/user-management/user-list', 1),
(12, 'heroicons_outline:home', 'PPS', 'group', NULL, NULL, NULL, NULL, NULL),
(13, 'heroicons_outline:check-circle', 'Menu/Action Create', 'basic', 10, 5, NULL, '/menu-management/menu-create', 3)
ON CONFLICT DO NOTHING;

