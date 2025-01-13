CREATE TABLE ratings (

    id INT AUTO_INCREMENT PRIMARY KEY,
    
    user_id INT NOT NULL, -- ID do usuário (chave estrangeira)
    
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        
    rater_id INT NOT NULL, -- ID do avaliador (chave estrangeira)
    
    CONSTRAINT fk_rater FOREIGN KEY (rater_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
        
    rating TINYINT NOT NULL 
);