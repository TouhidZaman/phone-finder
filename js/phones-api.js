// Storing searched data and showing count data to display 
var searchedPhonesData = [];
var resultCount = 0;
var showingResultCount = 0;

const errorMessageField = document.getElementById('error-message-field');
const searchInfoField = document.getElementById('searchInfoField');

//To clear search results
const clearDisplay = (fieldId) => {
    const phonesContainerField = document.getElementById(fieldId);
    phonesContainerField.textContent = '';
}

//To set or remove display none in a Field
const setDisplayNone = (fieldId, isNone) => {
    const field = document.getElementById(fieldId);
    isNone ? field.classList.add('d-none') : field.classList.remove('d-none');
}

//To fetch Searched Phones from API
const getPhonesBySearch = () => {
    clearDisplay('showPhoneDetailsField');
    clearDisplay('phones-container');
    
    searchInfoField.classList.add('d-none');
    setDisplayNone('phone-banner-img', true); //to remove existing banner
    setDisplayNone('show-more-btn', true); //to remove existing more button
    setDisplayNone('show-less-btn', true); //to remove existing less button
    setDisplayNone('spinner', false); //Showing spinners

    const searchInputField = document.getElementById('searchInputField');
    // getting lowercase search text to improve search results
    const searchText = searchInputField.value.toLowerCase(); 
    fetch(`https://openapi.programming-hero.com/api/phones?search=${searchText}`)
        .then(response => response.ok ? response.json() : Promise.reject(response.status))
        .then(data => searchResultsHandler(data))
        .catch(error => {
            errorMessageField.innerText=`Opps, something went wrong! status: ${error}`;
            errorMessageField.classList.remove('d-none');
            setDisplayNone('phone-banner-img', true);
        });
}

// Handling search result data 
const searchResultsHandler = resultsData => {
    setDisplayNone('spinner', true); //Hiding spinners
    
    if(resultsData.status === false) {
        errorMessageField.innerText="Opps, Not Found!";
        errorMessageField.classList.remove('d-none');
    }
    else {
        searchedPhonesData = resultsData.data; // storing search data to global variable
        errorMessageField.classList.add('d-none');//to remove existing not found message
        
        // calculating search result count 
        resultCount = searchedPhonesData.length;
        resultCount < 20 ? showingResultCount = resultCount : showingResultCount = 20; //updating showing count
        
        const phones =  searchedPhonesData.slice(0, 20); // slice will take only first 20 results
        loadPhones(phones);
        if(searchedPhonesData.length > 20) {
            setDisplayNone('show-more-btn', false);
        }
    }
}

//Loading phones data to UI
const loadPhones = phones => {
    const phonesContainerField = document.getElementById('phones-container');
    
    //handling search info field
    searchInfoField.innerText = `Total ${resultCount}+ Results Found. Showing: (${showingResultCount})`;
    searchInfoField.classList.remove('d-none');
    
    // phones[3].slug = 'test-me'; //For phone details not found test
    // phonesContainerField.textContent = '';
    phones.forEach(phone => {
        const colCard = document.createElement('div');
        colCard.innerHTML = `
            <div class="card py-4 b-none shadow h-100">
                <div class="py-2 d-flex justify-content-center">
                    <img src="${phone.image}" class="img-fluid" alt="phone-img">
                </div>
                <div class="card-body text-center">
                    <h5 class="card-title">Name: ${phone.phone_name}</h5>
                    <p class="card-text">Brand: ${phone.brand}</p>
                </div>
                <div class="py-2 d-flex justify-content-center">
                    <button onclick="loadPhoneBySlug('${phone.slug}')" class="btn btn-secondary rounded-pill px-4">Show Details</button>
                </div>
            </div>
        `;
        colCard.classList.add('col');
        phonesContainerField.appendChild(colCard);
    });
}

//To fetch a specique phone using slug Id
const loadPhoneBySlug = slug => {
    clearDisplay('showPhoneDetailsField');
    setDisplayNone('spinner', false); //Showing spinners
    errorMessageField.classList.add('d-none');
    
    const url = `https://openapi.programming-hero.com/api/phone/${slug}`;
    fetch(url)
        .then(response => response.json())
        .then(data => showPhoneDetails(data))
        .catch(error => {
            errorMessageField.innerText= `404! Phone details not found`;
            errorMessageField.classList.remove('d-none');
            errorMessageField.scrollIntoView();
        });
}

// Loading phone Details to UI
const showPhoneDetails = phoneData => {
    setDisplayNone('spinner', true); //Hiding spinners
    const phoneCard = document.createElement('div');

    if(phoneData.status !== false) {
        phone = phoneData.data;
        phoneCard.innerHTML = `
            <div class="card shadow p-4 mt-4 mt-md-5">
                <div class="p-2 row">
                    <div class="col-lg-5 pb-4">
                        <img src="${phone.image}" class="h-auto w-100 py-2" alt="phone-img">
                        <div class="p-2">
                            <h4 class="card-title">
                                <span class="fw-bold">Name:</span> 
                                ${phone.name}
                            </h4>
                            <p class="card-text">
                                <span class="fw-bold">Release Date:</span>
                                ${phone.releaseDate ? phone.releaseDate : `<span class="text-danger">Not Available</span>`}
                            </p>
                            <p class="card-text">
                                <span class="fw-bold">Brand Name:</span> 
                                ${phone.brand}
                            </p>
                        </div>
                    </div>
                    <div class="ps-md-4 col-lg-7">
                        <div class="table-responsive">
                            <table class="table main-features">
                                <thead>
                                    <tr>
                                        <th scope="col" colspan="3">Main Features</th>
                                    </tr>
                                </thead>
                                <tbody id="main-features-container"></tbody>
                            </table>
                        </div>
                        <div class="table-responsive">
                            <table class="table others-features">
                                <thead>
                                    <tr>
                                        <th scope="col" colspan="3">Others Features</th>
                                    </tr>
                                </thead>
                                <tbody id="other-features-container"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `; 
    }
    showPhoneDetailsField.appendChild(phoneCard);
    loadFeatures('main-features-container', phone.mainFeatures);
    loadFeatures('other-features-container', phone.others);
    showPhoneDetailsField.scrollIntoView(); //jumping to the result field
}

//Dynamically pusing features to Phone Details UI
const loadFeatures = (fieldId, features) => {
    const featuresContainer = document.getElementById(fieldId);
    features ? Object.keys(features).forEach(featureName => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <th scope="row">${featureName}</th>
            <td colspan="2">
                <p class="card-text">
                    ${Array.isArray(features[featureName]) ? features[featureName].join(', ') :  features[featureName]}
                </p>
            </td>
        `;
        featuresContainer.appendChild(tr)
    }) : featuresContainer.innerHTML = `
        <th scope="row">Not Found</th>
        <td colspan="2">
            <p class="card-text">Others features not available</p>
        </td>
    `;
    // }) : featuresContainer.parentNode.style.display = 'none';
}

//handling show more results
const showMoreResults = (event) => {
    showingResultCount = resultCount; //updating showing count
    const phones = searchedPhonesData.slice(20, );
    loadPhones(phones);
    event.target.classList.add('d-none');
    setDisplayNone('show-less-btn', false);
}

//handling show less results
const showLessResults = (event) => {
    clearDisplay('phones-container');
    showingResultCount = 20; //updating showing count
    const phones = searchedPhonesData.slice(0, 20);
    loadPhones(phones);
    event.target.classList.add('d-none');
    setDisplayNone('show-more-btn', false);
}