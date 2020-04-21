import PNotify from 'pnotify/dist/es/PNotify.js';
import 'pnotify/dist/PNotifyBrightTheme.css';
import debounce from "lodash.debounce";
import api from '../services/fetchCountries.js';
import refs from '../services/refs.js';
import countriesList from '../templates/countriesList.hbs';
import countryItem from '../templates/countryItemTemplate.hbs';

refs.input.addEventListener('input', debounce(handlesChangeInput, 500));

function handlesChangeInput(event) {
    // когда в строке ввода пусто или пробел
    if (event.target.value === "" || event.target.value === " ") {
        PNotify.notice({
            text: "Please, enter country name!",
            type: 'notice',
            type: 'notice',
            delay: 2000,
        });
        handlesCloseNotification()
        return;
    }
    api.fetchCountries(event.target.value)
        .then(data => {
            // когда бекенд вернул массив с одной страной, в интерфейсе
            // рендерится разметка с данными о стране: название,
            // столица, население, языки и флаг
            if (data.length === 1) {
                refs.countriesUl.innerHTML = `${countryItem(data)}`;
                PNotify.success({
                    title: 'You found country!',
                    type: 'success',
                    text: 'You found the country you were looking for!',
                    delay: 2000,
                });
                handlesCloseNotification();
            }
            // когда бекенд вернул от 2-х до 10-ти стран, под инпутом 
            // отображается список имен найденных стран
            if (data.length >= 2 && data.length <= 10) {
                refs.countriesUl.innerHTML = `${countriesList(data)}`;
            }
            // когда бекенд вернул больше чем 10 стран подошедших под
            // критерий введенный пользователем, в интерфейсе
            // отображается нотификация о том, что необходимо сделать
            // запрос более специфичным
            if (data.length > 10) {
                PNotify.error({
                    text: "Too many matches found. Please enter a more specific query!",
                    type: 'error',
                    delay: 2000,
                });
                handlesCloseNotification()
            }
        })
        .catch(error => console.log(error)
        );
}

// убирает уведомление при нажатии на него
function handlesCloseNotification() {
    const notification = document.querySelector('.ui-pnotify');

    notification.addEventListener('click', closeNotification);

    function closeNotification(evt) {

        if (evt.currentTarget) {
            notification.remove('ui-pnotify')
        }
    }
}

 // дополнить: 
 // при нажатии на объект из масcива открывать его
 // попытаться словить ошибку 404 и отобразить нотификацией