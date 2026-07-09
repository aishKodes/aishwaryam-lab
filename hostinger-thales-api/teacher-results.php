<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

handle_preflight();
require_post();
$data = read_json_body();
require_teacher_pin($data);

try {
    $pdo = get_pdo();
    $statement = $pdo->prepare(
        'SELECT id, student_name, roll_number, score, total_possible, answers, started_at, submitted_at
         FROM triangle_game_results
         ORDER BY submitted_at DESC'
    );
    $statement->execute();
    $results = $statement->fetchAll();

    foreach ($results as &$result) {
        $decodedAnswers = null;
        if (isset($result['answers']) && is_string($result['answers']) && $result['answers'] !== '') {
            $decodedAnswers = json_decode($result['answers'], true);
        }
        $result['answers'] = $decodedAnswers;
        $result['score'] = (int) $result['score'];
        $result['total_possible'] = (int) $result['total_possible'];
        $result['id'] = (int) $result['id'];
    }
    unset($result);

    json_response(['success' => true, 'results' => $results]);
} catch (Throwable $error) {
    json_response(['success' => false, 'error' => 'Database error while loading results.'], 500);
}
