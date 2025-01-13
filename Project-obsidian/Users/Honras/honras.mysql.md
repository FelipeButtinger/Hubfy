CREATE TABLE honor (

    id INT AUTO_INCREMENT PRIMARY KEY,
    
    user_id INT UNIQUE, -- Cada usuário pode estar conectado a apenas uma entrada
    
    leadership INT DEFAULT 0, -- Começa com 0
    
    sociable INT DEFAULT 0,   -- Começa com 0
    
    participative INT DEFAULT 0, -- Começa com 0
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
