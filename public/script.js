// script.js
document.addEventListener('DOMContentLoaded', () => {
  // Grab core elements
  const btnValidate       = document.getElementById('validatePersonalDetails');
  const programmeEl       = document.getElementById('programme');
  const eduDetails        = document.getElementById('educationalDetails');
  const eduFields         = document.getElementById('educationFields');
  const form              = document.getElementById('studentForm');
  const applicationDateEl = document.getElementById('applicationDate');

  // Guard against missing elements to avoid hard crashes
  if (!btnValidate || !programmeEl || !eduDetails || !eduFields || !form) {
    console.warn('[script.js] Required elements missing on this page.');
    return;
  }

  // Initialize application date to today
  if (applicationDateEl) {
    const today = new Date().toISOString().split('T')[0];
    applicationDateEl.setAttribute('min', today);
    applicationDateEl.setAttribute('value', today);
  }

  // 1) Validate personal details and reveal education section
  btnValidate.addEventListener('click', () => {
    const phoneNumber  = document.getElementById('phoneNumber')?.value || '';
    const emailAddress = document.getElementById('emailAddress')?.value || '';
    const dob          = document.getElementById('dob')?.value || '';

    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dobRegex   = /^\d{4}-\d{2}-\d{2}$/;

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

    // Show the educational details section
    eduDetails.style.display = 'block';
  });

  // 2) Programme change → render dynamic education fields
  programmeEl.addEventListener('change', function () {
    const programme = this.value;
    eduFields.innerHTML = ''; // clear previous block

    if (programme === 'btech') {
      eduFields.innerHTML = `
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
      eduFields.innerHTML = `
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
      eduFields.innerHTML = `
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

  // 3) Submit handler → POST /api/students (relative URL)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const parseNum = (v) => {
      if (v === undefined || v === null || String(v).trim() === '') return null;
      const n = parseFloat(v);
      return Number.isNaN(n) ? null : n;
    };

    const payload = {
      applicationDate:   document.getElementById('applicationDate')?.value,
      firstName:         document.getElementById('firstName')?.value,
      lastName:          document.getElementById('lastName')?.value,
      gender:            document.getElementById('gender')?.value,
      dob:               document.getElementById('dob')?.value,
      fatherName:        document.getElementById('fatherName')?.value,
      phoneNumber:       document.getElementById('phoneNumber')?.value,
      emailAddress:      document.getElementById('emailAddress')?.value,
      permanentAddress:  document.getElementById('permanentAddress')?.value,
      presentAddress:    document.getElementById('presentAddress')?.value,
      programme:         document.getElementById('programme')?.value,
      stream:            document.getElementById('stream')?.value,
      tenthSchoolName:   document.getElementById('tenthSchoolName')?.value,
      tenthPercentage:   parseNum(document.getElementById('tenthPercentage')?.value),
      interCollegeName:  document.getElementById('interCollegeName')?.value,
      interPercentage:   parseNum(document.getElementById('interPercentage')?.value),
      btechCollegeName:  document.getElementById('btechCollegeName')?.value,
      btechPercentage:   parseNum(document.getElementById('btechPercentage')?.value),
      degreeCollegeName: document.getElementById('degreeCollegeName')?.value,
      degreePercentage:  parseNum(document.getElementById('degreePercentage')?.value),
    };

    if (!payload.programme || !payload.stream) {
      alert('Please select programme and stream.');
      return;
    }

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error('Submit failed:', res.status, body);
        alert(body.message || 'Failed to save student data');
        return;
      }

      alert(body.message || 'Student data saved successfully');

      // Reset the form and collapse dynamic section
      form.reset();
      eduDetails.style.display = 'none';
      eduFields.innerHTML = '';

      // Reset date to today after reset (optional)
      if (applicationDateEl) {
        const today = new Date().toISOString().split('T')[0];
        applicationDateEl.setAttribute('value', today);
      }
    } catch (err) {
      console.error('Error while submitting:', err);
      alert('An error occurred. Please try again.');
    }
  });
});
