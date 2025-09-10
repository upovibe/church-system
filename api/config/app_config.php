<?php
// Central app configuration for database and email
return [
    'db' => [
        'host' => 'localhost', // Change to your DB host
        'name' => '4555497_church', // Change to your DB name
        'user' => 'root',      // Change to your DB user
        'pass' => '',          // Change to your DB password
    ],
    'mail' => [
        'host' => 'mboxhosting.com',
        'port' => 465,
        'encryption' => 'ssl',
        'username' => 'info@piwcfranklincitytn.org',
        'password' => 'Piwc@FC2025',
        'from_address' => 'info@piwcfranklincitytn.org',
        'from_name' => 'PIWC-FC Contact Us',
    ],
    'client_url' => 'http://localhost:8081',
    'api_url' => 'http://localhost:8081/api',
    'app_url' => 'http://localhost:8081',
]; 

// cd church-system; php -S localhost:8081           # Run server

// cd church-system; php api/index.php --help       # Show help

// cd church-system; php api/index.php --fresh    # Drop tables, create tables, add default data

// cd church-system; php api/index.php --migrate    # Create tables

// cd church-system; php api/index.php --seed       # Add default data

// 'mail' => [
//     'host' => 'smtp.gmail.com',
//     'port' => 465,
//     'encryption' => 'ssl',
//     'username' => 'uzorpromise11@gmail.com',
//     'password' => 'yuwr xfnm bqrg fjof',
//     'from_address' => 'noreply@churchsystem.com',
//     'from_name' => 'Church System',
// ],