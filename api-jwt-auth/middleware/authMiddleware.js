import jwt from "jsonwebtoken"
const JWT_SECRET = 'supersecretkey'


 // Middleware to validate JWT token
 export function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];;
    if (!token) return res.status(403).send('Token is required');

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid token');
        req.user = user;
        next();
    });
}

// Middleware to authorize based on role
export function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).send('Access denied');
        }
        next();
    };
}