<?php
// Central app configuration for database and email
return [
    'db' => [
        'host' => 'localhost', // Change to your DB host
        'name' => 'church_db', // Change to your DB name
        'user' => 'root',      // Change to your DB user
        'pass' => '',          // Change to your DB password
    ],
    'mail' => [
        'host' => 'smtp.gmail.com',
        'port' => 465,
        'encryption' => 'ssl',
        'username' => 'uzorpromise11@gmail.com',
        'password' => 'yuwr xfnm bqrg fjof',
        'from_address' => 'noreply@churchsystem.com',
        'from_name' => 'Church System',
    ],
    'client_url' => 'http://localhost:8080',
    'api_url' => 'http://localhost:8080/api',
    'app_url' => 'http://localhost:8080',
]; 

// cd church-system; php -S localhost:8080

// cd church-system; php api/index.php --help