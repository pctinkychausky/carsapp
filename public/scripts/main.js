import { updateItemById, removeItemById, getItemById } from './collection_utilities.js';
import { makeCall } from './ajax_utilities.js';
import { serializeFormToArray, populateForm } from './form_utilities.js';

document.addEventListener('DOMContentLoaded', function(){

/* MATERIALIZE INITIALISATION */
    // Initialise Tabs
    var tabsElement = document.querySelector('.tabs');
    var tabsInstance = M.Tabs.init(tabsElement, {});

/* END OF MATERIALIZE INITIALISATION */

    // Globals & Flags
    let cars = [];

    // DOM ELEMENTS
    const listInsertionPoint = document.getElementById('list-holder');
    const refreshButton = document.getElementById('refresh-cars-list');
    const addForm = document.getElementById('add-car-form');
    const updateForm = document.getElementById('update-car-form');
    const updateTab = document.getElementById('update-tab');

    // HANDLEBARS PREP
    // Cars List Template
    const carsListTemplateTag = document.getElementById('cars-list-template');
    const carsListTemplateMarkup = carsListTemplateTag.innerHTML;
    const carsListTemplateFn = Handlebars.compile(carsListTemplateMarkup);

    // Pre Loader Template
    const preLoaderTemplateTag = document.getElementById('preloader-template');
    const preLoaderTemplateMarkup = preLoaderTemplateTag.innerHTML;
    const preLoaderTemplateFn = Handlebars.compile(preLoaderTemplateMarkup);

    // End of HANDLEBARS PREP

    function renderCarsList(){
        const carsHTML = carsListTemplateFn({cars});
        listInsertionPoint.innerHTML = carsHTML;
    }
    
    function loadCars(){
        listInsertionPoint.innerHTML = preLoaderTemplateFn();
        // addVisualFlash();
        makeCall('/cars')
        .then(data => {
            console.log('data: ', data);
            cars = data;
            setTimeout(function(){
                renderCarsList();
            }, 200);
        });
    }


    // Event Bindings
    // GETTING
    refreshButton.addEventListener('click', () => {
        loadCars();
    });

    // ADDING
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formValues = serializeFormToArray(e.target);
        console.log('formValues', formValues);
        const data = {};
        formValues.forEach(field => {
            data[field.name] = field.value;
        });
        console.log('data', data);
        addCar(data);
    });

    // UPDATING
    // Delegated Event Listener for update buttons
    listInsertionPoint.addEventListener('click', function(e){
        if (e.target && e.target.matches('button.update')) {
            const carId = e.target.dataset.id;
            const car = getItemById(cars, carId);
            // switch to tab
            updateTab.classList.remove('disabled');
            tabsInstance.select('update-form-container');
            // populate form
            populateForm(updateForm, car);
            updateForm.dataset.carId = carId;
        }
    });

    // Update Form Control
    updateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = serializeFormToArray(e.target);
        const carId = e.target.dataset.carId;
        const oldCar = getItemById(cars, carId);
        const updates = {};

        for (let i in formData) {
            const field = formData[i];
            if (oldCar[field.name] !== field.value) { // because bhp number
                updates[field.name] = field.value;
            }
        }

        updateCar(carId, updates);
    });

    // DELETING
    // Delegated Event Listener for delete buttons
    listInsertionPoint.addEventListener('click', function(e){
        if (e.target && e.target.matches('button.delete')) {
            const id = e.target.dataset.id;
            deleteCar(id);
        }
    });



    function addCar(data){
        makeCall('/cars', 'POST', data)
            .then(car => {
                cars.push(car);
                addForm.reset();
                tabsInstance.select('cars-list-container');
                renderCarsList();
            })
            .catch(err => {
                M.toast({html: 'Could not add car', classes: 'rounded red'});
            });
    }

    function updateCar(id, updates){
        makeCall(`/cars/${id}`, 'PUT', updates)
            .then(car => {
                cars = updateItemById(cars, id, updates);
                updateForm.reset();
                tabsInstance.select('cars-list-container');
                renderCarsList();
            })
            .catch(err => {
                console.log(err);
                populateForm(updateForm, cars.find(car => car._id === id));
            });
    }

    function deleteCar(id){
        makeCall(`/cars/${id}`, 'DELETE')
            .then(car => {
                cars = removeItemById(cars, id);
                renderCarsList();
            });
    }
    
    // Load cars on initial page load
    loadCars();
});