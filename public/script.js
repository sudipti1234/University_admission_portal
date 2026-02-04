document.getElementById('validatePersonalDetails').addEventListener('click', function() {
    const phoneNumber = document.getElementById('phoneNumber').value;
    const emailAddress = document.getElementById('emailAddress').value;
    const dob = document.getElementById('dob').value;

    // Validate personal details
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!phoneRegex.test(phoneNumber)) {
        alert('Please enter a valid 10-digit phone number.');
        return;
    }

    if (!emailRegex.test(emailAddress)) {
        alert('Please enter a valid email address.');
        return;
    }

    if (!dobRegex.test(dob)) {
        alert('Please enter a valid date of birth (YYYY-MM-DD).');
        return;
    }

    // Show educational details section
    document.getElementById('educationalDetails').style.display = 'block';

    // Add event listener for programme selection
    document.getElementById('programme').addEventListener('change', function() {
        const programme = this.value;
        const educationFields = document.getElementById('educationFields');
        educationFields.innerHTML = ''; // Clear previous fields

        if (programme === 'btech') {
            educationFields.innerHTML = `
                <label for="btechStream">B.Tech Stream:</label>
                <select id="stream" name="stream" required>
                    <option value="">Select Stream</option>
                    <option value="cse">CSE</option>
                    <option value="it">IT</option>
                    <option value="ece">ECE</option>
                    <option value="aiml">AI-ML</option>
                    <option value="ds">Data Science</option>
                    <option value="iot">IOT</option>
                    <option value="cs">Cyber Security</option>
                </select><br>
                <label for="tenthSchoolName">10th School Name:</label>
                <input type="text" id="tenthSchoolName" name="tenthSchoolName" required><br>
                <label for="tenthPercentage">10th Percentage:</label>
                <input type="number" step="0.1" id="tenthPercentage" name="tenthPercentage" required><br>
                <label for="interCollegeName">Inter/Diploma College Name:</label>
                <input type="text" id="interCollegeName" name="interCollegeName" required><br>
                <label for="interPercentage">Inter/Diploma Percentage:</label>
                <input type="number" step="0.1" id="interPercentage" name="interPercentage" required><br>
            `;
        } else if (programme === 'mtech') {
            educationFields.innerHTML = `
                <label for="mtechStream">M.Tech Stream:</label>
                <select id="stream" name="stream" required>
                    <option value="">Select Stream</option>
                    <option value="cse">CSE</option>
                    <option value="it">IT</option>
                    <option value="ds">Data Science</option>
                    <option value="ai">Artificial Intelligence</option>
                    <option value="cne">Computer Networking Engineering</option>
                </select><br>
                <label for="tenthSchoolName">10th School Name:</label>
                <input type="text" id="tenthSchoolName" name="tenthSchoolName" required><br>
                <label for="tenthPercentage">10th Percentage:</label>
                <input type="number" step="0.1" id="tenthPercentage" name="tenthPercentage" required><br>
                <label for="interCollegeName">Inter/Diploma College Name:</label>
                <input type="text" id="interCollegeName" name="interCollegeName" required><br>
                <label for="interPercentage">Inter/Diploma Percentage:</label>
                <input type="number" step="0.1" id="interPercentage" name="interPercentage" required><br>
                <label for="btechCollegeName">B.Tech/Degree College Name:</label>
                <input type="text" id="btechCollegeName" name="btechCollegeName" required><br>
                <label for="btechPercentage">B.Tech/Degree Percentage:</label>
                <input type="number" step="0.1" id="btechPercentage" name="btechPercentage" required><br>
            `;
        } else if (programme === 'mba') {
            educationFields.innerHTML = `
                <label for="mbaStream">MBA Stream:</label>
                <select id="stream" name="stream" required>
                    <option value="">Select Stream</option>
                    <option value="hr">Human Resources</option>
                    <option value="finance">Finance</option>
                    <option value="marketing">Marketing</option>
                    <option value="operations">Operations</option>
                    <option value="it">Information Technology</option>
                </select><br>
                <label for="tenthSchoolName">10th School Name:</label>
                <input type="text" id="tenthSchoolName" name="tenthSchoolName" required><br>
                <label for="tenthPercentage">10th Percentage:</label>
                <input type="number" step="0.1" id="tenthPercentage" name="tenthPercentage" required><br>
                <label for="interCollegeName">Inter/Diploma College Name:</label>
                <input type="text" id="interCollegeName" name="interCollegeName" required><br>
                <label for="interPercentage">Inter/Diploma Percentage:</label>
                <input type="number" step="0.1" id="interPercentage" name="interPercentage" required><br>
                <label for="degreeCollegeName">Degree College Name:</label>
                <input type="text" id="degreeCollegeName" name="degreeCollegeName" required><br>
                <label for="degreePercentage">Degree Percentage:</label>
                <input type="number" step="0.1" id="degreePercentage" name="degreePercentage" required><br>
            `;
        }
    });
});

document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Gather form data
    const formData = {
        applicationDate: document.getElementById('applicationDate').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        gender: document.getElementById('gender').value,
        dob: document.getElementById('dob').value,
        fatherName: document.getElementById('fatherName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        emailAddress: document.getElementById('emailAddress').value,
        permanentAddress: document.getElementById('permanentAddress').value,
        presentAddress: document.getElementById('presentAddress').value,
        programme: document.getElementById('programme').value,
        stream: document.getElementById('stream').value,
        tenthSchoolName: document.getElementById('tenthSchoolName')?.value,
        tenthPercentage: parseFloat(document.getElementById('tenthPercentage')?.value),
        interCollegeName: document.getElementById('interCollegeName')?.value,
        interPercentage: parseFloat(document.getElementById('interPercentage')?.value),
        btechCollegeName: document.getElementById('btechCollegeName')?.value,
        btechPercentage: parseFloat(document.getElementById('btechPercentage')?.value),
        degreeCollegeName: document.getElementById('degreeCollegeName')?.value,
        degreePercentage: parseFloat(document.getElementById('degreePercentage')?.value),
    };

    // Submit form data to the server
    fetch('http://localhost:3028/api/students', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        document.getElementById('studentForm').reset();
        document.getElementById('educationalDetails').style.display = 'none'; // Hide educational details after submission
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
});

window.onload = function() {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const applicationDateInput = document.getElementById('applicationDate');
    applicationDateInput.setAttribute('min', today); // Set the minimum date to today
    applicationDateInput.setAttribute('value', today); // Set the default value to today
};
