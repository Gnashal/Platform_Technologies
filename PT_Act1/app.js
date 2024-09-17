const express = require("express");
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
});


app.get('/route1', (req, res) => {
    const header = req.headers['x-access-route1'];
    if (header === 'allow-route1') {
        res.send('Access to route 1 is allowed');
    } else {
        res.status(403).send('You are forbidden to access the route');
    }
});

app.get('/route2', (req, res) => {
    const header = req.headers['x-access-route2'];
    if (header === 'allow-route2') {
        res.send('Access to route 2 is allowed');
    } else {
        res.status(403).send('You are forbidden to access the route');
    }
});

app.get('/route3', (req, res) => {
    const auth = req.headers['authorization'];
    const encoded = Buffer.from('test:password').toString('base64');

    if (auth === `Basic ${encoded}`) {
        res.send('Access to route 3 is allowed');
    } else {
        res.status(403).send('You are forbidden to access the route');
    }
});

app.get('/route4', (req, res) => {
    const token = req.headers['authorization'];
    const validToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    if (token == validToken) {
        res.send('Access to route 4 is allowed');
    } else {
        res.status(403).send('You are forbidden to access the route');
    }
});


app.listen(port, () => {
    console.log(`port is listening on: ${port}`);
})