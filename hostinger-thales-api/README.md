# Hostinger Thales API

Upload the PHP files in this folder to a public folder on Hostinger, for example:

```text
public_html/thales-api/
```

Your API base URL will then look like:

```text
https://pixtra.site/thales-api
```

## 1. Create MySQL Database

In Hostinger hPanel:

1. Open **Databases**.
2. Create a MySQL database.
3. Create or assign a database user.
4. Copy the database name, username, password, and host.

## 2. Create Table

Run this SQL in phpMyAdmin:

```sql
CREATE TABLE triangle_game_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_name VARCHAR(120) NOT NULL,
  roll_number VARCHAR(60) NOT NULL,
  score INT NOT NULL DEFAULT 0,
  total_possible INT NOT NULL DEFAULT 500,
  answers JSON NULL,
  started_at DATETIME NULL,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT NULL,
  ip_hash VARCHAR(128) NULL
);
```

## 3. Edit `config.php`

Replace these placeholders:

```php
const DB_HOST = 'localhost';
const DB_NAME = 'YOUR_HOSTINGER_DATABASE_NAME';
const DB_USER = 'YOUR_HOSTINGER_DATABASE_USER';
const DB_PASS = 'YOUR_HOSTINGER_DATABASE_PASSWORD';
const TEACHER_PIN = 'CHANGE_ME_STRONG_TEACHER_PIN';
const IP_HASH_SALT = 'CHANGE_ME_LONG_RANDOM_IP_HASH_SALT';
```

Add your deployed Vercel URL to `ALLOWED_ORIGINS`:

```php
const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://your-vercel-app.vercel.app',
];
```

Do not put real database credentials or the teacher PIN in the frontend.

## 4. Upload Files

Upload these files to your Hostinger API folder:

```text
config.php
submit.php
teacher-results.php
export.php
```

## 5. Configure Vercel

In Vercel project settings, add:

```text
NEXT_PUBLIC_RESULTS_API_BASE=https://pixtra.site/thales-api
```

Redeploy the frontend after adding the variable.

## 6. Test Submit

From your terminal:

```bash
curl -X POST https://pixtra.site/thales-api/submit.php \
  -H "Content-Type: application/json" \
  -d '{
    "student_name": "Test Student",
    "roll_number": "10A-01",
    "score": 500,
    "total_possible": 500,
    "answers": {"test": true},
    "started_at": "2026-07-08T10:00:00.000Z"
  }'
```

Expected response:

```json
{"success":true,"id":1,"message":"Result submitted successfully."}
```

## 7. Open Teacher Page

Open the frontend teacher dashboard:

```text
https://your-vercel-app.vercel.app/teacher
```

Enter the `TEACHER_PIN` from `config.php`. Results are fetched only from `teacher-results.php` after the PIN check. CSV export uses `export.php`.
