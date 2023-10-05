CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL,
    password varchar(128) NOT NULL,
    email VARCHAR(256) UNIQUE NOT NULL,
    created_at DATETIME NOT NULL
);

ALTER TABLE users AUTO_INCREMENT = 100000;

CREATE TABLE verification_attempts ( 
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    verification_code VARCHAR(6) NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE scores (
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    score INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);