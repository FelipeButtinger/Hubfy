
document.addEventListener('DOMContentLoaded', async () => {

    const token = localStorage.getItem('token'); 
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    // Seleciona os elementos onde as informações do usuário e mensagens serão exibidas
    // Realiza uma requisição para obter os dados do usuário autenticado
    const response = await fetch('http://localhost:3000/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // Certifique-se de que o token está sendo enviado
        }
    });
    if (response.ok) {

        userData = await response.json();
        
        console.log("seu id: ",userData.id);
    } else {

        console.log('Erro ao obter dados do usuário.');
    }
    const eventDateInput = document.getElementById('event_date');
    eventDateInput.addEventListener('input', () => {
        const today = new Date().toISOString().split('T')[0]; // Data atual no formato YYYY-MM-DD
        if (eventDateInput.value < today) {
            alert('A data do evento não pode ser em um dia anterior ao atual!');
            eventDateInput.value = ''; // Limpa o campo
        }
    });
    
    document.getElementById('eventRegisterForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtém os valores dos campos de entrada de email e senha
        const name = document.getElementById('name').value;
        const organizer_id = userData.id;
        const description = document.getElementById('description').value;
        const event_type = document.getElementById('event_type').value;
        const participants = document.getElementById('participants').value;
        const event_date = document.getElementById('event_date').value;
        const event_time = document.getElementById('event_time').value;
        const CEP = document.getElementById('cep').value;
        const phone_number = document.getElementById('phone_number').value;
    

        const response = await fetch('http://localhost:3000/groupRegister', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 

            body: JSON.stringify({ name, organizer_id, description, event_type, participants,event_date, event_time, CEP, phone_number })
        });
    

        const messageElement = document.getElementById('message');
    

        if (response.ok) {

            messageElement.textContent = 'Usuário registrado com sucesso!';
          
        } else {
           
            const errorMessage = await response.text();
           
            messageElement.textContent = errorMessage;
        }
       
    });//fim do listener submir
    
});//fim do DOMContentLoaded

// TEsta aqui dai Div id="grupsContainer"


