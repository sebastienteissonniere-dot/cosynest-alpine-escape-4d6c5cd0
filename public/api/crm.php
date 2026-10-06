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

// Ensure database tables exist automatically
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS `prospects` (
      `id` VARCHAR(100) PRIMARY KEY,
      `name` VARCHAR(255) NOT NULL,
      `email` VARCHAR(255) NOT NULL,
      `phone` VARCHAR(50) NULL,
      `source` VARCHAR(100) DEFAULT 'Formulaire Web',
      `status_tag` VARCHAR(50) DEFAULT 'Nouveau Prospect',
      `notes` TEXT NULL,
      `created_at` DATE NOT NULL
    );");

    $pdo->exec("CREATE TABLE IF NOT EXISTS `email_campaigns` (
      `id` VARCHAR(100) PRIMARY KEY,
      `title` VARCHAR(255) NOT NULL,
      `subject` VARCHAR(255) NOT NULL,
      `target_segment` VARCHAR(50) NOT NULL,
      `promo_code` VARCHAR(50) NULL,
      `custom_body` TEXT NULL,
      `status` VARCHAR(50) DEFAULT 'draft',
      `created_date` DATE NOT NULL,
      `recipients_count` INT DEFAULT 0,
      `open_rate_percent` INT DEFAULT 0,
      `click_rate_percent` INT DEFAULT 0,
      `revenue_generated` DECIMAL(10,2) DEFAULT 0
    );");

    // Add custom_body column dynamically if missing
    try {
        $pdo->exec("ALTER TABLE `email_campaigns` ADD COLUMN `custom_body` TEXT NULL;");
    } catch (Exception $e) {}
} catch (Exception $e) {
    // Silent catch
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $action = $_GET['action'] ?? 'all';

    if ($action === 'get_prospects') {
        $stmt = $pdo->query("SELECT * FROM prospects ORDER BY created_at DESC");
        $rows = $stmt->fetchAll();
        $prospects = array_map(function($r) {
            return [
                "id" => $r['id'],
                "name" => $r['name'],
                "email" => $r['email'],
                "phone" => $r['phone'] ?? 'N/A',
                "source" => $r['source'] ?? 'Formulaire Web',
                "statusTag" => $r['status_tag'] ?? 'Nouveau Prospect',
                "notes" => $r['notes'] ?? '',
                "createdAt" => $r['created_at'],
                "tags" => ["Prospect", $r['source'] ?? 'Web']
            ];
        }, $rows);
        echo json_encode(["status" => "success", "data" => $prospects]);
        exit();
    }

    if ($action === 'get_campaigns') {
        $stmt = $pdo->query("SELECT * FROM email_campaigns ORDER BY created_date DESC");
        $rows = $stmt->fetchAll();
        $campaigns = array_map(function($r) {
            return [
                "id" => $r['id'],
                "title" => $r['title'],
                "subject" => $r['subject'],
                "targetSegment" => $r['target_segment'],
                "templateId" => "promo_15_direct",
                "promoCode" => $r['promo_code'] ?? '',
                "customBody" => $r['custom_body'] ?? null,
                "status" => $r['status'] ?? 'draft',
                "createdDate" => $r['created_date'],
                "sentDate" => $r['created_date'],
                "recipientsCount" => (int)($r['recipients_count'] ?? 0),
                "openRatePercent" => (int)($r['open_rate_percent'] ?? 0),
                "clickRatePercent" => (int)($r['click_rate_percent'] ?? 0),
                "revenueGenerated" => (float)($r['revenue_generated'] ?? 0)
            ];
        }, $rows);
        echo json_encode(["status" => "success", "data" => $campaigns]);
        exit();
    }

    echo json_encode(["status" => "success", "message" => "CRM API Infomaniak BDD actif", "sender" => "contact@chaletcosynest.fr"]);
    exit();
}

