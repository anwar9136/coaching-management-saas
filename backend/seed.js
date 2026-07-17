// seed.js
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';

dotenv.config();

const ADMIN_EMAIL = "anwarbasha913@gmail.com";

const seedAdmin = async () => {
    try {
        await connectDB();

        // Check using the actual email being seeded
        const adminExists = await User.findOne({ email: ADMIN_EMAIL });

        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        await User.create({
            name: "Anwar",
            email: ADMIN_EMAIL,
            password: "anwar9136",
            role: "admin"
        });

        console.log('Admin seeded successfully!');

    } catch (error) {
        console.error('Seed error:', error);
    } finally {
        process.exit();
    }
};

seedAdmin();