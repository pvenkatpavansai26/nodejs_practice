import { config } from './config.ts';
import mongoose from 'mongoose';

const connectDB = async() => {
    try {

        mongoose.connection.on('connected', () => {
            console.log('Database connected successfully');
        });
        mongoose.connection.on('error', (error) => {
            console.error('Database connection error:', error);
        });

        
        await mongoose.connect(config.databaseUrl as string);

        
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

export default connectDB;