if ($method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    $action = $body['action'] ?? 'dispatch_campaign';

    if ($action === 'save_prospect') {
        $prospect = $body['prospect'] ?? null;
        if (!$prospect || empty($prospect['id']) || empty($prospect['email'])) {
            http_response_code(400);
            echo json_encode(["error" => "Données prospect invalides"]);
            exit();
        }

        $sql = "INSERT INTO prospects (id, name, email, phone, source, status_tag, notes, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                name = VALUES(name), email = VALUES(email), phone = VALUES(phone),
                source = VALUES(source), status_tag = VALUES(status_tag), notes = VALUES(notes)";
        
        $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
        if ($driver === 'sqlite') {
            $sql = "INSERT OR REPLACE INTO prospects (id, name, email, phone, source, status_tag, notes, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        }

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $prospect['id'],
            $prospect['name'],
            $prospect['email'],
            $prospect['phone'] ?? 'N/A',
            $prospect['source'] ?? 'Formulaire Web',
            $prospect['statusTag'] ?? 'Nouveau Prospect',
            $prospect['notes'] ?? '',
            $prospect['createdAt'] ?? date('Y-m-d')
        ]);

        echo json_encode(["status" => "success", "message" => "Prospect enregistré en BDD", "id" => $prospect['id']]);
        exit();
    }

    if ($action === 'delete_prospect') {
        $id = $body['id'] ?? null;
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM prospects WHERE id = ?");
            $stmt->execute([$id]);
        }
        echo json_encode(["status" => "success", "message" => "Prospect supprimé de la BDD"]);
        exit();
    }

    if ($action === 'save_campaign') {
        $campaign = $body['campaign'] ?? null;
        if (!$campaign || empty($campaign['id']) || empty($campaign['title'])) {
            http_response_code(400);
            echo json_encode(["error" => "Données campagne invalides"]);
            exit();
        }

        $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
        $sql = ($driver === 'sqlite') 
            ? "INSERT OR REPLACE INTO email_campaigns (id, title, subject, target_segment, promo_code, custom_body, status, created_date, recipients_count, open_rate_percent, click_rate_percent, revenue_generated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            : "REPLACE INTO email_campaigns (id, title, subject, target_segment, promo_code, custom_body, status, created_date, recipients_count, open_rate_percent, click_rate_percent, revenue_generated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $campaign['id'],
            $campaign['title'],
            $campaign['subject'] ?? '',
            $campaign['targetSegment'] ?? 'all',
            $campaign['promoCode'] ?? '',
            $campaign['customBody'] ?? '',
            $campaign['status'] ?? 'draft',
            $campaign['createdDate'] ?? date('Y-m-d'),
            (int)($campaign['recipientsCount'] ?? 0),
            (int)($campaign['openRatePercent'] ?? 0),
            (int)($campaign['clickRatePercent'] ?? 0),
            (float)($campaign['revenueGenerated'] ?? 0)
        ]);

        echo json_encode(["status" => "success", "message" => "Campagne enregistrée en BDD", "id" => $campaign['id']]);
        exit();
    }

    if ($action === 'delete_campaign') {
        $id = $body['id'] ?? null;
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM email_campaigns WHERE id = ?");
            $stmt->execute([$id]);
        }
        echo json_encode(["status" => "success", "message" => "Campagne supprimée de la BDD"]);
        exit();
    }

    if ($action === 'dispatch_campaign') {
        $campaignId = $body['id'] ?? ('camp-' . time());
        $campaignTitle = $body['title'] ?? 'Offre Chalet CosyNest';
        $recipients = $body['recipients'] ?? [];
        $subject = $body['subject'] ?? '🎁 Offre privilège au Chalet CosyNest';
        $promoCode = $body['promoCode'] ?? 'DIRECT15';
        $targetSegment = $body['targetSegment'] ?? 'all';
        $rawCustomBody = $body['customBody'] ?? $body['content'] ?? null;
        $campaignId = 'camp-' . time();

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

            if (!empty($rawCustomBody)) {
                $formatted = htmlspecialchars($rawCustomBody, ENT_QUOTES, 'UTF-8');
                $formatted = str_replace(['{{nom}}', '{{nom_destinataire}}'], htmlspecialchars($toName), $formatted);
                $formatted = str_replace('{{code_promo}}', htmlspecialchars($promoCode), $formatted);
                $formatted = preg_replace('/\*\*(.*?)\*\*/s', '<strong>$1</strong>', $formatted);
                $formatted = preg_replace('/\*([^\*]+)\*/s', '<em>$1</em>', $formatted);
                $formatted = nl2br($formatted);

                $bodyHtmlContent = "<div style='font-size:15px; line-height:1.6; color:#334155;'>{$formatted}</div>";
            } else {
                $bodyHtmlContent = "
                  <p>Bonjour <strong>" . htmlspecialchars($toName) . "</strong>,</p>
                  <p>Nous espérons que vous préparez votre prochain séjour au Chalet CosyNest !</p>
                  <p>Bénéficiez d'une réduction privilège de <strong>-15% sur votre séjour en direct</strong> sur notre site avec le code promo :</p>
                ";
            }

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
                  {$bodyHtmlContent}
                  
                  " . (!empty($promoCode) ? "
                  <div class='promo-box'>
                    <p style='margin:0 0 8px 0; font-size:12px; color:#166534; font-weight:bold; text-transform:uppercase;'>Votre Code Réduction Direct</p>
                    <div class='promo-code'>" . htmlspecialchars($promoCode) . "</div>
                  </div>" : "") . "

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

            $success = @mail($toEmail, $subject, $htmlBody, $headers);
            if ($success) {
                $sentCount++;
            } else {
                $failedCount++;
            }
        }

        // Save campaign record into BDD
        try {
            $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
            $sqlCamp = ($driver === 'sqlite') ? "INSERT OR REPLACE INTO email_campaigns" : "REPLACE INTO email_campaigns";
            $stmtCamp = $pdo->prepare("$sqlCamp (id, title, subject, target_segment, promo_code, custom_body, status, created_date, recipients_count, open_rate_percent, click_rate_percent, revenue_generated) VALUES (?, ?, ?, ?, ?, ?, 'sent', ?, ?, 100, 50, 0)");
            $stmtCamp->execute([$campaignId, $campaignTitle, $subject, $targetSegment, $promoCode, $rawCustomBody ?? '', date('Y-m-d'), count($recipients)]);
        } catch (Exception $e) {
            // Ignore BDD save error for campaign
        }

        echo json_encode([
            "status" => "success",
            "message" => "Campagne '$campaignTitle' envoyée via contact@chaletcosynest.fr.",
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
