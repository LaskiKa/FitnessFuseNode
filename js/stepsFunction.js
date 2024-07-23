// View: Steps
import { today, baseModal } from './views';
import { createChartwithApiData, chartModalFunction } from './chartFunction';

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

        const managecontent = document.createElement('div');
        managecontent.classList.add('managecontent', 'update');

        const formmodal = document.createElement('div');
        formmodal.classList.add('formmodal');

        const createform = document.createElement('form');
        createform.classList.add('form', 'update');
        createform.innerHTML = `
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
        createform.querySelector('select').addEventListener('click', () => {
            const seleted = createform.querySelector('select')
            var selectedOption = seleted.options[seleted.selectedIndex];

            const stepsinput = createform.querySelector('#steps');
            const dateinput = createform.querySelector('#measurement_date');
            const tieminput = createform.querySelector('#measurement_time');

            const measurementdata = selectedOption.textContent.split(" ");
            const measurementdataweight = measurementdata[measurementdata.length -1];
            const measurementdatadate = measurementdata[0];
            const measurementdatatime = measurementdata[1];

            stepsinput.value = measurementdataweight;
            dateinput.value = measurementdatadate;
            tieminput.value = measurementdatatime;


        })

        // SELECT - append new option with data
        const apistepsdata = async () => {
            const token = sessionStorage.getItem('token')
            const response = await fetch('http://127.0.0.1:8000/steps/', {
                mode: 'cors',
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
    
            // Response verification
            if (response.ok) {
                const stepsdata = await response.json()
                const sortedstepsdata = stepsdata.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
                
                // Append select with meseaurment data

                const selectelement = document.querySelector('#selectdata')
                sortedstepsdata.forEach(element => {
                    const option = document.createElement('option');
                    const datetime = new Date (element.measurement_date)
                    const date = datetime.toISOString().split('T')[0];
                    const time = datetime.toISOString().split('T')[1].split('.')[0]

                    option.textContent = `${date} ${time} - steps: ${element.steps}`;
                    option.value = element.id;
                    createform.querySelector('select').appendChild(option);

                });

    
            } else {
                // Error
                const error = await response.json();
                console.log('Error: ', error);
            }
        };
        
        apistepsdata()


        formmodal.appendChild(createform);
        managecontent.appendChild(formmodal);

        if (!document.querySelector('.managecontent.update')) {
            // If the .managecontent.update not exist -> show the managecontetn update modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });            
            document.querySelector('.stepsmodal').append(managecontent);
        };

        // Update button
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();

            const formdata = new FormData(event.target)
            const meseaurmentid = parseInt(document.querySelector('select').value)
            const newdate = `${formdata.get('measurement_date')}T${formdata.get('measurement_time')}`
            const token = sessionStorage.getItem('token');

            // PUT - update steps
            const updatestepsdata = async() => {
                const response = await fetch(`http://127.0.0.1:8000/steps/${meseaurmentid}/`, {
                    mode: 'cors',
                    credentials: 'same-origin',
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    },
                    body: JSON.stringify({
                        'user': token,
                        'steps': formdata.get('steps'),
                        'measurement_date': newdate
                    })
                })

                if (response.ok) {
                    const data = response.json();

                    const infomodal = document.createElement('div');
                    infomodal.classList.add('infomodal', 'success');

                    const infocontent = document.createElement('div');
                    infocontent.classList.add('infocontent');
                    infocontent.textContent = 'Updated!';

                    infomodal.append(infocontent);
                    
                    document.querySelector('.managemodal').parentElement.append(infomodal)

                    // UPDATE CHART
                    // Destroy chart if exist
                    if (window.dataChart != null) {
                        window.dataChart.destroy()
                    }
                    getSteps();

                    // Delete succes bar
                    setTimeout( () => {
                        document.querySelector('.infomodal').remove();
                    }, 3000);
                }
            }
            updatestepsdata();


        });


    });   

    // STEPS MANAGE: CREATE

    const create = document.createElement('div');
    create.classList.add('manage','create');
    create.textContent='create';

    create.addEventListener('click', () => {
        const managecontent = document.createElement('div');
        managecontent.classList.add('managecontent', 'create');

        const formmodal = document.createElement('div');
        formmodal.classList.add('formmodal');

        const createform = document.createElement('form');
        createform.classList.add('form', 'create');
        createform.innerHTML = `
        <label>Steps:</label>
        <input type="number" id="steps" name="steps" required>

        <label>Measurement date:</label>
        <input type="date" id="measurement_date" name="measurement_date" required>

        <label>Measurement time:</label>
        <input type="time" step=1 id="measurement_time" name="measurement_time" required>
        
        <button type="submit" id="submit">Submit</button>

        `
        createform.querySelector('#measurement_date').value = now[0];
        createform.querySelector('#measurement_time').value = now[1];
        

        formmodal.appendChild(createform);
        managecontent.appendChild(formmodal);
        

        if (!document.querySelector('.managecontent.create')) {
            // If the .managecontent.update not exist -> show the managecontetn update modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });
            document.querySelector('.stepsmodal').append(managecontent);
        };

        // POST: add new steps to api
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();

            const formdata = new FormData(event.target)
            const todatatime = `${formdata.get('measurement_date')}T${formdata.get('measurement_time')}`

            const token = sessionStorage.getItem('token')
            

            // POST - Add steps api
            const apiaddsteps = async () => {
                const response = await fetch('http://127.0.0.1:8000/steps/', {
                    mode: 'cors',
                    credentials: 'same-origin',
                    method: 'POST',
                    headers: {                    
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`                
                    },
                    body: JSON.stringify({
                        'user': token,
                        'steps': formdata.get('steps'),
                        'measurement_date': todatatime
    
                    })
                })
    
    
                if (response.ok) {
                    const data = response.json()
                    
                    const infomodal = document.createElement('div');
                    infomodal.classList.add('infomodal', 'success');

                    const infocontent = document.createElement('div');
                    infocontent.classList.add('infocontent');
                    infocontent.textContent = 'Success';

                    infomodal.append(infocontent);
                    
                    document.querySelector('.managemodal').parentElement.append(infomodal)

                    // UPDATE CHART
                    // Destroy chart if exist
                    if (window.dataChart != null) {
                        window.dataChart.destroy()
                    }
                    getSteps();
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
    const deletedata = document.createElement('div');
    deletedata.classList.add('manage', 'deletedata');
    deletedata.textContent='delete';

    deletedata.addEventListener('click', () => {

        const managecontent = document.createElement('div');
        managecontent.classList.add('managecontent', 'deletedata');

        const formmodal = document.createElement('div');
        formmodal.classList.add('formmodal');

        const createform = document.createElement('form');
        createform.classList.add('form', 'update');
        createform.innerHTML = `
        <label>Select data: </label>
        <select id='selectdata'>
        </select>

        <button type="submit" id="delete">Delete</button>

        `

        // SELECT - append new option with data
        const apistepsdata = async () => {
            const token = sessionStorage.getItem('token')
            const response = await fetch('http://127.0.0.1:8000/steps/', {
                mode: 'cors',
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
    
            // Response verification
            if (response.ok) {
                const stepsdata = await response.json()
                const sortedstepsdata = stepsdata.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
                
                // Append select with meseaurment data

                const selectelement = document.querySelector('#selectdata')

                sortedstepsdata.forEach(element => {
                    const option = document.createElement('option');
                    const datetime = new Date (element.measurement_date)
                    const date = datetime.toISOString().split('T')[0];
                    const time = datetime.toISOString().split('T')[1].split('.')[0]

                    option.textContent = `${date} ${time} - steps: ${element.steps}`;
                    option.value = element.id;
                    createform.querySelector('select').appendChild(option);

                });

    
            } else {
                // Error
                const error = await response.json();
                console.log('Error: ', error);
            }
        };
        
        apistepsdata()


        formmodal.appendChild(createform);
        managecontent.appendChild(formmodal);


        if (!document.querySelector('.managecontent.deletedata')) {
            // If the .managecontent.deletedata not exist -> show the managecontetn delete modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });
            document.querySelector('.stepsmodal').append(managecontent);
        };

        // Event listener - delete
        document.querySelector('form').addEventListener('submit', (element)=> {
            element.preventDefault()
            const deletedata = async () => {
                const token = sessionStorage.getItem('token');
                const id = document.querySelector('select').value
                const response = await fetch(`http://127.0.0.1:8000/steps/${id}/`, {
                    mode: 'cors',
                    credentials: "same-origin",
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    }
                })

                if (response.ok) {

                    const infomodal = document.createElement('div');
                    infomodal.classList.add('infomodal', 'success');

                    const infocontent = document.createElement('div');
                    infocontent.classList.add('infocontent');
                    infocontent.textContent = 'Deleted!';

                    infomodal.append(infocontent);
                    
                    document.querySelector('.managemodal').parentElement.append(infomodal)

                    // UPDATE CHART
                    // Destroy chart if exist
                    if (window.dataChart != null) {
                        window.dataChart.destroy()
                    }
                    getSteps();
                    // Remove removed option
                    const toremove = document.querySelector('select');
                    toremove.remove(toremove.selectedIndex);

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
    manageModal.appendChild(deletedata);
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