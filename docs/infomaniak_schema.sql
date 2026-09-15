-- Script SQL pour Base de Données Native Infomaniak (phpMyAdmin / MySQL / MariaDB / PostgreSQL)
-- Projet Chalet Cosynest

CREATE TABLE IF NOT EXISTS `reservations` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_id` VARCHAR(100) NOT NULL UNIQUE,
  `property_id` VARCHAR(100) DEFAULT 'cosynest-chalet-vars',
  `guest_name` VARCHAR(255) NOT NULL,
  `guest_email` VARCHAR(255),
  `guest_phone` VARCHAR(50),
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

CREATE TABLE IF NOT EXISTS `guest_signatures` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_id` VARCHAR(100) NOT NULL,
  `guest_name` VARCHAR(255) NOT NULL,
  `signature_data_url` LONGTEXT NOT NULL,
  `ip_address` VARCHAR(50) NULL,
  `signed_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`booking_id`) REFERENCES `reservations`(`booking_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  `verified_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`booking_id`) REFERENCES `reservations`(`booking_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `inventories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_id` VARCHAR(100) NOT NULL,
  `type` VARCHAR(50) NOT NULL,
  `inspector_name` VARCHAR(255) NOT NULL,
  `items` LONGTEXT NOT NULL,
  `general_remarks` TEXT NULL,
  `signed_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`booking_id`) REFERENCES `reservations`(`booking_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
