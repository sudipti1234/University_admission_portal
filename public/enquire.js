document.getElementById('programmeEnquiry').addEventListener('change', function() {
    const programme = this.value;
    const streamEnquiryFields = document.getElementById('streamEnquiryFields');
    streamEnquiryFields.innerHTML = ''; // Clear previous fields

    if (programme === 'btech') {
        streamEnquiryFields.innerHTML = `
            <label for="streamEnquiry">B.Tech Stream:</label>
            <select id="streamEnquiry" name="streamEnquiry" required>
                <option value="">Select Stream</option>
                <option value="cse">CSE</option>
                <option value="it">IT</option>
                <option value="ece">ECE</option>
                <option value="aiml">AI-ML</option>
                <option value="ds">Data Science</option>
                <option value="iot">IOT</option>
                <option value="cs">Cyber Security</option>
            </select><br>
        `;
    } else if (programme === 'mtech') {
        streamEnquiryFields.innerHTML = `
            <label for="streamEnquiry">M.Tech Stream:</label>
            <select id="streamEnquiry" name="streamEnquiry" required>
                <option value="">Select Stream</option>
                <option value="cse">CSE</option>
                <option value="it">IT</option>
                <option value="ds">Data Science</option>
                <option value="ai">Artificial Intelligence</option>
                <option value="cne">Computer Networking Engineering</option>
            </select><br>
        `;
    } else if (programme === 'mba') {
        streamEnquiryFields.innerHTML = `
            <label for="streamEnquiry">MBA Stream:</label>
            <select id="streamEnquiry" name="streamEnquiry" required>
                <option value="">Select Stream</option>
                <option value="hr">Human Resources</option>
                <option value="finance">Finance</option>
                <option value="marketing">Marketing</option>
                <option value="operations">Operations</option>
                <option value="it">Information Technology</option>
            </select><br>
        `;
    }
});

document.getElementById('enquireForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Gather enquiry form data
    const programme = document.getElementById('programmeEnquiry').value;
    const stream = document.getElementById('streamEnquiry')?.value;

    // Check seat availability
    fetch(`/api/seats?programme=${programme}&stream=${stream}`)
        .then(response => response.json())
        .then(data => {
            if (data.availableSeats > 0) {
                // Submit enquiry data to the server
                const enquiryData = {
                    name: document.getElementById('name').value,
                    contactNumber: document.getElementById('contactNumber').value,
                    email: document.getElementById('email').value,
                    programme,
                    stream,
                };

                fetch('/api/enquire', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(enquiryData),
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    document.getElementById('enquireForm').reset();
                })
                .catch(error => {
                    alert('An error occurred while submitting the enquiry.');
                });
            } else {
                alert('No seats available for the selected programme and stream.');
            }
        })
        .catch(error => {
            alert('An error occurred while checking seat availability.');
        });
});
