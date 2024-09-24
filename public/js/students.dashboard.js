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

async function fetchAssignments() {
    try {
        method = 'GET';
        const response = await fetch('http://localhost:5000/api/assignment/', options);

        if (!response.ok){
            throw new Error('Fail to fetch assignment');
        }

        const data = await response.json();

        const ul = document.getElementById('assignments-list');
        ul.innerHTML = '';

        
        data.forEach(assignment => {
            var date = new Date(assignment.due_date);
            const li = document.createElement('li');
            li.innerHTML = `<div>
                                <a href="/api/materials/${assignment.id}/download">${assignment.title} -  
                                ${assignment.description}</a><br>
                                Due: ${date.toDateString()}<br>
                                <button class="submit-btn" data-id="${assignment.id}">Submit Assignment</button>
                            </div>`;
            ul.appendChild(li);
        });

    } catch (error) {
        console.log('Error:', error.message);
    }
}

////// Using Event DELEGATION to grap data-id and prefil in submitform
const assignmentContainer = document.getElementById('assignments-list');
assignmentContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('submit-btn')){
        const idValue = event.target.getAttribute('data-id');

        const idPreFil = document.getElementById('id').value = idValue;
        window.location.href = '#submit-assignment';
        document.getElementById('submit-assignment').style.display = 'block';
    }
});

async function fetchMaterials() {
    try {
        method = 'GET';
        const response = await fetch('http://localhost:5000/api/materials/', options);

        if (!response.ok){
            throw new Error('Fail to fetch materials');
        }

        const data = await response.json();

        const ul = document.getElementById('materials-list');
        ul.innerHTML = '';

        data.forEach(material => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="/api/materials/${material.id}/download">${material.title}</a> -  ${material.description}`;
            ul.appendChild(li);
        });

    } catch (error) {
        console.log('Error:', error.message);
    }
}

// Handle assignment submission with file
const submission = document.getElementById('submit-assignment-form');
submission.addEventListener('submit', async(e) => {
    e.preventDefault();

    
    const formData = new FormData();
    const id = document.getElementById('id').value;
    formData.append('file', document.getElementById('filepath').files[0]);

    
    // const description = document.getElementById('description').value;
    // const file = document.getElementById('filepath').files[0];
    // const formData = [ title, description, file ]

    console.log(id);
    try {
        method = 'POST';

        const response = await fetch(`http://localhost:5000/api/assignment/${id}/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok){
            throw new Error('Fail to Submit Assignment');
        }

        alert('Assignment submitted successfully');
        // const data = await response.json();

    } catch (error) {
        console.log('Error:', error.message);
    }
});

fetchMaterials();
fetchAssignments();