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

export const caloriesConsumedUpdateFormTemplate = `
        <label>Select data: </label>
        <select id='selectdata'>
        </select>

        <label>Calories Consumed:</label>
        <input type="number" id="kcal" name="kcal" required>

        <label>Meal:</label>
        <input type="text" id="meal" name="meal" required>

        <label>Protein:</label>
        <input type="number" id="protein" name="protein" step="0.01" required>

        <label>Carbs</label>
        <input type="number" id="carbs" name="carbs" step="0.01" required>

        <label>Fat:</label>
        <input type="number" id="fat" name="fat" step="0.01" required>

        <label>Measurement date:</label>
        <input type="date" id="measurement_date" name="measurement_date" required>

        <label>Measurement time:</label>
        <input type="time" step=1 id="measurement_time" name="measurement_time" required>
        
        <button type="submit" id="submit">Update</button>
`

export const caloriesConsumedCreateFormTemplate = `
        <label>Calories Consumed:</label>
        <input type="number" id="kcal" name="kcal" required>

        <label>Meal:</label>
        <input type="text" id="meal" name="meal" required>

        <label>Protein:</label>
        <input type="number" id="protein" name="protein" step="0.01" required>

        <label>Carbs:</label>
        <input type="number" id="carbs" name="carbs" step="0.01" required>

        <label>Fat:</label>
        <input type="number" id="fat" name="fat" step="0.01" required>

        <label>Measurement date:</label>
        <input type="date" id="measurement_date" name="measurement_date" required>

        <label>Measurement time:</label>
        <input type="time" step=1 id="measurement_time" name="measurement_time" required>
        
        <button type="submit" id="submit">Submit</button>
`

export const caloriesConsumedDeleteFormTemplate = `
        <label>Select data: </label>
        <select id='selectdata'>
        </select>

        <button type="submit" id="delete">Delete</button>
`
export const caloriesUpdateFormTemplate = `
        <label>Select data: </label>
        <select id='selectdata'>
        </select>

        <label>Calories:</label>
        <input type="number" id="kcal" name="kcal" required>

        <label>Measurement date:</label>
        <input type="date" id="measurement_date" name="measurement_date" required>

        <label>Measurement time:</label>
        <input type="time" step=1 id="measurement_time" name="measurement_time" required>
        
        <button type="submit" id="submit">Update</button>
`

export const caloriesCreateFormTemplate = `
        <label>Calories:</label>
        <input type="number" id="kcal" name="kcal" required>

        <label>Measurement date:</label>
        <input type="date" id="measurement_date" name="measurement_date" required>

        <label>Measurement time:</label>
        <input type="time" step=1 id="measurement_time" name="measurement_time" required>
        
        <button type="submit" id="submit">Submit</button>
`
export const caloriesDeleteFormTemplate = `
        <label>Select data: </label>
        <select id='selectdata'>
        </select>

        <button type="submit" id="delete">Delete</button>
`