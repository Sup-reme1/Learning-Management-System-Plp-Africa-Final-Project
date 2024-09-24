// import jwtDecode from "jwt-decode";
// const jwtDecode = require('jwt-decode');

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
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;

    try{
        const response = await fetch('http://localhost:5000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role } )
        });

        const data = await response.json();

        if(!response.ok) {
            throw new Error('Bad Response');   
        } else {
            alert('Login User');
        }

        document.getElementById('login-form').style.display = 'block';
        document.getElementById('registration-form').style.display = 'none';
        
    } catch (error) {
        console.error(error);
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
            throw new Error('Bad Response');   
        }

         // Get token and store in localStorage
        const token = data.token;

        localStorage.setItem('token', token);

        const user = getUserData(token);

        if (user.role === 'teacher'){
            window.location.href = '/teacher/dashboard';
        } else if (user.role === 'student'){
            window.location.href = '/student/dashboard';
        } else if (user.role === 'admin'){
            window.location.href = '/user/profile';
        } else {
            window.location.href = '/';
        }

        

    } catch (error) {
        console.error(error);
    }
})


//  // Decode the token to extract the user ID
//  const decodeToken = jwt_decode(token);
//  //console.log('Decoded token:', decodeToken);

//  // Save the user ID in localStorage
//  localStorage.setItem('user_id', decodeToken.id);
//  //console.log('user ID saved in localStorage:', decodeToken.id);
