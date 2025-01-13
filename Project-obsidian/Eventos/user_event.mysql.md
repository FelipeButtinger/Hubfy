CREATE TABLE event_participants (

    id INT AUTO_INCREMENT PRIMARY KEY, -- ID único para o relacionamento
    
    event_id INT NOT NULL, -- ID do evento (chave estrangeira)
    
    user_id INT NOT NULL, -- ID do usuário (chave estrangeira)
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data de criação do registro
    
    -- Define a chave estrangeira para a tabela events
    CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Define a chave estrangeira para a tabela users
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    
    -- Garantir que um usuário não possa ser associado ao mesmo evento mais de uma vez
    UNIQUE(event_id, user_id)
);
