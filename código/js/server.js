// Importa os módulos necessários para configurar o servidor
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const app = express();
const SECRET_KEY = 'seu_segredo_aqui'; // Substitua por um segredo seguro para gerar tokens JWT

// Middleware para habilitar o CORS (Cross-Origin Resource Sharing)
app.use(cors());
app.use(bodyParser.json()); // Middleware para processar o corpo das requisições em JSON

// Configura a conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Ajuste conforme necessário
  password: '', // Insira a senha se aplicável
  database: 'project' // Nome do banco de dados
});

// Conecta ao banco de dados e exibe mensagem de sucesso ou erro
db.connect((err) => {
  if (err) throw err;
  console.log('Conectado ao banco de dados MySQL!');
});

// Rota para registrar usuários
app.post('/register', async (req, res) => {
  const { contact_info,name, age, password } = req.body; // Obtém o email e senha do corpo da requisição
  const hashedPassword = await bcrypt.hash(password, 10); // Criptografa a senha para segurança

  // Verifica se o usuário já existe
  db.query('SELECT contact_info FROM users WHERE contact_info = ?', [contact_info], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      return res.status(400).send('Usuário já existe');
    }

    // Insere o novo usuário no banco de dados
    db.query('INSERT INTO users (name, contact_info, age, password) VALUES (?, ?, ?, ?)', [name, contact_info,age, hashedPassword], (err, result) => {
      if (err) throw err;
      res.send('Usuário registrado com sucesso');
    });
  });
});

app.post('/groupRegister', async (req, res) => {
  const { name, organizer_id, description, event_type, participants,event_date, event_time, CEP, phone_number} = req.body;
    db.query('INSERT INTO events (name, organizer_id, description, event_type, participants,event_date, event_time, CEP, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, organizer_id, description, event_type, participants,event_date, event_time, CEP, phone_number], (err, result) => {
      if (err) throw err;
      res.send('Evento registrado com sucesso');
    });
  
});

app.post('/participants register', async (req, res) => {
  const { event_id, user_id} = req.body;
    db.query('INSERT INTO events (name, organizer_id, description, event_type, participants,event_date, event_time, CEP, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, organizer_id, description, event_type, participants,event_date, event_time, CEP, phone_number], (err, result) => {
      if (err) throw err;
      res.send('Evento registrado com sucesso');
    });
  
});


// Rota para login de usuários
app.post('/login', async (req, res) => {
  const { name, password } = req.body; // Obtém o email e senha do corpo da requisição

  // Consulta o usuário no banco de dados
  db.query('SELECT * FROM users WHERE name= ?', [name], async (err, result) => {
    if (err) throw err;

    // Verifica se o usuário existe e se a senha está correta
    if (result.length === 0 || !(await bcrypt.compare(password, result[0].password))) {
      return res.status(400).send('Login ou senha inválidos');
    }

    // Gera o token JWT
    const token = jwt.sign({ name }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token }); // Retorna o token ao cliente
  });
});

// Middleware para verificar o token JWT nas requisições
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.log('Token não fornecido');
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log('Erro ao verificar token:', err);
      return res.sendStatus(403);
    }
    console.log('Usuário autenticado:', user); // Certifique-se de que o username está correto
    req.user = user;
    next();
  });
};

// Rota para obter dados do usuário logado
app.get('/user', authenticateToken, (req, res) => {
  
  db.query('SELECT name, contact_info,id FROM users WHERE name = ?', [req.user.name], (err, result) => {
    if (err) throw err;
    if (result.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }
    res.json(result[0]); 
  });
});

app.get('/events/ids', (req, res) => {
  db.query('SELECT id FROM events', (err, results) => {
    if (err) {
      console.error('Erro ao buscar IDs de eventos:', err);
      return res.status(500).json({ error: 'Erro ao buscar IDs de eventos' });
    }

    const eventIds = results.map(event => event.id); // Mapeia apenas os IDs dos resultados
    res.json(eventIds); // Retorna os IDs como uma array para que os use
  });
});


app.get('/eventId', (req, res) => {//retorna algumas informações com o id fornecido
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID do evento não fornecido' });
  }

  const query = 'SELECT * FROM events WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro no servidor:', err);
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    // Retorna o primeiro resultado (espera-se que o ID seja único)
    res.json(results[0]);
  });
});
app.get('/userId', async (req, res) => { //retorna os dados do usuário como um json
  const { name } = req.query; 
  
  if (!name) {
    return res.status(400).json({ error: 'Username é obrigatório' });
  }

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro no servidor' });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ id: result[0] });
  });
});



// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});







