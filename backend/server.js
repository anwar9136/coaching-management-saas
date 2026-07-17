import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import courseRoutes from './routes/course.routes.js'
import lectureRoutes from './routes/lecture.routes.js'
import instructorRoutes from './routes/instructor.routes.js'
import programRoutes from './routes/program.routes.js'
import errorHandler from './middleware/errorMiddleware.js';
import authRoutes from './routes/auth.routes.js'

dotenv.config();
const app = express()

app.use(cors({
    origin: [
        "http://localhost:5173"
    ],
    credentials: true
}));
app.use(express.json());

connectDB();

app.get('/', (req, res) =>{
    res.send("Lecture Scheduling Backend is up and running")
})

app.use('/api/courses', courseRoutes);
app.use('/api/lectures', lectureRoutes); 
app.use('/api/instructors', instructorRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/auth', authRoutes);

app.use(errorHandler)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log(`Server is running on port: ${PORT}`)
})