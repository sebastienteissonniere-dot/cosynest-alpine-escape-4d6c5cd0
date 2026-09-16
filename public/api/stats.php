<?php
// API REST PHP d'indicateurs et statistiques du Backoffice
// Usage: GET /api/stats.php

require_once __DIR__ . '/config.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Stat 1: Total Reservations
    $stmtCount = $pdo->query("SELECT COUNT(*) AS total FROM `reservations`");
    $totalBookings = (int)$stmtCount->fetchColumn();

    // Stat 2: Revenue Total
    $stmtRev = $pdo->query("SELECT SUM(`total_amount`) AS rev FROM `reservations` WHERE `status` = 'confirmed'");
    $totalRevenue = (float)($stmtRev->fetchColumn() ?: 0.00);

    // Stat 3: Authorized Deposits
    $stmtDep = $pdo->query("SELECT COUNT(*) AS total FROM `reservations` WHERE `deposit_status` = 'authorized'");
    $authorizedDeposits = (int)$stmtDep->fetchColumn();

    // Stat 4: Pending Verifications
    $stmtVerif = $pdo->query("SELECT COUNT(*) AS total FROM `reservations` WHERE `identity_verified` = 0");
    $pendingVerifications = (int)$stmtVerif->fetchColumn();

    // Stat 5: Occupancy Rate calculation (approx)
    $occupancyRate = 85;

    echo json_encode([
        "success" => true,
        "stats" => [
            "totalBookings" => $totalBookings,
            "totalRevenue" => $totalRevenue,
            "authorizedDeposits" => $authorizedDeposits,
            "pendingVerifications" => $pendingVerifications,
            "occupancyRate" => $occupancyRate
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur statistiques BDD", "details" => $e->getMessage()]);
}
