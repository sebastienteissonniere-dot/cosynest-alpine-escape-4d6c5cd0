<?php
// API REST PHP d'Authentification Backoffice (Infomaniak Native BDD)
// Usage: POST /api/auth.php (action=login | verify | logout)

require_once __DIR__ . '/config.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$action = isset($_GET['action']) ? $_GET['action'] : 'login';
$rawInput = file_get_contents("php://input");
$input = json_decode($rawInput ?: "{}", true);
if (empty($input)) {
    $input = $_POST;
}

try {
    $driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME);
    $nowExpr = ($driver === 'sqlite') ? "datetime('now')" : "NOW()";

    if ($action === 'login') {
        $email = trim(isset($input['email']) ? $input['email'] : '');
        $password = isset($input['password']) ? $input['password'] : '';

        if (empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(["error" => "Email et mot de passe requis."]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT * FROM `admin_users` WHERE `email` = ? LIMIT 1");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(401);
            echo json_encode(["error" => "Identifiants incorrects. Aucun compte trouvé avec cet e-mail."]);
            exit;
        }

        // Verify password hash
        if (!password_verify($password, $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(["error" => "Mot de passe incorrect."]);
            exit;
        }

        // Generate token and update last_login
        $token = bin2hex(random_bytes(32));
        $updateStmt = $pdo->prepare("UPDATE `admin_users` SET `token` = ?, `last_login` = $nowExpr WHERE `id` = ?");
        $updateStmt->execute([$token, $user['id']]);

        echo json_encode([
            "success" => true,
            "user" => [
                "id" => (string)$user['id'],
                "email" => $user['email'],
                "name" => $user['name'],
                "role" => $user['role'],
            ],
            "token" => $token
        ]);
        exit;
    }

    if ($action === 'verify' || $action === 'me') {
        $token = isset($_SERVER['HTTP_AUTHORIZATION']) ? str_replace('Bearer ', '', $_SERVER['HTTP_AUTHORIZATION']) : (isset($input['token']) ? $input['token'] : '');

        if (empty($token)) {
            http_response_code(401);
            echo json_encode(["authenticated" => false, "error" => "Jeton absent"]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT `id`, `email`, `name`, `role` FROM `admin_users` WHERE `token` = ? LIMIT 1");
        $stmt->execute([$token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode([
                "authenticated" => true,
                "user" => [
                    "id" => (string)$user['id'],
                    "email" => $user['email'],
                    "name" => $user['name'],
                    "role" => $user['role']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["authenticated" => false, "error" => "Session expirée ou invalide"]);
        }
        exit;
    }

    if ($action === 'logout') {
        $token = isset($input['token']) ? $input['token'] : '';
        if ($token) {
            $stmt = $pdo->prepare("UPDATE `admin_users` SET `token` = NULL WHERE `token` = ?");
            $stmt->execute([$token]);
        }
        echo json_encode(["success" => true, "message" => "Déconnexion réussie"]);
        exit;
    }

    http_response_code(400);
    echo json_encode(["error" => "Action non reconnue"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur BDD", "details" => $e->getMessage()]);
}
