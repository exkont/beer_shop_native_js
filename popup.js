const popupRegistration = document.querySelector('.popup-registration');
const registrationButton = document.querySelector('.registration-button');
const header = document.querySelector('.header');

let isShowPopUp = true;

if (popupRegistration) {
    registrationButton.addEventListener('click', showPopUp);
    popupRegistration.addEventListener('input', setClassForValidate);
    popupRegistration.addEventListener('click', checkElementsClassesForValidate);
    var registrationInputs = popupRegistration.getElementsByTagName('input');
    var submitButton = popupRegistration.getElementsByClassName('registration-form__button-submit');
    submitButton[0].addEventListener('click', submitForm);
    submitButton[0].addEventListener('click', showPopUp);
}

const validatorsData = {
    emailValidator: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    errorFields: document.getElementsByClassName('registration-form__text-error')
};

function showPopUp(elem) {
    const wrapperPopupRegistration = document.querySelector('.wrapper-popup-registration');
    const popUpCross = document.querySelector('.popup-registration__cross');
    let target = elem.target;
    if (target.className === 'registration-button') {
        wrapperPopupRegistration.style.display = 'block';
        popupRegistration.style.display = 'flex';
        registrationButton.removeEventListener('click', showPopUp);
        wrapperPopupRegistration.addEventListener('click', showPopUp);
        popUpCross.addEventListener('click', showPopUp);
    } else {                                                //    } else if (target.className !== 'popup-registration') {
        wrapperPopupRegistration.style.display = 'none';
        popupRegistration.style.display = 'none';
        wrapperPopupRegistration.removeEventListener('click', showPopUp);
        popUpCross.removeEventListener('click', showPopUp);
        registrationButton.addEventListener('click', showPopUp);
    }
    isShowPopUp = !isShowPopUp;
}

function setClassForValidate(elem) {
    elem.target.classList.add('touched');
    checkElementsClassesForValidate(elem.target);
}

function checkElementsClassesForValidate(excludingElem) {
    for (let i = 0; i < registrationInputs.length; i++) {
        if ((registrationInputs[i].className !== excludingElem.className) &&
            (registrationInputs[i]).className.indexOf('touched') !== -1) {
            validate((registrationInputs[i]), i);
        }
    }
}

function validate(validatingElem, i) {
    switch (validatingElem.name) {
        case 'email':
            if (!validatorsData.emailValidator.test(validatingElem.value.toLowerCase())) {
                validatorsData.errorFields[i].innerHTML = 'you entered incorrect email';
            } else {
                validatorsData.errorFields[i].innerHTML = '';
            }
            break;
        case 'password':
        case 'password-repeat':
            if (validatingElem.value.length < 7) {
                validatorsData.errorFields[i].innerHTML = 'password must be more than 6 symbols';
            } else {
                validatorsData.errorFields[i].innerHTML = '';
            }
            break;
        case 'first-name':
        case 'last-name':
            if (validatingElem.value.length < 5) {
                validatorsData.errorFields[i].innerHTML = 'your name must be longer than 5 symbols';
            } else {
                validatorsData.errorFields[i].innerHTML = '';
            }
            break;
        case 'date':
            if (validatingElem.value === '') {
                validatorsData.errorFields[i].innerHTML = 'you didn\'t chose date';
            } else {
                validatorsData.errorFields[i].innerHTML = '';
            }
    }
    if ((registrationInputs[1].className.indexOf('touched') !== -1) &&
        (registrationInputs[2].className.indexOf('touched') !== -1)) {
        isFieldsHaveEqualValue(registrationInputs[1], registrationInputs[2]);
    }
    submitButton[0].disabled = !isCorrectForm();
}

// review - тут spead оператор не нужен если у тебя всегда булет только два аргумента
function isFieldsHaveEqualValue(elem1, elem2) {
    switch (elem1.name) {
        case 'password':
        case 'password-repeat':
            if (elem1.value !== elem2.value) {
                elem1.nextSibling.nextSibling.innerHTML = elem1.nextSibling.nextSibling.innerHTML === '' ?
                    'passwords are not equal' : 'password must be more than 6 symbols passwords are not equal';
                elem2.nextSibling.nextSibling.innerHTML = elem2.nextSibling.nextSibling.innerHTML === '' ?
                    'passwords are not equal' : 'password must be more than 6 symbols passwords are not equal';
            }
    }
}

function isCorrectForm() {
    for (let i = 0; i < registrationInputs.length; i++) {
        if ((registrationInputs[i].value === '') || (validatorsData.errorFields[i].innerHTML !== '')) {
            return false;
        }
    }
    return true;
}

function submitForm() {
    console.log('submit!');
    deleteElements('.registration-button');
    const div = createElement('div', header, 'user-name');
    addTextSrcToElement(div, `Thank you for registration, ${registrationInputs[3].value} ${registrationInputs[4].value}`);
}
