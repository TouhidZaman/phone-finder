// Storing searched data to contro number o resuts to display 
var searchedPhonesData = [];

//To clear search results
const clearDisplay = (fieldId) => {
    const phonesContainerField = document.getElementById(fieldId);
    // const phonesContainerField = document.getElementById('phones-container');
    phonesContainerField.textContent = '';
}

//To fetch Searched Phones from API
const getPhonesBySearch = () => {
    const searchInputField = document.getElementById('searchInputField');
    // getting lowercase search text to improve search results
    const searchText = searchInputField.value.toLowerCase(); 
    fetch(`https://openapi.programming-hero.com/api/phones?search=${searchText}`)
        .then(response => response.json())
        .then(data => searchResultsHandler(data));
    // console.log(searchText)
}

// Handling search result data 
const searchResultsHandler = data => {
    clearDisplay('showPhoneDetailsField');
    clearDisplay('phones-container');

    const notFoundField = document.getElementById('not-found-field');
    const searchInfoField = document.getElementById('searchInfoField');
    const moreButton =  document.getElementById('show-more-btn');
    const lessButton = document.getElementById('show-less-btn');
    searchInfoField.classList.add('d-none');
    moreButton.classList.add("d-none");
    lessButton.classList.add("d-none");

    if(data.status === false) {
        notFoundField.classList.remove('d-none');
    }
    else {
        searchedPhonesData = data.data; // storing search data to global variable
        //search info field
        let resultCount = searchedPhonesData.length;
        searchInfoField.innerText = `Total ${resultCount}+ Results Found. Showing: (${resultCount < 20 ? resultCount : "20"})`;
        searchInfoField.classList.remove('d-none');
        searchInfoField.classList.add('d-block');
        
        notFoundField.classList.add('d-none');//to remove existing not found message
        
        const phones =  searchedPhonesData.slice(0, 20); // slice will take only first 20 results
        loadPhones(phones);
        if(searchedPhonesData.length > 20) {
            moreButton.classList.remove("d-none");
        }
    }
}

//Loading phones data to UI
const loadPhones = phones => {
    const phonesContainerField = document.getElementById('phones-container');
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

//handling show more results
const showMoreResults = (event) => {
    const phones = searchedPhonesData.slice(20, );
    loadPhones(phones);
    event.target.classList.add('d-none');
    const lessButton = document.getElementById('show-less-btn');
    lessButton.classList.remove('d-none')
}

//handling show less results
const showLessResults = (event) => {
    clearDisplay('phones-container');
    const phones = searchedPhonesData.slice(0, 20);
    loadPhones(phones);
    event.target.classList.add('d-none');
    const moreButton = document.getElementById('show-more-btn');
    moreButton.classList.remove('d-none')
}

//To fetch a specique phone using slug Id
const loadPhoneBySlug = slug => {
    const url = `https://openapi.programming-hero.com/api/phone/${slug}`;
    fetch(url)
        .then(response => response.json())
        .then(data => showPhoneDetails(data.data))
}

// Loading phone Details to UI
const showPhoneDetails = phone => {
    clearDisplay('showPhoneDetailsField');
    const phoneCard = document.createElement('div');
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
                             ${phone.releaseDate ? phone.releaseDate : "Not Available"}
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
    }) : featuresContainer.parentNode.style.display = 'none';
}

// phoneCard.innerHTML = `
//         <div class="card shadow p-4">
//             <div class="p-2 d-flex">
//                 <div class="">
//                     <img src="${phone.image}" class="img-fluid" alt="phone-img">
//                 </div>
//                 <div class="ps-md-4">
//                     <h5 class="card-title">Name: ${phone.name}</h5>
//                     <p class="card-text">Release Date: ${phone.releaseDate ? phone.releaseDate : "Not Available"}</p>
//                     <p class="card-text">Brand: ${phone.brand}</p>
//                 </div>
//             </div>
//             <div class="card-body">
//                 <table class="table main-features">
//                     <thead>
//                         <tr>
//                             <th scope="col" colspan="3">Main Features</th>
//                         </tr>
//                     </thead>
//                     <tbody id="main-features-container"></tbody>
//                 </table>

//                 <table class="table others-features">
//                     <thead>
//                         <tr>
//                             <th scope="col" colspan="3">Others Features</th>
//                         </tr>
//                     </thead>
//                     <tbody id="other-features-container"></tbody>
//                 </table>
//             </div>
//         </div>
//     `; 