import { today, baseModal } from './views';
import { createChartwithApiData, chartModalFunction } from './chartFunction';

export function trainingFunction(row) {

    const getTrainingList = async () => {
        // SELECT - append new option with list of trainings
        const token = sessionStorage.getItem('token');
        const response = await fetch('http://127.0.0.1:8000/traininglist/', {
            mode: 'cors',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        });
        
    // Response verification
    if (response.ok) {
        const trainingList = await response.json();

        // append training list in form
        const select = document.querySelector('#traininglist');
        trainingList.forEach( (element) => {
            const option = document.createElement('option');
            option.textContent = element.training_name;
            option.value = element.key;
            select.appendChild(option);
        })
    }
    };

    const apiTrainingData = async () => {
        // Function which fill form with sport avalible to choose
        const token = sessionStorage.getItem('token')
        const response = await fetch('http://127.0.0.1:8000/training/', {
            mode: 'cors',
            credentials: "same-origin",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        })

        // Response verification
        if (response.ok) {
            const trainingData = await response.json()
            const sortedTrainingData = trainingData.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
            
            // Append select with meseaurment data

            const selectelement = document.querySelector('#selectdata')
            sortedTrainingData.forEach(element => {
                const option = document.createElement('option');
                const datetime = new Date (element.measurement_date)
                const date = datetime.toISOString().split('T')[0];
                const time = datetime.toISOString().split('T')[1].split('.')[0]

                option.textContent = `${date} ${time} - training: ${element.training} - duration: ${element.training_time}`;
                option.value = element.id;
                document.querySelector('select').appendChild(option);

            });


        } else {
            // Error
            const error = await response.json();
            console.log('Error: ', error);
        }
    };

    const now = today();
    const modalArray = [];

    // Trainging manage console: Update, Create, Delete

    const trainingModal = baseModal(row);
    trainingModal.firstChild.classList.add('trainingmodal');

    // TRAINING MANAGE: update, create, delete
    const manageModal = document.createElement('div');
    manageModal.classList.add('managemodal');

    // TRAINING MANAGE: UPDATE
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
        <label>Select session: </label>
        <select id='selectdata'>
        </select>

        <label>Training:</label>
        <select id='traininglist' name='training'>
        </select>
        <label>Traning Duration</label>
        <div id="training_time">
        <label>Hours:</label>
        <input type="number" step=1 id="durationhours", name="durationhours" requred>
        <label>Minutes:</label>
        <input type="number" step=1 id="durationminutes", name="durationminutes" requred>
        <label>Seconds:</label>
        <input type="number" step=1 id="durationseconds", name="durationseconds" requred>
        </div>
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

            const trainingInput = createform.querySelector('#traininglist');
            const dateinput = createform.querySelector('#measurement_date');
            const tieminput = createform.querySelector('#measurement_time');
            const durationhoursinput = createform.querySelector('#durationhours');
            const durationminutesinput = createform.querySelector('#durationminutes');
            const durationsecondsinput = createform.querySelector('#durationseconds');

            const measurementdata = selectedOption.textContent.split(" ");
            const measurementDataTraining = measurementdata[4];
            const measurementdatadate = measurementdata[0];
            const measurementdatatime = measurementdata[1];
            const measurementduration = measurementdata[measurementdata.length - 1].split(":")

            trainingInput.value = measurementDataTraining
            dateinput.value = measurementdatadate;
            tieminput.value = measurementdatatime;
            durationhoursinput.value = measurementduration[0];
            durationminutesinput.value = measurementduration[1];
            durationsecondsinput.value = measurementduration[2];




        })


        // Fill form with Sport avalible to choose
        apiTrainingData();

        formmodal.appendChild(createform);
        managecontent.appendChild(formmodal);

        if (!document.querySelector('.managecontent.update')) {
            // If the .managecontent.update not exist -> show the managecontetn update modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });            
            document.querySelector('.trainingmodal').append(managecontent);
        };

        // Update button
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();

            const formdata = new FormData(event.target)
            const meseaurmentid = parseInt(document.querySelector('select').value)
            const token = sessionStorage.getItem('token');
            const duration = `${formdata.get('durationhours')}:${formdata.get('durationminutes')}:${formdata.get('durationseconds')}`;
            const measurement_date_time = `${formdata.get('measurement_date')}T${formdata.get('measurement_time')}Z`

        

            // PUT - update training
            const updateTrainingData = async() => {
                const response = await fetch(`http://127.0.0.1:8000/training/${meseaurmentid}/`, {
                    mode: 'cors',
                    credentials: 'same-origin',
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    },
                    body: JSON.stringify({
                        'user': token,
                        'training': formdata.get('training'),
                        'measurement_date': measurement_date_time,
                        'training_time': duration,
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
                    getTraining();

                    // Delete succes bar
                    setTimeout( () => {
                        document.querySelector('.infomodal').remove();
                    }, 3000);
                }
            }
            updateTrainingData();


        });

        getTrainingList();

    });

    // TAINING MANAGE: CREATE
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
        <label>Training:</label>
        <select id='traininglist' name='training'>
        </select>
        <label>Traning Duration</label>
        <div id="training_time">
        <label>Hours:</label>
        <input type="number" step=1 id="durationhours", name="durationhours" value=0 requred>
        <label>Minutes:</label>
        <input type="number" step=1 id="durationminutes", name="durationminutes" value=0 requred>
        <label>Seconds:</label>
        <input type="number" step=1 id="durationseconds", name="durationseconds" value=0 requred>
        </div>
        <label>Measurement date:</label>
        <input type="date" id="measurement_date" name="measurement_date" required>

        <label>Measurement time:</label>
        <input type="time" step=1 id="measurement_time" name="measurement_time" required>
        
        <button type="submit" id="submit">Create</button>

        `
        createform.querySelector('#measurement_date').value = now[0];
        createform.querySelector('#measurement_time').value = now[1];
        

        // Fill form with Sport avalible to choose
        getTrainingList();
        formmodal.appendChild(createform);
        managecontent.appendChild(formmodal);

        

        if (!document.querySelector('.managecontent.create')) {
            // If the .managecontent.create not exist -> show the managecontetn create modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });
            document.querySelector('.trainingmodal').append(managecontent);
        };

        // POST: add new training to api
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();

            const formdata = new FormData(event.target)
            const todatatime = `${formdata.get('measurement_date')}T${formdata.get('measurement_time')}`
            const duration = `${formdata.get('durationhours')}:${formdata.get('durationminutes')}:${formdata.get('durationseconds')}`;
            const token = sessionStorage.getItem('token')
            

            // POST - Add training api
            const apiAddTraining = async () => {
                const response = await fetch('http://127.0.0.1:8000/training/', {
                    mode: 'cors',
                    credentials: 'same-origin',
                    method: 'POST',
                    headers: {                    
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`                
                    },
                    body: JSON.stringify({
                        'user': token,
                        'training': formdata.get('training'),
                        'measurement_date': todatatime,
                        'training_time': duration
    
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
                    getTraining();
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
            apiAddTraining();

        })

    });

    // TRAINING MANAGE: DELETE
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
        const apiTrainingData = async () => {
            const token = sessionStorage.getItem('token')
            const response = await fetch('http://127.0.0.1:8000/training/', {
                mode: 'cors',
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
    
            // Response verification
            if (response.ok) {
                const trainingData = await response.json()
                const sortedTrainingData = trainingData.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
                
                // Append select with meseaurment data

                const selectelement = document.querySelector('#selectdata')

                sortedTrainingData.forEach(element => {
                    const option = document.createElement('option');
                    const datetime = new Date (element.measurement_date)
                    const date = datetime.toISOString().split('T')[0];
                    const time = datetime.toISOString().split('T')[1].split('.')[0]

                    option.textContent = `${date} ${time} - weight: ${element.training}`;
                    option.value = element.id;
                    createform.querySelector('select').appendChild(option);

                });

    
            } else {
                // Error
                const error = await response.json();
                console.log('Error: ', error);
            }
        };
        
        apiTrainingData()


        formmodal.appendChild(createform);
        managecontent.appendChild(formmodal);


        if (!document.querySelector('.managecontent.deletedata')) {
            // If the .managecontent.deletedata not exist -> show the managecontetn delete modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });
            document.querySelector('.trainingmodal').append(managecontent);
        };

        // Event listener - delete
        document.querySelector('form').addEventListener('submit', (element)=> {
            element.preventDefault()
            const deletedata = async () => {
                const token = sessionStorage.getItem('token');
                const id = document.querySelector('select').value
                const response = await fetch(`http://127.0.0.1:8000/training/${id}/`, {
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
                    getTraining();

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

    // Append {UPDATE CREATE DELETE}
    manageModal.appendChild(update);
    manageModal.appendChild(create);
    manageModal.appendChild(deletedata);
    trainingModal.firstChild.appendChild(manageModal);

    // CHART
    const chartModal = chartModalFunction();
    
    // Get training data after clicking weight navbtn
    document.querySelector('.navbtn.training').addEventListener('click', () => {
        createChartwithApiData('training', 'line', 'Training hours', 
                                {type: 'time',
                                    time: {unit: 'day'}
                                },
                                ['training_time', 2], ['', 3]);

    })

    modalArray.push(trainingModal, chartModal);

    return modalArray
};