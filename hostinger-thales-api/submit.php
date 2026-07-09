<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

handle_preflight();
require_post();
$data = read_json_body();

$studentName = isset($data['student_name']) && is_string($data['student_name']) ? trim($data['student_name']) : '';
$rollNumber = isset($data['roll_number']) && is_string($data['roll_number']) ? trim($data['roll_number']) : '';
$score = filter_var($data['score'] ?? null, FILTER_VALIDATE_INT);
$totalPossible = filter_var($data['total_possible'] ?? null, FILTER_VALIDATE_INT);
$answers = $data['answers'] ?? null;
$startedAt = normalize_datetime_or_null($data['started_at'] ?? null);

if ($studentName === '' || strlen($studentName) > 120) {
    json_response(['success' => false, 'error' => 'student_name is required and must be 120 characters or fewer.'], 400);
}

if ($rollNumber === '' || strlen($rollNumber) > 60) {
    json_response(['success' => false, 'error' => 'roll_number is required and must be 60 characters or fewer.'], 400);
}

if ($score === false || $score < 0) {
    json_response(['success' => false, 'error' => 'score must be a non-negative integer.'], 400);
}

if ($totalPossible === false || $totalPossible <= 0) {
    json_response(['success' => false, 'error' => 'total_possible must be a positive integer.'], 400);
}

if (!is_array($answers)) {
    json_response(['success' => false, 'error' => 'answers must be a JSON object or array.'], 400);
}

$answersJson = json_encode($answers, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
if ($answersJson === false) {
    json_response(['success' => false, 'error' => 'answers could not be encoded as JSON.'], 400);
}

try {
    $pdo = get_pdo();
    $statement = $pdo->prepare(
        'INSERT INTO triangle_game_results
            (student_name, roll_number, score, total_possible, answers, started_at, user_agent, ip_hash)
         VALUES
            (:student_name, :roll_number, :score, :total_possible, :answers, :started_at, :user_agent, :ip_hash)'
    );

    $statement->execute([
        ':student_name' => $studentName,
        ':roll_number' => $rollNumber,
        ':score' => (int) $score,
        ':total_possible' => (int) $totalPossible,
        ':answers' => $answersJson,
        ':started_at' => $startedAt,
        ':user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
        ':ip_hash' => hashed_client_ip(),
    ]);

    json_response([
        'success' => true,
        'id' => (int) $pdo->lastInsertId(),
        'message' => 'Result submitted successfully.',
    ]);
} catch (Throwable $error) {
    json_response(['success' => false, 'error' => 'Database error while saving result.'], 500);
}
