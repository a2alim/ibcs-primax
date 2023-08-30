--Component
INSERT INTO component (id, name) VALUES
(1, 'PPS'),
(2, 'NPM'),
(3, 'GIS'),
(4, 'SSRC'),
(5, 'Common Service')
ON CONFLICT
DO NOTHING;


--Module
INSERT INTO module (id, name, component_id) VALUES
(1, 'Project Concept', 1),
(2, 'Access Control', 5),
(3, 'User Management', 5),
(4, 'Api Management', 5),
(5, 'Dpp-Tapp Module', 1),
(6, 'Feasibility Study', 1),
(7,'Query Management Module',1),
(8,'PPS-Configuration Module',1),
(9,'Dashboard',1),
(10,'Rdpp Rtapp Module',1),
(11,'Project Management Module',1),
(20,'Information & Proposal System', 4),
(21,'Rms-Settings', 4),
(22,'GED', 4),
(23,'Research Process Management', 4),
(24,'Reports', 4),
(25,'Proposal Setup', 4),
(26,'Agreement Process', 4),
(27,'Classroom', 4),
(28,'Others', 4)
ON CONFLICT
DO NOTHING;


--SubModule
INSERT INTO sub_module (id, name, module_id) VALUES
(1, 'Project Concept List', 1),
(2, 'Role Management', 2),
(3, 'Api-List', 4),
(4, 'User Account Management', 3),
(5, 'Permission List', 4),
(6, 'Menu-Manage', 4),
(7, 'DPP/TAPP Management', 5),
(8, 'Feasibility Study Management', 6),
(9,'Query List',7),
(10,'PPS Configurations',8),
(11,'Agency Dashboard',9),
(12,'RDPP/RTAPP Management',10),
(30,'Researcher List',20),
(31,'Profile Submission',20),
(32,'Sectors Sub-Sector Selection',20),
(33,'Agreement Information',20),
(34,'Linkup Proposal With Evaluators',20),
(35,'Evaluator Grant Amount List',20),
(36,'Award / Agreement Letter',20),
(37,'Fiscal Year',21),
(38,'Fiscal Budget Amount',21),
(39,'Template Type',21),
(40,'Predefined Template',21),
(41,'Installment Type',21),
(42,'Installment Pay Rules',21),
(43,'Expenditure Item',21),
(44,'Research Category Type',21),
(45,'Category Wise Grant Amount',21),
(46,'Category Wise Desk Officer',21),
(47,'Profile Marks Setup',21),
(48,'Sector Type',21),
(49,'Sub Sector',21),
(50,'Committee Type',21),
(50,'Committee Setup',21),
(51,'Expert Evaluator',21),
(52,'Common Type',21),
(53,'User Serialization',21),
(54,'Create Letter For GED',22),
(55,'Save GED Feedback Answer',22),
(56,'Researcher Presentation', 23),
(57,'Researcher Proposal Information',23),
(58,'Profile & Proposal Report',24),
(59,'Installment Report',24),
(60,'Agreement Report',24),
(61,'researcher-profile-list',20),
(64, 'Project Management List', 11),
(65, 'Trainers List', 25),
(66, 'Course Schedule', 25),
(67, 'Budget', 25),
(68, 'Proposal List', 25),
(69, 'Participant List', 26),
(70, 'Guarantors Agreement', 26),
(71, 'Agreement Letter', 26),
(72, 'Participants Attendance', 27),
(73, 'Participants Login', 27),
(74, 'Speaker Evaluation', 27),
(75, 'Progress/Verification Report', 28),
(76, 'Nominate Institutes', 28),
(77, 'Partial & Final Payment', 28),
(78, 'Check Collection Info', 28),
(79, 'Seminar List', 23),
(80, 'Installment Process', 23),
(81, 'Feedback List', 23),
(82, 'Award Letter', 28),
(83, 'Completion Report', 28)
ON CONFLICT
DO NOTHING;
