// Views: Calories Consumed
import  Chart, { LineElement }  from 'chart.js/auto';
import { today, baseModal } from './views';
import { createChartwithApiData, chartModalFunction } from './chartFunction';


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
        createForm.innerHTML = `
        <label>Select data: </label>
        <select id='selectdata'>
        </select>

        <label>Calories Consumed:</label>
        <input type="number" id="kcal" name="kcal" required>

        <label>Meal:</label>
        <input type="text" id="meal" name="meal" required>


        <label>Protein:</label>
        <input type="number" id="protein" name="protein" step="0.01" required>

        <label>Carbs</label>
        <input type="number" id="carbs" name="carbs" step="0.01" required>

        <label>Fat:</label>
        <input type="number" id="fat" name="fat" step="0.01" required>

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

            const getMealData = async (mealId) => {
                // get meal details: calories, protein, carbs, fat, etc.
                const token = sessionStorage.getItem('token')
                const response = await fetch(`http://127.0.0.1:8000/calorieseaten/${mealId}/`, {
                    mode: 'cors',
                    credentials: "same-origin",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    }
                })

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
            const token = sessionStorage.getItem('token')
            const response = await fetch('http://127.0.0.1:8000/calorieseaten/', {
                mode: 'cors',
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
    
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
            }
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
            const meseaurmentid = parseInt(document.querySelector('select').value)
            const newDate = `${formData.get('measurement_date')}T${formData.get('measurement_time')}`
            const token = sessionStorage.getItem('token');

            // PUT - update calories
            const updateCaloriesData = async() => {
                const response = await fetch(`http://127.0.0.1:8000/calorieseaten/${meseaurmentid}/`, {
                    mode: 'cors',
                    credentials: 'same-origin',
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    },
                    body: JSON.stringify({
                        'user': token,
                        'kcal': formData.get('kcal'),
                        'meal': formData.get('meal'),
                        'protein': formData.get('protein'),
                        'carbs': formData.get('carbs'),
                        'fat': formData.get('fat'),
                        'measurement_date': newDate
                    })
                })

                if (response.ok) {
                    const data = response.json();

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
                    }
                    getCalories();

                    // Delete succes bar
                    setTimeout( () => {
                        document.querySelector('.infomodal').remove();
                    }, 3000);
                }
            }
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
        createForm.innerHTML = `
        <label>Calories Consumed:</label>
        <input type="number" id="kcal" name="kcal" required>

        <label>Meal:</label>
        <input type="text" id="meal" name="meal" required>

        <label>Protein:</label>
        <input type="number" id="protein" name="protein" step="0.01" required>

        <label>Carbs:</label>
        <input type="number" id="carbs" name="carbs" step="0.01" required>

        <label>Fat:</label>
        <input type="number" id="fat" name="fat" step="0.01" required>

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
                const response = await fetch('http://127.0.0.1:8000/calorieseaten/', {
                    mode: 'cors',
                    credentials: 'same-origin',
                    method: 'POST',
                    headers: {                    
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`                
                    },
                    body: JSON.stringify({
                        'user': token,
                        'kcal': formData.get('kcal'),
                        'meal': formData.get('meal'),
                        'protein': formData.get('protein'),
                        'carbs': formData.get('carbs'),
                        'fat': formData.get('fat'),
                        'measurement_date': toDataTime
    
                    })
                })
    
    
                if (response.ok) {
                    const data = response.json()
                    
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
            apiAddcalories();

        })

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
        createForm.innerHTML = `
        <label>Select data: </label>
        <select id='selectdata'>
        </select>

        <button type="submit" id="delete">Delete</button>

        `

        // SELECT - append new option with data
        const apiCaloriesData = async () => {
            const token = sessionStorage.getItem('token')
            const response = await fetch('http://127.0.0.1:8000/calorieseaten/', {
                mode: 'cors',
                credentials: "same-origin",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
    
            // Response verification
            if (response.ok) {
                const caloriesData = await response.json()
                const sortedCaloriesData = caloriesData.sort((a,b)=> new Date(b.measurement_date) - new Date(a.measurement_date));
                
                // Append select with meseaurment data

                const selectElement = document.querySelector('#selectdata')

                sortedCaloriesData.forEach(element => {
                    const option = document.createElement('option');
                    const dateTime = new Date (element.measurement_date)
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
            }
        };
        
        apiCaloriesData()


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
                const token = sessionStorage.getItem('token');
                const id = document.querySelector('select').value
                const response = await fetch(`http://127.0.0.1:8000/calorieseaten/${id}/`, {
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
            deleteData()
        })


    }); 

    // Append UPDATE CREATE DELETE
    manageModal.appendChild(update);
    manageModal.appendChild(create);
    manageModal.appendChild(deleteData);
    caloriesModal.firstChild.appendChild(manageModal);

    // CHART
    // const chartModal = baseModal(row);
    // chartModal.firstChild.classList.add('chartmodal');

    // const canvas = document.createElement('canvas');
    // canvas.classList.add('canvas');
    // canvas.setAttribute('id', 'canvas'); // canvas chart id

    // chartModal.firstChild.appendChild(canvas);
    
    // // GET CALORIES DATA
    // const getCalories = async () => {
    //     const token = sessionStorage.getItem('token')
    //     const response = await fetch('http://127.0.0.1:8000/calorieseaten/', {
    //         mode: 'cors',
    //         credentials: "same-origin",
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Token ${token}`
    //         }
    //     })

    //     // Response verification
    //     if (response.ok) {
    //         const caloriesData = await response.json()
    //         const sortedCaloriesData = caloriesData.sort((a,b)=> new Date(a.measurement_date) - new Date(b.measurement_date));
            
    //         // IF CHART EXIST - DELETE
    //         if (window.dataChart != null) {
    //             window.dataChart.destroy()
    //         }

    //         // CREATE CHART - create global variable with chart
    //         window.dataChart = new Chart(
    //             chartModal.querySelector('#canvas'),
    //             {
    //                 type: 'line',
    //                 options: {
    //                     responsive: true,
    //                     scales: {
    //                         y: {
    //                             beginAtZero: true,
    //                         }
    //                     },
    //                 },
    //                 data: {
    //                     labels: sortedCaloriesData.map(row => row.meal),
    //                     datasets: [
    //                         {
    //                             label: 'Consumed calories by date',
    //                             data: sortedCaloriesData.map(row => row.kcal),
    //                             backgroundColor: '#4d3ef9',
    //                             borderColor: '#4d3ef9'
    //                         }
    //                     ]
    //                 }
    //             }
    //         );
            
    //     } else {
    //         // Error
    //         const error = await response.json();
    //         console.log('Error: ', error);
    //     }
    // };
    
    // // Get consumed calories data after pressing calories consumed navbtn
    // document.querySelector('.navbtn.caloriesconsumed').addEventListener('click', () => {
    //     getCalories();
    // })

    // CHART
    const chartModal = chartModalFunction();

    document.querySelector('.navbtn.caloriesconsumed').addEventListener('click', () => {
    // getCalories();
        createChartwithApiData('calorieseaten', 'line', 'Consumed calories by date',
                                {type: 'category'}, 
                                ['kcal', 1], 
                                ['meal', 1]);
    })

    modalArray.push(caloriesModal, chartModal);

    return modalArray
};