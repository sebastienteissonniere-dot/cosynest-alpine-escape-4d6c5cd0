<?php
require_once __DIR__ . '/config.php';

header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $bookingId = $_GET['bookingId'] ?? null;

    if ($bookingId) {
        $stmt = $pdo->prepare("SELECT * FROM reservations WHERE booking_id = ?");
        $stmt->execute([$bookingId]);
        $res = $stmt->fetch();
        if ($res) {
            echo json_encode(["data" => formatReservation($res)]);
        } else {
            http_response_code(404);
            echo json_encode(["error" => "Réservation introuvable"]);
        }
    } else {
        $stmt = $pdo->query("SELECT * FROM reservations ORDER BY check_in ASC");
        $rows = $stmt->fetchAll();
        $list = array_map('formatReservation', $rows);
        echo json_encode(["data" => $list]);
    }
    exit();
}

if ($method === 'POST' || $method === 'PUT') {
    $body = json_decode(file_get_contents('php://input'), true);

    if (!$body || !isset($body['bookingId'])) {
        http_response_code(400);
        echo json_encode(["error" => "bookingId obligatoire"]);
        exit();
    }

    $bookingId = $body['bookingId'];
    $guestName = $body['guestName'] ?? 'Voyageur';
    $guestEmail = $body['guestEmail'] ?? '';
    $guestPhone = $body['guestPhone'] ?? '';
    $checkIn = $body['checkIn'] ?? date('Y-m-d');
    $checkOut = $body['checkOut'] ?? date('Y-m-d', strtotime('+7 days'));
    $numberOfGuests = $body['numberOfGuests'] ?? 2;
    $totalAmount = $body['totalAmount'] ?? 0.00;
    $source = $body['source'] ?? 'Direct';
    $status = $body['status'] ?? 'confirmed';
    $requiresContract = isset($body['requiresContract']) ? ($body['requiresContract'] ? 1 : 0) : 1;
    $contractSigned = isset($body['contractSigned']) ? ($body['contractSigned'] ? 1 : 0) : 0;
    $identityVerified = isset($body['identityVerified']) ? ($body['identityVerified'] ? 1 : 0) : 0;
    $depositStatus = $body['depositStatus'] ?? 'pending';
    $depositAmount = $body['depositAmount'] ?? 1500.00;
    $igloohomePinCode = $body['igloohomePinCode'] ?? null;
    $notes = $body['notes'] ?? null;

    $sql = "INSERT INTO reservations 
        (booking_id, guest_name, guest_email, guest_phone, check_in, check_out, number_of_guests, total_amount, source, status, requires_contract, contract_signed, identity_verified, deposit_status, deposit_amount, igloohome_pin_code, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        guest_name=VALUES(guest_name),
        guest_email=VALUES(guest_email),
        guest_phone=VALUES(guest_phone),
        check_in=VALUES(check_in),
        check_out=VALUES(check_out),
        number_of_guests=VALUES(number_of_guests),
        total_amount=VALUES(total_amount),
        source=VALUES(source),
        status=VALUES(status),
        requires_contract=VALUES(requires_contract),
        contract_signed=VALUES(contract_signed),
        identity_verified=VALUES(identity_verified),
        deposit_status=VALUES(deposit_status),
        deposit_amount=VALUES(deposit_amount),
        igloohome_pin_code=VALUES(igloohome_pin_code),
        notes=VALUES(notes)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $bookingId, $guestName, $guestEmail, $guestPhone, $checkIn, $checkOut, $numberOfGuests, $totalAmount,
        $source, $status, $requiresContract, $contractSigned, $identityVerified, $depositStatus, $depositAmount, $igloohomePinCode, $notes
    ]);

    echo json_encode(["success" => true, "bookingId" => $bookingId]);
    exit();
}

function formatReservation($row) {
    return [
        "id" => (string)$row['id'],
        "bookingId" => $row['booking_id'],
        "guestName" => $row['guest_name'],
        "guestEmail" => $row['guest_email'] ?? '',
        "guestPhone" => $row['guest_phone'] ?? '',
        "checkIn" => $row['check_in'],
        "checkOut" => $row['check_out'],
        "numberOfGuests" => (int)$row['number_of_guests'],
        "totalAmount" => (float)$row['total_amount'],
        "source" => $row['source'],
        "status" => $row['status'],
        "requiresContract" => (bool)$row['requires_contract'],
        "contractSigned" => (bool)$row['contract_signed'],
        "contractSignedAt" => $row['contract_signed_at'],
        "identityVerified" => (bool)$row['identity_verified'],
        "depositStatus" => $row['deposit_status'],
        "depositAmount" => (float)$row['deposit_amount'],
        "igloohomePinCode" => $row['igloohome_pin_code'],
        "checkInInventoryDone" => (bool)$row['check_in_inventory_done'],
        "checkOutInventoryDone" => (bool)$row['check_out_inventory_done'],
        "notes" => $row['notes'],
    ];
}
