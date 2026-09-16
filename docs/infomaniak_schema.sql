-- Script SQL d'installation manuelle pour Infomaniak phpMyAdmin / MariaDB / MySQL
-- Base de données Chalet Cosynest (Backoffice & PWA Voyageurs)

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Table admin_users
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'admin',
  `token` VARCHAR(255) NULL,
  `last_login` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insertion des administrateurs par défaut (contact@chaletcosynest.fr / Cosynest2026! & concierge@chaletcosynest.fr / Concierge2026!)
INSERT IGNORE INTO `admin_users` (`email`, `password_hash`, `name`, `role`) VALUES 
('contact@chaletcosynest.fr', '$2y$10$eE61B2O6qK5t8H3M.W5r4.3mH8Qz2bK9w1jP7oL3xY9n6vQ0t5w6O', 'Propriétaire CosyNest', 'admin'),
('concierge@chaletcosynest.fr', '$2y$10$w81V7B6n.M4L0pP9x1.1r4O5u1p2Q3r4S5t6U7v8W9x0Y1z2A3b4C', 'Conciergerie Chalet', 'concierge');

-- 2. Table reservations
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_id` VARCHAR(100) NOT NULL UNIQUE,
  `property_id` VARCHAR(100) DEFAULT 'cosynest-chalet-vars',
  `guest_name` VARCHAR(255) NOT NULL,
  `guest_email` VARCHAR(255) NULL,
  `guest_phone` VARCHAR(50) NULL,
  `check_in` DATE NOT NULL,
  `check_out` DATE NOT NULL,
  `number_of_guests` INT DEFAULT 2,
  `total_amount` DECIMAL(10,2) DEFAULT 0.00,
  `source` VARCHAR(50) DEFAULT 'Direct',
  `status` VARCHAR(50) DEFAULT 'confirmed',
  `requires_contract` TINYINT(1) DEFAULT 1,
  `contract_signed` TINYINT(1) DEFAULT 0,
  `contract_signed_at` DATETIME NULL,
  `identity_verified` TINYINT(1) DEFAULT 0,
  `deposit_status` VARCHAR(50) DEFAULT 'pending',
  `deposit_amount` DECIMAL(10,2) DEFAULT 1500.00,
  `igloohome_pin_code` VARCHAR(50) NULL,
  `igloohome_keybox_code` VARCHAR(50) NULL,
  `check_in_inventory_done` TINYINT(1) DEFAULT 0,
  `check_out_inventory_done` TINYINT(1) DEFAULT 0,
  `notes` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Table guest_signatures
CREATE TABLE IF NOT EXISTS `guest_signatures` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_id` VARCHAR(100) NOT NULL,
  `guest_name` VARCHAR(255) NOT NULL,
  `signature_data_url` LONGTEXT NOT NULL,
  `ip_address` VARCHAR(50) NULL,
  `signed_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Table identity_verifications
CREATE TABLE IF NOT EXISTS `identity_verifications` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_id` VARCHAR(100) NOT NULL,
  `guest_name` VARCHAR(255) NOT NULL,
  `extracted_name` VARCHAR(255) NULL,
  `verification_passed` TINYINT(1) DEFAULT 0,
  `confidence_score` INT DEFAULT 0,
  `face_matches` TINYINT(1) DEFAULT 0,
  `name_matches` TINYINT(1) DEFAULT 0,
  `is_live_person` TINYINT(1) DEFAULT 1,
  `summary_reason` TEXT NULL,
  `verified_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Table inventories
CREATE TABLE IF NOT EXISTS `inventories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_id` VARCHAR(100) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `inspector_name` VARCHAR(255) NOT NULL,
  `items` LONGTEXT NOT NULL,
  `general_remarks` TEXT NULL,
  `signed_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Table igloohome_logs
CREATE TABLE IF NOT EXISTS `igloohome_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_id` VARCHAR(100) NOT NULL,
  `pin_code` VARCHAR(50) NOT NULL,
  `keybox_code` VARCHAR(50) NOT NULL,
  `valid_from` DATETIME NOT NULL,
  `valid_to` DATETIME NOT NULL,
  `status` VARCHAR(50) DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;
