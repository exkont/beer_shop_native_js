function setupListenerOnElement(selector, event, fn) {
    if (document.querySelector(selector)) {
        document.querySelector(selector).addEventListener(event, fn);
    }
}

// review - старайся избеать таких фукнций где на вход идёт много параметров... с ними всегда будут сложности, даже просто покрыть тестами... в идеале 0 или 1 или 2 аргумента, не очень но нормально 3, а 4 это ну если свовсем край =)
function createElement(tag, appendParameter, className) {
    const elem = document.createElement(tag);
    if (appendParameter) {
        appendParameter.append(elem);
    }
    if (className) {
        elem.classList.add(className);
    }
    return elem;
}

function addTextSrcToElement(elem, text = null, src = null) {
    if (text) {
        elem.innerHTML = text;
    }
    if (src) {
        elem.src = src;
    }
    return elem;
}

function addTypePositionToElement(elem, type = null, position = null) {
    if (type) {
        elem.type = type;
    }
    if (position) {
        elem.setAttribute('position', position);
    }
    return elem;
}

function createListOfProducts(listOfProducts) {
    for (let i = 0; i < countOfBeersPerPage; i++) {
        if (listOfProducts[i]) {
            const sectionBodyItem = createElement('div', sectionBody, 'section-body-item');
            const img = createElement('img', sectionBodyItem, 'section-body-item__pic');
            addTextSrcToElement(img, null, listOfProducts[i].image_url);
            const sectionBodyItemAnnotation = createElement('div', sectionBodyItem, 'section-body-item-annotation');
            const h1 = createElement('h1', sectionBodyItemAnnotation, 'section-body-item-annotation__name');
            addTextSrcToElement(h1, listOfProducts[i].name);
            const h2 = createElement('h2', sectionBodyItemAnnotation, 'section-body-item-annotation__tagline');
            addTextSrcToElement(h2, listOfProducts[i].tagline);
            const h4 = createElement('h4', sectionBodyItemAnnotation, 'section-body-item-annotation__description');
            addTextSrcToElement(h4, listOfProducts[i].description);
            const label = createElement('label', sectionBodyItemAnnotation, 'container-checkbox');
            addTextSrcToElement(label, 'Add');
            const input = createElement('input', label, 'container-checkbox__checkbox');
            addTypePositionToElement(input, 'checkbox', `${listOfProducts[i].id}`);
            createElement('span', label, 'container-checkbox__checkmark');
        }
    }
}

function deleteElements(selector) {
    let bodyItemsArr = document.querySelectorAll(selector);
    for (let i = 0; i < bodyItemsArr.length; i++) {
        bodyItemsArr[i].remove();
    }
}
