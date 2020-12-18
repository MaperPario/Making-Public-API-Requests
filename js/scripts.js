//global constants
const randomUrl = 'https://randomuser.me/api';
const searchContainer = document.querySelector('.search-container');
const employeeDirectory = document.getElementById('gallery');
let employeeArr = [];
let currentIndex = 0;

//fetches random users from randomuser.me/api
async function getEmployees(employeeCount) {
    const userResponse = await fetch(`https://randomuser.me/api?results=${employeeCount}&nat=us`);
    const userData = await userResponse.json();

    return userData.results;
}

//initializes fresh people, rendering and inserting search area
async function initialize() {
    employeeArr = [];

    try {
        employeeArr = await getEmployees(12);
    } catch(err) {
        console.log('Error with fetching: ', err);
        alert('Error Fetching Employees');
    }

    renderEmployees(employeeArr);
    insertSearchBar();
}

//used for adding search bar in initialization
function insertSearchBar() {
    searchContainer.insertAdjacentHTML('beforeend', `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
        </form>
    `);

    const searchBar = document.getElementById('search-input');
    
    searchBar.addEventListener('keyup', (e) => {
        const searchString = e.target.value.toLowerCase();
        const matchingEmployees = employeeArr.filter(employee => {
            return (
                employee.name.first.toLowerCase().includes(searchString) ||
                employee.name.last.toLowerCase().includes(searchString)
            );
        });
        renderEmployees(matchingEmployees);
    });
}

//renders employees to screen
function renderEmployees(employees) {
    employeeDirectory.innerHTML = '';
    employees.forEach(person => generateEmployeeDirectoryHTML(person, employees));
}

//generates the html to throw on page
function generateEmployeeDirectoryHTML(person, employees) {
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
        currentIndex = employees.indexOf(person);
        generateEmployeeModalWindow(person, employees);
    });
}

//generates modal window for when employee card is clicked
function generateEmployeeModalWindow(person, employees) {
    const birthday = new Date(person.dob.date);
    const employeeModal = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${person.picture.large}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${person.name.first} ${person.name.last}</h3>
                    <p class="modal-text">${person.email}</p>
                    <p class="modal-text cap">${person.location.city}</p>
                    <hr>
                    <p class="modal-text">${person.phone}</p>
                    <p class="modal-text">${person.location.street.number} ${person.location.street.name}, ${person.location.city}, ${person.location.state} ${person.location.postcode}</p>
                    <p class="modal-text">Birthday: ${birthday.toLocaleDateString("en-US")}</p>
                </div>
            </div>

            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>`;

    document.body.insertAdjacentHTML("beforeend", employeeModal);

    addModalEventListeners(employees);
}

//provides functionality to modal
function addModalEventListeners(employees) {
   const closebtn = document.getElementById('modal-close-btn');
   const modalContainer = document.querySelector('.modal-container');
   const prevButton = document.querySelector('#modal-prev');
   const nextButton = document.querySelector('#modal-next');

    closebtn.addEventListener('click', () => {
        modalContainer.remove();
    });

    prevButton.addEventListener('click', () => {
        modalContainer.remove();

        const lastIndexInEmployeeArr = employees.length - 1;
        
        currentIndex = currentIndex > 0 ? currentIndex - 1 : lastIndexInEmployeeArr;
        generateEmployeeModalWindow(employees[currentIndex], employees);
    });

    nextButton.addEventListener('click', () => {
        modalContainer.remove();

        const isEndOfDirectory = currentIndex >= employees.length - 1;
        
        currentIndex = isEndOfDirectory ? 0 : currentIndex + 1;
        generateEmployeeModalWindow(employees[currentIndex], employees);
    });
}

//calling initialize to restart everything, clean slate
initialize();
