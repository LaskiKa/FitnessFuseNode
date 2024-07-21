import './style.css';
import { navbar } from './navbar';
import { loginFunction, logoutFunction, registerFunction } from './authentication';
import { aboutFunction, caloriesFunction, contactFunction, 
        homeFunction, removeRows, 
        weightFunction } from './views';
import { caloriesConsumedFunction } from './caloriesconsumed';
import { stepsFunction } from './stepsFunction';
import { trainingFunction } from './trainingFunction';

document.addEventListener('DOMContentLoaded', function () {
    // CONTAINER:
    const container = document.querySelector('.container')
    container.style.display='flex'

        // NAVBAR

    const navbox = navbar()
    container.append(navbox);
    
        // HOME

    const home = homeFunction(true);
    
    home.forEach(element => {
        container.append(element);
    });

            // Home navbar logic
    const homenavbtn = this.querySelector('.navbtn.home');
    homenavbtn.addEventListener('click', () => {

        if (!this.querySelector('.basemodal.homemodal')) {
        // If the home modal not exist -> show the home modal
            this.querySelectorAll('.basemodal').forEach((element) => {
                element.parentElement.remove();
            });
            home.forEach(element => {
                container.append(element);
            })
        } else {
            home.forEach(element => {
                container.append(element)
            });
        };
    });

        // ABOUT
    
    const about = aboutFunction(true);
    this.querySelector('.navbtn.about').addEventListener('click', () => {
        // If the about modal not exist -> show the about modal
        if (!this.querySelector('.basemodal.aboutmodal')) {
            this.querySelectorAll('.basemodal').forEach((element) => {
                element.parentElement.remove();
            });
            container.append(about);
        };
    });

        // CONTACT

    const contact = contactFunction(true);
    this.querySelector('.navbtn.contact').addEventListener('click', () => {
        // If the contact modal not exist -> show the contact modal
        if (!this.querySelector('.basemodal.contactmodal')) {
            this.querySelectorAll('.basemodal').forEach((element) => {
                element.parentElement.remove();
            });
            container.append(contact);
        };
    });   





    
    // ANONYMOUS
if (!sessionStorage.getItem('token')) {
    registerFunction();
    loginFunction();
};

    // AUTHENTICATED
if (sessionStorage.getItem('token')) {
    logoutFunction();

    //WEIGHT

    const weight = weightFunction(true);
    this.querySelector('.navbtn.weight').addEventListener('click', () => {
        // If the weight modal not exist -> show the contact modal
        if (!this.querySelector('.basemodal.weightmodal')) {
            this.querySelectorAll('.basemodal').forEach((element) => {
                element.parentElement.remove();
            });

            // Append container with weight elements
            weight.forEach((element) => {
                container.append(element);
            });
        };
    }); 

    // CALORIES CONSUMED

    const caloriesConsumed = caloriesConsumedFunction(true);
    this.querySelector('.navbtn.caloriesconsumed').addEventListener('click', () => {
        // If the contact modal not exist -> show the contact modal
        if (!this.querySelector('.basemodal.caloriesconsumedmodal')) {
            this.querySelectorAll('.basemodal').forEach((element) => {
                element.parentElement.remove();
            });
            // Append container with calories elements
            caloriesConsumed.forEach((element) => {
                container.append(element);
            });
        };
    }); 

    // CALORIES

    const calories = caloriesFunction(true);
    this.querySelector('.navbtn.calories').addEventListener('click', () => {
        // If the contact modal not exist -> show the contact modal
        if (!this.querySelector('.basemodal.caloriesmodal')) {
            this.querySelectorAll('.basemodal').forEach((element) => {
                element.parentElement.remove();
            });
            // Append container with calories elements
            calories.forEach((element) => {
                container.append(element);
            });
        };
    }); 

    // STEPS

    const steps = stepsFunction(true);

    this.querySelector('.navbtn.steps').addEventListener('click', () => {
        // If the steps modal not exist -> show the steps modal
        if (!this.querySelector('.basemodal.stepsmodal')) {
            this.querySelectorAll('.basemodal').forEach((element) => {
                element.parentElement.remove();
            });

            // Append container with steps elements
            steps.forEach((element) => {
                container.append(element);
            });
        };
    });   
    
    // TRAINING

    const training = trainingFunction(true);

    this.querySelector('.navbtn.training').addEventListener('click', () => {
        // If the training modal not exist -> show the training modal
        if(!this.querySelector('.basemodal.trainingmodal')) {
            this.querySelectorAll('.basemodal').forEach((element) => {
                element.parentElement.remove();
            });

            // Append container with training elements
            training.forEach((element) => {
                container.append(element);
            });
        };
    });

};
    // DASHBOARD LOGED IN 
    if (sessionStorage.getItem('token')) {

    }

    // container.append(loginbtn)
})





const getApi = async () => {
    const response = await fetch('http://127.0.0.1:8000/', {
        mode: 'cors',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
        }
    })
};
getApi();

