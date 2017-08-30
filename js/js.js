/**
 * Created by IgorS on 27.08.2017.
 */

class Form {
    constructor() {
        document.getElementById('myForm').addEventListener('submit', this.submit.bind(this));
        this.submit = this.submit.bind(this);
        this.validate = this.validate.bind(this);
        this.setData = this.setData.bind(this);
        this.getData = this.getData.bind(this);
    }
    submit(event) {
        if (typeof event !== 'undefined') {
            event.preventDefault();
        }

        let validationResult = this.validate();
        const resultContainer = document.getElementById('resultContainer');
        const submitButton = document.getElementById('submitButton');

        for (let input of document.getElementsByTagName('input')) {
            input.classList.remove('error');
        }

        resultContainer.className = '';
        resultContainer.innerHTML = '';

        console.log(validationResult.isValid);
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

        }
        else {
            return false
        }
    }
 validate() {
     var errorFields = [];
     var isValid = true;
     var form = document.getElementById('myForm');
     var elems = form.elements;
     var fio = elems.fio.value;
     var email = elems.email.value;
     var phone = elems.phone.value;
     var fioA = fio.split(' ');

     function showError(container, errorMessage) {
         container.className = 'error';
         var msgElem = document.createElement('span');
         msgElem.className = "error-message";
         msgElem.innerHTML = errorMessage;
         container.appendChild(msgElem);
         errorFields.push(container.querySelector('input').name);
         isValid = false;
     }

     function resetError(container) {
         container.className = '';
         if (container.lastChild.className == "error-message") {
             container.removeChild(container.lastChild);
         }
     }

    function isCorrectFIO(fio) {

        resetError(elems.fio.parentNode);
        if (!fio) {
            showError(elems.fio.parentNode, ' Отсутствует текст');
            return false;
        }
        if (fioA.length !== 3) {
            showError(elems.fio.parentNode,"ФИО должно состоять не менее 3 символов");
            return false;
        }
        for (var i = 0; i < 3; i++) {
            if (!/^[а-яА-ЯёЁa-zA-Z. ]+$/.test(fioA[i])) {
                if(fioA[i]==''){
                    showError(elems.fio.parentNode,"Одна из частей ФИО не может быть пробелом!");
                    return false;
                }
                else {
                    showError(elems.fio.parentNode,"Не корректные данные в ФИО - (' "+fioA[i]+" ')");
                    return false;
                }
            }
        }
        return true;
    }
    function isCorrectEmail(email) {
        resetError(elems.email.parentNode);
        var pattern1 = new RegExp(/^[a-z0-9_\.-]+@(yandex)+\.(ru|ua|by|kz|com)$/i);
        var pattern2 = new RegExp(/^[-._A-Za-z0-9]+@(ya)+\.(ru)$/i);
        if(!pattern1.test(email) && !pattern2.test(email)){
            showError(elems.email.parentNode,"Не корректный email. Email должен быть на доменах ya.ru, yandex.ru, yandex.ua, yandex.by, yandex.kz, yandex.com");
            return false;
        }
        return true;
    }

    function isCorrectPhone(phone) {
        var phonePattern;
        var checkSumm;
        var allSumm;
        var summ;
        var summPattern
        resetError(elems.phone.parentNode);
        if(!phone){
            showError(elems.phone.parentNode,"Вы не ввели номер телефона");
            return false;
        }
        else{
            phonePattern = new RegExp (/^[\+]\d{1}[\(]\d{3}[\)]\d{3}[\-]\d{2}[\-]\d{2}$/);

            if(!phonePattern.test(phone)){
                console.log(phonePattern.test(phone));
                showError(elems.phone.parentNode,"Не правильный формат телефона");
                return false;
            }
            else{
                checkSumm = 0;
                allSumm = 0;
                summPattern =new RegExp (/[-\(\)\+]+/);
                summ = phone.split(summPattern);
                summ.forEach(function(item, i, arr) {
                    checkSumm +=item;
                });
                for (var i = 0; i < checkSumm.length; i++)
                    allSumm += Number(checkSumm[i]);
                console.log(allSumm);
                if(allSumm < 30 ){
                    return true
                }
                else{
                    showError(elems.phone.parentNode,"Сумма всех цифр телефона должна быть меньше 30");
                    return false
                }
            }
        }
    }

    if (isCorrectFIO(fio) & isCorrectEmail(email) & isCorrectPhone(phone)){
        resetError(form.parentNode);
        submitButton.disabled = true;
    }
     return {
         isValid: isValid
     };

}

    getData() {
        return [].reduce.call(document.getElementById('myForm').elements, (data, element) => {
                let isValidElement = (el) => {
                return el.name === el.type;
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