/******************
* Project Constants
******************/

const randomUrl = 'https://randomuser.me/api';
const searchContainer = document.querySelector('.search-container');
const employeeDirectory = document.getElementById('gallery');

/*****************
* Search Container
*****************/

searchContainer.insertAdjacentHTML('beforeend', `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
`);

/****************
* Async Function
****************/

async function getEmployees(employeeCount) {
    const userResponse = await fetch(`https://randomuser.me/api?results=${employeeCount}`);
    const userData = await userResponse.json();

    return userData.results;
}

getEmployees(12)
    .then(employee => employee.forEach(person => generateEmployeeDirectoryHTML(person)))
    .catch(err => console.log('Error with fetching: ', err));

/*****************
* Helper Functions 
*****************/

function generateEmployeeDirectoryHTML(person) {
    employeeDirectory.insertAdjacentHTML('beforeend', `
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="${person.picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="card-text">${person.email}</p>
                <p class="card-text cap">${person.location.city}, ${person.location.state}</p>
            </div>
        </div>
    `);
    employeeDirectory.lastElementChild.addEventListener('click', () => {
        generateEmployeeModalWindow(person);
    });
}

function generateEmployeeModalWindow(person) {
    const birthday = new Date(person.dob.date);
    const employeeModal =
    `<div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src="${person.picture.large}" alt="profile picture">
                <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                <p class="modal-text">${person.email}</p>
                <p class="modal-text cap">${person.location.city}</p>
                <hr>
                <p class="modal-text">${person.cell}</p>
                <p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
                <p class="modal-text">Birthday: ${birthday.toLocaleDateString("en-US")}</p>
            </div>
        </div>

        // IMPORTANT: Below is only for exceeds tasks 
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>`;
    //cellNumberParts.substr(0,3)} ${cellNumberParts.substr(3,3)}-${cellNumberParts.substr(6,4) couldn't get this to work
    document.body.insertAdjacentHTML("beforeend", employeeModal);
    const closebtn = document.getElementById('modal-close-btn');
    const modalContainer = document.querySelector('.modal-container');

    closebtn.addEventListener('click', () => {
        modalContainer.remove();
    });

    // modalContainer.addEventListener('click', () => {
    //     modalContainer.remove();
    // });

}
/****************
* Event Listeners
****************/
