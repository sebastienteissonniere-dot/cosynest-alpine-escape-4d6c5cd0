<?php
// Script d'installation automatique des tables pour Infomaniak
// Acces : https://chaletcosynest.fr/api/install.php

require_once __DIR__ . '/config.php';

header("Content-Type: application/json");

try {
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    $autoPk = ($driver === 'sqlite') ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT AUTO_INCREMENT PRIMARY KEY';
    $insertIgnore = ($driver === 'sqlite') ? 'INSERT OR IGNORE INTO' : 'INSERT IGNORE INTO';

    // 1. Table admin_users (Backoffice Auth)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `admin_users` (
      `id` $autoPk,
      `email` VARCHAR(255) NOT NULL UNIQUE,
      `password_hash` VARCHAR(255) NOT NULL,
      `name` VARCHAR(255) NOT NULL,
      `role` VARCHAR(50) NOT NULL DEFAULT 'admin',
      `token` VARCHAR(255) NULL,
      `last_login` DATETIME NULL,
      `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    );");

    // Pre-seeding admin & concierge users if not existing
    $ownerHash = password_hash('Cosynest2026!', PASSWORD_BCRYPT);
    $conciergeHash = password_hash('Concierge2026!', PASSWORD_BCRYPT);

    $stmt = $pdo->prepare("$insertIgnore `admin_users` (`email`, `password_hash`, `name`, `role`) VALUES 
        ('contact@chaletcosynest.fr', ?, 'Propriétaire CosyNest', 'admin'),
        ('concierge@chaletcosynest.fr', ?, 'Conciergerie Chalet', 'concierge')");
    $stmt->execute([$ownerHash, $conciergeHash]);

    // Update password_hash if user already exists
    $stmtUpdate = $pdo->prepare("UPDATE `admin_users` SET `password_hash` = ? WHERE `email` = ?");
    $stmtUpdate->execute([$ownerHash, 'contact@chaletcosynest.fr']);
    $stmtUpdate->execute([$conciergeHash, 'concierge@chaletcosynest.fr']);

    // 2. Table reservations
    $pdo->exec("CREATE TABLE IF NOT EXISTS `reservations` (
      `id` $autoPk,
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
      `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    );");

    // 3. Table guest_signatures
    $pdo->exec("CREATE TABLE IF NOT EXISTS `guest_signatures` (
      `id` $autoPk,
      `booking_id` VARCHAR(100) NOT NULL,
      `guest_name` VARCHAR(255) NOT NULL,
      `signature_data_url` LONGTEXT NOT NULL,
      `ip_address` VARCHAR(50) NULL,
      `signed_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    );");

    // 4. Table identity_verifications (Gemini IA)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `identity_verifications` (
      `id` $autoPk,
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
    );");

    // 5. Table inventories
    $pdo->exec("CREATE TABLE IF NOT EXISTS `inventories` (
      `id` $autoPk,
      `booking_id` VARCHAR(100) NOT NULL,
      `type` VARCHAR(50) NOT NULL,
      `inspector_name` VARCHAR(255) NOT NULL,
      `items` LONGTEXT NOT NULL,
      `general_remarks` TEXT NULL,
      `signed_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    );");

    // 6. Table igloohome_logs
    $pdo->exec("CREATE TABLE IF NOT EXISTS `igloohome_logs` (
      `id` $autoPk,
      `booking_id` VARCHAR(100) NOT NULL,
      `pin_code` VARCHAR(50) NOT NULL,
      `keybox_code` VARCHAR(50) NOT NULL,
      `valid_from` DATETIME NOT NULL,
      `valid_to` DATETIME NOT NULL,
      `status` VARCHAR(50) DEFAULT 'active',
      `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
    );");

    // Pre-seeding demo reservations
    $pdo->exec("$insertIgnore `reservations` 
        (`booking_id`, `guest_name`, `guest_email`, `guest_phone`, `check_in`, `check_out`, `number_of_guests`, `total_amount`, `source`, `status`, `requires_contract`, `contract_signed`, `identity_verified`, `deposit_status`, `deposit_amount`, `igloohome_pin_code`) 
        VALUES 
        ('demo', 'Jean Dupont (Démo Infomaniak)', 'jean.dupont@example.com', '+33 6 00 11 22 33', '2026-09-15', '2026-09-22', 10, 5200.00, 'Direct', 'confirmed', 1, 0, 0, 'pending', 2000.00, '918234'),
        ('BK-9821', 'Sophie Martin', 'sophie.martin@example.fr', '+33 6 12 34 56 78', '2026-10-01', '2026-10-08', 6, 3800.00, 'Airbnb', 'confirmed', 0, 1, 1, 'authorized', 1500.00, '482910'),
        ('BK-9822', 'Alexander Smith', 'alex.smith@example.co.uk', '+44 7700 900077', '2026-10-15', '2026-10-22', 8, 4900.00, 'Direct', 'confirmed', 1, 1, 1, 'authorized', 2000.00, '739102');");

    echo json_encode([
        "success" => true,
        "driver" => $driver,
        "message" => "Toutes les tables Infomaniak (admin_users, reservations, guest_signatures, identity_verifications, inventories, igloohome_logs) ont été créées et configurées avec succès !",
        "users" => [
            "admin" => "contact@chaletcosynest.fr",
            "concierge" => "concierge@chaletcosynest.fr"
        ],
        "status" => "BASE DE DONNÉES INFOMANIAK PRÊTE A L'EMPLOI"
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => "Erreur lors de la création automatique des tables",
        "details" => $e->getMessage()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
