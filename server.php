<?php
$host = "localhost";
$user = "root";
$pass = "";
$db = "bookDB";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $title = $_POST["title"];
    $author = $_POST["author"];

    $sql = "INSERT INTO books (title, author) VALUES ('$title', '$author')";
    if ($conn->query($sql) === TRUE) {
        echo "Book saved!";
    } else {
        echo "Error: " . $conn->error;
    }
}

// Retrieve saved books
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $sql = "SELECT * FROM books";
    $result = $conn->query($sql);
    
    $books = [];
    while($row = $result->fetch_assoc()) {
        $books[] = $row;
    }
    echo json_encode($books);
}

$conn->close();
?>