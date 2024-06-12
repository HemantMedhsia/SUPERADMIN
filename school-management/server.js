// Existing imports and setup...
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/schoolDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Mongoose schema and model
const schoolSchema = new mongoose.Schema({
  name: String,
  phone_number: String,
  email: String,
  password: String,
});

const School = mongoose.model('School', schoolSchema);

// Route to add a new school
app.post('/manager/store', async (req, res) => {
  const { name, phone_number, email, password } = req.body;

  const newSchool = new School({ name, phone_number, email, password });

  try {
    await newSchool.save();
    res.status(201).send('School data saved successfully');
  } catch (error) {
    res.status(500).send('Error saving school data: ' + error.message);
  }
});

// Route to delete a school by ID
app.delete('/manager/schools/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSchool = await School.findByIdAndDelete(id);
    if (!deletedSchool) {
      return res.status(404).send('School not found');
    }
    res.status(200).send('School deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting school: ' + error.message);
  }
});


// Route to get all schools
app.get('/manager/schools', async (req, res) => {
  try {
    const schools = await School.find({}, 'name email');
    res.status(200).json(schools);
  } catch (error) {
    res.status(500).send('Error fetching school data: ' + error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});
