//API imports
const express = require('express');
const cors = require('cors');
//Gemini import
const { gemini } = require('./gemini.js');
//Environment variables
require('dotenv').config();

//create express app
const app = express();
const port = process.env.PORT || 3000;
//CORS configuration
const origins = ['http://localhost:5173'];

app.use(cors({ origin: origins }));


app.get('/', async (req, res) => {
    gemini_response = await gemini()
    res.send(gemini_response);

});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
}); 