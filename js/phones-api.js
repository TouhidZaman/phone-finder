// Search Phones handler 
const getPhonesByBrand = () => {
    const searchInputField = document.getElementById('searchInputField');
    // getting lowercase search text to improve search results
    const searchText = searchInputField.value.toLowerCase(); 
    fetch(`https://openapi.programming-hero.com/api/phones?search=${searchText}`)
        .then(response => response.json())
        .then(data => loadPhones(data));
    console.log(searchText)
}

//Loading phones data from api to UI
const loadPhones = data => {
    const notFoundField = document.getElementById('not-found-field');
    const phonesContainerField = document.getElementById('phones-container');
    phonesContainerField.textContent = '';
    
    if(data.status === false) {
        notFoundField.classList.remove('d-none');
        notFoundField.classList.add('d-block');
    }
    else {
        notFoundField.classList.add('d-none');
        const phones =  data.data;
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
            console.log(phone)
        });
    }
}

const loadPhoneBySlug = slug => {
    const url = `https://openapi.programming-hero.com/api/phone/${slug}`;
    fetch(url)
        .then(response => response.json())
        .then(data => showPhoneDetails(data.data))
}

const showPhoneDetails = phone => {
    const showPhoneDetailsField = document.getElementById('showPhoneDetailsField');
    showPhoneDetailsField.textContent = '';
    const phoneCard = document.createElement('div');
    phoneCard.innerHTML = `
        <div class="card shadow p-4 mx-auto">
            <div class="p-2 d-flex">
                <div class="">
                    <img src="${phone.image}" class="img-fluid" alt="phone-img">
                </div>
                <div class="ps-md-4">
                    <h5 class="card-title">Name: ${phone.name}</h5>
                    <p class="card-text">Release Date: ${phone.releaseDate ? phone.releaseDate : "Not Available"}</p>
                    <p class="card-text">Brand: ${phone.brand}</p>
                </div>
            </div>
            <div class="card-body">
                <table class="table main-features">
                    <thead>
                        <tr>
                            <th scope="col" colspan="3">Main Features</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">Storage</th>
                            <td colspan="2"><p class="card-text">${phone.mainFeatures.storage}</p></td>
                        </tr>
                        <tr>
                            <th scope="row">Display Size</th>
                            <td colspan="2"><p class="card-text">${phone.mainFeatures.displaySize}</p></td>
                        </tr>
                        <tr>
                            <th scope="row">Chipset</th>
                            <td colspan="2"><p class="card-text">${phone.mainFeatures.chipSet}</p></td>
                        </tr>
                        <tr>
                            <th scope="row">Memory</th>
                            <td colspan="2"><p class="card-text">${phone.mainFeatures.memory}</p></td>
                        </tr>
                        <tr>
                            <th scope="row">Sensors</th>
                            <td colspan="2"><p class="card-text">${phone.mainFeatures.sensors?.join(', ')}</p></td>
                        </tr>
                    </tbody>
                </table>

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
    `; 

    showPhoneDetailsField.appendChild(phoneCard);

    //Handling Others Features
    const otherFeaturesContainer = document.getElementById('other-features-container');
    const others = phone.others;
    others ? Object.keys(others).forEach(featureName => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <th scope="row">${featureName}</th>
            <td colspan="2"><p class="card-text">${others[featureName]}</p></td>
        `;
        otherFeaturesContainer.appendChild(tr)
    }) : otherFeaturesContainer.parentNode.style.display = 'none';
    
}