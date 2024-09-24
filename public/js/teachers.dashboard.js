const token = localStorage.getItem('token');

// var ans = prompt('Should i laod this page?', '(yes or no)');
// console.log(ans);

// {/* <label for="questions">Question</label>
// <input type="text" id="questions" name="questions" required>
// <button id="appendQuestion">Next Question</button>
// <button type="submit">Submit</button> */}

var questions = [];
function collectQuestions(){
    document.querySelector('#quiz-title').style.display = 'none';
    document.querySelector('.questionDisplay').style.display = 'block';

    document.querySelector('form #appendQuestion').addEventListener('click', e => {
        e.preventDefault();

        var questionInput = document.getElementById('questions');
        var question = questionInput.value;

        questions.push(question);

        questionInput.value = '';
        console.log(questions);
    })
}
// Handle upload material with file
const material = document.getElementById('upload-material-form');
material.addEventListener('submit', async(e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('file', document.getElementById('filepath').files[0]);

    // const title = document.getElementById('title').value;
    // const description = document.getElementById('description').value;
    // const file = document.getElementById('filepath').files[0];
    // const formData = [ title, description, file ]

    try {
        method = 'POST';

        const response = await fetch('http://localhost:5000/api/materials/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok){
            throw new Error('Fail to Upload materials');
        }

        alert('Material uploaded successfully');
        // const data = await response.json();

    } catch (error) {
        console.log('Error:', error.message);
    }
});

// Handle upload assignment
const assignment = document.getElementById('upload-assignment-form');
assignment.addEventListener('submit', async(e) => {
    e.preventDefault();

    // const formData = new FormData();
    // formData.append('title', document.getElementById('title').value);
    // formData.append('description', document.getElementById('description').value);
    // formData.append('dueDate', document.getElementById('dueDate').value);

    const title = document.getElementById('title1').value;
    const description = document.getElementById('description1').value;
    const dueDate = document.getElementById('dueDate').value;
    const formData = { title, description, dueDate };

    console.log(formData);
    try {
        method = 'POST';

        const response = await fetch('http://localhost:5000/api/assignment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok){
            throw new Error('Fail to Upload assignment');
        }

        console.log(response);
        alert('Assignment uploaded successfully');

    } catch (error) {
        console.log('Error:', error.message);
    }
});

// Handle upload quizzez
const quizzes = document.querySelector('form #quizzes');
quizzes.addEventListener('click', async(e) => {
    e.preventDefault();

    if (!confirm('Did you want to submit the quiz?')){
        return false
    } else{

        const title = document.getElementById('title2').value;

        try {
            method = 'POST';

            const response = await fetch('http://localhost:5000/api/quizzes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, questions })
            });

            if (!response.ok){
                throw new Error('Fail to Upload assignment');
            }

            console.log(response);
            alert('Quiz uploaded successfully');
            questions = [];

        } catch (error) {
            console.log('Error:', error.message);
        }
                
    }
});
  
async function fetchMaterials() {
    try {
        method = 'GET'
        const response = await fetch('http://localhost:5000/api/materials/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            // body: JSON.stringify({  })
        });

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

async function fetchAssignments() {
    try {
        const response = await fetch('http://localhost:5000/api/assignment/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            // body: JSON.stringify({  })
        });

        if (!response.ok){
            throw new Error('Fail to fetch assignment');
        }

        const data = await response.json();

        const ul = document.getElementById('assignments-list');
        ul.innerHTML = '';

        
        data.forEach(assignment => {
            var date = new Date(assignment.due_date);
            const li = document.createElement('li');
            li.innerHTML = `<a href="/api/materials/${assignment.id}/download">${assignment.title}</a> -  ${assignment.description}  - Due: ${date}`;
            ul.appendChild(li);
        });

    } catch (error) {
        console.log('Error:', error.message);
    }
}

async function fetchProgress() {
    // Fetch student progress
    try {
        const response = await fetch('http://localhost:5000/api/progress', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            // body: JSON.stringify({  })
        });

        if (!response.ok){
            throw new Error('Fail to fetch Students Progress');
        }

        const data = await response.json();
        const result = data.result;
        // {
        //     student_id: 1,
        //     student_name: 'SupremeEdited',
        //     assignments_submitted: 4,
        //     assignment_names: 'Calculus, English Assignment, Mathematic Assignment'
        //   }
        
        const tbody = document.querySelector('#progress-list tbody');
        result.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                            <td>${student.student_name}</td>
                            <td>${student.assignment_submitted}</td>
                            <td>${student.assignment_names}</td>`;
            tbody.append(row);
        });

    } catch (error) {
        console.log('Error:', error.message);
    }
}


fetchMaterials();
fetchAssignments();
fetchProgress();