$(document).ready(function() {

    let favNumCard = $('#favorite-number');
    let multiNumList = $('#multiple-numbers');
    let fourNumsList = $('#four-facts');

    async function getFavNum(num) {
        try {
          let res = await axios.get(`http://numbersapi.com/${num}?json`);
          favNumCard.text(res.data.text);
        } catch(err) {
            favNumCard.text(displayErrorMsg(err));
        }
    }

    async function getMultiNum(min, max) {
        try {
            let res = await axios.get(`http://numbersapi.com/${min}..${max}`);
            for (let i in res.data) {
                multiNumList.append(`<li class="list-group-item">${res.data[i]}</li>`);
            }
        } catch(err) {
            multiNumList.append(`<li class="list-group-item">${displayErrorMsg(err)}</li>`);
        }
    }

    async function getFavNumbers(num, count) {
        try {
            for (let i in [...Array(count).keys()]) {
                let res = await axios.get(`http://numbersapi.com/${num}?json`);
                fourNumsList.append(`<li class="list-group-item">${res.data.text}</li>`);
            }
        } catch(err) {
            fourNumsList.append(`<li class="list-group-item">${displayErrorMsg(err)}</li>`);
        }
    }

    function displayErrorMsg(err){
        return `${err.message}. Please refresh the page.`
    }

    getFavNum(7);
    getMultiNum(1, 10);
    getFavNumbers(7, 4);

});




