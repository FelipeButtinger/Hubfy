const urlParams = new URLSearchParams(window.location.search);
const thisId = urlParams.get('id');
document.addEventListener('DOMContentLoaded', async () => {
   
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
  userData = await response.json();    
        console.log(userData.id)
        receiveHonors()
        receiveRatings()
 
})
async function receiveHonors(){
    const allHonorResponse = await fetch(`http://localhost:3000/honorInfo?id=${thisId}`, {
        method: 'GET'
    });

    honorData = await allHonorResponse.json();
    if(honorData.leadership_honors==null){
        honorData.leadership_honors = 0
    }
    if(honorData.sociable_honors==null){
        honorData.sociable_honors = 0
    }
    if(honorData.participative_honors==null){
        honorData.participative_honors = 0
    }
    document.getElementById("leadership").textContent = honorData.leadership_honors;
    document.getElementById("sociable").textContent = honorData.sociable_honors;
    document.getElementById("participative").textContent = honorData.participative_honors;
    
}
async function receiveRatings(){
    const ratingsResponse = await fetch(`http://localhost:3000/getRatings?userId=${thisId}`, {
        method: 'GET'
    });
    
    let ratingsResult = await ratingsResponse.json();
    document.getElementById('rating').textContent = parseFloat(ratingsResult.average_rating).toFixed(1);

    ratingsResult.ratings.forEach(rating => {
        if(rating.rating_user_id!=userData.id){
            addComment(rating);
            console.log(rating)
        }else{
            userComment(rating)
   
        }
    });
}
function userComment(rating){
    document.getElementById('yourRating').innerHTML = `
    <div id='topHalf' style="height: 5dvh;display:flex;justify-content: space-around">
    <div style="height: 5dvh;display:flex"><img style="height: 5dvh" src="../src/lider.png" alt=""><h3>${userData.name}</h3></div>
    <div style="height: 5dvh;display:flex"><img style="height: 5dvh" src="../src/yellowStar.png" alt=""><h3>${rating.rating_value}</h3></div>
    </div>
    <div id='bottomHalf ' style="height: 90%;display:flex; justify-content:center;align-items:center">
    <textarea style="resize: none;height: 60%;width: 35dvw;display:flex" id="comment" name="description" required maxlength="500">${rating.comment}</textarea>
    </div>
    `
}
function addComment(rating){
    const div = document.createElement('div');
    div.classList.add('commentCard');

    div.innerHTML = `
    <div id='topHalf' style="height: 5dvh;display:flex;justify-content: space-around">
    <div style="height: 5dvh;display:flex"><img style="height: 5dvh" src="../src/lider.png" alt=""><h3>${userData.name}</h3></div>
    <div style="height: 5dvh;display:flex"><img style="height: 5dvh" src="../src/yellowStar.png" alt=""><h3>${rating.rating_value}</h3></div>
    </div>
    <div id='bottomHalf ' style="height: 90%;display:flex; justify-content:center;align-items:center">
    <textarea style="resize: none;height: 60%;width: 35dvw;display:flex" id="comment" name="description" required maxlength="500">${rating.comment}</textarea>
    </div>
    
`;
    comments.appendChild(div); // Adiciona ao elemento <main>
}
