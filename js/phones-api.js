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
                        <button class="btn btn-secondary rounded-pill px-4">Show Details</button>
                    </div>
                </div>
            `;
            colCard.classList.add('col');
            phonesContainerField.appendChild(colCard);
            console.log(phone)
        });
    }
}