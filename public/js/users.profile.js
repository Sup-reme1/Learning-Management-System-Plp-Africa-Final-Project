// GET getUserProfile
// POST updateUserProfile
// route '/api/users/profile'

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

// Fetching profile
async function fetchMaterials() {
    try {
        method = 'GET';
        const response = await fetch('http://localhost:5000/api/users/profile', options);

        if (!response.ok){
            throw new Error('Fail to fetch users');
        }

        const data = await response.json();

        const title = document.getElementById('user-title');
        const name = document.getElementById('name-id');
        const email = document.getElementById('email-id');
        const role = document.getElementById('role-id');

        // Populate the data
        title.innerHTML = data.role;
        name.innerHTML = data.name;
        role.innerHTML = data.role;

    } catch (error) {
        console.log('Error:', error.message);
    }
}

var sexType;
function gender(x) {
    if (x === 'm'){
        sexType = 'male';
    } else if (x === 'f'){
        sexType = 'female';
    }
}

// Updating Profile
const update = document.getElementById('update-profile');
update.addEventListener('submit', async(e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;    
    const address = document.getElementById('address').value || 'null';    
    const contact = document.getElementById('contact').value || 'null';    
    const gender = sexType || 'null';    
    const age = document.getElementById('age').value || 'null';    

    try {
        
        method = 'POST';
        body = { name, role, address, contact, gender, age }
        console.log(body);
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

fetchMaterials();