// Handling Loging, Register, Logout

import { baseModal } from "./views";
import { removeRows } from "./views";

export function loginFunction() {
    // Create login form and front login logic
    
    // LOGIN
    // Set Login Logic
    const loginbtn = document.querySelector('.navbtn.login');
    // LOGIN FORM

    loginbtn.addEventListener('click', () => {
        // If modalbox exist, don't create new modlabox
        if (!document.querySelector('.modalbox.login')) {

            const loginform = document.createElement('div')
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
                        document.querySelector('form').remove()

                        const message = document.createElement('div');
                        message.style.display = 'flex';
                        message.style.justifyContent = 'center'
                        message.textContent = 'You are logged in!!!';
                        
                        document.querySelector('.modalbox.login').appendChild(message);
                        
                        window.location.reload(true);

                    } else {
                        // Wrong credentials
                        // Show message - Wrong credentials
                        const error = await response.json();

                            // Create message box
                        const messagebox = document.createElement('div');
                        messagebox.classList.add('messagebox');

                            // Create message content
                        const errormessage = document.createElement('div');
                        errormessage.textContent = error.error;
                        errormessage.classList.add('error', 'login');


                        messagebox.appendChild(errormessage);
                        

                        // If error message NOT exist - show err message
                        if (!document.querySelector('.error.login')) {
                            // document.querySelector('.modalbox.login').appendChild(messagediv);
                            document.querySelector('.login-form').appendChild(messagebox);
                        };
                    };
            };

        apilogin();   

        });


            // Close form logic
        loginform.querySelector('.close').style.cursor='pointer'    
        loginform.querySelector('.close').onclick = () => {
            loginform.remove()
        };

        // Remove rows
        removeRows();

        // Add login form to container
        document.querySelector('.container').appendChild(loginform);
        };

    });
};

export function registerFunction() {
    // Create register form and front register logic
    
    // REGISTER
    // Set Register Logic    
    const registernbtn = document.querySelector('.navbtn.register');
    const loginbtn = document.querySelector('.navbtn.login');

    // REGISTER FORM

    registernbtn.addEventListener('click', () => {
        // If modalbox exist, don't create new modlabox
        if (!document.querySelector('modalbox.register')) {

            const registerform = document.createElement('div');
            registerform.classList.add('modalbox', 'register');
            registerform.innerHTML = `
            <span class="close">&times;</span>
            <form class="register-form" method="post">

                <label>Username:</label>
                <input type="text" id="username" required>

                <label>Email address:</label>
                <input type="text" id="email" required>

                <label>Password:</label>
                <input type="password" id="password" name="password" required>
                
                <input type="button" value="Register">

            </form>
            
            `
                //  Send form

            registerform.querySelector('input[value="Register"]').addEventListener('click', () => {

                const apiregister = async () => {
                    const response = await fetch('http://127.0.0.1:8000/register/', {
                        mode: 'cors',
                        credentials: 'same-origin',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            'username': registerform.querySelector('#username').value,
                            'email': registerform.querySelector('#email').value,
                            'password': registerform.querySelector('#password').value,
                        })
                    })

                    // Response verification
                    if (response.ok) {
                        // Valid Registration
                        // Ask user to login
                        const message = await response.json();
                        
                        // Create message box
                        const messagebox = document.createElement('div');
                        messagebox.classList.add('messagebox');                        
                        
                        // Create message content
                        const contentmessage = document.createElement('div');
                        contentmessage.textContent = `${message.message}. Try to login`;
                        contentmessage.classList.add('message', 'content');

                        messagebox.appendChild(contentmessage);

                        if (document.querySelector('.messagebox')) {
                            document.querySelector('.messagebox').remove();
                        };

                        document.querySelector('.modalbox.register').appendChild(messagebox);
                        

                    } else {

                        // Error
                        const error = await response.json();
                        console.log("Error: ", error);

                            // Create message box
                            // If messagebox don't exist create messagebox
                        
                        const messagebox = document.createElement('div');
                        messagebox.classList.add('messagebox');

                            // Create message content
                        const errormessage = document.createElement('div');
                        errormessage.textContent = 'Try again'
                        errormessage.classList.add('message', 'content');

                        messagebox.appendChild(errormessage);

                        if (document.querySelector('.messagebox')) {
                            document.querySelector('.messagebox').remove();
                        };
                        
                        document.querySelector('.modalbox.register').appendChild(messagebox);
                    
                                     
                    };
                };

            apiregister();

            });
            
            // Close form logic
            registerform.querySelector('.close').style.cursor='pointer'    
            registerform.querySelector('.close').onclick = () => {
                // remove parent element -> registerform is contentbox child
                registerform.parentElement.remove()
            }
    

            // remove all modals from app
            removeRows();
            // Add register form to contentbox
            // Add contentbox to container
            const contentbox = document.createElement('div');
            contentbox.classList.add('modalrow');
            contentbox.appendChild(registerform)
            document.querySelector('.container').appendChild(contentbox);            
        };
    });
    
};

export function logoutFunction() {
    // Create logout form and front logout logic
    // get logout btn
    const loginbtn = document.querySelector('.navbtn.logout');
    
    // LOGOUT
    // Set Logout Logic      
    loginbtn.addEventListener('click', () => {
        const apilogout = async () => {
            const token = sessionStorage.getItem('token')
            const response = await fetch('http://127.0.0.1:8000/logout/', {
                mode: 'cors',
                credentials: 'same-origin',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    'token': sessionStorage.getItem('token')
                })
            })

            // Response verification
            if (response.ok) {
                // remove token from session
                const message = await response.json();
                sessionStorage.removeItem('token');

                    // Create message box
                const messagebox = document.createElement('div');
                messagebox.classList.add('messagebox');

                    // Create message content
                const contentmessage = document.createElement('div');
                contentmessage.textContent = message.message;
                contentmessage.classList.add('message', 'content');

                messagebox.appendChild(contentmessage);
                
                document.querySelector('.container').appendChild(messagebox);
                
                window.location.reload(true);

            } else {
                // Error
                const error = await response.json();

                    // Create message box
                const messagebox = document.createElement('div');
                messagebox.classList.add('messagebox');

                    // Create message content
                const errormessage = document.createElement('div');
                errormessage.textContent = error.error;
                errormessage.classList.add('error', 'login');

                messagebox.appendChild(errormessage);

                document.querySelector('.container').appendChild(messagebox);

            }
        }

    apilogout();

    });


};
