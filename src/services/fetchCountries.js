const baseUrl = 'https://restcountries.eu/rest/v2';

export default {
    fetchCountries(searchQuery) {
        return fetch(baseUrl + `/name/${searchQuery}`).then(data => data.json()).catch(err => console.log(err)
        );
    }
}