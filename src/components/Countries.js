import PNotify from 'pnotify/dist/es/PNotify';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import debounce from "lodash.debounce";
import fetchCountries from '../services/fetchCountries.js';
import refs from '../services/refs.js';
import countriesList from '../templates/countriesList.hbs';
import countryItem from '../templates/countryItemTemplate.hbs'

PNotify.error({
    text: "I'm an alert.",
    type: 'notice',
});

console.log(refs);

console.log(fetchCountries.fetchCountries());

refs.input.addEventListener(
    "input",
    debounce(event => {
        if (event.target.value === "") {
            return;
        }
        fetchCountries
            .fetchCountries(event.target.value)
            .then(data => {
                if (data.length === 1) {
                    refs.countriesUl.innerHTML = `${countryItem(data)}`;
                }
                if (data.length >= 2 && data.length <= 10) {
                    refs.countriesUl.innerHTML = `${countriesList(data)}`;
                }
                if (data.length > 10) {
                    PNotify.error(
                        "Too many matches found. Please enter a more specific query!"
                    );
                }
            })
            .catch(error => console.error(error));
    }, 500)
);