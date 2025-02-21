const form = document.getElementById("form");
const username_input = document.getElementById("username-input");
const email_input = document.getElementById("email-input");
const password_input = document.getElementById("password-input");
const repeat_password_input = document.getElementById("repeat-password-input");
const error_message = document.getElementById('error-message')

const registerUser = async (userData) => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST', headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if(!response.ok) {
            throw new Error('Registration failed');
        }

        const result = await response.json();
        console.log('Registration successful:', result);
        return result;
    } catch (error) {
        console.error('Registration failed:', error);
        throw error;
    }
};

// const userData = {
//     username: 'testuser',
//     email: 'test@example.com',
//     password: 'password123',
// };

// registerUser(userData)
//     .then((result) => {
//         console.log('Token:', result.token);
//     })
//     .catch((error) => {
//         console.error('Error:', error.message);
//     });

    const loginUser = async (userData) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set the Content-Type header
                },
                body: JSON.stringify(userData), // Convert the data to JSON
            });
    
            if (!response.ok) {
                throw new Error('Login failed');
            }
    
            const result = await response.json();
            console.log('Login successful:', result);
            return result;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };
    
    // Example usage
    // const loginData = {
    //     email: 'test@example.com',
    //     password: 'password123',
    // };
    
    // loginUser(loginData)
    //     .then((result) => {
    //         if(result.token && result.userId) {
    //             localStorage.setItem('token', result.token);
    //             // decode the token to extract the user ID
    //             const decoded = jwt_decode(result.token);
    //             localStorage.setItem('userId', decoded.id);
    //             window.location.href = 'menu.html'; // Redirect to menu page
    //         }
    //     })
    //     .catch((error) => {
    //         console.error('Error:', error.message);
    //     });

const createFlashcard = async () => {
    const flashcardData = {
        front: 'What is JavaScript?', back: 'a language for web dev.', userId: 'some-user-id',
    }

    const response = await fetch('http://localhost:5000/api/flashcards', {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(flashcardData)
    })

    const result = await response.json()
    console.log('Flashcard created: ', result)
}

form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Uncomment this to prevent form submission
    console.log('Submit event intercepted')
    let errors = [];

    const isRegisterForm = repeat_password_input !== null;

    if(isRegisterForm){
        errors = getSignupFormErrors(username_input.value, email_input.value, password_input.value, repeat_password_input.value);
        
        if(errors.length === 0){
            const userData = { username: username_input.value, email: email_input.value, password: password_input.value };
            const result = await registerUser(userData);
            if(result.token) {
                localStorage.setItem('token', result.token);
                window.location.href = 'menu.html'; // Send user to menu
            } else {
                error_message.innerText = result.message || 'Registration failed';
            }
        }
    } else {
        errors = getLoginFormErrors(email_input.value, password_input.value);
        if(errors.length === 0){
            const userData = { email: email_input.value, password: password_input.value };
            const result = await loginUser(userData);
            if(result.token && result.userId) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('userId', result.userId);
                window.location.href = 'menu.html'; 
            } else {
                error_message.innerText = result.message || 'Login failed';
            }
        }
    }
    
    if (errors.length > 0) {
        e.preventDefault();
        error_message.innerText = errors.join(". ");
    }
})

function getSignupFormErrors(username, email, password, repeatPassword){
    let errors = []

    if(username === '' || username == null){
        errors.push('Username is required')
        username_input.classList.add('incorrect')
    }

    if(email === '' || email == null){
        errors.push('Email is required')
        email_input.classList.add('incorrect')
    }

    if(password === '' || password == null){
        errors.push('Password is required')
        password_input.classList.add('incorrect')
    }
    if(password.length < 8){
        errors.push('Password must have at least 8 characters')
        password_input.classList.add('incorrect')
    }
    if(password != repeatPassword){
        errors.push('Password does not match repeated password')
        password_input.classList.add('incorrect')
        repeat_password_input.classList.add('incorrect')
    }

    return errors;
}

function getLoginFormErrors(email, password){
    let errors = [];
    if(email === '' || email == null){
        errors.push('Email is required')
        email_input.classList.add('incorrect')
    }

    if(password === '' || password == null){
        errors.push('Password is required')
        password_input.classList.add('incorrect')
    }
    return errors;
}

const allInputs = [username_input, email_input, password_input, repeat_password_input].filter(input => input != null)

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(input.classList.contains('incorrect')){
            input.classList.remove('incorrect')
            error_message.innerText = ''
        }
    })
})


