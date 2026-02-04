const express = require('express');

//function imports from other files
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const app = express();

//configurations
dotenv.config();
connectDB();

//middlewares
app.use(express.json());
const port = 3002;




app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});