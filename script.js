
const url = 'https://api.punkapi.com/v2/beers?';

//data for urls for pagination requesting
let page = 1;
let countOfBeersPerPage = 20;

//data for urls for listing IDs requesting
let listOfIDs = [1,2,3];

//place which will include list of beers
const sectionBody = document.querySelector('.section-body');

// const dataFromServer;
// let promise = new Promise(((resolve, reject) => {
//     dataFromServer = fetch(requestPaginationUrl);
//     if (dataFromServer.ok) {
//         let json = dataFromServer.json();
//
//     }
// }))

function sendRequest(url) {
    return fetch(url).then(response => {
        if (response.ok) {
            return response.json();    //return response.text();
        }

        return response.json().then(error => {
            const err = new Error('Something wrong');
            err.data = error;
            throw err;
        })
    })
}

function createRequest(goal) {
    switch (goal) {
        case 'pagination':
            return url + 'page=' + page + '&per_page=' + countOfBeersPerPage;
            break;
        case 'listing':
            return url + 'ids=' + listOfIDs.join('|');
            break;
    }
}

function createElement(tag, appendParameter, className, text = null, src = null) {
    const elem = document.createElement(tag);
    if (appendParameter) appendParameter.append(elem);
    if (className) elem.classList.add(className);
    if (text) elem.innerHTML = text;
    if (src) elem.src = src;
    return elem;
}

function createListOfProducts() {
    sendRequest(createRequest('pagination'))
        .then(data => {
            const listOfProducts = data;
            console.log(listOfProducts);
            console.log(listOfProducts.length);
            for (let i = 0; i < listOfProducts.length; i++) {
                let sectionBodyItem = createElement('div', sectionBody,'section-body-item');
                createElement('img', sectionBodyItem,'section-body-item__pic', null, listOfProducts[i].image_url);
                let sectionBodyItemAnnotation = createElement('div', sectionBodyItem,'section-body-item-annotation');
                createElement('h1', sectionBodyItemAnnotation, 'section-body-item-annotation__name', listOfProducts[i].name);
                createElement('h2', sectionBodyItemAnnotation, 'section-body-item-annotation__tagline', listOfProducts[i].tagline);
                createElement('h4', sectionBodyItemAnnotation, 'section-body-item-annotation__description', listOfProducts[i].description);
            }
        })
        .catch(err => console.error(err));
}

// sendRequest(createRequest('pagination'))
//     .then(data => {
//         const dataFromServer = data;
//         console.log(dataFromServer);
//         console.log(dataFromServer.length);
//     })
//     .catch(err => console.error(err));
// sendRequest(createRequest('listing'))
//     .then(data => {
//         const dataFromServer = data;
//         console.log(dataFromServer);
//         console.log(dataFromServer.length);
//     })
//     .catch(err => console.error(err));


createListOfProducts();
