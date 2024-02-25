$(document).ready(function() {

    let catchButtonDiv = $('#button-div');
    let pokemonDiv = $('#pokemon-div');
    let errorDiv = $('#error-div');

    const pokemonArr = [];

    $(document).on('click', '#get-pokemon', showPokemon);

    async function getAllPokemon(limit) {
        try {
          let res = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=${limit}`);
          return res.data;
        } catch(err) { displayErr(err); }
    }

    async function getPokemon(num) {
        try {
          let res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${num}`);
          return res.data;
        } catch(err) { displayErr(err); }
    }

    async function getPokeSpecies(name) {
        try {
          let res = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
          return res.data;
        } catch(err) { displayErr(err); }
    }

    function createButton(){
        let catchButton = document.createElement('button');
        catchButton.classList.add('btn', 'btn-warning', 'p-2', 'mb-5');
        catchButton.id = 'get-pokemon';
        catchButton.innerText = "GOTTA CATCH'EM ALL";
        catchButtonDiv.append(catchButton);
    }

    // display pokemon to UI
    function showPokemon(){
        $('#get-pokemon').prop('disabled', true);
        for (let item of pokemonArr) {
            pokemonDiv.append(`<div class="card align-self-stretch mx-2" style="width: 18rem;">
                                <img class="card-img-top" src="${item.image}" alt="${item.name} sprite">
                                    <div class="card-body">
                                        <h5 class="card-title">${item.name}</h5>
                                        <p class="card-text">${item.flavor_text}</p>
                                    </div>
                                </div>`);
        }
    }

    //https://mavtipi.medium.com/how-to-generate-unique-random-numbers-in-a-specified-range-in-javascript-80bf1a545ae7
    function generateRandomNumbers(quantity, max){
        const set = new Set()
        while(set.size < quantity) {
          set.add(Math.floor(Math.random() * max) + 1)
        }
        return set
    }

    function displayErr(err){
        errorDiv.append(`<p>${err.message}. Please refresh the page.</p>`)
    }

    async function main() {
        //get all pokemon and log data
        let allPokemon = await getAllPokemon(1302);
        console.log(allPokemon);

        // get three random pokemon from prev req and log data
        let threePokemon = [];
        let count = allPokemon.count;
        let randomNums = generateRandomNumbers(25, count)
        for(let num of randomNums){
            let res = await getPokemon(num);
            if(res) threePokemon.push(res);
            if(threePokemon.length === 3) break;
        }
        threePokemon.forEach(p => console.log(p));

        // store names from prev & make species req for each
        // log name and eng flavor_text for each
        // combine values in array for UI display
        let threePokeNames = [];
        let idx = 0;
        for(let pokemon of threePokemon){
            threePokeNames.push(pokemon.name);
        }
        for(let name of threePokeNames){
            let res = await getPokeSpecies(name);
            if(res.flavor_text_entries){
                for (let i in res.flavor_text_entries) {
                    // confirm res has english flavor-text
                    if(res.flavor_text_entries[i].language.name === 'en'){
                        console.log(`name: ${name}, flavor_text: ${res.flavor_text_entries[i].flavor_text}`);
                        // add values to UI display array
                        pokemonArr.push(
                            {name: `${name}`, 
                            flavor_text: `${res.flavor_text_entries[i].flavor_text}`, 
                            image: `${threePokemon[idx].sprites['front_default']}`
                        });
                        idx++;
                        break;
                    }
                }
            }
        }

        // if pokemon are ready for display load button
        if(pokemonArr) createButton();
    }

    main();

});

