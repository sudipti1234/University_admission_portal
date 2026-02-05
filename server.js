
// server.js (fixed)
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());

// Serve static files from ./public
app.use(express.static(path.join(__dirname, 'public')));

// Mongo URI: prefer MONGODB_URI (K8s/Helm), fallback to common names, then service DNS
const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URL   ||
  process.env.DB_URL      ||
  'mongodb://mongodb-service:27017/studentDB';

// Connect to MongoDB with sane defaults
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
}).then(() => console.log('[mongo] connected'))
  .catch(err => {
    console.error('[mongo] connection error:', err.message);
    process.exit(1);
  });

// Schemas
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
}, { timestamps: true });

const enquireNowSchema = new mongoose.Schema({
  name: String,
  contactNumber: String,
  email: String,
  programme: String,
  stream: String,
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
const EnquireNow = mongoose.model('EnquireNow', enquireNowSchema);

// In-memory seat availability
const seatAvailability = {
  btech: { cse: 20, it: 25, ece: 20, aiml: 15, ds: 10, iot: 8, cs: 5 },
  mtech: { cse: 15, it: 10, ds: 8, ai: 5, cne: 3 },
  mba:   { hr: 20, finance: 15, marketing: 10, operations: 0, it: 5 },
};

// Health endpoints
app.get('/healthz', (req, res) => res.json({ ok: true }));
app.get('/readyz', (req, res) => {
  const ready = mongoose.connection.readyState === 1; // 1 = connected
  res.status(ready ? 200 : 503).json({ ready });
});

// REST endpoints
app.get('/api/seats', (req, res) => {
  const { programme, stream } = req.query;
  if (seatAvailability[programme] && seatAvailability[programme][stream] !== undefined) {
    return res.status(200).json({ availableSeats: seatAvailability[programme][stream] });
  }
  return res.status(400).json({ message: 'Invalid programme or stream' });
});

app.post('/api/students', async (req, res) => {
  try {
    const { programme, stream } = req.body || {};
    if (!(programme && stream)) return res.status(400).json({ message: 'programme and stream are required' });
    if (!(seatAvailability[programme] && seatAvailability[programme][stream] > 0)) {
      return res.status(400).json({ message: 'No seats available for the selected programme and stream' });
    }
    const student = new Student(req.body);
    await student.save();
    seatAvailability[programme][stream]--;
    return res.status(201).json({ message: 'Student data saved successfully', id: student._id });
  } catch (e) {
    console.error('[POST /api/students] error', e);
    return res.status(500).json({ message: 'Failed to save student data' });
  }
});

app.post('/api/enquire', async (req, res) => {
  try {
    const { programme, stream } = req.body || {};
    if (!(programme && stream)) return res.status(400).json({ message: 'programme and stream are required' });
    if (!(seatAvailability[programme] && seatAvailability[programme][stream] > 0)) {
      return res.status(400).json({ message: 'No seats available for the selected programme and stream' });
    }
    const enquire = new EnquireNow(req.body);
    await enquire.save();
    return res.status(201).json({ message: 'Enquiry saved successfully', id: enquire._id });
  } catch (e) {
    console.error('[POST /api/enquire] error', e);
    return res.status(500).json({ message: 'Failed to save enquiry' });
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json(students);
  } catch (e) {
    return res.status(500).json({ message: 'Failed to retrieve student data' });
  }
});

app.get('/api/enquire', async (req, res) => {
  try {
    const enquiries = await EnquireNow.find({}).sort({ createdAt: -1 }).lean();
    return res.status(200).json(enquiries);
  } catch (e) {
    return res.status(500).json({ message: 'Failed to retrieve enquiries' });
  }
});

// Fallback to index.html for other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Listen (default 3028 to match K8s Service targetPort)
const PORT = Number(process.env.PORT || 3028);
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server listening on http://${HOST}:${PORT}`);
});
