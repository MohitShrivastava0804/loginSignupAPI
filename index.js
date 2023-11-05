const express = require("express");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;

//cookie-parser - what is this and why we need this ?

app.use(express.json());

require("./config/database").connect();

// home page route
app.get('/', (req, res) => {
    res.status(200).json({
        message: "We are on the home page.",
    })
});

// dashboard route
app.get('/dashboard', (req, res) => {
    // You can send data or render a view here
    res.send('Welcome to the dashboard!');
});

//route import and mount
const user = require("./routes/user");
app.use("/api/v1", user);

//activate
app.listen(PORT, () => {
    console.log(`App is listening at PORT: ${PORT}`);
})