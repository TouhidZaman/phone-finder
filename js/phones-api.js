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
    const phones =  data.data;
    const phonesContainerField = document.getElementById('phones-container');
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
                    <button class="btn btn-secondary rounded-pill px-5">Show Details</button>
                </div>
            </div>
        `;
        colCard.classList.add('col');
        phonesContainerField.appendChild(colCard);
        console.log(phone)
    });
}