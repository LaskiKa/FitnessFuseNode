// View: Steps
import { today, baseModal } from './views';
import { createChartwithApiData, chartModalFunction } from './chartFunction';
import { createFunction, deleteFunction, responseFunction, updateFunction } from './tools';

export function stepsFunction(row) {

    const now = today();
    const modalArray = [];

    // Steps manage console: update, create, delete

    const stepsModal = baseModal(row);
    stepsModal.firstChild.classList.add('stepsmodal');

    // STEPS MANAGE: update, create, delete
    const manageModal = document.createElement('div');
    manageModal.classList.add('managemodal');

    // STEPS MANAGE: UPDATE
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

        <label>Steps:</label>
        <input type="number" id="steps" name="steps" required>

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

            const stepsInput = createForm.querySelector('#steps');
            const dateInput = createForm.querySelector('#measurement_date');
            const tiemInput = createForm.querySelector('#measurement_time');

            const measurementData = selectedOption.textContent.split(" ");
            const measurementDataWeight = measurementData[measurementData.length -1];
            const measurementDataDate = measurementData[0];
            const measurementDataTime = measurementData[1];

            stepsInput.value = measurementDataWeight;
            dateInput.value = measurementDataDate;
            tiemInput.value = measurementDataTime;

        })

        // SELECT - append new option with data
        const apiStepsData = async () => {

            const response = await responseFunction('steps');
    
            // Response verification
            if (response.ok) {
                const stepsData = await response.json()
                const sortedStepsData = stepsData.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
                
                // Append select with meseaurment data

                sortedStepsData.forEach(element => {
                    const option = document.createElement('option');
                    const dateTime = new Date (element.measurement_date)
                    const date = dateTime.toISOString().split('T')[0];
                    const time = dateTime.toISOString().split('T')[1].split('.')[0]

                    option.textContent = `${date} ${time} - steps: ${element.steps}`;
                    option.value = element.id;
                    createForm.querySelector('select').appendChild(option);

                });

    
            } else {
                // Error
                const error = await response.json();
                console.log('Error: ', error);
            }
        };
        
        apiStepsData()

        formModal.appendChild(createForm);
        manageContent.appendChild(formModal);

        if (!document.querySelector('.managecontent.update')) {
            // If the .managecontent.update not exist -> show the managecontetn update modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });            
            document.querySelector('.stepsmodal').append(manageContent);
        };

        // Update button
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();

            const formData = new FormData(event.target)
            const meseaurmentId = parseInt(document.querySelector('select').value)
            const newDate = `${formData.get('measurement_date')}T${formData.get('measurement_time')}`

            // PUT - update steps
            const updateStepsData = async() => {
                const body = {
                    'steps': formData.get('steps'),
                    'measurement_date': newDate
                }
                const response = await updateFunction('steps', meseaurmentId, body)

                if (response.ok) {

                    const infoModal = document.createElement('div');
                    infoModal.classList.add('infomodal', 'success');

                    const infoContent = document.createElement('div');
                    infoContent.classList.add('infocontent');
                    infoContent.textContent = 'Updated!';

                    infoModal.append(infoContent);
                    
                    document.querySelector('.managemodal').parentElement.append(infoModal)

                    // UPDATE CHART
                    // Destroy chart if exist
                    if (window.dataChart != null) {
                        window.dataChart.destroy()
                    }
                    createChartwithApiData('steps', 'bar', 'Steps by date', 
                                            {type: 'time',
                                                time: {unit: 'day'}
                                            },
                                            ['steps', 1], ['',3]);

                    // Delete succes bar
                    setTimeout( () => {
                        document.querySelector('.infomodal').remove();
                    }, 3000);
                }
            }

            updateStepsData();

        });

    });   

    // STEPS MANAGE: CREATE

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
        <label>Steps:</label>
        <input type="number" id="steps" name="steps" required>

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
            document.querySelector('.stepsmodal').append(manageContent);
        };

        // POST: add new steps to api
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();

            const formdata = new FormData(event.target)
            const todatatime = `${formdata.get('measurement_date')}T${formdata.get('measurement_time')}`

            const token = sessionStorage.getItem('token')
            

            // POST - Add steps api
            const apiaddsteps = async () => {

                const body = {
                        'steps': formdata.get('steps'),
                        'measurement_date': todatatime
                }

                const response = await createFunction('steps', body)
    
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

                    createChartwithApiData('steps', 'bar', 'Steps by date', 
                                            {type: 'time',
                                                time: {unit: 'day'}
                                            },
                                            ['steps', 1], ['',3]);

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
            apiaddsteps();

        })

    });

    // STEPS MANAGE: DELETE
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
        const apiStepsData = async () => {

            const response = await responseFunction('steps');
    
            // Response verification
            if (response.ok) {
                const stepsData = await response.json()
                const sortedStepsData = stepsData.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
                
                // Append select with meseaurment data

                sortedStepsData.forEach(element => {
                    const option = document.createElement('option');
                    const datetime = new Date (element.measurement_date)
                    const date = datetime.toISOString().split('T')[0];
                    const time = datetime.toISOString().split('T')[1].split('.')[0]

                    option.textContent = `${date} ${time} - steps: ${element.steps}`;
                    option.value = element.id;
                    createForm.querySelector('select').appendChild(option);

                });

    
            } else {
                // Error
                const error = await response.json();
                console.log('Error: ', error);
            }
        };
        
        apiStepsData()


        formModal.appendChild(createForm);
        manageContent.appendChild(formModal);


        if (!document.querySelector('.managecontent.deletedata')) {
            // If the .managecontent.deletedata not exist -> show the managecontetn delete modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });
            document.querySelector('.stepsmodal').append(manageContent);
        };

        // Event listener - delete
        document.querySelector('form').addEventListener('submit', (element)=> {
            element.preventDefault()
            const deletedata = async () => {
                const id = document.querySelector('select').value
                const response = await deleteFunction('steps', id);

                if (response.ok) {

                    const infoModal = document.createElement('div');
                    infoModal.classList.add('infomodal', 'success');

                    const infoContent = document.createElement('div');
                    infoContent.classList.add('infocontent');
                    infoContent.textContent = 'Deleted!';

                    infoModal.append(infoContent);
                    
                    document.querySelector('.managemodal').parentElement.append(infoModal);

                    // UPDATE CHART
                    // Destroy chart if exist
                    if (window.dataChart != null) {
                        window.dataChart.destroy()
                    }

                    createChartwithApiData('steps', 'bar', 'Steps by date', 
                                            {type: 'time',
                                                time: {unit: 'day'}
                                            },
                                            ['steps', 1], ['',3]);

                    // Remove removed option
                    const toRemove = document.querySelector('select');
                    toRemove.remove(toRemove.selectedIndex);

                    // Delete succes bar
                    setTimeout( () => {
                        document.querySelector('.infomodal').remove();
                    }, 3000); 
                }

            }
            deletedata()
        })


    }); 

    // Append UPDATE CREATE DELETE
    manageModal.appendChild(update);
    manageModal.appendChild(create);
    manageModal.appendChild(deleteData);
    stepsModal.firstChild.appendChild(manageModal);


    // // CHART
    const chartModal = chartModalFunction();
    
    // Get steps data after clicking steps navbtn
    document.querySelector('.navbtn.steps').addEventListener('click', () => {
        createChartwithApiData('steps', 'bar', 'Steps by date', 
                                {type: 'time',
                                    time: {unit: 'day'}
                                },
                                ['steps', 1], ['',3]);
    })


    modalArray.push(stepsModal, chartModal);
    
    return modalArray
};