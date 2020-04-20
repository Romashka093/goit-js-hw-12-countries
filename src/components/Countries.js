import PNotify from 'pnotify/dist/es/PNotify.js';
import 'pnotify/dist/PNotifyBrightTheme.css';
import debounce from "lodash.debounce";
import api from '../services/fetchCountries.js';
import refs from '../services/refs.js';
import countriesList from '../templates/countriesList.hbs';
import countryItem from '../templates/countryItemTemplate.hbs';

refs.input.addEventListener('input', debounce(handlesChangeInput, 500));

function handlesChangeInput(event) {
    if (event.target.value === "") {
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
            if (data.length >= 2 && data.length <= 10) {
                refs.countriesUl.innerHTML = `${countriesList(data)}`;
            }
            if (data.length >= 10 || event.target.value === 200) {
                PNotify.error({
                    text: "Too many matches found. Please enter a more specific query!",
                    type: 'error',
                    delay: 2000,
                });
                handlesCloseNotification()
            }
        })
        .catch(error => console.error(error));
}



function handlesCloseNotification() {
    const notification = document.querySelector('.ui-pnotify');

    notification.addEventListener('click', closeNotification);

    function closeNotification(evt) {

        if (evt.currentTarget) {
            notification.remove('ui-pnotify')
        }
    }
}
