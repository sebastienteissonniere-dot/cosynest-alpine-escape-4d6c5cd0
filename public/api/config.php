<?php
// Configuration PDO intelligente (Infomaniak MySQL ou SQLite Native)
// Chalet Cosynest API Backend

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_host = getenv('INFOMANIAK_DB_HOST') ?: 'localhost';
$db_name = getenv('INFOMANIAK_DB_NAME') ?: '';
$db_user = getenv('INFOMANIAK_DB_USER') ?: '';
$db_pass = getenv('INFOMANIAK_DB_PASS') ?: '';

$pdo = null;

// Attempt 1: Try MySQL if credentials supplied
if (!empty($db_name) && !empty($db_user)) {
    try {
        $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (PDOException $e) {
        // Fallthrough to SQLite
    }
}

// Attempt 2: Fallback to SQLite Native BDD file if MySQL is not yet configured
if (!$pdo) {
    try {
        $sqlitePath = __DIR__ . '/cosynest_database.sqlite';
        $pdo = new PDO("sqlite:$sqlitePath", null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Erreur de connexion BDD Infomaniak", "details" => $e->getMessage()]);
        exit();
    }
}
