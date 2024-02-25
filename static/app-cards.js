$(document).ready(function() {

    let buttonDiv = $('#button-div');
    let cardsDiv = $('#cards-div');
    let errDiv = $('#error-div');
    let getCardBtn;

    let mainDeckId;
    let mainCard;

    $(document).on('click', '#get-card', displayCard);

    async function getDeck(count) {
        try {
          let res = await axios.get(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${count}`);
          return res.data.deck_id;
        } catch(err) { displayErr(err); }
    }

    async function getCard(id) {
        try {
          let res = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`);
          return res.data.cards[0];
        } catch(err) { displayErr(err); }
    }

    async function displayCard() {
        try {
            // display rotated card image
            // https://stackoverflow.com/questions/13455042/random-number-between-negative-and-positive-value
            let randomNum = Math.ceil(Math.random() * 12) * (Math.round(Math.random()) ? 1 : -1);
            cardsDiv.append(`<div class="card-img"><img src="${mainCard.image}" style="transform: rotate(${randomNum}deg);"></div>`);

            getCardBtn.disabled = true;
            mainCard = null;
            
            mainCard = await getCard(mainDeckId);
            if (mainCard) getCardBtn.disabled = false;

        } catch(err) { displayErr(err); }
    }

    function createButton(){
        getCardBtn = document.createElement('button');
        getCardBtn.classList.add('btn', 'btn-secondary', 'p-3');
        getCardBtn.id = 'get-card';
        getCardBtn.innerText = 'Give me a card!';
        getCardBtn.disabled = true;
        buttonDiv.append(getCardBtn);
    }

    function displayErr(err){
        errDiv.append(`<p>${err.message}. Please refresh the page.</p>`)
    }

    async function main() {
        // log single card
        let deckId1 = await getDeck(1);
        let card1 = await getCard(deckId1);
        console.log(`${card1.value} of ${card1.suit}`);

        // log two cards
        let card2 = await getCard(deckId1);
        let card3 = await getCard(deckId1);
        console.log(`${card2.value} of ${card2.suit}`);
        console.log(`${card3.value} of ${card3.suit}`);

        // build button for interaction
        // set primary deck id & get first card for display
        createButton();
        mainDeckId = await getDeck(1);
        mainCard = await getCard(mainDeckId);
        getCardBtn.disabled = false;
    }
    
    main();
    
});




