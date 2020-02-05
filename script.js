
const url = 'https://api.punkapi.com/v2/beers?';

//data for urls for pagination requesting
let page = 1;
let countOfBeersPerPage = 20;

//data for urls for listing IDs requesting
let listOfIDs = [1,2,3];

//place which will include list of products
const sectionBody = document.querySelector('.section-body');

function sendRequest(url) {
    return fetch(url).then(response => {
        if (response.ok) {
            return response.json();
        }
        return response.json().then(error => {
            const err = new Error('Something wrong');
            err.data = error;
            throw err;
        });
    });
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

function createElement(tag, appendParameter, className, text = null, src = null, type = null, name = null) {
    const elem = document.createElement(tag);
    if (appendParameter) appendParameter.append(elem);
    if (className) elem.classList.add(className);
    if (text) elem.innerHTML = text;
    if (src) elem.src = src;
    if (type) elem.type = type;
    if (name) elem.name = name;
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
                let label = createElement('label', sectionBodyItemAnnotation, 'container-checkbox', 'Add');
                createElement('input', label, 'container-checkbox__checkbox', null, null, 'checkbox', `id${i}`);
                createElement('span', label, 'container-checkbox__checkmark');

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
