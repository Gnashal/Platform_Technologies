import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import userRoutes from './routes/userRoutes.js'
const app = express();
const JWT_SECRET = 'supersecretkey';

app.use(express.json());
// adding a static file server. Mainly for experimenting purposes :D
app.use(express.static('public'));


const users = [
    { id: 1, username: 'admin', password: '$2a$10$abcdefg', role: 'admin' },
    { id: 2, username: 'user', password: '$2a$10$xyz1234', role: 'user' },
];


app.use('/api', userRoutes);

app.listen(3000, () => {
    console.log("Server listening at port 3000");
})
