const url = 'https://api.punkapi.com/v2/beers?';

//data for urls for pagination requesting
let page = 1;
let maxCountOfPages = 5;
let countOfBeersPerPage = 20;

//bucket data
let storageArrayOfIDs = localStorage.getItem('listOfIDs') ?
    localStorage.getItem('listOfIDs').split('|').map(e => Number(e)) : [];
let setOfIDs = new Set(storageArrayOfIDs);
console.log(storageArrayOfIDs.length);

//place which will include list of products
const sectionBody = document.querySelector('.section-body');
sectionBody.addEventListener('change', changeBucketsList);

//get content parts
const contentMain = document.querySelector('.content-main');
const contentBucket = document.querySelector('.content-bucket');
let goal;


//pagination
let pagination = document.querySelector('.pagination');
// console.log(pagination);
pagination.addEventListener('click', changePage);


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

function createRequest() {
    switch (goal) {
        case 'list':
            return url + 'page=' + page + '&per_page=' + countOfBeersPerPage;
            break;
        case 'bucket':
            return url + 'ids=' + localStorage.getItem('listOfIDs').split('|').slice(countOfBeersPerPage * (page - 1)).join('|');
            break;
    }
}

function createElement(tag, appendParameter, className, text = null, src = null, type = null, position = null) {
    const elem = document.createElement(tag);
    if (appendParameter) appendParameter.append(elem);
    if (className) elem.classList.add(className);
    if (text) elem.innerHTML = text;
    if (src) elem.src = src;
    if (type) elem.type = type;
    if (position) elem.setAttribute('position', position);
    return elem;
}

function createListOfProducts() {
    return sendRequest(createRequest())
        .then(data => {
            const listOfProducts = data;
            // console.log(listOfProducts);
            // console.log(listOfProducts.length);
            for (let i = 0; i < countOfBeersPerPage; i++) {
                if (listOfProducts[i]) {
                    let sectionBodyItem = createElement('div', sectionBody, 'section-body-item');
                    createElement('img', sectionBodyItem, 'section-body-item__pic', null, listOfProducts[i].image_url);
                    let sectionBodyItemAnnotation = createElement('div', sectionBodyItem, 'section-body-item-annotation');
                    createElement('h1', sectionBodyItemAnnotation, 'section-body-item-annotation__name', listOfProducts[i].name);
                    createElement('h2', sectionBodyItemAnnotation, 'section-body-item-annotation__tagline', listOfProducts[i].tagline);
                    createElement('h4', sectionBodyItemAnnotation, 'section-body-item-annotation__description', listOfProducts[i].description);
                    let label = createElement('label', sectionBodyItemAnnotation, 'container-checkbox', 'Add');
                    createElement('input', label, 'container-checkbox__checkbox', null, null, 'checkbox', `${listOfProducts[i].id}`);
                    createElement('span', label, 'container-checkbox__checkmark');
                }
            }
        })
        .catch(err => console.error(err));
}

function changeBucketsList(event) {
    let positions = Number(event.target.getAttribute('position'));
    event.target.checked? setOfIDs.add(positions) : setOfIDs.delete(positions);
    sortSet(setOfIDs);
    localStorage.setItem('listOfIDs', `${[...setOfIDs].join('|')}`);
    console.log(setOfIDs);
}

function sortSet(set) {
    setOfIDs = new Set([...set].sort((a,b) => a-b));
}

function downloadPage() {
    if (contentMain) {
        goal = 'list';
        createListOfProducts(goal)
            .then(() => putTickOnProducts())
            .then(() => createPagination(goal));
    }
    if (contentBucket) {
        goal = 'bucket';
        createListOfProducts(goal)
            .then(() => putTickOnProducts())
            .then(() => createPagination(goal));
    }
}

function putTickOnProducts() {
    const products = document.querySelectorAll('.container-checkbox__checkbox');
    for (let i = 0; i < products.length; i++) {
        if (setOfIDs.has(Number(products[i].getAttribute('position')))) {
            products[i].checked = true;
        }
    }
}

function createPagination() {
    switch (goal) {
        case 'list':
            for (let i = 0; i < maxCountOfPages; i++) {
                i === 0 ?
                    createElement('a', pagination, 'pagination__next-page', `${i+1}`).classList.add('pagination__next-page_active') :
                    createElement('a', pagination, 'pagination__next-page', `${i+1}`);
            }
            break;
        case 'bucket':
            for (let i = 0; i < Math.ceil(storageArrayOfIDs.length/countOfBeersPerPage); i++) {
                i === 0 ?
                    createElement('a', pagination, 'pagination__next-page', `${i+1}`).classList.add('pagination__next-page_active') :
                    createElement('a', pagination, 'pagination__next-page', `${i+1}`);
            }
    }
}

function changePage(elem) {
    let target = elem.target;
    if (target.className === 'pagination__next-page' && page !== Number(target.innerText)) {
        page = target.innerText;
        changedPagesNumbersStyle(target);
        deleteList();
        createListOfProducts(goal).then(() => putTickOnProducts())
    }
}

function changedPagesNumbersStyle(target) {
    document.querySelector('.pagination__next-page_active').classList.remove('pagination__next-page_active');
    target.classList.add('pagination__next-page_active');
}

function deleteList() {
    let bodyItemsArr = document.querySelectorAll('.section-body-item');
    for (let i = 0;  i < bodyItemsArr.length; i++) {
        bodyItemsArr[i].remove();
    }
}

downloadPage();































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


// createListOfProducts('pagination');
// createListOfProducts('listing');
