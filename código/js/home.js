document.addEventListener('DOMContentLoaded', async () => {
  let eventIds = [];
  const token = localStorage.getItem('token'); 
  if (!token) {
      window.location.href = 'login.html';
      return;
  }
  // Seleciona os elementos onde as informações do usuário e mensagens serão exibidas
 const messageElement = document.getElementById('message');
  // Realiza uma requisição para obter os dados do usuário autenticado
  const response = await fetch('http://localhost:3000/user', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}` // Certifique-se de que o token está sendo enviado
    }
});
  if (response.ok) {

      userData = await response.json();
      
      messageElement.textContent = userData.id;
  } else {

      messageElement.textContent = 'Erro ao obter dados do usuário.';
  }

  try {
      const response = await fetch('http://localhost:3000/events/ids', {
          method: 'GET'
        });
      
  
      if (!response.ok) {
        throw new Error('Erro ao obter IDs de eventos.');
      }
  
      eventIds = await response.json();
       // Agora você tem os IDs de eventos disponíveis como uma array
      // Use eventIds para popular o menu ou exibir na página
      messageElement.textContent = `Eventos encontrados: ${eventIds.join(', ')}`;
    } catch (error) {
      console.error('Erro:', error);
      messageElement.textContent = 'Erro ao obter IDs de eventos.';
    }
    
    console.log(eventIds);
    
    for (const eventId of eventIds) { // Corrigido para iterar sobre os valores do array
      fetch(`http://localhost:3000/eventId?id=${eventId}`, {
          method: 'GET',
      })
          .then(response => {
              if (!response.ok) {
                  throw new Error(`Erro: ${response.statusText}`);
              }
              return response.json();
          })
          .then(eventData => {
              console.log(eventData); // Dados do evento retornados pelo servidor
              // Manipula os dados, por exemplo, adicioná-los ao HTML
              const div = document.createElement('div');
              div.textContent = `Evento: ${eventData.name}, Tipo: ${eventData.event_type}, Participantes: ${eventData.participants}, Data: ${eventData.event_date}, Hora: ${eventData.event_time}, Endereço: ${eventData.CEP}`;
              document.body.appendChild(div); // Adiciona ao corpo da página
          })
          .catch(error => {
              console.error('Erro ao buscar os dados do evento:', error.message);
          });
  }
});