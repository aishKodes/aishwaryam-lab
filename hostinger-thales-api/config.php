<?php
declare(strict_types=1);

// Replace these placeholder values after creating your Hostinger MySQL database.
const DB_HOST = 'localhost';
const DB_NAME = 'YOUR_HOSTINGER_DATABASE_NAME';
const DB_USER = 'YOUR_HOSTINGER_DATABASE_USER';
const DB_PASS = 'YOUR_HOSTINGER_DATABASE_PASSWORD';

// Change this before uploading. Keep this PIN private and do not put it in frontend code.
const TEACHER_PIN = 'CHANGE_ME_STRONG_TEACHER_PIN';

// Change this to a long random string. Used to hash IP addresses without storing raw IPs.
const IP_HASH_SALT = 'CHANGE_ME_LONG_RANDOM_IP_HASH_SALT';

// Add your deployed Vercel URL here, for example: https://project-thales.vercel.app
const ALLOWED_ORIGINS = [
    'https://aishwaryam-lab.vercel.app',
    'https://pixtra.site',
    'https://www.pixtra.site',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
];

function send_cors_headers(): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if ($origin !== '' && in_array($origin, ALLOWED_ORIGINS, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
}

function handle_preflight(): void
{
    send_cors_headers();

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function require_post(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        json_response(['success' => false, 'error' => 'POST request required.'], 405);
    }
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE || !is_array($data)) {
        json_response(['success' => false, 'error' => 'Invalid JSON body.'], 400);
    }

    return $data;
}

function read_json_or_form_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw !== false && trim($raw) !== '') {
        $data = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
            return $data;
        }
    }

    return $_POST;
}

function json_response(array $payload, int $statusCode = 200): void
{
    send_cors_headers();
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function get_pdo(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function normalize_datetime_or_null(mixed $value): ?string
{
    if (!is_string($value) || trim($value) === '') {
        return null;
    }

    try {
        $date = new DateTime($value);
        return $date->format('Y-m-d H:i:s');
    } catch (Throwable $error) {
        return null;
    }
}

function hashed_client_ip(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    return hash('sha256', IP_HASH_SALT . '|' . $ip);
}

function require_teacher_pin(array $data): void
{
    $pin = isset($data['pin']) && is_string($data['pin']) ? $data['pin'] : '';

    if (!hash_equals(TEACHER_PIN, $pin)) {
        json_response(['success' => false, 'error' => 'Unauthorized.'], 401);
    }
}
