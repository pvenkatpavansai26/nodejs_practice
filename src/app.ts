import express from 'express';


const app = express();


app.get('/', (req, res, next) => {
    res.json('Hello, World!');      
});

export default app;
