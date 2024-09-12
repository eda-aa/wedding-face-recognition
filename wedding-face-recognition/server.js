const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));  // To handle large base64 data from camera
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Handle file uploads
app.post('/upload', upload.single('file'), (req, res) => {
  const imagePath = req.file.path;
  console.log('Uploaded image:', imagePath);

  // TODO: Process face recognition logic here

  res.redirect('/loading.html');
});

// Handle camera-captured images (base64)
app.post('/upload-camera', (req, res) => {
  const capturedImageData = req.body.capturedImage;
  const base64Data = capturedImageData.replace(/^data:image\/png;base64,/, '');

  // Save the captured image to the uploads folder
  const filename = Date.now() + '.png';
  const filePath = path.join(__dirname, 'uploads', filename);

  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      console.error('Error saving captured image:', err);
      return res.status(500).send('Failed to save image');
    }

    console.log('Captured image saved:', filePath);

    // TODO: Process face recognition logic here

    res.redirect('/loading.html');
  });
});

// Serve the loading and results pages
app.get('/loading.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'loading.html'));
});

app.get('/results.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'results.html'));
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
