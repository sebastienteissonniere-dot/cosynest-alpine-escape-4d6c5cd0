<?php
require_once __DIR__ . '/config.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);

    if (!$body || !isset($body['bookingId'])) {
        http_response_code(400);
        echo json_encode(["error" => "bookingId obligatoire"]);
        exit();
    }

    $bookingId = $body['bookingId'];
    $guestName = $body['guestName'] ?? 'Voyageur';
    $extractedName = $body['extractedName'] ?? $guestName;
    $verificationPassed = isset($body['verificationPassed']) ? ($body['verificationPassed'] ? 1 : 0) : 0;
    $confidenceScore = $body['confidenceScore'] ?? 95;
    $faceMatches = isset($body['faceMatches']) ? ($body['faceMatches'] ? 1 : 0) : 1;
    $nameMatches = isset($body['nameMatches']) ? ($body['nameMatches'] ? 1 : 0) : 1;
    $isLivePerson = isset($body['isLivePerson']) ? ($body['isLivePerson'] ? 1 : 0) : 1;
    $summaryReason = $body['summaryReason'] ?? 'Vérification effectuée via API Gemini IA';

    $sql = "INSERT INTO identity_verifications 
        (booking_id, guest_name, extracted_name, verification_passed, confidence_score, face_matches, name_matches, is_live_person, summary_reason)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $bookingId, $guestName, $extractedName, $verificationPassed, $confidenceScore, $faceMatches, $nameMatches, $isLivePerson, $summaryReason
    ]);

    // Update identity_verified status in reservations table
    $updateStmt = $pdo->prepare("UPDATE reservations SET identity_verified = ? WHERE booking_id = ?");
    $updateStmt->execute([$verificationPassed, $bookingId]);

    echo json_encode(["success" => true, "bookingId" => $bookingId]);
    exit();
}
