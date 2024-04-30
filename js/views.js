// Views: Home, About, Contact, Weight, Steps, Caloreis, BASE MODAL
import  Chart, { LineElement }  from 'chart.js/auto';
// import { textContent } from "./static/textcontent.json";

function today() {
    const now = [];
    const date = new Date();
    now.push(date.toISOString().split('T')[0]);
    now.push(date.toLocaleTimeString());

    return now
}

export function baseModal(row) {

    const modalbase = document.createElement('div');
    modalbase.classList.add('basemodal');
    
    
    if (row) {
        const modalrow = document.createElement('div');
        modalrow.classList.add('modalrow');
        modalrow.appendChild(modalbase);
        return modalrow
    };
    
    return modalbase
    
};

export function homeFunction(row) {
    const modalArray = [];

    const textContent = require('./static/textcontent.json');
    const homeModal = baseModal(row);
    homeModal.firstChild.classList.add('homemodal')

    const logoImage = document.createElement('img');
    logoImage.setAttribute('id', 'imglogomodal');
    logoImage.src = 'js/static/FitnessFuselogo_wide.png'

    const descriptionModal = baseModal(row)
    descriptionModal.firstChild.classList.add('descriptionmodal');
    
    const descriptionContent = document.createElement('div');


    descriptionContent.setAttribute('id', 'descricontent');

    descriptionContent.innerText = textContent.homepage.description;
    descriptionModal.firstChild.appendChild(descriptionContent);


    homeModal.firstChild.appendChild(logoImage);

    modalArray.push(homeModal, descriptionModal)

    return modalArray
};

export function aboutFunction(row) {
    
    const aboutModal = baseModal(row);
    aboutModal.firstChild.classList.add('aboutmodal')
    aboutModal.firstChild.textContent = "ABOUT MODAL"


    return aboutModal
};

export function contactFunction(row) {
    
    const contactModal = baseModal(row);
    contactModal.firstChild.classList.add('contactmodal')
    contactModal.firstChild.textContent = "CONTACT MODAL"


    return contactModal
};

