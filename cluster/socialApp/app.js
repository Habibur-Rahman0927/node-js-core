const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`Welcome to the social media app! Served by PID: ${process.pid}`);
});

app.get('/post/:id', (req, res) => {
    const postId = req.params.id;
    // Simulate post fetching
    res.send(`Post ${postId} fetched by PID: ${process.pid}`);
});

app.get('/like', (req, res) => {
    // Simulate like action
    res.send(`Post liked! Processed by PID: ${process.pid}`);
});

module.exports = app;
