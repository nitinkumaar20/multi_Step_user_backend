// MERN STACK IMPLEMENTATION

// ------------------------
// server/index.js
// ------------------------

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect('mongodb://localhost:27017/mern-form', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') cb(null, true);
    else cb(new Error('Only JPG and PNG allowed'));
  },
});

app.post('/api/upload', upload.single('profilePic'), (req, res) => {
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

app.get('/api/check-username', async (req, res) => {
  const { username } = req.query;
  const user = await User.findOne({ username });
  res.json({ available: !user });
});

app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(5000, () => console.log('Server started on http://localhost:5000'));


// ------------------------
// server/models/User.js
// ------------------------



// ------------------------
// client/src/App.js (React)
// ------------------------

// import React, { useState, useEffect } from 'react';

// const App = () => {
//   const [form, setForm] = useState({});
//   const [preview, setPreview] = useState('');
//   const [usernameStatus, setUsernameStatus] = useState('');
//   const [passwordStrength, setPasswordStrength] = useState('');

//   useEffect(() => {
//     document.getElementById('dob').max = new Date().toISOString().split('T')[0];
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'profilePic') {
//       const file = files[0];
//       if (file && file.size <= 2 * 1024 * 1024 && ['image/jpeg', 'image/png'].includes(file.type)) {
//         const reader = new FileReader();
//         reader.onload = () => setPreview(reader.result);
//         reader.readAsDataURL(file);
//         uploadFile(file);
//       }
//     } else {
//       setForm({ ...form, [name]: value });
//       if (name === 'username') checkUsername(value);
//       if (name === 'newPassword') validatePassword(value);
//       if (name === 'country') setForm({ ...form, address: '' });
//     }
//   };

//   const checkUsername = async (username) => {
//     const res = await fetch(`http://localhost:5000/api/check-username?username=${username}`);
//     const data = await res.json();
//     setUsernameStatus(data.available ? '✅ Available' : '❌ Taken');
//   };

//   const validatePassword = (pwd) => {
//     const strong = /[!@#$%^&*]/.test(pwd) && /\d/.test(pwd) && pwd.length >= 8;
//     setPasswordStrength(strong ? 'Strong' : 'Weak');
//   };

//   const uploadFile = async (file) => {
//     const formData = new FormData();
//     formData.append('profilePic', file);
//     const res = await fetch('http://localhost:5000/api/upload', {
//       method: 'POST',
//       body: formData,
//     });
//     const data = await res.json();
//     setForm({ ...form, profilePic: data.filePath });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await fetch('http://localhost:5000/api/users', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });
//     alert('User registered!');
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
//       <span>{usernameStatus}</span><br />

//       <select name="gender" onChange={handleChange} required>
//         <option value="">--Select Gender--</option>
//         <option value="male">Male</option>
//         <option value="female">Female</option>
//         <option value="other">Other</option>
//       </select><br />

//       {form.gender === 'other' && (
//         <input type="text" name="customGender" placeholder="Your Gender" onChange={handleChange} />
//       )}

//       <select name="profession" onChange={handleChange}>
//         <option value="">--Profession--</option>
//         <option value="student">Student</option>
//         <option value="developer">Developer</option>
//         <option value="business">Business</option>
//       </select><br />

//       {form.profession === 'business' && (
//         <>
//           <input type="text" name="companyName" placeholder="Company Name" onChange={handleChange} />
//           <input type="text" name="designation" placeholder="Designation" onChange={handleChange} />
//         </>
//       )}

//       <input type="date" id="dob" name="dob" onChange={handleChange} /><br />
//       <select name="country" onChange={handleChange}>
//         <option value="india">India</option>
//         <option value="usa">USA</option>
//       </select><br />
//       <input type="text" name="address" placeholder="Address" value={form.address || ''} onChange={handleChange} /><br />

//       <input type="file" name="profilePic" accept=".jpg,.jpeg,.png" onChange={handleChange} /><br />
//       {preview && <img src={preview} alt="Preview" width="100" />}<br />

//       <input type="password" name="currentPassword" placeholder="Current Password" onChange={handleChange} required /><br />
//       <input type="password" name="newPassword" placeholder="New Password" onChange={handleChange} /><span>{passwordStrength}</span><br />

//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default App;