export function weightFunction(row) {

    const now = today();
    const modalArray = [];
    
    // Weight manage consloe: update, create, delete\

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

        <label>Weight:</label>
        <input type="number" step=".01" id="weight" name="weight" required>

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

            const weightinput = createform.querySelector('#weight');
            const dateinput = createform.querySelector('#measurement_date');
            const tieminput = createform.querySelector('#measurement_time');

            const  measurementdata = selectedOption.textContent.split(" ");
            const measurementdataweight = measurementdata[measurementdata.length -1];
            const measurementdatadate = measurementdata[0];
            const measurementdatatime = measurementdata[1];

            weightinput.value = measurementdataweight;
            dateinput.value = measurementdatadate;
            tieminput.value = measurementdatatime;


        })

        // SELECT - append new option with data
        const apiweightdata = async () => {
            const token = sessionStorage.getItem('token')
            const response = await fetch('http://127.0.0.1:8000/weight/', {
                mode: 'cors',
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
    
            // Response verification
            if (response.ok) {
                const weightdata = await response.json()
                const sortedweightdata = weightdata.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
                
                // Append select with meseaurment data

                const selectelement = document.querySelector('#selectdata')
                sortedweightdata.forEach(element => {
                    const option = document.createElement('option');
                    const datetime = new Date (element.measurement_date)
                    const date = datetime.toISOString().split('T')[0];
                    const time = datetime.toISOString().split('T')[1].split('.')[0]

                    option.textContent = `${date} ${time} - weight: ${element.weight}`;
                    option.value = element.id;
                    createform.querySelector('select').appendChild(option);

                });

    
            } else {
                // Error
                const error = await response.json();
                console.log('Error: ', error);
            }
        };
        
        apiweightdata()


        formmodal.appendChild(createform);
        managecontent.appendChild(formmodal);

        if (!document.querySelector('.managecontent.update')) {
            // If the .managecontent.update not exist -> show the managecontetn update modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });            
            document.querySelector('.weightmodal').append(managecontent);
        };

        // Update button
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();

            const formdata = new FormData(event.target)
            const meseaurmentid = parseInt(document.querySelector('select').value)
            const newdate = `${formdata.get('measurement_date')}T${formdata.get('measurement_time')}`
            const token = sessionStorage.getItem('token');

            // PUT - update weight
            const updateweightdata = async() => {
                const response = await fetch(`http://127.0.0.1:8000/weight/${meseaurmentid}/`, {
                    mode: 'cors',
                    credentials: 'same-origin',
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    },
                    body: JSON.stringify({
                        'user': token,
                        'weight': formdata.get('weight'),
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
                    getWeight();

                    // Delete succes bar
                    setTimeout( () => {
                        document.querySelector('.infomodal').remove();
                    }, 3000);
                }
            }
            updateweightdata();


        });


    });

    // WEIGHT MANAGE: CREATE
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
        <label>Weight:</label>
        <input type="number" step=".01" id="weight" name="weight" required>

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
            document.querySelector('.weightmodal').append(managecontent);
        };

        // POST: add new weight to api
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();

            const formdata = new FormData(event.target)
            const todatatime = `${formdata.get('measurement_date')}T${formdata.get('measurement_time')}`

            const token = sessionStorage.getItem('token')
            

            // POST - Add weight api
            const apiaddweight = async () => {
                const response = await fetch('http://127.0.0.1:8000/weight/', {
                    mode: 'cors',
                    credentials: 'same-origin',
                    method: 'POST',
                    headers: {                    
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`                
                    },
                    body: JSON.stringify({
                        'user': token,
                        'weight': formdata.get('weight'),
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
                    getWeight();
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
            apiaddweight();

        })

    });

    // WEIGHT MANAGE: DELETE
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
        const apiweightdata = async () => {
            const token = sessionStorage.getItem('token')
            const response = await fetch('http://127.0.0.1:8000/weight/', {
                mode: 'cors',
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
    
            // Response verification
            if (response.ok) {
                const weightdata = await response.json()
                const sortedweightdata = weightdata.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
                
                // Append select with meseaurment data

                const selectelement = document.querySelector('#selectdata')

                sortedweightdata.forEach(element => {
                    const option = document.createElement('option');
                    const datetime = new Date (element.measurement_date)
                    const date = datetime.toISOString().split('T')[0];
                    const time = datetime.toISOString().split('T')[1].split('.')[0]

                    option.textContent = `${date} ${time} - weight: ${element.weight}`;
                    option.value = element.id;
                    createform.querySelector('select').appendChild(option);

                });

    
            } else {
                // Error
                const error = await response.json();
                console.log('Error: ', error);
            }
        };
        
        apiweightdata()


        formmodal.appendChild(createform);
        managecontent.appendChild(formmodal);


        if (!document.querySelector('.managecontent.deletedata')) {
            // If the .managecontent.deletedata not exist -> show the managecontetn delete modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });
            document.querySelector('.weightmodal').append(managecontent);
        };

        // Event listener - delete
        document.querySelector('form').addEventListener('submit', (element)=> {
            element.preventDefault()
            const deletedata = async () => {
                const token = sessionStorage.getItem('token');
                const id = document.querySelector('select').value
                const response = await fetch(`http://127.0.0.1:8000/weight/${id}/`, {
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
                    getWeight();
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
    weightModal.firstChild.appendChild(manageModal);

    // CHART
    const chartModal = baseModal(row);
    chartModal.firstChild.classList.add('chartmodal');

    const canvas = document.createElement('canvas');
    canvas.classList.add('canvas');
    canvas.setAttribute('id', 'canvas'); // canvas chart id

    chartModal.firstChild.appendChild(canvas);

    // GET WEIGHT DATA
    const getWeight = async () => {
        const token = sessionStorage.getItem('token')
        const response = await fetch('http://127.0.0.1:8000/weight/', {
            mode: 'cors',
            credentials: "same-origin",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        })

        // Response verification
        if (response.ok) {
            const weightdata = await response.json()
            const sortedweightdata = weightdata.sort((a,b)=> new Date(a.measurement_date) - new Date(b.measurement_date));

            // IF CHART EXIST - DELETE
            if (window.dataChart != null) {
                window.dataChart.destroy()
            }
            // CREATE CHART - create global variable with chart

            window.dataChart = new Chart(
                chartModal.querySelector('#canvas'),
                {
                    type: 'line',
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                                
                            }
                        },
                    },
                    data: {
                        labels: sortedweightdata.map(row => row.measurement_date),
                        datasets: [
                            {
                                label: 'Weight by date',
                                data: sortedweightdata.map(row => row.weight),
                                backgroundColor: '#4d3ef9',
                                borderColor: '#4d3ef9'
                            }
                        ]
                    }
                }
            );

        } else {
            // Error
            const error = await response.json();
            console.log('Error: ', error);
        }
    };
    
    // Get weight data after clicking weight navbtn
    document.querySelector('.navbtn.weight').addEventListener('click', () => {
        getWeight();
    })

    modalArray.push(weightModal, chartModal);
    
    return modalArray
};

