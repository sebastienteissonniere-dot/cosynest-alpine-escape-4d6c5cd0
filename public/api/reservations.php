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

    // Send automated email to guest if email provided
    if (!empty($guestEmail)) {
        sendWelcomeEmail($guestEmail, $guestName, $bookingId, $checkIn, $checkOut, $source);
    }

    echo json_encode(["success" => true, "bookingId" => $bookingId, "emailSent" => !empty($guestEmail)]);
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

function sendWelcomeEmail($guestEmail, $guestName, $bookingId, $checkIn, $checkOut, $source) {
    if (empty($guestEmail) || !filter_var($guestEmail, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    $subject = "Chalet Cosynest - Vos accès et instructions de séjour (Réservation #" . $bookingId . ")";
    $guestUrl = "https://chaletcosynest.fr/guest/" . urlencode($bookingId);

    $isDirect = (strtolower($source) === 'direct');

    $htmlContent = '
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: "Georgia", serif; background-color: #FAF7F2; color: #3c2415; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 16px; border: 1px solid #e8dfd3; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { text-align: center; border-bottom: 1px solid #e8dfd3; padding-bottom: 20px; margin-bottom: 20px; }
        .title { font-size: 26px; font-weight: bold; color: #9B6B43; margin: 0; }
        .subtitle { font-size: 13px; color: #785233; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 4px; }
        .badge { display: inline-block; background: #f5ebe0; color: #9B6B43; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .step { background: #fdfbf7; padding: 14px; border-radius: 12px; border: 1px solid #f0e6d8; margin-bottom: 10px; font-size: 14px; line-height: 1.5; }
        .step-num { color: #9B6B43; font-weight: bold; margin-right: 8px; }
        .btn { display: block; width: 100%; text-align: center; background: #9B6B43; color: #ffffff !important; padding: 15px 0; border-radius: 12px; text-decoration: none; font-weight: bold; margin-top: 25px; font-size: 15px; }
        .footer { text-align: center; margin-top: 25px; font-size: 12px; color: #a38c78; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">Chalet Cosynest</h1>
          <div class="subtitle">Livret d\'Accueil & Clés Numériques</div>
        </div>

        <p>Bonjour <strong>' . htmlspecialchars($guestName) . '</strong>,</p>
        <p>Nous avons le plaisir de vous confirmer votre réservation pour votre séjour au <strong>Chalet Cosynest</strong> (Vars 2000) du <strong>' . htmlspecialchars($checkIn) . '</strong> au <strong>' . htmlspecialchars($checkOut) . '</strong>.</p>
        
        <p style="margin-top: 20px; font-weight: bold;">Afin de préparer au mieux votre arrivée et débloquer vos digicodes d\'accès :</p>';

    if ($isDirect) {
        $htmlContent .= '
        <div class="step"><span class="step-num">1.</span> ✍️ <strong>Signature du contrat de location</strong> : Signez électroniquement votre contrat de location saisonnière.</div>
        <div class="step"><span class="step-num">2.</span> 🛡️ <strong>Empreinte de caution en ligne</strong> : Validez votre caution sécurisée via Swikly.</div>
        <div class="step"><span class="step-num">3.</span> 🪪 <strong>Vérification d\'identité</strong> : Transmettez votre pièce d\'identité (analyse IA).</div>
        <div class="step"><span class="step-num">4.</span> 🔑 <strong>Digicode Serrure Igloohome</strong> : Récupérez votre code d\'accès personnel.</div>';
    } else {
        $htmlContent .= '
        <div class="step"><span class="step-num">1.</span> 🪪 <strong>Vérification d\'identité</strong> : Transmettez votre pièce d\'identité (analyse IA).</div>
        <div class="step"><span class="step-num">2.</span> 🔑 <strong>Digicode Serrure Igloohome</strong> : Récupérez votre code d\'accès personnel.</div>';
    }

    $htmlContent .= '
        <a href="' . $guestUrl . '" class="btn">Accéder à mon Espace Voyageur PWA</a>

        <div class="footer">
          Chalet Cosynest • Vars 2000, Hautes-Alpes<br>
          Service Conciergerie : contact@chaletcosynest.fr
        </div>
      </div>
    </body>
    </html>';

    $headers  = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
    $headers .= "From: Chalet Cosynest <contact@chaletcosynest.fr>" . "\r\n";
    $headers .= "Reply-To: contact@chaletcosynest.fr" . "\r\n";

    return @mail($guestEmail, $subject, $htmlContent, $headers);
}
