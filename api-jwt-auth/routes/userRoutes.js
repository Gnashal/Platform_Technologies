import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import {authenticateToken, authorizeRole} from "../middleware/authMiddleware.js"

const router = express.Router();


const JWT_SECRET = 'supersecretkey';
const saltRounds = 10;
let users = [
    { id: 1, username: 'admin', password: '$2a$10$abcdefg', role: 'admin' },
    { id: 2, username: 'user', password: '$2a$10$xyz1234', role: 'user' },
];
// I'm hashing my own password
function hashPassword(password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, (err, hashPassword) => {
            if (err) {
                reject(err);
            } else {
                resolve(hashPassword);
            }
        });
    });
}
async function hashedPasswords(){
    try {
        const hashedAdminPassword = await hashPassword('admin_password');
        const hashedUserPassword = await hashPassword('user_password');
    
        users = [{ id: 1, username: 'admin', password: hashedAdminPassword, role: 'admin' },
            { id: 2, username: 'user', password: hashedUserPassword, role: 'user' },
        ];
        console.log('Hashed Password:', users);
    } catch (error) {
        console.error('Error hasing passwords:', error);      
    }
}

hashedPasswords();

router.post('/login', (req, res) => {
    const {username, password} = req.body;

    console.log('Request Body:', req.body);

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(401).json('Invalid username');
    }
    console.log('User found: ', user);

    const isMatch = bcrypt.compareSync(password, user.password);
    console.log('Password Comparison Result:', isMatch);
    if (!isMatch) {
        return res.status(401).json('Invalid password');
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
})

 // Protected route for all authenticated users
 router.get('/profile', authenticateToken, (req, res) => {
    res.json({ message: `Hello ${req.user.role}, this is your profile.` });
});

// Admin-only route
router.get('/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
    res.json({ message: 'Welcome Admin! This route is restricted to admins only.' });
});

// User-only route
router.get('/user', authenticateToken, authorizeRole('user'), (req, res) => {
    res.json({ message: 'Welcome User! This route is restricted to users only.' });
});


export default router;