export function caloriesFunction(row) {
    
    const now = today();
    const modalArray = [];
    
    // Calories manage console: update, create, delete

    const caloriesModal = baseModal(row);
    caloriesModal.firstChild.classList.add('caloriesmodal')

    // CALORIES MANAGE: update, create, delete
    const manageModal = document.createElement('div');
    manageModal.classList.add('managemodal');
    
    // CALORIES MANAGE: UPDATE
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

        <label>Calories:</label>
        <input type="number" id="kcal" name="kcal" required>

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

            const caloriestinput = createform.querySelector('#kcal');
            const dateinput = createform.querySelector('#measurement_date');
            const tieminput = createform.querySelector('#measurement_time');

            const measurementdata = selectedOption.textContent.split(" ");
            const measurementdataweight = measurementdata[measurementdata.length -1];
            const measurementdatadate = measurementdata[0];
            const measurementdatatime = measurementdata[1];

            caloriestinput.value = measurementdataweight;
            dateinput.value = measurementdatadate;
            tieminput.value = measurementdatatime;


        })

        // SELECT - append new option with data
        const apicaloriesdata = async () => {
            const token = sessionStorage.getItem('token')
            const response = await fetch('http://127.0.0.1:8000/caloriesburned/', {
                mode: 'cors',
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
    
            // Response verification
            if (response.ok) {
                const caloriesdata = await response.json()
                const sortedcaloriesdata = caloriesdata.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
                
                // Append select with meseaurment data

                const selectelement = document.querySelector('#selectdata')
                sortedcaloriesdata.forEach(element => {
                    const option = document.createElement('option');
                    const datetime = new Date (element.measurement_date)
                    const date = datetime.toISOString().split('T')[0];
                    const time = datetime.toISOString().split('T')[1].split('.')[0]

                    option.textContent = `${date} ${time} - kcal: ${element.kcal}`;
                    option.value = element.id;
                    createform.querySelector('select').appendChild(option);

                });

    
            } else {
                // Error
                const error = await response.json();
                console.log('Error: ', error);
            }
        };
        
        apicaloriesdata()


        formmodal.appendChild(createform);
        managecontent.appendChild(formmodal);

        if (!document.querySelector('.managecontent.update')) {
            // If the .managecontent.update not exist -> show the managecontetn update modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });            
            document.querySelector('.caloriesmodal').append(managecontent);
        };

        // Update button
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();

            const formdata = new FormData(event.target)
            const meseaurmentid = parseInt(document.querySelector('select').value)
            const newdate = `${formdata.get('measurement_date')}T${formdata.get('measurement_time')}`
            const token = sessionStorage.getItem('token');

            // PUT - update calories
            const updatecaloriesdata = async() => {
                const response = await fetch(`http://127.0.0.1:8000/caloriesburned/${meseaurmentid}/`, {
                    mode: 'cors',
                    credentials: 'same-origin',
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    },
                    body: JSON.stringify({
                        'user': token,
                        'kcal': formdata.get('kcal'),
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
                    getCalories();

                    // Delete succes bar
                    setTimeout( () => {
                        document.querySelector('.infomodal').remove();
                    }, 3000);
                }
            }
            updatecaloriesdata();


        });


    });        

    // CALORIES MANAGE: CREATE

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
        <label>Calories:</label>
        <input type="number" id="kcal" name="kcal" required>

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
            document.querySelector('.caloriesmodal').append(managecontent);
        };

        // POST: add new calories to api
        document.querySelector('.form').addEventListener('submit', (event) => {
            event.preventDefault();

            const formdata = new FormData(event.target)
            const todatatime = `${formdata.get('measurement_date')}T${formdata.get('measurement_time')}`

            const token = sessionStorage.getItem('token')
            

            // POST - Add calories api
            const apiaddcalories = async () => {
                const response = await fetch('http://127.0.0.1:8000/caloriesburned/', {
                    mode: 'cors',
                    credentials: 'same-origin',
                    method: 'POST',
                    headers: {                    
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`                
                    },
                    body: JSON.stringify({
                        'user': token,
                        'kcal': formdata.get('kcal'),
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
                    getCalories();
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
            apiaddcalories();

        })

    });

    // CALORIES MANAGE: DELETE
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
        const apicaloriesdata = async () => {
            const token = sessionStorage.getItem('token')
            const response = await fetch('http://127.0.0.1:8000/caloriesburned/', {
                mode: 'cors',
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
    
            // Response verification
            if (response.ok) {
                const caloriesdata = await response.json()
                const sortedcaloriesdata = caloriesdata.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
                
                // Append select with meseaurment data

                const selectelement = document.querySelector('#selectdata')

                sortedcaloriesdata.forEach(element => {
                    const option = document.createElement('option');
                    const datetime = new Date (element.measurement_date)
                    const date = datetime.toISOString().split('T')[0];
                    const time = datetime.toISOString().split('T')[1].split('.')[0]

                    option.textContent = `${date} ${time} - calories: ${element.kcal}`;
                    option.value = element.id;
                    createform.querySelector('select').appendChild(option);

                });

    
            } else {
                // Error
                const error = await response.json();
                console.log('Error: ', error);
            }
        };
        
        apicaloriesdata()


        formmodal.appendChild(createform);
        managecontent.appendChild(formmodal);


        if (!document.querySelector('.managecontent.deletedata')) {
            // If the .managecontent.deletedata not exist -> show the managecontetn delete modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });
            document.querySelector('.caloriesmodal').append(managecontent);
        };

        // Event listener - delete
        document.querySelector('form').addEventListener('submit', (element)=> {
            element.preventDefault()
            const deletedata = async () => {
                const token = sessionStorage.getItem('token');
                const id = document.querySelector('select').value
                const response = await fetch(`http://127.0.0.1:8000/caloriesburned/${id}/`, {
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
                    getCalories();
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
    caloriesModal.firstChild.appendChild(manageModal);

    // CHART
    const chartModal = baseModal(row);
    chartModal.firstChild.classList.add('chartmodal');

    const canvas = document.createElement('canvas');
    canvas.classList.add('canvas');
    canvas.setAttribute('id', 'canvas'); // canvas chart id

    chartModal.firstChild.appendChild(canvas);
    
    // GET CALORIES DATA
    const getCalories = async () => {
        const token = sessionStorage.getItem('token')
        const response = await fetch('http://127.0.0.1:8000/caloriesburned/', {
            mode: 'cors',
            credentials: "same-origin",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        })

        // Response verification
        if (response.ok) {
            const caloriesdata = await response.json()
            const sortedcaloriesdata = caloriesdata.sort((a,b)=> new Date(a.measurement_date) - new Date(b.measurement_date));

            // IF CHART EXIST - DELETE
            if (window.dataChart != null) {
                window.dataChart.destroy()
            }

            // CREATE CHART - create global variable with chart
            window.dataChart = new Chart(
                chartModal.querySelector('#canvas'),
                {
                    type: 'line',
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                            }
                        },
                    },
                    data: {
                        labels: sortedcaloriesdata.map(row => row.measurement_date),
                        datasets: [
                            {
                                label: 'Burned calories by date',
                                data: sortedcaloriesdata.map(row => row.kcal),
                                backgroundColor: '#4d3ef9',
                                borderColor: '#4d3ef9'
                            }
                        ]
                    }
                }
            );
            
        } else {
            // Error
            const error = await response.json();
            console.log('Error: ', error);
        }
    };
    
    // Get calories data after pressing weight navbtn
    document.querySelector('.navbtn.calories').addEventListener('click', () => {
        getCalories();
    })

    modalArray.push(caloriesModal, chartModal);
    
    return modalArray
};

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


    // CHART
    const chartModal = baseModal(row);
    chartModal.firstChild.classList.add('chartmodal');

    const canvas = document.createElement('canvas');
    canvas.classList.add('canvas');
    canvas.setAttribute('id', 'canvas'); // ID canvasa - tutaj zmiana

    chartModal.firstChild.appendChild(canvas);

    // GET STEPS DATA
    const getSteps = async () => {
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
            const stepsdata = await response.json();
            const sortedstepsdata = stepsdata.sort((a,b)=> new Date(a.measurement_date) - new Date(b.measurement_date));


            // IF CHART EXIST - DELETE
            if (window.dataChart != null) {
                window.dataChart.destroy()
            }

            // CREATE CHART - create global variable with chart
            window.dataChart = new Chart(
                chartModal.querySelector('#canvas'),
                {
                    type: 'bar',
                    options: {
                        responsive: true,
                    },
                    data: {
                        labels: sortedstepsdata.map(row => row.measurement_date),
                        datasets: [
                            {
                                label: 'Steps by date',
                                data: sortedstepsdata.map(row => row.steps),
                                backgroundColor: '#4d3ef9',
                                borderColor: '#4d3ef9'
                            }
                        ]
                    }
                }
            );
            
        } else {
            // Error
            const error = await response.json();
            console.log('Error: ', error);
        }
    };
    
    // Get steps data after clicking steps navbtn
    document.querySelector('.navbtn.steps').addEventListener('click', () => {
        getSteps();
    })

    modalArray.push(stepsModal, chartModal);
    
    return modalArray
};