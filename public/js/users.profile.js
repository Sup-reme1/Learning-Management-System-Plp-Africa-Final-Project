var user = JSON.parse(localStorage.getItem('user')) || [];
const token = localStorage.getItem('token');
var { method, body } = '';
const options = {
    method: method,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: body ? JSON.stringify(body) : null
};
var first_name = document.getElementById('fname').value = user.first_name;
var last_name = document.getElementById('lname').value = user.last_name;
var role = document.getElementById('role').value = user.role;  

var sexType;
function gender(x) {
    if (x === 'm'){
        sexType = 'male';
    } else if (x === 'f'){
        sexType = 'female';
    }
}

// Fetching profile
async function fetchUser() {
    try {
        method = 'GET';
        const response = await fetch('http://localhost:5000/api/users/profile', options);

        if (!response.ok){
            throw new Error('Fail to fetch users');
        }

        const data = await response.json();

        localStorage.setItem('user', JSON.stringify(data));

        const title = document.getElementById('user-title');
        const name = document.getElementById('name-id');
        const email = document.getElementById('email-id');
        const role = document.getElementById('role-id');

        // Populate the data
        title.innerHTML = data.role;
        name.innerHTML = data.first_name;
        role.innerHTML = data.role;

    } catch (error) {
        console.log('Error:', error.message);
    }
}

// Updating Profile
const update = document.getElementById('update-profile');
update.addEventListener('submit', async(e) => {
    e.preventDefault();

    const first_name = document.getElementById('fname').value || user.first_name;
    const last_name = document.getElementById('lname').value || user.last_name;
    const role = document.getElementById('role').value || user.role;    
    const address = document.getElementById('address').value || user.address;    
    const contact = document.getElementById('contact').value || user.contact;    
    const profileImg = document.getElementById('picture').value || user.contact;    
    const gender = sexType || user.gender;    
    var age = document.getElementById('age').value;    

    if (age === ''){
        if (user.age === null) age = 0;
        if (user.age !== null) age = user.age;
    }

    try {
        
        method = 'POST';
        body = { first_name, last_name, role, address, profileImg, contact, gender, age };
        const response = await fetch(`http://localhost:5000/api/users/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok){
            throw new Error('Fail to Update user');
        }

        alert('User updated successfully');
        window.location.reload();

    } catch (error) {
        console.log('Error:', error.message);
    }
});

fetchUser();