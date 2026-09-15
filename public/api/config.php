<?php
// Configuration de la connexion PDO à la Base de Données Infomaniak
// Chalet Cosynest API Backend

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_host = getenv('INFOMANIAK_DB_HOST') ?: 'localhost';
$db_name = getenv('INFOMANIAK_DB_NAME') ?: 'cosynest_db';
$db_user = getenv('INFOMANIAK_DB_USER') ?: 'cosynest_user';
$db_pass = getenv('INFOMANIAK_DB_PASS') ?: 'password_secret';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    // Return graceful JSON error if DB connection fails
    http_response_code(500);
    echo json_encode(["error" => "Erreur de connexion BDD Infomaniak", "details" => $e->getMessage()]);
    exit();
}
