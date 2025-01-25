let selectedEvent =0;
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
    
    const main = document.querySelector('main'); // Seleciona o elemento <main>
if (!main) {
    console.error('Elemento <main> não encontrado no HTML!');
}

async function fetchEventData(eventId) {
    try {
        const eventResponse = await fetch(`http://localhost:3000/eventId?id=${eventId}`);
        if (!eventResponse.ok) {
            throw new Error(`Erro: ${eventResponse.statusText}`);
        }
        const eventData = await eventResponse.json();

        const today = new Date().toISOString().split('T')[0]; // Data atual no formato YYYY-MM-DD
        if (eventData.event_date < today) {
            console.warn(`Evento "${eventData.name}" não será adicionado, pois a data (${eventData.event_date}) é anterior à data atual.`);
            return; // Não adiciona o evento
        }

        const cepResponse = await fetch(`https://viacep.com.br/ws/${eventData.CEP}/json/`);
        if (!cepResponse.ok) {
            throw new Error(`Erro ao buscar CEP: ${cepResponse.statusText}`);
        }
        const cepData = await cepResponse.json();

        // Cria um elemento HTML com os dados do evento e do endereço
        const div = document.createElement('div');
div.classList.add('eventCard');
const data = eventData.event_date.slice(0, -14);
const partes = data.split("-")
// Adiciona elementos HTML para cada parte da informação
div.innerHTML = `
    <h3>${eventData.name}</h3>
    <div class="divide">
        <p><strong>Tipo:</strong> ${eventData.event_type}</p>
        <p><strong>Participantes:</strong> ${eventData.participants}</p>
    </div>
    <div class="divide">
        <p><strong>Data:</strong> ${partes[2]+"/"+partes[1]+"/"+partes[0]}</p>
        <p><strong>Hora:</strong> ${eventData.event_time}</p>
    </div>
    <p><strong>Endereço:</strong> ${cepData.bairro}, ${cepData.localidade} - ${cepData.uf}</p>
    <button value="${eventId}" onclick="entrarCardEvento(this)">teste</button>
`;

        main.appendChild(div); // Adiciona ao elemento <main>
    } catch (error) {
        console.error(`Erro ao buscar os dados do evento ${eventId}:`, error.message);
    }
}

async function fetchAllEvents(eventIds) {
    for (const eventId of eventIds) {
        await fetchEventData(eventId);
    }
}

// Substitua 'eventIds' pelo array real com os IDs dos eventos
fetchAllEvents(eventIds)
  

});
async function entrarEvento(){
    eventId = document.getElementById('userEvent').value
    participantId = userData.id

    console.log("teste "+ participantId + selectedEvent)
    const response = await fetch('http://localhost:3000/participantsRegister', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 

        body: JSON.stringify({event_id: selectedEvent, participant_id: participantId })

    });
    
  }
async function entrarCardEvento(button) {

  document.getElementById('joinEventLock').style.display = "block";
  document.getElementById('preencher').textContent = selectedEvent;
  
  selectedEvent=button.value
    console.log(selectedEvent);
    document.getElementById('preencher').textContent = selectedEvent;

    try {
        const eventResponse = await fetch(`http://localhost:3000/eventId?id=${selectedEvent}`);
        if (!eventResponse.ok) {
            throw new Error(`Erro: ${eventResponse.statusText}`);
        }
        const eventData = await eventResponse.json();
    
        const cepResponse = await fetch(`https://viacep.com.br/ws/${eventData.CEP}/json/`);
        if (!cepResponse.ok) {
            throw new Error(`Erro ao buscar CEP: ${cepResponse.statusText}`);
        }
        const cepData = await cepResponse.json();
        
        const participantsResponse = await fetch(`http://localhost:3000/participants?groupId=${selectedEvent}`);
        if (!eventResponse.ok) {
            throw new Error(`Erro: ${eventResponse.statusText}`);
        }
        participantsData = await participantsResponse.json();
        console.log(participantsData.participants.total_participants+1)
        
        document.getElementById('description').textContent = eventData.description;
        document.getElementById('type').textContent = eventData.event_type;
        const data = eventData.event_date.slice(0, -14);
        const partes = data.split("-")

        document.getElementById('dataHora').textContent = partes[2]+"/"+partes[1]+"/"+partes[0]+" - "+eventData.event_time.slice(0, -3);
        document.getElementById('local').textContent = cepData.bairro+" - "+cepData.localidade+" - "+cepData.uf;
        document.getElementById('contact').href = `https://api.whatsapp.com/send?phone=55${eventData.phone_number.replace(/[()]/g, "").trim()}`;
        document.getElementById('participants').textContent = participantsData.participants.total_participants+1+"/"+eventData.participants
        document.getElementById('userEvent').value = selectedEvent;
        
    } catch (error) {
        console.error(`Erro ao buscar os dados do evento ${selectedEvent}:`, error.message);
    }
}

function fecharEvento(){
  document.getElementById('joinEventLock').style.display = "none";
  
}


