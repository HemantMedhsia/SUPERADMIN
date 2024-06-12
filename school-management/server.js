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

// Route to handle form submission
app.post('/manager/store', async (req, res) => {
  const { name, phone_number, email, password } = req.body;

  const newSchool = new School({
    name,
    phone_number,
    email,
    password,
  });

  try {
    await newSchool.save();
    res.status(201).send('School data saved successfully');
  } catch (error) {
    res.status(500).send('Error saving school data: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
