// Views: Home, About, Contact, Weight, Steps, Caloreis, BASE MODAL

export function baseModal(row) {

    const modalbase = document.createElement('div');
    modalbase.classList.add('basemodal');
    modalbase.textContent = "Base modal"
    
    
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
    
    const weightModal = baseModal(row);
    weightModal.firstChild.classList.add('weightmodal')
    weightModal.firstChild.textContent = "WEIGHT MODAL"

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
            console.log('weight data: ', weightdata);
            
        } else {
            // Error
            const error = await response.json();
            console.log('Error: ', error);
        }
    };
    
    // Get weight data after pressing weight navbtn
    document.querySelector('.navbtn.weight').addEventListener('click', () => {
        getWeight();
    })
    
    return weightModal
};

export function caloriesFunction(row) {
    
    const caloriesModal = baseModal(row);
    caloriesModal.firstChild.classList.add('caloriesmodal')
    caloriesModal.firstChild.textContent = "CALORIES MODAL"

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
            console.log('calories data: ', caloriesdata);
            
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
    
    return caloriesModal
};

export function stepsFunction(row) {
    
    const stepsModal = baseModal(row);
    stepsModal.firstChild.classList.add('stepsmodal')
    stepsModal.firstChild.textContent = "STEPS MODAL"

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
            console.log('steps data: ', stepsdata);
            
        } else {
            // Error
            const error = await response.json();
            console.log('Error: ', error);
        }
    };
    
    // Get weight data after pressing weight navbtn
    document.querySelector('.navbtn.steps').addEventListener('click', () => {
        getSteps();
    })
    
    return stepsModal
};