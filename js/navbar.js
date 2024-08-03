// Create navbar

import { navBoxTemplate } from "./htmlTemplates";

export function navbar () {
    const navBox = document.createElement('div');
    navBox.innerHTML = navBoxTemplate;

    navBox.classList.add('navbox')


    // If tokken exist
    if (sessionStorage.getItem('token') !== null) {
        const weightBtn = document.createElement('div');
        weightBtn.classList.add('navbtn', 'weight');
        weightBtn.textContent = 'Weight';

        const trainingBtn = document.createElement('div');
        trainingBtn.classList.add('navbtn', 'training');
        trainingBtn.textContent = 'Training';

        const stapsBtn = document.createElement('div');
        stapsBtn.classList.add('navbtn', 'steps');
        stapsBtn.textContent = 'Steps';

        const caloriseBtn = document.createElement('div');
        caloriseBtn.classList.add('navbtn', 'calories');
        caloriseBtn.textContent = 'Calories';

        const caloriesConsumedBtn = document.createElement('div');
        caloriesConsumedBtn.classList.add('navbtn', 'caloriesconsumed');
        caloriesConsumedBtn.textContent = 'Calories Consumed';

        const logoutBtn = document.createElement('div');
        logoutBtn.classList.add('navbtn', 'logout');
        logoutBtn.textContent = 'Logout';

        navBox.querySelector('nav').appendChild(weightBtn);
        navBox.querySelector('nav').appendChild(trainingBtn);
        navBox.querySelector('nav').appendChild(stapsBtn);
        navBox.querySelector('nav').appendChild(caloriseBtn);
        navBox.querySelector('nav').appendChild(caloriesConsumedBtn);
        navBox.querySelector('nav').appendChild(logoutBtn);

        return navBox

    } else {
        const loginBtn = document.createElement('div');
        loginBtn.classList.add('navbtn', 'login');
        loginBtn.textContent = 'Login';

        const registerBtn = document.createElement('div');
        registerBtn.classList.add('navbtn', 'register');
        registerBtn.textContent = 'Register';

        navBox.querySelector('nav').appendChild(loginBtn);
        navBox.querySelector('nav').appendChild(registerBtn);
        return navBox
    };
};