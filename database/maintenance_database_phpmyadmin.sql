-- phpMyAdmin SQL Dump
-- Database: `maintenance_v1_erp`
-- Synchronized by WOSys Sheets Manager
-- Export Date: 2026-09-23 16:48:57

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+08:00";

CREATE DATABASE IF NOT EXISTS `maintenance_v1_erp` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `maintenance_v1_erp`;

-- --------------------------------------------------------
-- Table structure for `app_users`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `app_users`;
CREATE TABLE `app_users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` text DEFAULT NULL,
  `password` text DEFAULT NULL,
  `nama` text DEFAULT NULL,
  `role` text DEFAULT NULL,
  `status` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `email` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `app_users`
INSERT INTO `app_users` (`id`, `username`, `password`, `nama`, `role`, `status`, `created_at`, `updated_at`, `email`) VALUES
(1, 'planner', '$2y$12$CTMzuykez/RdBXab7zwqQuNEKXuI5CqFISfM.Fqt5p1NUhJXcFhdy', 'Andi Herwan', 'PMC', 'ACTIVE', '2026-09-13 08:00:00', '2026-09-13 08:00:00', NULL),
(2, 'admin', '$2y$12$CTMzuykez/RdBXab7zwqQuNEKXuI5CqFISfM.Fqt5p1NUhJXcFhdy', 'Brayen', 'Logistic', 'ACTIVE', '2026-09-13 08:00:00', '2026-09-13 08:00:00', 'admin@wosys.local'),
(3, 'mekanik1', '$2y$12$CTMzuykez/RdBXab7zwqQuNEKXuI5CqFISfM.Fqt5p1NUhJXcFhdy', 'Tim Mekanik KBCT', 'Mekanik', 'ACTIVE', '2026-09-13 08:00:00', '2026-09-13 08:00:00', NULL),
(4, 'mekanik2', '$2y$12$CTMzuykez/RdBXab7zwqQuNEKXuI5CqFISfM.Fqt5p1NUhJXcFhdy', 'Tim Mekanik LMP', 'Mekanik', 'ACTIVE', '2026-09-13 08:00:00', '2026-09-13 08:00:00', NULL),
(5, 'boss', '$2y$12$CTMzuykez/RdBXab7zwqQuNEKXuI5CqFISfM.Fqt5p1NUhJXcFhdy', 'Hariadi', 'GM & Mgr. Maintenance', 'ACTIVE', '2026-09-13 08:00:00', '2026-09-13 08:00:00', NULL),
(6, 'direksi', '$2y$12$CTMzuykez/RdBXab7zwqQuNEKXuI5CqFISfM.Fqt5p1NUhJXcFhdy', 'M. Nur Salam', 'Direksi', 'ACTIVE', '2026-09-13 08:00:00', '2026-09-13 08:00:00', NULL);

