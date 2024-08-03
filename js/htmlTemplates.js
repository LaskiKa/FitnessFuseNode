export const loginFormTemplate = `
            <span class="close">&times;</span>
            <form class="login-form" method="post">

                <label>Username:</label>
                <input type="text" id="username" required>

                <label>Password:</label>
                <input type="password" id="password" name="password" required>
                
                <input type="button" value="Login">

            </form>
            `

export const registerFormTemplate = `
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