<?php
// Script d'installation automatique des tables pour Infomaniak
// Acces : https://chaletcosynest.fr/api/install.php

require_once __DIR__ . '/config.php';

header("Content-Type: application/json");

try {
    // 1. Table reservations
    $pdo->exec("CREATE TABLE IF NOT EXISTS `reservations` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 2. Table guest_signatures
    $pdo->exec("CREATE TABLE IF NOT EXISTS `guest_signatures` (
      `id` INT AUTO_INCREMENT PRIMARY KEY,
      `booking_id` VARCHAR(100) NOT NULL,
      `guest_name` VARCHAR(255) NOT NULL,
      `signature_data_url` LONGTEXT NOT NULL,
      `ip_address` VARCHAR(50) NULL,
      `signed_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 3. Table identity_verifications (Gemini IA)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `identity_verifications` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // 4. Table inventories
    $pdo->exec("CREATE TABLE IF NOT EXISTS `inventories` (
      `id` INT AUTO_INCREMENT PRIMARY KEY,
      `booking_id` VARCHAR(100) NOT NULL,
      `type` VARCHAR(50) NOT NULL,
      `inspector_name` VARCHAR(255) NOT NULL,
      `items` LONGTEXT NOT NULL,
      `general_remarks` TEXT NULL,
      `signed_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Insertion d'une réservation démo de test
    $pdo->exec("INSERT IGNORE INTO `reservations` 
        (`booking_id`, `guest_name`, `guest_email`, `guest_phone`, `check_in`, `check_out`, `number_of_guests`, `total_amount`, `source`, `status`, `requires_contract`, `contract_signed`, `identity_verified`, `deposit_status`, `deposit_amount`, `igloohome_pin_code`) 
        VALUES 
        ('demo', 'Jean Dupont (Démo Infomaniak)', 'jean.dupont@example.com', '+33 6 00 11 22 33', '2026-09-15', '2026-09-22', 10, 5200.00, 'Direct', 'confirmed', 1, 0, 0, 'pending', 2000.00, '918234');");

    echo json_encode([
        "success" => true,
        "message" => "Toutes les tables Infomaniak (reservations, guest_signatures, identity_verifications, inventories) ont été créées avec succès !",
        "status" => "BASE DE DONNÉES INFOMANIAK PRÊTE A L'EMPLOI"
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Erreur lors de la création automatique des tables",
        "details" => $e->getMessage()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
