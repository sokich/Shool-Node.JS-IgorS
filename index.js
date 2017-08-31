class Form {
    constructor() {
        document.getElementById('myForm').addEventListener('submit', this.submit.bind(this));
        this.submit = this.submit.bind(this);
        this.validate = this.validate.bind(this);
        this.setData = this.setData.bind(this);
        this.getData = this.getData.bind(this);
    }
    resetError(container) {
    container.className = '';
    if (container.lastChild.className == "error-message") {
        container.removeChild(container.lastChild);
        }
    }
    showError(container, errorMessage) {
        container.className = 'error';
        var msgElem = document.createElement('span');
        msgElem.className = "error-message";
        msgElem.innerHTML = errorMessage;
        container.parentNode.appendChild(msgElem);
    }


    submit(event) {
        var form = document.getElementById('myForm');
        var elems = form.elements;
        if (typeof event !== 'undefined') {
            event.preventDefault();
        }
        this.resetError(elems.fio.parentNode);
        this.resetError(elems.email.parentNode);
        this.resetError(elems.phone.parentNode);

        let validationResult = this.validate();
        const resultContainer = document.getElementById('resultContainer');
        const submitButton = document.getElementById('submitButton');

        for (let input of document.getElementsByTagName('input')) {
            input.classList.remove('error');
        }

        resultContainer.className = '';
        resultContainer.innerHTML = '';

        if (validationResult.isValid) {
            submitButton.disabled = true;

            let fetchJSONFile = () => {
                const xhr = new XMLHttpRequest();

                xhr.open('GET', document.getElementById('myForm').action, false);
                xhr.send();
                const successStatusCode = 200;
                const operationCompleteCode = 4;

                if (xhr.readyState === operationCompleteCode) {
                    if (xhr.status === successStatusCode) {
                        let data = JSON.parse(xhr.responseText);

                        if (data.status === 'success') {
                            resultContainer.className = 'success';
                            resultContainer.innerHTML = 'Success';
                        } else if (data.status === 'error') {
                            resultContainer.className = 'error';
                            resultContainer.innerHTML = data.reason;
                        } else if (data.status === 'progress') {
                            resultContainer.className = 'progress';
                            setTimeout(() => {
                                fetchJSONFile();
                        }, data.timeout);
                        }
                    }
                }
            };

            fetchJSONFile();

        } else {
            for (let value of validationResult.errorFields) {
              console.log(document.getElementById(value));
                this.showError(document.getElementById(value),"В этом поле допущена ошибка");
                document.getElementById(value).className = 'error';

            }
        }
    }

    validate() {
        let errorFields = [];
        let isValid = true;

        const allowedDomains = ['ya.ru', 'yandex.ru', 'yandex.ua', 'yandex.by', 'yandex.kz', 'yandex.com'];
        const domain = document.getElementById('email').value.replace(/.*@/, '');

        if (!allowedDomains.includes(domain)) {
            isValid = false;
            errorFields.push('email');
        }

        const fio = document.getElementById('fio').value;
        const fioWordsLength = document.getElementById('fio').value.trim().split(/\s+/).length;
        const fioMaxWords = 3;

        if (fioWordsLength !== fioMaxWords) {
            isValid = false;
            errorFields.push('fio');
        }

        if (!/^[a-zA-Z а-яА-Я]*$/g.test(fio)) {
            isValid = false;
            errorFields.push('fio');
        }

        const phoneNumber = document.getElementById('phone').value;
        const phonePattern = new RegExp(/^\+7\(\d{3}\)\d{3}(?:-\d{2}){2}$/);
        const maxSumOfDigitsInPhoneNumber = 30;

        let sumOfDigitsInPhoneNumber = (number) => {
            return number.match(/\d/g).reduce((a, b) => +a + +b);
        };

        if (phonePattern.test(phoneNumber)) {
            if (sumOfDigitsInPhoneNumber(phoneNumber) >= maxSumOfDigitsInPhoneNumber) {
                isValid = false;
                errorFields.push('phone');
            }

        } else {
            isValid = false;
            errorFields.push('phone');
        }

        return {
            isValid: isValid,
            errorFields: errorFields
        };

    }

    getData() {
        let data = [];
        return [].reduce.call(document.getElementById('myForm').elements, (data, element) => {
                let isValidElement = (el) => {
                return el.name === el.id;
    };

        if (isValidElement(element)) {
            data[element.name] = element.value;
        }

        return data;
    }, {});
    }

    setData(data) {
        const form = document.getElementById('myForm');

        for (let [key, value] of Object.entries(data)) {
            if (key === 'phone' || key === 'email' || key === 'fio') {
                if (form.elements[key]) {
                    form.elements[key].value = value;
                }
            }
        }
    }
}

const MyForm = new Form();
