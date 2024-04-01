import './style.css';
import { navbar } from './navbar';

document.addEventListener('DOMContentLoaded', function () {
    // CONTAINER:
    const container = document.querySelector('.container')
    container.style.display='flex'

        // NAVBAR

    const navbox = navbar()

    container.append(navbox);

        // LOGIN:
        // Set Login Logic

    const loginbtn = this.querySelector('.navbtn.login');

        // LOGIN FORM
    loginbtn.addEventListener('click', () => {
        // If modalbox exist, don't create new modlabox
        if (!this.querySelector('.modalbox.login')) {

            const loginform = this.createElement('div')
            loginform.classList.add('modalbox', 'login')
            loginform.innerHTML = `
            <span class="close">&times;</span>
            <form class="login-form" method="post">

                <label>Username:</label>
                <input type="text" id="username" required>

                <label>Password:</label>
                <input type="password" id="password" name="password" required>
                
                <input type="button" value="Login">

            </form>
            `
                //  Send form
            loginform.querySelector('input[value="Login"]').addEventListener('click', ()=>{

                const apilogin = async () => {
                    const response = await fetch('http://127.0.0.1:8000/login/', {
                        mode: 'cors',
                        credentials: 'same-origin',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            'username': loginform.querySelector('#username').value,
                            'password': loginform.querySelector('#password').value
                        })
                    })

                    // Response verification
                    if (response.ok) {
                        // Correct credentials
                        // Add token to session
                        const token = await response.json();
                        sessionStorage.setItem('token', token.token);
                        this.querySelector('.modalbox.login').remove

                        


                    } else {
                        // Wrong credentials
                        // Show message - Wrong credentials
                        const error = await response.json()
                        const messagediv = document.createElement('div')
                        messagediv.textContent = error.error
                        messagediv.classList.add('error', 'login')

                        if (!this.querySelector('.error.login')) {
                            this.querySelector('.modalbox.login').appendChild(messagediv);
                        };
                    };
            };
        apilogin();
        

        });


            // Close form
        loginform.querySelector('.close').style.cursor='pointer'    
        loginform.querySelector('.close').onclick = () => {
            loginform.remove()
        }

        container.appendChild(loginform)
        };

    })

    // DASHBOARD LOGED IN 
    if (sessionStorage.getItem('token')) {

    }

    // container.append(loginbtn)
})

const getCalories = async () => {
    const token = sessionStorage.getItem('token')
    const response = await fetch('http://127.0.0.1:8000/caloriesburned/', {
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    })
};
getCalories();

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

const getWeight = async () => {
    const token = sessionStorage.getItem('token')
    console.log(token);
    const response = await fetch('http://127.0.0.1:8000/weight/', {
        mode: 'cors',
        credentials: "same-origin",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    })
};
getWeight();
