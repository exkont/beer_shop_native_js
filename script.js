
const url = 'https://api.punkapi.com/v2/beers?';

//data for urls for pagination requesting
let page = 1;
let countOfBeersPerPage = 20;

//data for urls for listing IDs requesting
let listOfIDs = [1,2,3];

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

sendRequest(createRequest('pagination'))
    .then(data => {
        const dataFromServer = data;
        console.log(dataFromServer);
    })
    .catch(err => console.error(err));
sendRequest(createRequest('listing'))
    .then(data => {
        const dataFromServer = data;
        console.log(dataFromServer);
    })
    .catch(err => console.error(err));
