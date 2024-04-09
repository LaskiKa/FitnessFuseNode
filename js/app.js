import './style.css';
import { navbar } from './navbar';
import { loginFunction, logoutFunction, registerFunction } from './authentication';
import { aboutFunction, caloriesFunction, contactFunction, homeFunction, stepsFunction, weightFunction } from './views';

document.addEventListener('DOMContentLoaded', function () {
    // CONTAINER:
    const container = document.querySelector('.container')
    container.style.display='flex'



        // NAVBAR

    const navbox = navbar()
    container.append(navbox);
    
        // HOME

    const home = homeFunction(true);
    container.append(home);

            // Home navbar logic
    const homenavbtn = this.querySelector('.navbtn.home');
    homenavbtn.addEventListener('click', () => {

        if (!this.querySelector('.basemodal.homemodal')) {
        // If the home modal not exist -> show the home modal
            this.querySelector('.basemodal').parentElement.remove();
            container.append(home);
        } else {
            container.append(home);
        };
    });

        // ABOUT
    
    const about = aboutFunction(true);
    this.querySelector('.navbtn.about').addEventListener('click', () => {
        // If the about modal not exist -> show the about modal
        if (!this.querySelector('.basemodal.aboutmodal')) {
            this.querySelector('.basemodal').parentElement.remove();
            container.append(about);
        };
    });

        // CONTACT

    const contact = contactFunction(true);
    this.querySelector('.navbtn.contact').addEventListener('click', () => {
        // If the contact modal not exist -> show the contact modal
        if (!this.querySelector('.basemodal.contactmodal')) {
            this.querySelector('.basemodal').parentElement.remove();
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
        // If the contact modal not exist -> show the contact modal
        if (!this.querySelector('.basemodal.weightmodal')) {
            this.querySelector('.basemodal').parentElement.remove();
            container.append(weight);
            // container.append(contact);
        };
    }); 

    // CALORIES

    const calories = caloriesFunction(true);
    this.querySelector('.navbtn.calories').addEventListener('click', () => {
        // If the contact modal not exist -> show the contact modal
        if (!this.querySelector('.basemodal.caloriesmodal')) {
            this.querySelector('.basemodal').parentElement.remove();
            container.append(calories);
        };
    }); 

    // STEPS

    const steps = stepsFunction(true);
    this.querySelector('.navbtn.steps').addEventListener('click', () => {
        // If the steps modal not exist -> show the steps modal
        if (!this.querySelector('.basemodal.stepsmodal')) {
            this.querySelector('.basemodal').parentElement.remove();
            container.append(steps);
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

