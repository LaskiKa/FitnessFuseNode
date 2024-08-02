import { today, baseModal } from './views';
import { createChartwithApiData, chartModalFunction } from './chartFunction';
import { createFunction, deleteFunction, responseFunction, updateFunction } from './tools';

export function  weightFunction(row) {

    const now = today();
    const modalArray = [];
    
    // Weight manage console: update, create, delete

    const weightModal = baseModal(row);
    weightModal.firstChild.classList.add('weightmodal')

    // WEIGHT MANAGE: update, create, delete
    const manageModal = document.createElement('div');
    manageModal.classList.add('managemodal');

        // WEIGHT MANAGE: UPDATE
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
        createForm.innerHTML = `
        <label>Select data: </label>
        <select id='selectdata'>
        </select>

        <label>Weight:</label>
        <input type="number" step=".01" id="weight" name="weight" required>

        <label>Measurement date:</label>
        <input type="date" id="measurement_date" name="measurement_date" required>

        <label>Measurement time:</label>
        <input type="time" step=1 id="measurement_time" name="measurement_time" required>
        
        <button type="submit" id="submit">Update</button>

        `

        // Event listener - after selecting data to update fill other fields in form
        createForm.querySelector('select').addEventListener('click', () => {
            const seleted = createForm.querySelector('select')
            var selectedOption = seleted.options[seleted.selectedIndex];

            const weightInput = createForm.querySelector('#weight');
            const dateInput = createForm.querySelector('#measurement_date');
            const timeInput = createForm.querySelector('#measurement_time');

            const measurementData = selectedOption.textContent.split(" ");
            const measurementDataWeight = measurementData[measurementData.length -1];
            const measurementDataDate = measurementData[0];
            const measurementDataTime = measurementData[1];

            weightInput.value = measurementDataWeight;
            dateInput.value = measurementDataDate;
            timeInput.value = measurementDataTime;
        });

        // SELECT - append new option with data
        const apiWeightData = async () => {

            const response = await responseFunction('weight');
    
            // Response verification
            if (response.ok) {
                const weightData = await response.json()
                const sortedWeightData = weightData.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
                
                // Append select with meseaurment data

                sortedWeightData.forEach(element => {
                    const option = document.createElement('option');
                    const dateTime = new Date (element.measurement_date)
                    const date = dateTime.toISOString().split('T')[0];
                    const time = dateTime.toISOString().split('T')[1].split('.')[0]

                    option.textContent = `${date} ${time} - weight: ${element.weight}`;
                    option.value = element.id;
                    createForm.querySelector('select').appendChild(option);
                });
    
            } else {
                // Error
                const error = await response.json();
                console.log('Error: ', error);
            }
        };
        
        apiWeightData()


        formModal.appendChild(createForm);
        manageContent.appendChild(formModal);

        if (!document.querySelector('.managecontent.update')) {
            // If the .managecontent.update not exist -> show the managecontetn update modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });            
            document.querySelector('.weightmodal').append(manageContent);
        };

        // Update button
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(event.target)
            const meseaurmentId = parseInt(document.querySelector('select').value)
            const newDate = `${formData.get('measurement_date')}T${formData.get('measurement_time')}`

            // PUT - update weight
            const updateWeightData = async() => {

                const body = {
                    'weight': formData.get('weight'),
                    'measurement_date': newDate
                }
                const response = await updateFunction('weight', meseaurmentId, body)

                if (response.ok) {

                    const infoModal = document.createElement('div');
                    infoModal.classList.add('infomodal', 'success');

                    const infoContent = document.createElement('div');
                    infoContent.classList.add('infocontent');
                    infoContent.textContent = 'Updated!';

                    infoModal.append(infoContent);
                    
                    document.querySelector('.managemodal').parentElement.append(infoModal);

                    // UPDATE CHART
                    // Destroy chart if exist
                    if (window.dataChart != null) {
                        window.dataChart.destroy()
                    }
                    createChartwithApiData('weight', 'line', 'Weight by date', 
                                            {type: 'time',
                                            time: {unit: 'day'}
                                            },
                                            ['weight', 1], ['', 3])

                    // Delete succes bar
                    setTimeout( () => {
                        document.querySelector('.infomodal').remove();
                    }, 3000);
                }
            }
            updateWeightData();
        });
    });

    // WEIGHT MANAGE: CREATE
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
        createForm.innerHTML = `
        <label>Weight:</label>
        <input type="number" step=".01" id="weight" name="weight" required>

        <label>Measurement date:</label>
        <input type="date" id="measurement_date" name="measurement_date" required>

        <label>Measurement time:</label>
        <input type="time" step=1 id="measurement_time" name="measurement_time" required>
        
        <button type="submit" id="submit">Submit</button>

        `
        createForm.querySelector('#measurement_date').value = now[0];
        createForm.querySelector('#measurement_time').value = now[1];
        
        formModal.appendChild(createForm);
        manageContent.appendChild(formModal);

        if (!document.querySelector('.managecontent.create')) {
            // If the .managecontent.update not exist -> show the managecontetn update modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });
            document.querySelector('.weightmodal').append(manageContent);
        };

        // POST: add new weight to api
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(event.target)
            const toDataTime = `${formData.get('measurement_date')}T${formData.get('measurement_time')}`

            // POST - Add weight api
            const apiAddWeight = async () => {
                const body = {
                    'weight': formData.get('weight'),
                    'measurement_date': toDataTime
                }
                const response = await createFunction('weight', body)
    
                if (response.ok) {                    
                    const infoModal = document.createElement('div');
                    infoModal.classList.add('infomodal', 'success');

                    const infoContent = document.createElement('div');
                    infoContent.classList.add('infocontent');
                    infoContent.textContent = 'Success';

                    infoModal.append(infoContent);
                    
                    document.querySelector('.managemodal').parentElement.append(infoModal)

                    // UPDATE CHART
                    // Destroy chart if exist
                    if (window.dataChart != null) {
                        window.dataChart.destroy()
                    }
                    createChartwithApiData('weight', 'line', 'Weight by date', 
                                            {type: 'time',
                                            time: {unit: 'day'}
                                            },
                                            ['weight', 1], ['', 3]);
                    document.querySelector('.form').reset();

                    // Delete succes bar
                    setTimeout( () => {
                        document.querySelector('.infomodal').remove();
                    }, 3000);
                    
                } else {
                    const error = response.json()
                    console.log('Error: ', error );
                }

            }
            apiAddWeight();
        });
    });

    // WEIGHT MANAGE: DELETE
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
        createForm.innerHTML = `
        <label>Select data: </label>
        <select id='selectdata'>
        </select>

        <button type="submit" id="delete">Delete</button>

        `

        // SELECT - append new option with data
        const apiWeightData = async () => {
            const response = await responseFunction('weight');
    
            // Response verification
            if (response.ok) {
                const weightData = await response.json()
                const sortedWeightData = weightData.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
                
                // Append select with meseaurment data
                sortedWeightData.forEach(element => {
                    const option = document.createElement('option');
                    const dateTime = new Date (element.measurement_date)
                    const date = dateTime.toISOString().split('T')[0];
                    const time = dateTime.toISOString().split('T')[1].split('.')[0]

                    option.textContent = `${date} ${time} - weight: ${element.weight}`;
                    option.value = element.id;
                    createForm.querySelector('select').appendChild(option);
                });
            } else {
                // Error
                const error = await response.json();
                console.log('Error: ', error);
            }
        };
        apiWeightData()

        formModal.appendChild(createForm);
        manageContent.appendChild(formModal);

        if (!document.querySelector('.managecontent.deletedata')) {
            // If the .managecontent.deletedata not exist -> show the managecontetn delete modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });
            document.querySelector('.weightmodal').append(manageContent);
        };

        // Event listener - delete
        document.querySelector('form').addEventListener('submit', (element)=> {
            element.preventDefault()
            const deleteData = async () => {
                const id = document.querySelector('select').value
                const response = await deleteFunction('weight', id)

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
                    }
                    createChartwithApiData('weight', 'line', 'Weight by date', 
                                            {type: 'time',
                                            time: {unit: 'day'}
                                            },
                                            ['weight', 1], ['', 3])
                    // Remove removed option
                    const toRemove = document.querySelector('select');
                    toRemove.remove(toRemove.selectedIndex);

                    // Delete succes bar
                    setTimeout( () => {
                        document.querySelector('.infomodal').remove();
                    }, 3000); 
                };
            };
            deleteData()
        });
    }); 

    // Append UPDATE CREATE DELETE
    manageModal.appendChild(update);
    manageModal.appendChild(create);
    manageModal.appendChild(deleteData);
    weightModal.firstChild.appendChild(manageModal);

    // CHART
    const chartModal = chartModalFunction();
    
    // Get weight data after clicking weight navbtn
    document.querySelector('.navbtn.weight').addEventListener('click', () => {
        createChartwithApiData('weight', 'line', 'Weight by date', 
                                {type: 'time',
                                    time: {unit: 'day'}
                                },
                                ['weight', 1], ['', 3]);
    })

    modalArray.push(weightModal, chartModal);
    
    return modalArray
};