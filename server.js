const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// Create the Express app
const app = express();
app.use(bodyParser.json());

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://mongodb:27017/studentDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define the Student schema
const studentSchema = new mongoose.Schema({
    applicationDate: String,
    firstName: String,
    lastName: String,
    gender: String,
    dob: String,
    fatherName: String,
    phoneNumber: String,
    emailAddress: String,
    permanentAddress: String,
    presentAddress: String,
    programme: String,
    stream: String,
    tenthSchoolName: String,
    tenthPercentage: Number,
    interCollegeName: String,
    interPercentage: Number,
    btechCollegeName: String,
    btechPercentage: Number,
    degreeCollegeName: String,
    degreePercentage: Number,
});

// Define the Enquire Now schema
const enquireNowSchema = new mongoose.Schema({
    name: String,
    contactNumber: String,
    email: String,
    programme: String,
    stream: String,
});

// Create the models
const Student = mongoose.model('Student', studentSchema);
const EnquireNow = mongoose.model('EnquireNow', enquireNowSchema);

// In-memory seat availability structure
const seatAvailability = {
    btech: {
        cse: 20,
        it: 25,
        ece: 20,
        aiml: 15,
        ds: 10,
        iot: 8,
        cs: 5,
    },
    mtech: {
        cse: 15,
        it: 10,
        ds: 8,
        ai: 5,
        cne: 3,
    },
    mba: {
        hr: 20,
        finance: 15,
        marketing: 10,
        operations: 0,
        it: 5,
    },
};

// Endpoint to get seat availability
app.get('/api/seats', (req, res) => {
    const { programme, stream } = req.query;
    if (seatAvailability[programme] && seatAvailability[programme][stream] !== undefined) {
        res.status(200).json({ availableSeats: seatAvailability[programme][stream] });
    } else {
        res.status(400).json({ message: 'Invalid programme or stream' });
    }
});

// Endpoint to save student data and reduce seat count
app.post('/api/students', async (req, res) => {
    try {
        const { programme, stream } = req.body;

        // Check seat availability before saving student data
        if (seatAvailability[programme] && seatAvailability[programme][stream] > 0) {
            const student = new Student(req.body);
            await student.save();

            // Reduce seat count
            seatAvailability[programme][stream]--;
            res.status(201).send({ message: 'Student data saved successfully' });
        } else {
            res.status(400).send({ message: 'No seats available for the selected programme and stream' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Failed to save student data' });
    }
});

// Endpoint to save enquire now data
app.post('/api/enquire', async (req, res) => {
    try {
        const { programme, stream } = req.body;

        // Check seat availability before saving enquiry data
        if (seatAvailability[programme] && seatAvailability[programme][stream] > 0) {
            const enquire = new EnquireNow(req.body);
            await enquire.save();
            res.status(201).send({ message: 'Enquiry saved successfully' });
        } else {
            res.status(400).send({ message: 'No seats available for the selected programme and stream' });
        }
    } catch (error) {
        res.status(500).send({ message: 'Failed to save enquiry' });
    }
});

// Endpoint to retrieve student data
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find({});
        res.status(200).send(students);
    } catch (error) {
        res.status(500).send({ message: 'Failed to retrieve student data' });
    }
});

// Endpoint to retrieve enquiries
app.get('/api/enquire', async (req, res) => {
    try {
        const enquiries = await EnquireNow.find({});
        res.status(200).send(enquiries);
    } catch (error) {
        res.status(500).send({ message: 'Failed to retrieve enquiries' });
    }
});

// Handle all other routes to serve the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public','index.html'));
});

// Start the server
const PORT = 3028;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
