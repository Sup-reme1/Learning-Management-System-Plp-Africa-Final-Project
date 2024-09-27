// import jwtDecode from "jwt-decode";
// const jwtDecode = require('jwt-decode');

const msg = document.getElementById('msg');

// Decoding of jwtToken
function getUserData(token) {
    const decodeToken = jwt_decode(token);
    return decodeToken;
}

const login = document.getElementById('login-form');
const register = document.getElementById('registration-form');

const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.style.display = 'none';
});

register.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const first_name = document.getElementById('fname').value;
    const last_name = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;

    try{
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ first_name, last_name, email, password, role })
        });

        const data = await response.json();

        if(!response.ok) {
            msg.innerText = 'User Exist';
            throw new Error('Bad Response');   
        } else {
            alert('Login User');
        }

        document.getElementById('login-form').style.display = 'block';
        document.getElementById('registration-form').style.display = 'none';
        msg.remove();

    } catch (error) {
        console.error(error.message);
    }
})

login.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email2').value;
    const password = document.getElementById('password2').value;

    try{
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if(!response.ok) {
            msg.innerText = 'Incorrect email or password';
            throw new Error('Bad Response');   
        }

         // Get token and store in localStorage
        const token = data.token;

        localStorage.setItem('token', token);

        const user = getUserData(token);

        window.location.href = '/user/profile';

    } catch (error) {
        console.error(error);
    }
})

