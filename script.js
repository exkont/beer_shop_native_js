const url = 'https://api.punkapi.com/v2/beers?';

//data for urls for pagination requesting
let page = 1;
let maxCountOfPages = 5;
let countOfBeersPerPage = 20;

//bucket data
let storageArrayOfIDs = localStorage.getItem('listOfIDs') ?
    localStorage.getItem('listOfIDs').split('|').map(e => Number(e)) : [];
let setOfIDs = new Set(storageArrayOfIDs);

//search data
let search = [];
const searchData = {
    checkedSearchingField: Array.from(document.getElementsByClassName('form_radio_btn__btn')),
    searchingString:  document.getElementsByClassName('search-string__input')[0],
    filteredDownloadedData: [],
    // searchingParameters: [],
    getCheckedButton: function () {
        return this.checkedSearchingField.filter(elem => elem.checked)[0].value;
    },
    getSearchString: function () {
        return this.searchingString.value.toLowerCase();
    },
    clearFilteredDownloadedData: function () {
        this.filteredDownloadedData = [];
    }
};

//get finding parts
const findingSection = document.querySelector('.finding-section');
if (findingSection) findingSection.addEventListener('input', searchProducts);


//place which will include list of products
const sectionBody = document.querySelector('.section-body');
sectionBody.addEventListener('change', changeBucketsList);

//get content parts
const contentMain = document.querySelector('.content-main');
const contentBucket = document.querySelector('.content-bucket');

//pagination
let pagination = document.querySelector('.pagination');
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

