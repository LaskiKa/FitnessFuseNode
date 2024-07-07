// Create navbar

export function navbar () {
    const navbox = document.createElement('div');
    navbox.innerHTML = `
    <nav>
        <div class="navbtn home">Home</div>
        <div class="navbtn about">About</div>
        <div class="navbtn contact">Contact</div>
    </nav>
    `;

    navbox.classList.add('navbox')


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


        navbox.querySelector('nav').appendChild(weightBtn);
        navbox.querySelector('nav').appendChild(trainingBtn);
        navbox.querySelector('nav').appendChild(stapsBtn);
        navbox.querySelector('nav').appendChild(caloriseBtn);
        navbox.querySelector('nav').appendChild(caloriesConsumedBtn);
        navbox.querySelector('nav').appendChild(logoutBtn);


        return navbox

    } else {
        const loginBtn = document.createElement('div');
        loginBtn.classList.add('navbtn', 'login');
        loginBtn.textContent = 'Login';

        const registerBtn = document.createElement('div');
        registerBtn.classList.add('navbtn', 'register');
        registerBtn.textContent = 'Register';

        navbox.querySelector('nav').appendChild(loginBtn);
        navbox.querySelector('nav').appendChild(registerBtn);
        return navbox
    };
};