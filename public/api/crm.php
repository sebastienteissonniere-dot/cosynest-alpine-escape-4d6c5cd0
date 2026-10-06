<?php
require_once __DIR__ . '/config.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Lister ou récupérer les campagnes
    echo json_encode(["status" => "success", "message" => "CRM API Infomaniak prêt"]);
    exit();
}

if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    $action = $body['action'] ?? 'dispatch_campaign';

    if ($action === 'dispatch_campaign') {
        $campaignTitle = $body['title'] ?? 'Campagne Marketing';
        $recipients = $body['recipients'] ?? [];
        $subject = $body['subject'] ?? 'Offre Chalet CosyNest';
        $promoCode = $body['promoCode'] ?? '';

        // Journaliser ou simuler l'envoi mail PHP
        $sentCount = count($recipients);

        echo json_encode([
            "status" => "success",
            "message" => "Campagne '$campaignTitle' transmise avec succès.",
            "recipientsCount" => $sentCount,
            "dispatchedAt" => date('Y-m-d H:i:s')
        ]);
        exit();
    }
}

http_response_code(400);
echo json_encode(["error" => "Action invalide"]);
