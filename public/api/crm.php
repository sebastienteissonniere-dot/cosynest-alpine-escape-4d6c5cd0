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
    echo json_encode(["status" => "success", "message" => "CRM API Infomaniak ready", "sender" => "contact@chaletcosynest.fr"]);
    exit();
}

if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    $action = $body['action'] ?? 'dispatch_campaign';

    if ($action === 'dispatch_campaign') {
        $campaignTitle = $body['title'] ?? 'Offre Chalet CosyNest';
        $recipients = $body['recipients'] ?? [];
        $subject = $body['subject'] ?? '🎁 Offre privilège au Chalet CosyNest';
        $promoCode = $body['promoCode'] ?? 'DIRECT15';
        $customContent = $body['content'] ?? null;

        $senderEmail = "contact@chaletcosynest.fr";
        $senderName = "Chalet CosyNest";
        
        $headers  = "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
        $headers .= "From: {$senderName} <{$senderEmail}>\r\n";
        $headers .= "Reply-To: {$senderEmail}\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . " (Infomaniak ChaletCosyNest)\r\n";

        $sentCount = 0;
        $failedCount = 0;

        foreach ($recipients as $recipient) {
            $toEmail = is_array($recipient) ? ($recipient['email'] ?? '') : $recipient;
            $toName = is_array($recipient) ? ($recipient['name'] ?? 'Voyageur') : 'Voyageur';

            if (empty($toEmail) || !filter_var($toEmail, FILTER_VALIDATE_EMAIL)) {
                continue;
            }

            // Génération du contenu HTML du mail
            $htmlBody = "
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset='UTF-8'>
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; }
                .header { text-align: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px; }
                .title { font-size: 24px; font-weight: bold; color: #0f172a; margin: 0; }
                .subtitle { color: #64748b; font-size: 14px; margin-top: 4px; }
                .content { padding: 24px 0; font-size: 15px; line-height: 1.6; color: #334155; }
                .promo-box { background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0; }
                .promo-code { font-family: monospace; font-size: 24px; font-weight: bold; color: #15803d; letter-spacing: 2px; }
                .btn { display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; margin-top: 16px; }
                .footer { border-top: 1px solid #f1f5f9; padding-top: 20px; text-align: center; font-size: 12px; color: #94a3b8; }
              </style>
            </head>
            <body>
              <div class='container'>
                <div class='header'>
                  <h1 class='title'>Chalet CosyNest</h1>
                  <p class='subtitle'>Hautes-Alpes • Station de Risoul</p>
                </div>
                <div class='content'>
                  <p>Bonjour <strong>" . htmlspecialchars($toName) . "</strong>,</p>
                  <p>Nous espérons que vous gardez un souvenir inoubliable de votre séjour au Chalet CosyNest.</p>
                  <p>Pour préparer votre prochain séjour en montagne, nous avons le plaisir de vous offrir un privilège exclusif de <strong>-15% sur votre réservation en direct</strong> sur notre site internet.</p>
                  
                  <div class='promo-box'>
                    <p style='margin:0 0 8px 0; font-size:12px; color:#166534; font-weight:bold; text-transform:uppercase;'>Votre Code Réduction Direct</p>
                    <div class='promo-code'>" . htmlspecialchars($promoCode) . "</div>
                  </div>

                  <p style='text-align: center;'>
                    <a href='https://chaletcosynest.fr/dev#booking' class='btn'>Réserver mon séjour au Chalet</a>
                  </p>
                </div>
                <div class='footer'>
                  <p>Chalet CosyNest — Risoul 1850<br>Contact : <a href='mailto:contact@chaletcosynest.fr' style='color:#4f46e5;'>contact@chaletcosynest.fr</a></p>
                </div>
              </div>
            </body>
            </html>
            ";

            // Envoi effectif via la fonction mail() native Infomaniak
            $success = @mail($toEmail, $subject, $htmlBody, $headers);
            if ($success) {
                $sentCount++;
            } else {
                $failedCount++;
            }
        }

        echo json_encode([
            "status" => "success",
            "message" => "Campagne '$campaignTitle' envoyée depuis contact@chaletcosynest.fr.",
            "recipientsCount" => count($recipients),
            "sentCount" => $sentCount,
            "failedCount" => $failedCount,
            "sender" => $senderEmail,
            "dispatchedAt" => date('Y-m-d H:i:s')
        ]);
        exit();
    }
}

http_response_code(400);
echo json_encode(["error" => "Action invalide"]);
