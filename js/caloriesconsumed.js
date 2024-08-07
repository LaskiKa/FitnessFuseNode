// Views: Calories Consumed
import { today, baseModal } from './views';
import { createChartwithApiData, chartModalFunction } from './chartFunction';
import { createFunction, deleteFunction, responseFunction, updateFunction } from './tools';
import { caloriesConsumedCreateFormTemplate, caloriesConsumedDeleteFormTemplate, caloriesConsumedUpdateFormTemplate } from './htmlTemplates';


export function caloriesConsumedFunction(row) {
    
    const now = today();
    const modalArray = [];

    // Calories Consumed manage console: update, create, delete

    const caloriesModal = baseModal(row);
    caloriesModal.firstChild.classList.add('caloriesconsumedmodal');

    // CALORIES CONSUMED MANAGE: update, create, delete
    const manageModal = document.createElement('div');
    manageModal.classList.add('managemodal');

     // CALORIES CONSUMED MANAGE: UPDATE
     const update = document.createElement('div');
     update.classList.add('manage', 'update');
     update.textContent='update';

     update.addEventListener('click', () => {

        const manageContent = document.createElement('div');
        manageContent.classList.add('managecontent', 'update');

        const formModal = document.createElement('div');
        formModal.classList.add('formmodal');

        const createForm = document.createElement('form');
        createForm.classList.add('form', 'update');
        createForm.innerHTML = caloriesConsumedUpdateFormTemplate;

        // Event listener - after selecting data to update fill other fields in form
        createForm.querySelector('select').addEventListener('click', () => {
            const seleted = createForm.querySelector('select')
            var selectedOption = seleted.options[seleted.selectedIndex];

            const getMealData = async (mealId) => {
                // Get meal details: calories, protein, carbs, fat, etc.
                const response = await responseFunction(`calorieseaten/${mealId}`);

                // Response verification
                if (response.ok) {
                    const mealData = await response.json()
                    
                    // Fill empty fields by meal data: kcal, protein, carbs, fat, etc.
                    const caloriestInput = createForm.querySelector('#kcal');
                    const mealInput = createForm.querySelector('#meal');
                    const proteinInput = createForm.querySelector('#protein');
                    const carbsInput = createForm.querySelector('#carbs');
                    const fatInput = createForm.querySelector('#fat');
                    const dateInput = createForm.querySelector('#measurement_date');
                    const tiemInput = createForm.querySelector('#measurement_time');

                    caloriestInput.value = mealData.kcal;
                    mealInput.value = mealData.meal;
                    proteinInput.value = mealData.protein;
                    carbsInput.value = mealData.carbs;
                    fatInput.value = mealData.fat;
                    
                    dateInput.value = mealData.measurement_date.split('T')[0];
                    tiemInput.value = mealData.measurement_date.split('T')[1].split('Z')[0];

                } else {
                    // Error
                    const error = await response.json();
                    console.log('Error: ', error);
                }
            };

            getMealData(selectedOption.value)

        });

        // SELECT - append new option with data
        const apiCaloriesData = async () => {
            const response = await responseFunction('calorieseaten')
    
            // Response verification
            if (response.ok) {
                const caloriesData = await response.json()
                const sortedCaloriesData = caloriesData.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
                
                // Append select with meseaurment data

                const selectelement = document.querySelector('#selectdata')
                sortedCaloriesData.forEach(element => {
                    const option = document.createElement('option');
                    const dateTime = new Date (element.measurement_date)
                    const date = dateTime.toISOString().split('T')[0];
                    const time = dateTime.toISOString().split('T')[1].split('.')[0]

                    option.textContent = `${date} ${time} - meal: ${element.meal} - kcal: ${element.kcal}`;
                    option.value = element.id;
                    createForm.querySelector('select').appendChild(option);

                });
 
            } else {
                // Error
                const error = await response.json();
                console.log('Error: ', error);
            };
        };  
        apiCaloriesData()

        formModal.appendChild(createForm);
        manageContent.appendChild(formModal);

        if (!document.querySelector('.managecontent.update')) {
            // If the .managecontent.update not exist -> show the managecontetn update modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });            
            document.querySelector('.caloriesconsumedmodal').append(manageContent);
        };

        // Update button
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(event.target)
            const meseaurmentId = parseInt(document.querySelector('select').value)
            const newDate = `${formData.get('measurement_date')}T${formData.get('measurement_time')}`
            const token = sessionStorage.getItem('token');

            // PUT - update calories
            const updateCaloriesData = async() => {
                const body = {
                    'user': token,
                    'kcal': formData.get('kcal'),
                    'meal': formData.get('meal'),
                    'protein': formData.get('protein'),
                    'carbs': formData.get('carbs'),
                    'fat': formData.get('fat'),
                    'measurement_date': newDate
                };

                const response = await updateFunction('calorieseaten', meseaurmentId, body);

                if (response.ok) {
                    const infoModal = document.createElement('div');
                    infoModal.classList.add('infomodal', 'success');

                    const infocontent = document.createElement('div');
                    infocontent.classList.add('infocontent');
                    infocontent.textContent = 'Updated!';
                    infoModal.append(infocontent);
                    document.querySelector('.managemodal').parentElement.append(infoModal)

                    // UPDATE CHART
                    // Destroy chart if exist
                    if (window.dataChart != null) {
                        window.dataChart.destroy()
                    };
                    createChartwithApiData('calorieseaten', 'line', 'Consumed calories by date',
                                            {type: 'category'}, 
                                            ['kcal', 1], 
                                            ['meal', 1]);

                    // Delete succes bar
                    setTimeout( () => {
                        document.querySelector('.infomodal').remove();
                    }, 3000);
                };
            };
            updateCaloriesData();
        });
    });

    // CALORIES MANAGE: CREATE
    const create = document.createElement('div');
    create.classList.add('manage','create');
    create.textContent='create';

    create.addEventListener('click', () => {
        const manageContent = document.createElement('div');
        manageContent.classList.add('managecontent', 'create');

        const formModal = document.createElement('div');
        formModal.classList.add('formmodal');

        const createForm = document.createElement('form');
        createForm.classList.add('form', 'create');
        createForm.innerHTML = caloriesConsumedCreateFormTemplate;
        createForm.querySelector('#measurement_date').value = now[0];
        createForm.querySelector('#measurement_time').value = now[1];
        
        formModal.appendChild(createForm);
        manageContent.appendChild(formModal);

        if (!document.querySelector('.managecontent.create')) {
            // If the .managecontent.update not exist -> show the managecontetn update modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });
            document.querySelector('.caloriesconsumedmodal').append(manageContent);
        };

        // POST: add new calories to api
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(event.target)
            const toDataTime = `${formData.get('measurement_date')}T${formData.get('measurement_time')}`

            const token = sessionStorage.getItem('token')
            

            // POST - Add calories api
            const apiAddcalories = async () => {
                const body = {
                    'user': token,
                    'kcal': formData.get('kcal'),
                    'meal': formData.get('meal'),
                    'protein': formData.get('protein'),
                    'carbs': formData.get('carbs'),
                    'fat': formData.get('fat'),
                    'measurement_date': toDataTime
                };
                const response = await createFunction('calorieseaten', body);
    
                if (response.ok) {                    
                    const infoModal = document.createElement('div');
                    infoModal.classList.add('infomodal', 'success');

                    const infoContent = document.createElement('div');
                    infoContent.classList.add('infocontent');
                    infoContent.textContent = 'Success';
                    infoModal.append(infoContent);
                    document.querySelector('.managemodal').parentElement.append(infoModal);

                    // UPDATE CHART
                    // Destroy chart if exist
                    if (window.dataChart != null) {
                        window.dataChart.destroy()
                    };

                    createChartwithApiData('calorieseaten', 'line', 'Consumed calories by date',
                                            {type: 'category'}, 
                                            ['kcal', 1], 
                                            ['meal', 1]);
                    document.querySelector('.form').reset();

                    // Delete succes bar
                    setTimeout( () => {
                        document.querySelector('.infomodal').remove();
                    }, 3000);
                    
                } else {
                    const error = response.json()
                    console.log('Error: ', error );
                };
            };
            apiAddcalories();
        });
    });

    // CALORIES MANAGE: DELETE
    const deleteData = document.createElement('div');
    deleteData.classList.add('manage', 'deletedata');
    deleteData.textContent='delete';

    deleteData.addEventListener('click', () => {

        const manageContent = document.createElement('div');
        manageContent.classList.add('managecontent', 'deletedata');

        const formModal = document.createElement('div');
        formModal.classList.add('formmodal');

        const createForm = document.createElement('form');
        createForm.classList.add('form', 'update');
        createForm.innerHTML = caloriesConsumedDeleteFormTemplate;

        // SELECT - append new option with data
        const apiCaloriesData = async () => {
            const response = await responseFunction('calorieseaten');
            // Response verification
            if (response.ok) {
                const caloriesData = await response.json();
                const sortedCaloriesData = caloriesData.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
                
                // Append select with meseaurment data
                sortedCaloriesData.forEach(element => {
                    const option = document.createElement('option');
                    const dateTime = new Date (element.measurement_date);
                    const date = dateTime.toISOString().split('T')[0];
                    const time = dateTime.toISOString().split('T')[1].split('.')[0]

                    option.textContent = `${date} ${time} - meal: ${element.meal} - calories: ${element.kcal}`;
                    option.value = element.id;
                    document.querySelector('select').appendChild(option);
                });
            } else {
                // Error
                const error = await response.json();
                console.log('Error: ', error);
            };
        };    
        apiCaloriesData();

        formModal.appendChild(createForm);
        manageContent.appendChild(formModal);

        if (!document.querySelector('.managecontent.deletedata')) {
            // If the .managecontent.deletedata not exist -> show the managecontetn delete modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });
            document.querySelector('.caloriesconsumedmodal').append(manageContent);
        };

        // Event listener - delete
        document.querySelector('form').addEventListener('submit', (element)=> {
            element.preventDefault()
            const deleteData = async () => {
                const id = document.querySelector('select').value
                const response = await deleteFunction(`calorieseaten`, id);
                if (response.ok) {

                    const infoModal = document.createElement('div');
                    infoModal.classList.add('infomodal', 'success');
                    const infoContent = document.createElement('div');
                    infoContent.classList.add('infocontent');
                    infoContent.textContent = 'Deleted!';
                    infoModal.append(infoContent);
                    document.querySelector('.managemodal').parentElement.append(infoModal)

                    // UPDATE CHART
                    // Destroy chart if exist
                    if (window.dataChart != null) {
                        window.dataChart.destroy()
                    };
                    createChartwithApiData('calorieseaten', 'line', 'Consumed calories by date',
                                            {type: 'category'}, 
                                            ['kcal', 1], 
                                            ['meal', 1]);
                    // Remove removed option
                    const toRemove = document.querySelector('select');
                    toRemove.remove(toRemove.selectedIndex);

                    // Delete succes bar
                    setTimeout( () => {
                        document.querySelector('.infomodal').remove();
                    }, 3000); 
                };
            };
            deleteData();
        });
    }); 

    // Append UPDATE CREATE DELETE
    manageModal.appendChild(update);
    manageModal.appendChild(create);
    manageModal.appendChild(deleteData);
    caloriesModal.firstChild.appendChild(manageModal);

    // CHART
    const chartModal = chartModalFunction();
    document.querySelector('.navbtn.caloriesconsumed').addEventListener('click', () => {
        createChartwithApiData('calorieseaten', 'line', 'Consumed calories by date',
                                {type: 'category'}, 
                                ['kcal', 1], 
                                ['meal', 1]);
    })

    modalArray.push(caloriesModal, chartModal);

    return modalArray
};