-- --------------------------------------------------------
-- Table structure for `backlogs`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `backlogs`;
CREATE TABLE `backlogs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `item_id` text DEFAULT NULL,
  `tanggal` text DEFAULT NULL,
  `equip_no` text DEFAULT NULL,
  `deskripsi_backlog` text DEFAULT NULL,
  `status` text DEFAULT NULL,
  `rencana_eksekusi` text DEFAULT NULL,
  `est_hours` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `no_wo` text DEFAULT NULL,
  `priority` text DEFAULT NULL,
  `closed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `cache`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache` (
  `key` text DEFAULT NULL,
  `value` text DEFAULT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `cache_locks`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks` (
  `key` text DEFAULT NULL,
  `owner` text DEFAULT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `daily_hms`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `daily_hms`;
CREATE TABLE `daily_hms` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `item_id` text DEFAULT NULL,
  `tanggal` text DEFAULT NULL,
  `equip_no` text DEFAULT NULL,
  `hm_awal` double DEFAULT NULL,
  `hm_akhir` double DEFAULT NULL,
  `total_hm` double DEFAULT NULL,
  `timestamp` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `equipment_costs`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `equipment_costs`;
CREATE TABLE `equipment_costs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `item_id` text DEFAULT NULL,
  `transaction_date` text DEFAULT NULL,
  `equip_no` text DEFAULT NULL,
  `category` text DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `reference_no` text DEFAULT NULL,
  `wo_no` text DEFAULT NULL,
  `vendor` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `evidence_url` text DEFAULT NULL,
  `created_by` text DEFAULT NULL,
  `timestamp` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `failed_jobs`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` text DEFAULT NULL,
  `connection` text DEFAULT NULL,
  `queue` text DEFAULT NULL,
  `payload` text DEFAULT NULL,
  `exception` text DEFAULT NULL,
  `failed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `failure_analyses`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `failure_analyses`;
CREATE TABLE `failure_analyses` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `item_id` text DEFAULT NULL,
  `tanggal` text DEFAULT NULL,
  `equip_no` text DEFAULT NULL,
  `component_name` text DEFAULT NULL,
  `chronology` text DEFAULT NULL,
  `five_why_json` text DEFAULT NULL,
  `fishbone_json` text DEFAULT NULL,
  `corrective_action` text DEFAULT NULL,
  `preventive_action` text DEFAULT NULL,
  `status` text DEFAULT NULL,
  `lead_investigator` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `no_wo` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `inspections`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `inspections`;
CREATE TABLE `inspections` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `item_id` text DEFAULT NULL,
  `tanggal` text DEFAULT NULL,
  `equip_no` text DEFAULT NULL,
  `tipe_alat` text DEFAULT NULL,
  `checklist_json` text DEFAULT NULL,
  `inspector` text DEFAULT NULL,
  `timestamp` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `job_batches`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches` (
  `id` text DEFAULT NULL,
  `name` text DEFAULT NULL,
  `total_jobs` bigint(20) NOT NULL,
  `pending_jobs` bigint(20) NOT NULL,
  `failed_jobs` bigint(20) NOT NULL,
  `failed_job_ids` text DEFAULT NULL,
  `options` text DEFAULT NULL,
  `cancelled_at` bigint(20) DEFAULT NULL,
  `created_at` bigint(20) NOT NULL,
  `finished_at` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `jobs`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` text DEFAULT NULL,
  `payload` text DEFAULT NULL,
  `attempts` bigint(20) NOT NULL,
  `reserved_at` bigint(20) DEFAULT NULL,
  `available_at` bigint(20) NOT NULL,
  `created_at` bigint(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `maintenance_weeks`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `maintenance_weeks`;
CREATE TABLE `maintenance_weeks` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `week_no` text DEFAULT NULL,
  `label` text DEFAULT NULL,
  `start_date` text DEFAULT NULL,
  `end_date` text DEFAULT NULL,
  `is_active` bigint(20) NOT NULL,
  `target_compliance` bigint(20) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `master_components`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `master_components`;
CREATE TABLE `master_components` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `major_component` text DEFAULT NULL,
  `minor_component` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `master_components`
INSERT INTO `master_components` (`id`, `major_component`, `minor_component`, `created_at`, `updated_at`) VALUES
(1, 'ENGINE', 'CYLINDER HEAD', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(2, 'ENGINE', 'CYLINDER BLOCK', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(3, 'ENGINE', 'TURBOCHARGER', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(4, 'ENGINE', 'FUEL INJECTION PUMP', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(5, 'ENGINE', 'RADIATOR & COOLING SYSTEM', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(6, 'ENGINE', 'STARTING MOTOR', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(7, 'HYDRAULIC', 'MAIN PUMP', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(8, 'HYDRAULIC', 'CONTROL VALVE', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(9, 'HYDRAULIC', 'BOOM CYLINDER', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(10, 'HYDRAULIC', 'ARM CYLINDER', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(11, 'HYDRAULIC', 'HYDRAULIC HOSE', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(12, 'HYDRAULIC', 'OIL COOLER', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(13, 'ELECTRICAL', 'ALTERNATOR', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(14, 'ELECTRICAL', 'BATTERY & WIRING', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(15, 'ELECTRICAL', 'STARTING SWITCH', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(16, 'ELECTRICAL', 'WORK LAMP & CABIN LIGHT', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(17, 'ELECTRICAL', 'CONTROLLER / ECM', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(18, 'TRANSMISSION & DRIVE', 'TORQUE CONVERTER', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(19, 'TRANSMISSION & DRIVE', 'TRANSMISSION ASSY', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(20, 'TRANSMISSION & DRIVE', 'DIFFERENTIAL', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(21, 'TRANSMISSION & DRIVE', 'PROPELLER SHAFT', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(22, 'TRANSMISSION & DRIVE', 'FINAL DRIVE', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(23, 'UNDERCARRIAGE', 'TRACK LINK & SHOE', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(24, 'UNDERCARRIAGE', 'TRACK ROLLER', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(25, 'UNDERCARRIAGE', 'IDLER', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(26, 'UNDERCARRIAGE', 'SPROCKET', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(27, 'UNDERCARRIAGE', 'TRACK ADJUSTER', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(28, 'BRAKE SYSTEM', 'BRAKE SHOE & PAD', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(29, 'BRAKE SYSTEM', 'BRAKE VALVE', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(30, 'BRAKE SYSTEM', 'AIR COMPRESSOR', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(31, 'ATTACHMENT & BUCKET', 'BUCKET TOOTH', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(32, 'ATTACHMENT & BUCKET', 'BLADE ASSY', '2026-09-13 08:00:00', '2026-09-13 08:00:00');

-- --------------------------------------------------------
-- Table structure for `master_equips`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `master_equips`;
CREATE TABLE `master_equips` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `equip_no` text DEFAULT NULL,
  `brand` text DEFAULT NULL,
  `unit_type` text DEFAULT NULL,
  `warranty_status` text DEFAULT NULL,
  `model` text DEFAULT NULL,
  `serial_no` text DEFAULT NULL,
  `model_engine` text DEFAULT NULL,
  `serial_engine` text DEFAULT NULL,
  `capacity_unit` text DEFAULT NULL,
  `capacity_attachment` text DEFAULT NULL,
  `dimension_unit` text DEFAULT NULL,
  `dimension_attachment` text DEFAULT NULL,
  `rate_power_kw` double DEFAULT NULL,
  `year` double DEFAULT NULL,
  `status` text DEFAULT NULL,
  `location` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `last_hm` double DEFAULT NULL,
  `model_code` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `master_equips`
INSERT INTO `master_equips` (`id`, `equip_no`, `brand`, `unit_type`, `warranty_status`, `model`, `serial_no`, `model_engine`, `serial_engine`, `capacity_unit`, `capacity_attachment`, `dimension_unit`, `dimension_attachment`, `rate_power_kw`, `year`, `status`, `location`, `created_at`, `updated_at`, `last_hm`, `model_code`) VALUES
(1, 'DZ-002', 'ZOOMLION', 'BULLDOZER', 'NON WARRANTY', 'ZOOMLION ZD-320-3', 'ZMTZD062PN0001169', 'CUMMINS NTA855-C360S10', 41326274, '35.044 kg', '11,6 m³', '6.625x4.030x3.725', '4.030x1.705', 257, 2022, 'RFU', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 07:17:22', 8470, 'ZOOMLION_ZD320'),
(2, 'DZ-005', 'SEM', 'BULLDOZER', 'NON WARRANTY', 'SEM 822D', 'SEM00822VS8T00933', 'WEICHAI WD12G240E206', '1122S001731', '24.000 kg', '6,4 m³', '5.845x3.660x3.170', '3.660x1.520', 175, 2022, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 7341.5, 'SEM_822D'),
(3, 'DZ-069', 'ZOOMLION', 'BULLDOZER', 'NON WARRANTY', 'ZOOMLION ZD-220-3', 'ZMTZD030TN0005482', 'CUMMINS NTA855-C280', 41331692, '23.600 kg', '6,4 m³', '5.460x3.725x3.395', '3.725x1.315', 175, 2022, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 6984, 'ZOOMLION_ZD220'),
(4, 'DZ-007', 'CATERPILLAR', 'BULLDOZER', 'NON WARRANTY', 'CAT D8 GC', 'CAT000D8LKGX00408', 'CAT 3406C', 'TXJ02310', '37.000 kg', '0,93 m³', '', '', 130, 2022, 'RFU', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 11877.2, 'CAT_D8GC'),
(5, 'DZ-008', 'CATERPILLAR', 'BULLDOZER', 'NON WARRANTY', 'CAT D8 GC', 'CAT000D8LKGX00452', 'CAT 3406C', 'TXJ02531', '37.000 kg', '0,93 m³', '', '', 130, 2022, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 11751, 'CAT_D8GC'),
(6, 'DZ-010', 'CATERPILLAR', 'BULLDOZER', 'WARRANTY', 'CAT D8 GC', 'CAT000D8HKGX00474', 'CAT 3406C', '', '37.000 kg', '0,93 m³', '', '', 130, 2023, 'READY', 'LMP', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 9307, 'CAT_D8GC'),
(7, 'DZ-012', 'SEM', 'BULLDOZER', 'WARRANTY', 'SEM 822D', 'SEM00822AS8T01064', 'WEICHAI WD12G240E206', '1123D000428', '24.000 kg', '6,4 m³', '5.845x3.660x3.170', '3.660x1.520', 175, 2023, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 7240.5, 'SEM_822D'),
(8, 'EX-201', 'HYUNDAI', 'EXCAVATOR LONG ARM', 'NON WARRANTY', 'HYUNDAY HX220S', 'HHKHK606JE0003070', '6BTAA-5.9', 84962481, '24.390 kg', '0,52 m³', '12.030x3.190x3.280', '', 110, 2022, 'READY', 'LMP', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 4605.5, 'HYUNDAI_HX220S'),
(9, 'EX-205', 'CATERPILLAR', 'EXCAVATOR', 'WARRANTY', 'CAT 320 GX', 'CAT00320JSYW40665', 'CAT C4.4', '2W239272', '20.500 kg', '1,00 m³', '9.580x2.990x3.240', '0,93', 108, 2024, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 4415, 'CAT_320GX'),
(10, 'EX-302', 'SANY', 'EXCAVATOR', 'NON WARRANTY', 'SANY SY330H', 'SY0332CB13708', 'ISUZU 6HK1XKSC-01', 966626, '31.500 kg', '2,0 m³', '10.667x3.190x3.470', '', 212, 2022, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 3959.5, 'SANY_SY330H'),
(11, 'EX-304', 'SANY', 'EXCAVATOR', 'NON WARRANTY', 'SANY SY330H', 'SY0332CB13578', 'ISUZU 6HK1XKSC-01', 966606, '31.500 kg', '2,0 m³', '10.667x3.190x3.470', '', 212, 2022, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 3349, 'SANY_SY330H'),
(12, 'EX-305', 'SANY', 'EXCAVATOR', 'NON WARRANTY', 'SANY SY330H', 'SY0332CB15188', 'ISUZU 6HK1XKSC-01', 968608, '31.500 kg', '2,0 m³', '10.667x3.190x3.470', '', 212, 2022, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 2972, 'SANY_SY330H'),
(13, 'EX-306', 'DOOSAN', 'EXCAVATOR', 'NON WARRANTY', 'DOSAN DX300LCA-7M', 'CECFK-001257', 'DOSAN DE08TIS', 284561, '31.400 kg', '1,72 m³', '10.710x3.200x6.615', '', 205, 2022, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 5494, 'DOOSAN_DX300'),
(14, 'EX-309', 'CATERPILLAR', 'EXCAVATOR', 'WARRANTY', 'CAT 330 GX', 'CAT00330LFEK60026', '', '', '', '', '', '', '', 2024, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 586, 'CAT_330GX'),
(15, 'EX-310', 'CATERPILLAR', 'EXCAVATOR', 'WARRANTY', 'CAT 330 GX', 'CAT00330TFEK60694', 'C7.1', 'E7A67577', '1848 kg', '2,4 m³', '', '', 159, 2025, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 1719.5, 'CAT_330GX'),
(16, 'EX-311', 'CATERPILLAR', 'EXCAVATOR', 'WARRANTY', 'CAT 330 GX', 'CAT00330JFEK60697', 'C7.1', 'E7A67576', '1848 kg', '2,4 m³', '', '', 159, 2025, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 1656, 'CAT_330GX'),
(17, 'WL-010', 'SEM', 'WHEEL LOADER', 'NON WARRANTY', 'SEM 660D', 'SEM00660CS6203075', 'WEICHAI WD10G240E203', '1221G008520', '20.000 kg', '3,3 m³ - 5,5 m³', '8.414x3.370x3.458', 3370, 178, 2022, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 5196.5, 'SEM_660D'),
(18, 'WL-016', 'LIUGONG', 'WHEEL LOADER', 'NON WARRANTY', 'LUGONG T-930', 'T92823060173', 'SD490', 'SD5061623', '1.900 kg', '0,8 m³', '5.530x1.860x2.750', 1900, 65, 2023, 'RFU', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 2154.5, 'LUGONG_T930'),
(19, 'WL-017', 'LOVOL', 'WHEEL LOADER', 'NON WARRANTY', 'LOVOL FL955F-II', 'HKD2B2J1A301', 'WD10G220E23', '1222SO11299', '16620 kg', '3 m³', '7700x2980x3430', '', 162, 2024, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 7007, 'LOVOL_FL955F'),
(20, 'WL-019', 'LIUGONG', 'WHEEL LOADER', 'WARRANTY', 'LIU GONG CLG870H', 'CLG870HZHPL813667', 'QSL9.313TC190A2', '', '', '', '', '', 190, 2024, 'BREAKDOWN', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 3992.5, 'LIUGONG_CLG870H'),
(21, 'SL-100', 'BOBCAT', 'SKID STEER LOADER', 'NON WARRANTY', 'BOBCAT S570', 'AZNB14327', 'KUBOTA V2607-DI-T-EU4', 'V2607-8MM8854', '2.900 kg', '2,6 m³', '3.378x1.727x1.972', 828, 45.5, 2022, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 1958.5, 'BOBCAT_S570'),
(22, 'SL-200', 'LIUGONG', 'SKID STEER LOADER', 'NON WARRANTY', 'LIUGONG CLG375B', 'LGC375BZJPC505808', '4TNV98-ZCPLYSC', 'B0416A', '3.100 kg', '0,45 m³', '3.610X2.000X1.960', '', 43, 2024, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 2418, 'LIUGONG_CLG375B'),
(23, 'SL-300', 'CATERPILLAR', 'SKID STEER LOADER', 'WARRANTY', 'CAT 226B3', 'CAT0226BLDXZ04062', 'CAT C2.2 T', 'CZ212464', '2641 kg', '0,36 m³', '2.519X1.950X1.525', 1524, 45.5, 2024, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 2063.5, 'CAT_226B3'),
(24, 'SL-400', 'LIUGONG', 'SKID STEER LOADER', 'WARRANTY', 'LIUGONG CLG375B', 'LGC375BZLPC505801', '4TNV98-ZCPLYSC', 'B0408A', '3.100 kg', '0,45 m³', '3.610X2.000X1.960', '', 43, 2024, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 1720, 'LIUGONG_CLG375B'),
(25, 'DT-3011', 'SHACMAN', 'DUMP TRUCK', 'WARRANTY', 'SHACMAN F3000', 'LZGJLDR42RX094520', 'WP10.340E22', '1624S054055', '41.500 kg', '20 m³', '8600x2500x3550', '', 250, 2024, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 6196.5, 'SHACMAN_F3000'),
(26, 'DT-3012', 'SHACMAN', 'DUMP TRUCK', 'WARRANTY', 'SHACMAN F3000', 'LZGJLDR44RX094521', 'WP10.340E22', '1624S053548', '41.500 kg', '20 m³', '8600x2500x3550', '', 250, 2024, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 5494.5, 'SHACMAN_F3000'),
(27, 'DT-3017', 'SHACMAN', 'DUMP TRUCK', 'WARRANTY', 'SHACMAN F3000', 'LZGJLDR43RX094526', 'WP10.340E22', '1624S054065', '41.500 kg', '20 m³', '8600x2500x3550', '', 250, 2024, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 5916.5, 'SHACMAN_F3000'),
(28, 'DT-3018', 'SHACMAN', 'DUMP TRUCK', 'WARRANTY', 'SHACMAN F3000', 'LZGJLDR45RX094527', 'WP10.340E22', '', '41.500 kg', '20 m³', '8600x2500x3550', '', 250, 2024, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 5011.5, 'SHACMAN_F3000'),
(29, 'DT-3019', 'SHACMAN', 'DUMP TRUCK', 'WARRANTY', 'SHACMAN F3000', 'LZGJLDR44RX067092', 'WP10.340E22', '1624S053838', '41.500 kg', '20 m³', '8600x2500x3550', '', 250, 2024, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 6578, 'SHACMAN_F3000'),
(30, 'WT-009', 'UD TRUCKS', 'WATER TRUCK 20.000 KL', 'NON WARRANTY', 'QUESTER CWE 280', 'MFFCWZ50GRK826769', 'GH8E280E5', 634112, '26.000 kg', '20 m³', '11875x2500x3220', '', 280, 2024, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 3475, 'QUESTER_CWE280'),
(31, 'WT-011', 'UD TRUCKS', 'WATER TRUCK 20.000 KL', 'WARRANTY', 'QUESTER CWE 280', 'MFFCWZ50GRJ829721', 'GH8E280E5', 'GH8E*665623*C1*P', '26.000 kg', '20 m³', '11875x2500x3220', '', 280, 2024, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 3151.5, 'QUESTER_CWE280'),
(32, 'ST-002', 'FAW', 'LUBE TRUCK', 'WARRANTY', 'FAW 140LT', '', 'YC4D140-48', 'D58Y1R10021', '', '', '', '', 98, 2025, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 968, 'FAW_140LT'),
(33, 'GST-003', 'V-GEN', 'GENSET 40 KVA', 'WARRANTY', 'V-GEN VG40-I', 'VG24312128', 'ISUZU 4JA1-F1', 5108291, '40 KvA', '', '', '', '', 2025, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 5032, 'VGEN_VG40I'),
(34, 'GST-004', 'V-GEN', 'GENSET 40 KVA', 'WARRANTY', 'V-GEN VG40-I', 'VG24312136', 'ISUZU 4JA1-F1', 5108284, '40 KvA', '', '', '', '', 2025, 'READY', 'KBCT', '2026-09-13 08:00:00', '2026-09-21 06:51:26', 4791.5, 'VGEN_VG40I');

-- --------------------------------------------------------
-- Table structure for `master_mekaniks`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `master_mekaniks`;
CREATE TABLE `master_mekaniks` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama_mekanik` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `master_mekaniks`
INSERT INTO `master_mekaniks` (`id`, `nama_mekanik`, `created_at`, `updated_at`) VALUES
(1, 'Tim Mekanik KBCT', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(2, 'Tim Mekanik LMP', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(3, 'Andi Herwan (PMC)', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(4, 'Hariadi (GM & Mgr. Maintenance)', '2026-09-13 08:00:00', '2026-09-13 08:00:00');

-- --------------------------------------------------------
-- Table structure for `master_models`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `master_models`;
CREATE TABLE `master_models` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `model_code` text DEFAULT NULL,
  `model_name` text DEFAULT NULL,
  `equipment_type` text DEFAULT NULL,
  `unit_type_alias` text DEFAULT NULL,
  `manufacturer` text DEFAULT NULL,
  `aliases` text DEFAULT NULL,
  `is_active` bigint(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `master_models`
INSERT INTO `master_models` (`id`, `model_code`, `model_name`, `equipment_type`, `unit_type_alias`, `manufacturer`, `aliases`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'ZOOMLION_ZD320', 'ZOOMLION ZD-320-3', 'BULLDOZER', 'DOZER', 'Zoomlion', '["ZD-320-3","ZD320-3","ZOOMLION 320","ZD320","ZOOMLION ZD-320-3"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(2, 'ZOOMLION_ZD220', 'ZOOMLION ZD-220-3', 'BULLDOZER', 'DOZER', 'Zoomlion', '["ZD-220-3","ZD220-3","ZOOMLION 220","ZD220","ZOOMLION ZD-220-3"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(3, 'SEM_822D', 'SEM 822D', 'BULLDOZER', 'DOZER', 'SEM Caterpillar', '["SEM822D","822D","SEM 822","SEM 822D"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(4, 'CAT_D8GC', 'CAT D8 GC', 'BULLDOZER', 'DOZER', 'Caterpillar', '["D8GC","D8 GC","CAT D8GC","CAT D8","D8R","CAT D8 GC"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(5, 'CAT_320GX', 'CAT 320 GX', 'EXCAVATOR', 'EXCA', 'Caterpillar', '["320GX","320 GX","CAT 320GX","CAT 320 GX \\/ 330 GX","CAT 320"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(6, 'CAT_330GX', 'CAT 330 GX', 'EXCAVATOR', 'EXCA', 'Caterpillar', '["330GX","330 GX","CAT 330GX","CAT 320 GX \\/ 330 GX","CAT 330"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(7, 'HYUNDAI_HX220S', 'HYUNDAY HX220S', 'EXCAVATOR', 'EXCA', 'Hyundai', '["HX220S","HYUNDAI HX220S","HX 220 S","HYUNDAY HX220S"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(8, 'SANY_SY330H', 'SANY SY330H', 'EXCAVATOR', 'EXCA', 'Sany', '["SY330H","SANY 330","SY 330 H","SANY SY330H"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(9, 'DOOSAN_DX300', 'DOSAN DX300LCA-7M', 'EXCAVATOR', 'EXCA', 'Doosan', '["DX300LCA-7M","DOOSAN DX300","DX300","DOSAN DX300LCA-7M"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(10, 'SEM_660D', 'SEM 660D', 'WHEEL LOADER', 'LOADER', 'SEM Caterpillar', '["SEM660D","660D","SEM 660","SEM 660D"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(11, 'LUGONG_T930', 'LUGONG T-930', 'WHEEL LOADER', 'LOADER', 'Lugong', '["T-930","T930","LUGONG 930","LUGONG T-930"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(12, 'LOVOL_FL955F', 'LOVOL FL955F-II', 'WHEEL LOADER', 'LOADER', 'Lovol', '["FL955F-II","FL955F","LOVOL 955","LOVOL FL955F-II"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(13, 'LIUGONG_CLG870H', 'LIU GONG CLG870H', 'WHEEL LOADER', 'LOADER', 'LiuGong', '["CLG870H","LIUGONG 870","CLG 870 H","LIU GONG CLG870H"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(14, 'BOBCAT_S570', 'BOBCAT S570', 'SKID STEER LOADER', 'SKID STEER', 'Bobcat', '["S570","BOBCAT 570","BOBCAT S570"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(15, 'LIUGONG_CLG375B', 'LIUGONG CLG375B', 'SKID STEER LOADER', 'SKID STEER', 'LiuGong', '["CLG375B","LIUGONG 375","LIUGONG CLG375B"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(16, 'CAT_226B3', 'CAT 226B3', 'SKID STEER LOADER', 'SKID STEER', 'Caterpillar', '["226B3","CAT 226","CAT 226B3"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(17, 'FUSO_FN62', 'FUSO FIGHTER FN62', 'DUMP TRUCK', 'DT', 'Mitsubishi Fuso', '["FUSO FN62","FN62","FIGHTER FN62","FUSO FIGHTER","FUSO FIGHTER FN62"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(18, 'SHACMAN_F3000', 'SHACMAN F3000', 'DUMP TRUCK', 'DT', 'Shacman', '["F3000","SHACMAN 3000","SHACMAN F3000"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(19, 'QUESTER_CWE280', 'QUESTER CWE 280', 'DUMP TRUCK', 'DT', 'UD Trucks', '["CWE 280","CWE280","QUESTER 280","UD QUESTER","QUESTER CWE 280"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(20, 'FAW_140LT', 'FAW 140LT', 'WATER TRUCK 20.000 KL', 'SUPPORT', 'FAW', '["FAW 140","140LT","FAW 140LT"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26'),
(21, 'VGEN_VG40I', 'V-GEN VG40-I', 'GENSET 40 KVA', 'GENSET', 'V-Gen', '["VG40-I","VG40","V-GEN VG40-I"]', 1, '2026-09-21 06:51:26', '2026-09-21 06:51:26');

-- --------------------------------------------------------
-- Table structure for `master_parts`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `master_parts`;
CREATE TABLE `master_parts` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `part_number` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `uom` text DEFAULT NULL,
  `stock` double DEFAULT NULL,
  `min_stock` double DEFAULT NULL,
  `price` double DEFAULT NULL,
  `category_spare_part` text DEFAULT NULL,
  `qty_final` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `part_name` text DEFAULT NULL,
  `bin_location` text DEFAULT NULL,
  `last_in_date` text DEFAULT NULL,
  `last_out_date` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `master_pelapors`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `master_pelapors`;
CREATE TABLE `master_pelapors` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama_pelapor` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `master_tools`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `master_tools`;
CREATE TABLE `master_tools` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tool_id` text DEFAULT NULL,
  `tool_name` text DEFAULT NULL,
  `category` text DEFAULT NULL,
  `brand_spec` text DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `condition` text DEFAULT NULL,
  `location` text DEFAULT NULL,
  `borrower` text DEFAULT NULL,
  `status` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `borrow_date` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `mechanic_activities`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `mechanic_activities`;
CREATE TABLE `mechanic_activities` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `item_id` text DEFAULT NULL,
  `tanggal` text DEFAULT NULL,
  `no_wo` text DEFAULT NULL,
  `mekanik` text DEFAULT NULL,
  `aktifitas` text DEFAULT NULL,
  `jam_mulai` text DEFAULT NULL,
  `jam_selesai` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `meeting_notes`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `meeting_notes`;
CREATE TABLE `meeting_notes` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `item_id` text DEFAULT NULL,
  `tanggal` text DEFAULT NULL,
  `topic` text DEFAULT NULL,
  `leader` text DEFAULT NULL,
  `attendees` text DEFAULT NULL,
  `discussion_summary` text DEFAULT NULL,
  `action_items_json` text DEFAULT NULL,
  `status` text DEFAULT NULL,
  `plant_health` text DEFAULT NULL,
  `critical_issue` text DEFAULT NULL,
  `operational_impact` text DEFAULT NULL,
  `management_decision` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `monthly_budgets`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `monthly_budgets`;
CREATE TABLE `monthly_budgets` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `item_id` text DEFAULT NULL,
  `month_year` double DEFAULT NULL,
  `category` text DEFAULT NULL,
  `budget_plan` double DEFAULT NULL,
  `actual_spent` double DEFAULT NULL,
  `variance` double DEFAULT NULL,
  `status` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `oil_samples`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `oil_samples`;
CREATE TABLE `oil_samples` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `item_id` text DEFAULT NULL,
  `sample_code` text DEFAULT NULL,
  `equip_no` text DEFAULT NULL,
  `compartment` text DEFAULT NULL,
  `sample_date` text DEFAULT NULL,
  `hm` double DEFAULT NULL,
  `oil_grade` text DEFAULT NULL,
  `rating` text DEFAULT NULL,
  `top_up` double DEFAULT NULL,
  `repair_notes` text DEFAULT NULL,
  `si` double DEFAULT NULL,
  `al` double DEFAULT NULL,
  `na` double DEFAULT NULL,
  `fe` double DEFAULT NULL,
  `cu` double DEFAULT NULL,
  `cr` double DEFAULT NULL,
  `pb` double DEFAULT NULL,
  `pq` double DEFAULT NULL,
  `visc_100` double DEFAULT NULL,
  `oxi` double DEFAULT NULL,
  `soot` double DEFAULT NULL,
  `tbn` double DEFAULT NULL,
  `iso_6` double DEFAULT NULL,
  `iso_14` double DEFAULT NULL,
  `water_pct` double DEFAULT NULL,
  `interpretation` text DEFAULT NULL,
  `lab_vendor` text DEFAULT NULL,
  `status` text DEFAULT NULL,
  `created_by` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `part_services`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `part_services`;
CREATE TABLE `part_services` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `equipment` text DEFAULT NULL,
  `model` text DEFAULT NULL,
  `unit_type` text DEFAULT NULL,
  `part_name` text DEFAULT NULL,
  `part_number` text DEFAULT NULL,
  `ps_250` double DEFAULT NULL,
  `ps_500` double DEFAULT NULL,
  `ps_1000` double DEFAULT NULL,
  `ps_2000` double DEFAULT NULL,
  `ps_4000` double DEFAULT NULL,
  `category` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `model_code` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `password_reset_tokens`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` text DEFAULT NULL,
  `token` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `pcr_components`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `pcr_components`;
CREATE TABLE `pcr_components` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `item_id` text DEFAULT NULL,
  `equip_no` text DEFAULT NULL,
  `component_name` text DEFAULT NULL,
  `target_lifetime_hm` double DEFAULT NULL,
  `current_hm` double DEFAULT NULL,
  `remaining_hm` double DEFAULT NULL,
  `status` text DEFAULT NULL,
  `estimated_cost` double DEFAULT NULL,
  `scheduled_date` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `install_hm` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `plan_alats`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `plan_alats`;
CREATE TABLE `plan_alats` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `equip_no` text DEFAULT NULL,
  `model` text DEFAULT NULL,
  `plan_hours_per_month` double DEFAULT NULL,
  `plan_pa` double DEFAULT NULL,
  `mohh` double DEFAULT NULL,
  `category` text DEFAULT NULL,
  `status` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `plan_alats`
INSERT INTO `plan_alats` (`id`, `equip_no`, `model`, `plan_hours_per_month`, `plan_pa`, `mohh`, `category`, `status`, `created_at`, `updated_at`) VALUES
(1, 'DZ-002', 'ZOOMLION ZD-320-3', 720, 85, 450, 'BULLDOZER', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(2, 'DZ-005', 'SEM 822D', 720, 85, 450, 'BULLDOZER', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(3, 'DZ-069', 'ZOOMLION ZD-220-3', 720, 85, 450, 'BULLDOZER', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(4, 'DZ-007', 'CAT D8 GC', 720, 85, 450, 'BULLDOZER', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(5, 'DZ-008', 'CAT D8 GC', 720, 85, 450, 'BULLDOZER', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(6, 'DZ-010', 'CAT D8 GC', 720, 85, 450, 'BULLDOZER', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(7, 'DZ-012', 'SEM 822D', 720, 85, 450, 'BULLDOZER', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(8, 'EX-201', 'HYUNDAY HX220S', 720, 85, 500, 'EXCAVATOR', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(9, 'EX-205', 'CAT 320 GX', 720, 85, 500, 'EXCAVATOR', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(10, 'EX-302', 'SANY SY330H', 720, 85, 500, 'EXCAVATOR', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(11, 'EX-304', 'SANY SY330H', 720, 85, 500, 'EXCAVATOR', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(12, 'EX-305', 'SANY SY330H', 720, 85, 500, 'EXCAVATOR', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(13, 'EX-306', 'DOSAN DX300LCA-7M', 720, 85, 500, 'EXCAVATOR', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(14, 'EX-309', 'CAT 330 GX', 720, 85, 500, 'EXCAVATOR', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(15, 'EX-310', 'CAT 330 GX', 720, 85, 500, 'EXCAVATOR', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(16, 'EX-311', 'CAT 330 GX', 720, 85, 500, 'EXCAVATOR', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(17, 'WL-010', 'SEM 660D', 720, 85, 450, 'WHEEL LOADER', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(18, 'WL-016', 'LUGONG T-930', 720, 85, 450, 'WHEEL LOADER', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(19, 'WL-017', 'LOVOL FL955F-II', 720, 85, 450, 'WHEEL LOADER', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(20, 'WL-019', 'LIU GONG CLG870H', 720, 85, 450, 'WHEEL LOADER', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(21, 'SL-100', 'BOBCAT S570', 720, 85, 400, 'SKID STEER LOADER', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(22, 'SL-200', 'LIUGONG CLG375B', 720, 85, 400, 'SKID STEER LOADER', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(23, 'SL-300', 'CAT 226B3', 720, 85, 400, 'SKID STEER LOADER', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(24, 'SL-400', 'LIUGONG CLG375B', 720, 85, 400, 'SKID STEER LOADER', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(25, 'DT-3011', 'SHACMAN F3000', 720, 85, 550, 'DUMP TRUCK', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(26, 'DT-3012', 'SHACMAN F3000', 720, 85, 550, 'DUMP TRUCK', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(27, 'DT-3017', 'SHACMAN F3000', 720, 85, 550, 'DUMP TRUCK', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(28, 'DT-3018', 'SHACMAN F3000', 720, 85, 550, 'DUMP TRUCK', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(29, 'DT-3019', 'SHACMAN F3000', 720, 85, 550, 'DUMP TRUCK', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(30, 'WT-009', 'QUESTER CWE 280', 720, 85, 500, 'WATER TRUCK', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(31, 'WT-011', 'QUESTER CWE 280', 720, 85, 500, 'WATER TRUCK', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(32, 'ST-002', 'FAW 140LT', 720, 85, 350, 'LUBE TRUCK', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(33, 'GST-003', 'V-GEN VG40-I', 720, 85, 300, 'GENSET', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(34, 'GST-004', 'V-GEN VG40-I', 720, 85, 300, 'GENSET', 'AKTIF', '2026-09-13 08:00:00', '2026-09-13 08:00:00');

-- --------------------------------------------------------
-- Table structure for `plan_services`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `plan_services`;
CREATE TABLE `plan_services` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `equip_no` text DEFAULT NULL,
  `model` text DEFAULT NULL,
  `plan_hours_per_month` double DEFAULT NULL,
  `plan_pa` double DEFAULT NULL,
  `last_service_date` text DEFAULT NULL,
  `last_service_hm` text DEFAULT NULL,
  `next_service_hm` text DEFAULT NULL,
  `kategori` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `pm_records`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `pm_records`;
CREATE TABLE `pm_records` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `item_id` text DEFAULT NULL,
  `tanggal` text DEFAULT NULL,
  `equip_no` text DEFAULT NULL,
  `pm_type` text DEFAULT NULL,
  `washing_check` text DEFAULT NULL,
  `greasing_check` text DEFAULT NULL,
  `inspection_check` text DEFAULT NULL,
  `torque_check` text DEFAULT NULL,
  `battery_check` text DEFAULT NULL,
  `mechanic` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `hm_pm` double DEFAULT NULL,
  `status` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `week_no` text DEFAULT NULL,
  `achievement_pct` double DEFAULT NULL,
  `checklist_json` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `ppu_records`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `ppu_records`;
CREATE TABLE `ppu_records` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `unit_no` text DEFAULT NULL,
  `model` text DEFAULT NULL,
  `track_group_used` text DEFAULT NULL,
  `cts_date` text DEFAULT NULL,
  `last_fitted_track_group` text DEFAULT NULL,
  `pct_hours_track` double DEFAULT NULL,
  `hours_track_gp` double DEFAULT NULL,
  `smu` double DEFAULT NULL,
  `sprocket_lh` double DEFAULT NULL,
  `sprocket_rh` double DEFAULT NULL,
  `link_height_lh` double DEFAULT NULL,
  `link_height_rh` double DEFAULT NULL,
  `chain_bushing_lh` double DEFAULT NULL,
  `chain_bushing_rh` double DEFAULT NULL,
  `frame_ext_lh` double DEFAULT NULL,
  `frame_ext_rh` double DEFAULT NULL,
  `grouser_height_lh` double DEFAULT NULL,
  `grouser_height_rh` double DEFAULT NULL,
  `idler_front_lh` double DEFAULT NULL,
  `idler_front_rh` double DEFAULT NULL,
  `idler_rear_lh` double DEFAULT NULL,
  `idler_rear_rh` double DEFAULT NULL,
  `inspection_date` text DEFAULT NULL,
  `inspector` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` text DEFAULT NULL,
  `created_by` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `service_histories`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `service_histories`;
CREATE TABLE `service_histories` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `item_id` text DEFAULT NULL,
  `equip_no` text DEFAULT NULL,
  `plan_hm` text DEFAULT NULL,
  `plan_date` text DEFAULT NULL,
  `actual_hm` text DEFAULT NULL,
  `actual_date` text DEFAULT NULL,
  `timestamp` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `sessions`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` text DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `ip_address` text DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` text DEFAULT NULL,
  `last_activity` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `settings`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `key` text DEFAULT NULL,
  `value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `settings`
INSERT INTO `settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 'CompanyName', 'PT. KUK', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(2, 'ThemeColor', '#0f172a', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(3, 'CompanyLogo', '', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(4, 'ShiftDate', '2026-09-13', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(5, 'DocPrefix', 'PLANT-KUK/KBCT/2026', '2026-09-13 08:00:00', '2026-09-13 08:00:00');

-- --------------------------------------------------------
-- Table structure for `stocks`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `stocks`;
CREATE TABLE `stocks` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `part_number` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `uom` text DEFAULT NULL,
  `stock` double DEFAULT NULL,
  `min_stock` double DEFAULT NULL,
  `price` double DEFAULT NULL,
  `category_spare_part` text DEFAULT NULL,
  `qty_final` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `swab_components`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `swab_components`;
CREATE TABLE `swab_components` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `item_id` text DEFAULT NULL,
  `tanggal` text DEFAULT NULL,
  `donor_unit` text DEFAULT NULL,
  `target_unit` text DEFAULT NULL,
  `component_name` text DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `authorized_by` text DEFAULT NULL,
  `mechanic` text DEFAULT NULL,
  `status` text DEFAULT NULL,
  `restoration_date` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `no_wo` text DEFAULT NULL,
  `pcr_component_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `system_logs`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `system_logs`;
CREATE TABLE `system_logs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `timestamp` text DEFAULT NULL,
  `action` text DEFAULT NULL,
  `message` text DEFAULT NULL,
  `user` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `target_jam_harian`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `target_jam_harian`;
CREATE TABLE `target_jam_harian` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `equip_no` text DEFAULT NULL,
  `plan_year` bigint(20) DEFAULT NULL,
  `plan_month` bigint(20) DEFAULT NULL,
  `plan_day` bigint(20) DEFAULT NULL,
  `jam_rencana` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `downtime_type` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `target_jam_operasi`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `target_jam_operasi`;
CREATE TABLE `target_jam_operasi` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `equip_no` text DEFAULT NULL,
  `section` text DEFAULT NULL,
  `model` text DEFAULT NULL,
  `est_hm` double DEFAULT NULL,
  `status` text DEFAULT NULL,
  `next_service_hours_due` double DEFAULT NULL,
  `next_service_type_hm` double DEFAULT NULL,
  `next_service_type` text DEFAULT NULL,
  `next_service_date` text DEFAULT NULL,
  `pm_250` bigint(20) DEFAULT NULL,
  `pm_500` bigint(20) DEFAULT NULL,
  `pm_1000` bigint(20) DEFAULT NULL,
  `pm_2000` bigint(20) DEFAULT NULL,
  `pm_other` bigint(20) DEFAULT NULL,
  `ba_gg` bigint(20) DEFAULT NULL,
  `oil_fe` bigint(20) DEFAULT NULL,
  `pos` bigint(20) DEFAULT NULL,
  `plan_year` bigint(20) DEFAULT NULL,
  `plan_month` bigint(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `est_hm_date` text DEFAULT NULL,
  `next_service_hours_due_2` double DEFAULT NULL,
  `next_service_type_2` text DEFAULT NULL,
  `next_service_date_2` text DEFAULT NULL,
  `pm_4000` bigint(20) DEFAULT NULL,
  `downtime_pm` double DEFAULT NULL,
  `downtime_backlog` double DEFAULT NULL,
  `downtime_midlife` double DEFAULT NULL,
  `downtime_pcr` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `user_access`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `user_access`;
CREATE TABLE `user_access` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` text DEFAULT NULL,
  `feature` text DEFAULT NULL,
  `timestamp` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for `user_access`
INSERT INTO `user_access` (`id`, `username`, `feature`, `timestamp`, `created_at`, `updated_at`) VALUES
(1, 'planner', 'dashboard', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(2, 'planner', 'top-management', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(3, 'planner', 'database-3d', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(4, 'planner', 'buat-wo', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(5, 'planner', 'list-wo', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(6, 'planner', 'backlog', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(7, 'planner', 'pm-hub', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(8, 'planner', 'pm-washing', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(9, 'planner', 'pm-greasing', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(10, 'planner', 'pm-inspection', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(11, 'planner', 'pm-torque', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(12, 'planner', 'pm-battery', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(13, 'planner', 'pcr', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(14, 'planner', 'swab-component', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(15, 'planner', 'far', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(16, 'planner', 'daily-hm', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(17, 'planner', 'aktifitas', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(18, 'planner', 'inspection', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(19, 'planner', 'monthly-budget', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(20, 'planner', 'meeting-notes', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(21, 'planner', 'pesan-instan', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(22, 'planner', 'master-unit', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(23, 'planner', 'master-stock', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(24, 'planner', 'master-tools', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(25, 'planner', 'master-mekanik', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(26, 'planner', 'master-comp', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(27, 'planner', 'manage-users', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(28, 'planner', 'pengaturan', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(29, 'planner', 'systemlogs', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(30, 'admin', 'dashboard', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(31, 'admin', 'top-management', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(32, 'admin', 'database-3d', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(33, 'admin', 'buat-wo', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(34, 'admin', 'list-wo', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(35, 'admin', 'backlog', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(36, 'admin', 'pm-hub', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(37, 'admin', 'pm-washing', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(38, 'admin', 'pm-greasing', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(39, 'admin', 'pm-inspection', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(40, 'admin', 'pm-torque', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(41, 'admin', 'pm-battery', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(42, 'admin', 'pcr', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(43, 'admin', 'swab-component', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(44, 'admin', 'far', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(45, 'admin', 'daily-hm', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(46, 'admin', 'aktifitas', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(47, 'admin', 'inspection', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(48, 'admin', 'monthly-budget', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(49, 'admin', 'meeting-notes', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(50, 'admin', 'pesan-instan', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(51, 'admin', 'master-unit', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(52, 'admin', 'master-stock', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(53, 'admin', 'master-tools', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(54, 'admin', 'master-mekanik', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(55, 'admin', 'master-comp', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(56, 'admin', 'manage-users', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(57, 'admin', 'pengaturan', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(58, 'admin', 'systemlogs', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(59, 'mekanik1', 'dashboard', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(60, 'mekanik1', 'buat-wo', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(61, 'mekanik1', 'list-wo', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(62, 'mekanik1', 'backlog', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(63, 'mekanik1', 'pm-hub', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(64, 'mekanik1', 'pm-washing', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(65, 'mekanik1', 'pm-greasing', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(66, 'mekanik1', 'pm-inspection', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(67, 'mekanik1', 'pm-torque', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(68, 'mekanik1', 'pm-battery', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(69, 'mekanik1', 'pcr', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(70, 'mekanik1', 'swab-component', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(71, 'mekanik1', 'far', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(72, 'mekanik1', 'daily-hm', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(73, 'mekanik1', 'aktifitas', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(74, 'mekanik1', 'inspection', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(75, 'mekanik1', 'pesan-instan', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(76, 'mekanik1', 'master-tools', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(77, 'mekanik2', 'dashboard', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(78, 'mekanik2', 'buat-wo', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(79, 'mekanik2', 'list-wo', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(80, 'mekanik2', 'backlog', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(81, 'mekanik2', 'pm-hub', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(82, 'mekanik2', 'pm-washing', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(83, 'mekanik2', 'pm-greasing', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(84, 'mekanik2', 'pm-inspection', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(85, 'mekanik2', 'pm-torque', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(86, 'mekanik2', 'pm-battery', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(87, 'mekanik2', 'pcr', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(88, 'mekanik2', 'swab-component', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(89, 'mekanik2', 'far', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(90, 'mekanik2', 'daily-hm', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(91, 'mekanik2', 'aktifitas', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(92, 'mekanik2', 'inspection', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(93, 'mekanik2', 'pesan-instan', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(94, 'mekanik2', 'master-tools', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(95, 'boss', 'top-management', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(96, 'boss', 'database-3d', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(97, 'boss', 'dashboard', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(98, 'boss', 'list-wo', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(99, 'boss', 'monthly-budget', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(100, 'boss', 'meeting-notes', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(101, 'boss', 'pesan-instan', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(102, 'boss', 'far', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(103, 'boss', 'pcr', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(104, 'boss', 'inspection', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(105, 'boss', 'master-unit', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(106, 'boss', 'master-stock', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(107, 'boss', 'master-tools', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(108, 'boss', 'master-comp', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(109, 'boss', 'systemlogs', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(110, 'direksi', 'top-management', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(111, 'direksi', 'database-3d', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(112, 'direksi', 'dashboard', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(113, 'direksi', 'list-wo', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(114, 'direksi', 'monthly-budget', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(115, 'direksi', 'meeting-notes', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(116, 'direksi', 'pesan-instan', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(117, 'direksi', 'far', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(118, 'direksi', 'pcr', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(119, 'direksi', 'inspection', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(120, 'direksi', 'master-unit', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(121, 'direksi', 'master-stock', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(122, 'direksi', 'master-tools', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(123, 'direksi', 'master-comp', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00'),
(124, 'direksi', 'systemlogs', '2026-09-13 08:00:00', '2026-09-13 08:00:00', '2026-09-13 08:00:00');

-- --------------------------------------------------------
-- Table structure for `users`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` text DEFAULT NULL,
  `email` text DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` text DEFAULT NULL,
  `remember_token` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `work_order_parts`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `work_order_parts`;
CREATE TABLE `work_order_parts` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `no_wo` text DEFAULT NULL,
  `part_number` text DEFAULT NULL,
  `part_name` text DEFAULT NULL,
  `qty_used` double NOT NULL,
  `uom` text DEFAULT NULL,
  `unit_price` double DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  `stock_deducted` bigint(20) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for `work_orders`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `work_orders`;
CREATE TABLE `work_orders` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `no_wo` text DEFAULT NULL,
  `equip_no` text DEFAULT NULL,
  `brand` text DEFAULT NULL,
  `unit_type` text DEFAULT NULL,
  `hm_km` text DEFAULT NULL,
  `tgl_input` text DEFAULT NULL,
  `tgl_rusak` text DEFAULT NULL,
  `jam_rusak` text DEFAULT NULL,
  `tgl_selesai` text DEFAULT NULL,
  `jam_selesai` text DEFAULT NULL,
  `pelanggan` text DEFAULT NULL,
  `pm_service` text DEFAULT NULL,
  `major_comp` text DEFAULT NULL,
  `minor_comp` text DEFAULT NULL,
  `sch_unsch` text DEFAULT NULL,
  `reported_by` text DEFAULT NULL,
  `kendala` text DEFAULT NULL,
  `failure_reason` text DEFAULT NULL,
  `status` text DEFAULT NULL,
  `parts_json` text DEFAULT NULL,
  `tech` text DEFAULT NULL,
  `action_log` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `backlog_id` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;
SET FOREIGN_KEY_CHECKS=1;
