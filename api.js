const url = 'https://api.punkapi.com/v2/beers?';

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
            if (localStorage.getItem('listOfIDs')) {
                return url + 'ids=' + localStorage.getItem('listOfIDs').split('|').slice(countOfBeersPerPage * (page - 1)).join('|');
            } else {
                return url + 'ids=';
            }
    }
}

function searchProducts() {
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
                    console.log('больше нет данных, удовлетворяющих поиск');
                    return;
                }
                page++;
                for (let answer of answers) {
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
        console.log('страница по умолчанию. т.е без запроса');
    }
}
