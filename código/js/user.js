let activeEvents =[];
let pastEvents =[];

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Requisição para obter os dados do usuário autenticado
    const userResponse = await fetch('http://localhost:3000/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}` // Certifique-se de que o token está sendo enviado
        }
    });

    if (userResponse.ok) {
        userData = await userResponse.json(); // userData se mantém salvo
        console.log("seu id: ", userData.id);

        // Requisição para a rota /userEvents
        const eventsResponse = await fetch(`http://localhost:3000/userEvents?userId=${userData.id}`, {
            method: 'GET'
        });

        if (eventsResponse.ok) {
            const eventsData = await eventsResponse.json();
            const now = new Date();

            console.log("Eventos do usuário:", eventsData.allEvents);

            for (const event of eventsData.allEvents) {

                const eventDateTime = new Date(event.event_date);
            
                if (isNaN(eventDateTime.getTime())) {
                    console.warn("Data inválida encontrada:", event.event_date);
                    continue; // Ignorar eventos com datas inválidas
                }
            
                console.log("Data e hora do evento (convertida):", eventDateTime);
            
                if (eventDateTime < now) {
                    pastEvents.push(event); // Evento já aconteceu
                } else {
                    activeEvents.push(event); // Evento ainda ativo
                }
            }
            console.log(activeEvents[0])
            
                
           

            console.log("Eventos passados:", pastEvents);
            console.log("Eventos ativos:", activeEvents);
        } else {
            console.error("Erro ao buscar eventos do usuário.");
        }
    } else {
        console.log('Erro ao obter dados do usuário.');
    }
    renderCards(userData);
});//fim do DOMContentLoaded


async function renderCards(user){
    document.getElementById("back").disabled = true;
    for(let index = 0; index < activeEvents.length;index++){//carrega eventos programados
        let label = "ver";
        if(activeEvents[index].organizer_id == user.id){
            label = "editar";
        }
        const cepResponse = await fetch(`https://viacep.com.br/ws/${activeEvents[index].CEP}/json/`);
        if (!cepResponse.ok) {
            throw new Error(`Erro ao buscar CEP: ${cepResponse.statusText}`);
        }
        const cepData = await cepResponse.json();

        const data = activeEvents[index].event_date.slice(0, -14);
        const partes = data.split("-")

        document.getElementById(`activeCard${index}`).innerHTML = `
        <h3 id="activeName0">${activeEvents[index].name}</h3>
                    <div class="divide">
                        <p  id="activeType0"><strong>Tipo:</strong>${activeEvents[index].event_type}</p>
                    </div>
                    <div class="divide">
                        <p id="activeDate0"><strong>Data:</strong> ${partes[2]+"/"+partes[1]+"/"+partes[0]}</p>
                        <p id="activeTime0"><strong>Hora:</strong> ${activeEvents[index].event_time.slice(0, -3)}</p>
                    </div>
                    <p id="activeAddress0"><strong>Endereço:</strong> ${cepData.bairro+" - "+cepData.localidade+" - "+cepData.uf}</p>
                    <button id="activeButton${index}" value="${activeEvents[index].id}" onclick="entrarCardEvento(this)">${label}</button>
    `;
    document.getElementById(`activeCard${index}`).style.display = "flex";
    document.getElementById(`createIcon${index}`).style.display = "none"
    }
    let condicional = 0;
    if(pastEvents.length<=6){
        condicional = pastEvents.length
        document.getElementById("next").disabled = true;
    }
    else{
        condicional  = 6
        
    }
    console.log(condicional)
    for(let index = 0; index < condicional ;index++){//carrega cada evento que já
        
        const cepResponse = await fetch(`https://viacep.com.br/ws/${pastEvents[index].CEP}/json/`);
        if (!cepResponse.ok) {
            throw new Error(`Erro ao buscar CEP: ${cepResponse.statusText}`);
        }
        const cepData = await cepResponse.json();

        const data = pastEvents[index].event_date.slice(0, -14);
        const partes = data.split("-")

        document.getElementById(`pastCard${index}`).innerHTML = `
        <h3 id="activeName0">${pastEvents[index].name}</h3>
                    <div class="divide">
                        <p  id="activeType0"><strong>Tipo:</strong>${pastEvents[index].event_type}</p>
                    </div>
                    <div class="divide">
                        <p id="activeDate0"><strong>Data:</strong> ${partes[2]+"/"+partes[1]+"/"+partes[0]}</p>
                        <p id="activeTime0"><strong>Hora:</strong> ${pastEvents[index].event_time.slice(0, -3)}</p>
                    </div>
                    <p id="activeAddress0"><strong>Endereço:</strong> ${cepData.bairro+" - "+cepData.localidade+" - "+cepData.uf}</p>
                    <button id="activeButton${index}" value="${pastEvents[index].id}" onclick="entrarCardEvento(this)">ver</button>
    `;
    
    
    }
   
}

async function switchPage(button){
    switch(button){
        case 0: //voltar
        
        break;
        case 1://avançar
        document.getElementById("back").disabled = false;
        const pagina = document.getElementById("next").value
        if(!pastEvents[6*(pagina+1)]){
            document.getElementById("next").disabled = true;
        }

        let condicional = 0;
    if(pastEvents.length - (6*pagina)<=6){
        condicional = pastEvents.length - (6*pagina);  
    }
    else{
        condicional  = 6
        
    }
    
    for(let index2 = 6*pagina, index = 0; index < (6*pagina)+5 ;index++, index2++){//carrega cada evento que já
        if(!pastEvents[index2]){
            break
        }
        else{

                const cepResponse = await fetch(`https://viacep.com.br/ws/${pastEvents[index].CEP}/json/`);
                if (!cepResponse.ok) {
                    throw new Error(`Erro ao buscar CEP: ${cepResponse.statusText}`);
                }
                const cepData = await cepResponse.json();

                const data = pastEvents[index2].event_date.slice(0, -14);
                const partes = data.split("-")

                document.getElementById(`pastCard${index}`).innerHTML = `
                <h3 id="activeName0">${pastEvents[index2].name}</h3>
                            <div class="divide">
                                <p  id="activeType0"><strong>Tipo:</strong>${pastEvents[index2].event_type}</p>
                            </div>
                            <div class="divide">
                                <p id="activeDate0"><strong>Data:</strong> ${partes[2]+"/"+partes[1]+"/"+partes[0]}</p>
                                <p id="activeTime0"><strong>Hora:</strong> ${pastEvents[index2].event_time.slice(0, -3)}</p>
                            </div>
                            <p id="activeAddress0"><strong>Endereço:</strong> ${cepData.bairro+" - "+cepData.localidade+" - "+cepData.uf}</p>
                            <button id="activeButton${index2}" value="${pastEvents[index2].id}" onclick="entrarCardEvento(this)">ver</button>
            `;
            
            }
        }
        break;
    }
}

