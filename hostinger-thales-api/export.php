<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

require_post();
$data = read_json_or_form_body();
require_teacher_pin($data);

try {
    $pdo = get_pdo();
    $statement = $pdo->prepare(
        'SELECT roll_number, student_name, score, total_possible, submitted_at
         FROM triangle_game_results
         ORDER BY submitted_at DESC'
    );
    $statement->execute();

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="triangle-game-results.csv"');

    $output = fopen('php://output', 'w');
    if ($output === false) {
        throw new RuntimeException('Unable to open CSV output stream.');
    }

    fputcsv($output, ['roll_number', 'student_name', 'score', 'total_possible', 'submitted_at']);

    while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
        fputcsv($output, [
            $row['roll_number'],
            $row['student_name'],
            $row['score'],
            $row['total_possible'],
            $row['submitted_at'],
        ]);
    }

    fclose($output);
    exit;
} catch (Throwable $error) {
    json_response(['success' => false, 'error' => 'Database error while exporting CSV.'], 500);
}
