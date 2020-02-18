
//data for urls for pagination requesting
let page = 1;
let maxCountOfPages = 5;        //this parameter can be const but in future this parameter can change
let countOfBeersPerPage = 20;   //this parameter can be const too but in future this parameter can change

//bucket data
let storageArrayOfIDs = localStorage.getItem('listOfIDs') ?
    localStorage.getItem('listOfIDs').split('|').map(e => Number(e)) : [];
let setOfIDs = new Set(storageArrayOfIDs);

//search data
let search = [];
const searchData = {
    checkedSearchingField: Array.from(document.getElementsByClassName('form_radio_btn__btn')),
    searchingString: document.getElementsByClassName('search-string__input')[0],
    filteredDownloadedData: [],
    getCheckedButton: function () {
        if (this.checkedSearchingField.filter(elem => elem.checked)[0].value) {
            return this.checkedSearchingField.filter(elem => elem.checked)[0].value;
        } else {
            return 'name';  //default searching field
        }
    },
    getSearchString: function () {
        return this.searchingString.value.toLowerCase();
    },
    clearFilteredDownloadedData: function () {
        this.filteredDownloadedData = [];
    }
};



//get finding parts
// review - зачем это всё в глобальной области лежит если не используется ни где кромне как просто вызваться? Лучше закинуть это в небольшие фнкции типа  setupFindingListener.
setupListenerOnElement('.finding-section', 'input', searchProducts);


//place which will include list of products
const sectionBody = document.querySelector('.section-body');
sectionBody.addEventListener('change', changeBucketsList);

// review - тоже, данная переменная нужна только для одной фунции, можно в таком лучае её там и объявлять... прогляди остальные свои переменные, думаю тут ещё такие есть.
// here was two variables

//pagination
// review - почему не const? старайся всё делать const по возможности.
const pagination = document.querySelector('.pagination');
pagination.addEventListener('click', changePage);

// review - в этой функции от event используется только target логично передавать тогда только его, а не весь event.
function changeBucketsList(event) {
    const target = event.target;
    const positions = Number(target.getAttribute('position'));
    // review - не юзай так тернарки.
    if (target.checked) {
        setOfIDs.add(positions)
    } else {
        setOfIDs.delete(positions);
    }
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
    const contentMain = document.querySelector('.content-main');
    const contentBucket = document.querySelector('.content-bucket');
    let goal;
    if (contentMain) {
        goal = 'list';
    } else if (contentBucket) {
        goal = 'bucket';
    }
    sendRequest(createUrlRequest(goal, page, countOfBeersPerPage))
        .then(data => createListOfProducts(data))
        .then(() => putTickOnProducts())
        .then(() => createPagination(goal));
}

function putTickOnProducts() {
    const products = document.querySelectorAll('.container-checkbox__checkbox');
    for (let i = 0; i < products.length; i++) {
        if (setOfIDs.has(Number(products[i].getAttribute('position')))) {
            products[i].checked = true;
        }
    }
}

function createPagination(goal) {
    const goalType = ['list', 'bucket', 'search'].find(type => type === goal);
    //Todo: проверять на null и undefined.
    // answer - Это легко сделать и выдавать нечто деволтное. Но это не совсем корректно выдавать при ошибке какую стандратную пагинацию
    // answer - А цикл ниже все равно ни разу не сработает, потому что условие не выполнится и будет просто пустая пагинация
    const count = {
        list: maxCountOfPages,
        bucket: Math.ceil(storageArrayOfIDs.length / countOfBeersPerPage),
        search: Math.ceil(searchData.filteredDownloadedData.length / countOfBeersPerPage)
    };
    for (let i = 0; i < count[goalType]; i++) {  ////проверить на null
        const element = createElement('a', pagination, `pagination__next-page-${goalType}`);
        addTextSrcToElement(element,  `${i + 1}`);
        if (i === 0) {
            element.classList.add('pagination__next-page_active')
        }
    }
}

function changePage(elem) {
    let target = elem.target;
    if (target.className.indexOf('pagination__next-page') !== -1 && page !== Number(target.innerText)) {
        page = target.innerText;
        deleteElements('.section-body-item');
        let goal;
        // review - этот switch у тебя повторяется в двух местах, можно часть логики вынести
        // первых два кейса полность одинаковых, можно объеденить
        // answer - кое-что поднял, но объединить первые два нельзя, потому что в каждом кейсе меняется переменная goal
        // answer - а выносить по раздельности list и bucket для изменения переменной, а потом снова объединять list и
        // answer - bucket в одно условие для объединения sendRequest(createUrlRequest(..)).. думаю не стоит
        switch (target.className) {
            case 'pagination__next-page-list':
                goal = 'list';
                sendRequest(createUrlRequest(goal, page, countOfBeersPerPage))
                    .then(data => createListOfProducts(data));
                break;
            case 'pagination__next-page-bucket':
                goal = 'bucket';
                sendRequest(createUrlRequest(goal, page, countOfBeersPerPage))
                    .then(data => createListOfProducts(data));
                break;
            case 'pagination__next-page-search':
                createListOfProducts(searchData.filteredDownloadedData.slice((page - 1) * countOfBeersPerPage, (page - 1) * countOfBeersPerPage + 20));
        }
        putTickOnProducts();
        changedPagesNumbersStyle(target);
    }
}

function changedPagesNumbersStyle(target) {
    document.querySelector('.pagination__next-page_active').classList.remove('pagination__next-page_active');
    target.classList.add('pagination__next-page_active');
}

downloadPage();
