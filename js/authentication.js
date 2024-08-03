// Handling Loging, Register, Logout
import { removeRows } from "./views";
import { authenticationFunction } from './tools';

export function loginFunction() {
    // Create login form and front login logic
    
    // LOGIN
    // Set Login Logic
    const loginBtn = document.querySelector('.navbtn.login');
    // LOGIN FORM

    loginBtn.addEventListener('click', () => {
        // If modalbox exist, don't create new modlabox
        if (!document.querySelector('.modalbox.login')) {

            const loginForm = document.createElement('div')
            loginForm.classList.add('modalbox', 'login')
            loginForm.innerHTML = `
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
            loginForm.querySelector('input[value="Login"]').addEventListener('click', ()=>{

                const apiLogin = async () => {
                    const body = {
                        'username': loginForm.querySelector('#username').value,
                        'password': loginForm.querySelector('#password').value
                    }
                    const response = await authenticationFunction('login', body)

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
                        const messageBox = document.createElement('div');
                        messageBox.classList.add('messagebox');

                            // Create message content
                        const errorMessage = document.createElement('div');
                        errorMessage.textContent = error.error;
                        errorMessage.classList.add('error', 'login');

                        messageBox.appendChild(errorMessage);
                        
                        // If error message NOT exist - show err message
                        if (!document.querySelector('.error.login')) {
                            document.querySelector('.login-form').appendChild(messageBox);
                        };
                    };
                };
                apiLogin();
            });

            // Close form logic
            loginForm.querySelector('.close').style.cursor='pointer'    
            loginForm.querySelector('.close').onclick = () => {
                loginForm.remove()
            };
        // Remove rows
        removeRows();
        // Add login form to container
        document.querySelector('.container').appendChild(loginForm);
        };
    });
};

export function registerFunction() {
    // Create register form and front register logic
    
    // REGISTER
    // Set Register Logic    
    const registernBtn = document.querySelector('.navbtn.register');
    const loginBtn = document.querySelector('.navbtn.login');

    // REGISTER FORM

    registernBtn.addEventListener('click', () => {
        // If modalbox exist, don't create new modlabox
        if (!document.querySelector('modalbox.register')) {

            const registerForm = document.createElement('div');
            registerForm.classList.add('modalbox', 'register');
            registerForm.innerHTML = `
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
            registerForm.querySelector('input[value="Register"]').addEventListener('click', () => {

                const apiRegister = async () => {
                    const body = {
                        'username': registerForm.querySelector('#username').value,
                        'email': registerForm.querySelector('#email').value,
                        'password': registerForm.querySelector('#password').value,
                    };
                    const response = await authenticationFunction('register', body);

                    // Response verification
                    if (response.ok) {
                        // Valid Registration
                        // Ask user to login
                        const message = await response.json();
                        
                        // Create message box
                        const messageBox = document.createElement('div');
                        messageBox.classList.add('messagebox');                        
                        
                        // Create message content
                        const contentMessage = document.createElement('div');
                        contentMessage.textContent = `${message.message}. Try to login`;
                        contentMessage.classList.add('message', 'content');

                        messageBox.appendChild(contentMessage);

                        if (document.querySelector('.messagebox')) {
                            document.querySelector('.messagebox').remove();
                        };

                        document.querySelector('.modalbox.register').appendChild(messageBox);

                    } else {

                        // Error
                        const error = await response.json();
                        console.log("Error: ", error);

                            // Create message box
                            // If messagebox don't exist create messagebox
                        
                        const messageBox = document.createElement('div');
                        messageBox.classList.add('messagebox');

                            // Create message content
                        const errorMessage = document.createElement('div');
                        errorMessage.textContent = 'Try again'
                        errorMessage.classList.add('message', 'content');

                        messageBox.appendChild(errorMessage);

                        if (document.querySelector('.messagebox')) {
                            document.querySelector('.messagebox').remove();
                        };
                        document.querySelector('.modalbox.register').appendChild(messageBox);
                    };
                };
            apiRegister();
            });
            
            // Close form logic
            registerForm.querySelector('.close').style.cursor='pointer'    
            registerForm.querySelector('.close').onclick = () => {
                // remove parent element -> registerform is contentbox child
                registerForm.parentElement.remove()
            };

            // remove all modals from app
            removeRows();
            // Add register form to contentbox
            // Add contentbox to container
            const contentBox = document.createElement('div');
            contentBox.classList.add('modalrow');
            contentBox.appendChild(registerForm)
            document.querySelector('.container').appendChild(contentBox);            
        };
    });
};

export function logoutFunction() {
    // Create logout form and front logout logic
    // get logout btn
    const loginBtn = document.querySelector('.navbtn.logout');
    
    // LOGOUT
    // Set Logout Logic      
    loginBtn.addEventListener('click', () => {
        const apiLogout = async () => {
            const token = sessionStorage.getItem('token')
            const body = {
                'token': token
            };
            const response = await authenticationFunction('logout', body);

            // Response verification
            if (response.ok) {
                // remove token from session
                const message = await response.json();
                sessionStorage.removeItem('token');

                    // Create message box
                const messageBox = document.createElement('div');
                messageBox.classList.add('messagebox');

                    // Create message content
                const contentMessage = document.createElement('div');
                contentMessage.textContent = message.message;
                contentMessage.classList.add('message', 'content');

                messageBox.appendChild(contentMessage);
                
                document.querySelector('.container').appendChild(messageBox);
                
                window.location.reload(true);

            } else {
                // Error
                const error = await response.json();

                    // Create message box
                const messageBox = document.createElement('div');
                messageBox.classList.add('messagebox');

                    // Create message content
                const errorMessage = document.createElement('div');
                errorMessage.textContent = error.error;
                errorMessage.classList.add('error', 'login');

                messageBox.appendChild(errorMessage);

                document.querySelector('.container').appendChild(messageBox);
            };
        };
    apiLogout();
    });
};
