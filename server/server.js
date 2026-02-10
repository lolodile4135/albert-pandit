const express = require('express');
const cors = require('cors');

//function imports from other files
const dotenv = require('dotenv');
const connectDB = require('./utils/db');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require("./routes/commentRoutes");
const interestRoutes = require("./routes/interestRoutes");
const app = express();

//configurations
dotenv.config();
connectDB();

// CORS configuration - must be before other middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow any localhost / 127.0.0.1 origin (any port) for development
    if (
      origin.startsWith('http://localhost:') ||
      origin.startsWith('http://127.0.0.1:')
    ) {
      return callback(null, true);
    }

    // Optionally also allow a specific deployed frontend URL from env
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

//middlewares
app.use(express.json());

const port = process.env.PORT;

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/interests", interestRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});