function createUrlRequest(goal, page, countOfBeersPerPage) {
    switch (goal) {
        case 'list':
            return url + 'page=' + page + '&per_page=' + countOfBeersPerPage;
        case 'bucket':
            return url + 'ids=' + localStorage.getItem('listOfIDs').split('|').slice(countOfBeersPerPage * (page - 1)).join('|');
        case 'search':
            return url + 'ids=' + localStorage.getItem('listOfIDs').split('|').slice(countOfBeersPerPage * (page - 1)).join('|');
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

function createListOfProducts(listOfProducts) {
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
}

function changeBucketsList(event) {
    let positions = Number(event.target.getAttribute('position'));
    event.target.checked ? setOfIDs.add(positions) : setOfIDs.delete(positions);
    sortSet(setOfIDs);
    localStorage.setItem('listOfIDs', `${[...setOfIDs].join('|')}`);
    console.log(setOfIDs);
}

function sortSet(set) {
    setOfIDs = new Set([...set].sort((a, b) => a - b));
}

function downloadPage() {
    deleteElements('.section-body-item');
    deleteElements('.pagination__next-page-search');
    deleteElements('.pagination__next-page-list');
    deleteElements('.pagination__next-page-bucket');
    if (contentMain) {
        let goal = 'list';
        sendRequest(createUrlRequest(goal, page, countOfBeersPerPage))
            .then(data => createListOfProducts(data))
            .then(() => putTickOnProducts())
            .then(() => createPagination(goal));
    }
    if (contentBucket) {
        let goal = 'bucket';
        sendRequest(createUrlRequest(goal, page, countOfBeersPerPage))
            .then(data => createListOfProducts(data))
            .then(() => putTickOnProducts())
            .then(() => createPagination(goal));
    }
}

function putTickOnProducts() {
    const products = document.querySelectorAll('.container-checkbox__checkbox');
    for (let i = 0; i < products.length; i++) {
        if (setOfIDs.has(Number(products[i].getAttribute('position')))) products[i].checked = true;
    }
}

function createPagination(goal) {
    switch (goal) {
        case 'list':
            for (let i = 0; i < maxCountOfPages; i++) {
                i === 0 ?
                    createElement('a', pagination, 'pagination__next-page-list', `${i + 1}`).classList.add('pagination__next-page_active') :
                    createElement('a', pagination, 'pagination__next-page-list', `${i + 1}`);
            }
            break;
        case 'bucket':
            for (let i = 0; i < Math.ceil(storageArrayOfIDs.length / countOfBeersPerPage); i++) {
                i === 0 ?
                    createElement('a', pagination, 'pagination__next-page-bucket', `${i + 1}`).classList.add('pagination__next-page_active') :
                    createElement('a', pagination, 'pagination__next-page-bucket', `${i + 1}`);
            }
            break;
        case 'search':
            for (let i = 0; i < Math.ceil(searchData.filteredDownloadedData.length / countOfBeersPerPage); i++) {
                i === 0 ?
                    createElement('a', pagination, 'pagination__next-page-search', `${i + 1}`).classList.add('pagination__next-page_active') :
                    createElement('a', pagination, 'pagination__next-page-search', `${i + 1}`);
            }
    }
}

function changePage(elem) {
    let target = elem.target;
    if (target.className.indexOf('pagination__next-page') !== -1 && page !== Number(target.innerText)) {
        page = target.innerText;
        deleteElements('.section-body-item');
        let goal;
        switch (target.className) {
            case 'pagination__next-page-list':
                goal = 'list';
                sendRequest(createUrlRequest(goal, page, countOfBeersPerPage))
                    .then(data => createListOfProducts(data))
                    .then(() => putTickOnProducts());
                break;
            case 'pagination__next-page-bucket':
                goal = 'bucket';
                sendRequest(createUrlRequest(goal, page, countOfBeersPerPage))
                    .then(data => createListOfProducts(data))
                    .then(() => putTickOnProducts());
                break;
            case 'pagination__next-page-search':
                goal = 'search';
                createListOfProducts(searchData.filteredDownloadedData.slice((page-1) * countOfBeersPerPage, (page-1) * countOfBeersPerPage + 20));
                putTickOnProducts();
        }
        changedPagesNumbersStyle(target);
    }
}

function changedPagesNumbersStyle(target) {
    document.querySelector('.pagination__next-page_active').classList.remove('pagination__next-page_active');
    target.classList.add('pagination__next-page_active');
}

function deleteElements(selector) {
    let bodyItemsArr = document.querySelectorAll(selector);
    for (let i = 0; i < bodyItemsArr.length; i++) {
        bodyItemsArr[i].remove();
    }
}

function searchProducts() {
    // filterSearchRequest();
    if (searchData.getSearchString() !== '') {
        let goal = 'search';
        console.log('страница загружена');
        searchData.clearFilteredDownloadedData();

        async function* fetchCommits() {
            let page = 1;
            while (true) {
                let url = createUrlRequest('list', page, maxCountOfPages);
                const response = await fetch(url);
                const answers = await response.json();
                if (answers.length === 0) {
                    console.log('Streams have no more data');
                    return;
                }
                page++;
                for(let answer of answers) {
                    yield answer;
                }
            }
        }

        (async () => {
            for await (const commit of fetchCommits()) {
                if ((commit[searchData.getCheckedButton()].toLowerCase().indexOf(`${searchData.getSearchString()}`) >= 0)
                    && (searchData.filteredDownloadedData.find(elem => elem.id === commit.id) === undefined)) {
                    searchData.filteredDownloadedData.push(commit);
                }
                if (searchData.filteredDownloadedData.length >= maxCountOfPages * countOfBeersPerPage) {
                    break;
                }
            }
            searchData.filteredDownloadedData = searchData.filteredDownloadedData.sort((a, b) => {
                if (a[searchData.getCheckedButton()].toLowerCase() > b[searchData.getCheckedButton()].toLowerCase()) return 1;
                if (a[searchData.getCheckedButton()].toLowerCase() < b[searchData.getCheckedButton()].toLowerCase()) return -1;
                return 0;
                // return a.id - b.id;
            });
            console.log(searchData.filteredDownloadedData);
        })().then(() => deleteElements('.section-body-item'))
            .then(() => deleteElements('.pagination__next-page-search'))
            .then(() => createListOfProducts(searchData.filteredDownloadedData))
            .then(() => putTickOnProducts())
            .then(() => deleteElements('.pagination__next-page-list'))
            .then(() => createPagination(goal));
    } else if (searchData.getSearchString() === '') {
        downloadPage();
        console.log('страница по умолчанию');
        console.log(searchData.getSearchString() === '');
    }
}

function alerting() {
    console.log(searchData.filteredDownloadedData);
}

downloadPage();
