CREATE TABLE events (

id INT(11) AUTO_INCREMENT PRIMARY KEY, 

name VARCHAR(100) NOT NULL, 

organizer_id INT(11) NOT NULL, 

description TEXT,

event_type VARCHAR(50) NOT NULL, 

participants INT(11) NOT NULL, 

event_date DATE NOT NULL, 

event_time TIME NOT NULL, 

CEP VARCHAR(10) NOT NULL,

phone_number VARCHAR(15) NOT NULL, 

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

