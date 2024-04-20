// Views: Home, About, Contact, Weight, Steps, Caloreis, BASE MODAL
import  Chart  from 'chart.js/auto'

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
    // modalbase.textContent = "Base modal"
    
    
    if (row) {
        const modalrow = document.createElement('div');
        modalrow.classList.add('modalrow');
        modalrow.appendChild(modalbase);
        return modalrow
    };
    
    return modalbase
    
};

export function homeFunction(row) {
    
    const homeModal = baseModal(row);
    homeModal.firstChild.classList.add('homemodal')
    homeModal.firstChild.textContent = "HOME MODAL"

    return homeModal
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
        // Rozwiń pole poniżej do edycji
        // Dodaj formularz do edycji
        // Dodaj pole rozwijane z dostępnymi pomiarami
        const managecontent = document.createElement('div');
        managecontent.classList.add('managecontent', 'update');
        managecontent.textContent = 'MANAGE UPDATE';

        if (!document.querySelector('.managecontent.update')) {
            // If the .managecontent.update not exist -> show the managecontetn update modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });            
            document.querySelector('.weightmodal').append(managecontent);
        };


    });

    // WEIGHT MANAGE: CREATE
    const create = document.createElement('div');
    create.classList.add('manage','create');
    create.textContent='create';

    create.addEventListener('click', () => {
        // Rozwiń pole poniżej do edycji
        // Dodaj formularz do edycji
        // Dodaj pole rozwijane z dostępnymi pomiarami
        const managecontent = document.createElement('div');
        managecontent.classList.add('managecontent', 'create');

        const formmodal = document.createElement('div');
        formmodal.classList.add('formmodal');

        const createform = document.createElement('form');
        createform.classList.add('form', 'create');
        createform.innerHTML = `
        <label>Weight:</label>
        <input type="number" id="weight" required>

        <label>Measurement date:</label>
        <input type="date" id="measurement_date" required>

        <label>Measurement time:</label>
        <input type="time" id="measurement_time" required>
        
        <input type="button" value="Add">
        <button type="submit">Submit</button>

        `
        console.log(now[0]);
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

        // TU SKOŃCZYŁEM - UTWORZYĆ KOD KTÓRY WYŚLE DANE METODĄ POST DO API I DODA NOWĄ WAGĘ
        // 
        // 
        // 
        // 



    });

    // WEIGHT MANAGE: delete
    const deletedata = document.createElement('div');
    deletedata.classList.add('manage', 'deletedata');
    deletedata.textContent='delete';

    deletedata.addEventListener('click', () => {
        // Rozwiń pole poniżej do edycji
        // Dodaj formularz do edycji
        // Dodaj pole rozwijane z dostępnymi pomiarami
        const managecontent = document.createElement('div');
        managecontent.classList.add('managecontent', 'deletedata');
        managecontent.textContent = 'MANAGE DELETE DATA';

        if (!document.querySelector('.managecontent.deletedata')) {
            // If the .managecontent.update not exist -> show the managecontetn update modal
            document.querySelectorAll('.managecontent').forEach((element) => {
                element.remove();
            });
            document.querySelector('.weightmodal').append(managecontent);
        };


    });

    // Append UPDATE CREATE DELETE
    manageModal.appendChild(update);
    manageModal.appendChild(create);
    manageModal.appendChild(deletedata);
    weightModal.firstChild.appendChild(manageModal);

    // CHART
    const chartModal = baseModal(row);
    chartModal.firstChild.classList.add('chartmodal');
    // chartModal.firstChild.textContent = "CHART MODAL"

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
            
            // CREATE CHART
            new Chart(
                chartModal.querySelector('#canvas'),
                {
                    type: 'bar',
                    data: {
                        labels: weightdata.map(row => row.measurement_date),
                        datasets: [
                            {
                                label: 'Weight by date',
                                data: weightdata.map(row => row.weight)
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
    
    const modalArray = [];
    
    const caloriesModal = baseModal(row);
    caloriesModal.firstChild.classList.add('managemodal', 'caloriesmodal')
    caloriesModal.firstChild.textContent = "CALORIES MODAL"

    // Chart
    const chartModal = baseModal(row);
    chartModal.firstChild.classList.add('chartmodal');
    chartModal.firstChild.textContent = "CHART MODAL"

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

            // CREATE CHART
            new Chart(
                chartModal.querySelector('#canvas'),
                {
                    type: 'bar',
                    data: {
                        labels: caloriesdata.map(row => row.measurement_date),
                        datasets: [
                            {
                                label: 'Burned calories by date',
                                data: caloriesdata.map(row => row.kcal)
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
    
    // Get weight data after pressing weight navbtn
    document.querySelector('.navbtn.calories').addEventListener('click', () => {
        getCalories();
    })

    modalArray.push(caloriesModal, chartModal);
    
    return modalArray
};

export function stepsFunction(row) {
    
    const modalArray = [];

    const stepsModal = baseModal(row);
    stepsModal.firstChild.classList.add('managemodal', 'stepsmodal')
    stepsModal.firstChild.textContent = "STEPS MODAL"

    // Chart
    const chartModal = baseModal(row);
    chartModal.firstChild.classList.add('chartmodal');
    chartModal.firstChild.textContent = "CHART MODAL"

    const canvas = document.createElement('canvas');
    canvas.classList.add('canvas');
    canvas.setAttribute('id', 'canvas'); // ID canvasa - tutaj zmiana

    chartModal.firstChild.appendChild(canvas);


    // GET CALORIES DATA
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
            const stepsdata = await response.json()

            // CREATE CHART
            new Chart(
                chartModal.querySelector('#canvas'),
                {
                    type: 'bar',
                    data: {
                        labels: stepsdata.map(row => row.measurement_date),
                        datasets: [
                            {
                                label: 'Steps by date',
                                data: stepsdata.map(row => row.steps)
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