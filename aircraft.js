//JavaScript code
function searchProduct() {
    var searchQuery = document.getElementById("searchInput").value;
    var sqlQuery = "SELECT * FROM products WHERE name LIKE '%" + searchQuery + "%'";
    var results = executeSQLQuery(sqlQuery);
    var displayResults(results);
}

function addToCart(productId) {
    var sqlQuery = "SELECT * FROM products WHERE id = " + productId;
    var product = executeSQLQuery(sqlQuery);
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));
}

function displayCart() {
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var cartContainer = document.getElementById("cartContainer");
    cartContainer.innerHTML = "";

    for (var i = 0; i < cart.length; i++) {
        var product = cart[i];
        var productElement = document.createElement("div");
        productElement.innerHTML = product.name;
        cartContainer.appendChild(productElement);
    }

}
// JavaScript code for executing SQL queries
function executeSQLQuery(query) {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'mydatabase'
    });
    connection.connect();
    var results = [];
    connection.query(query, function(error, rows, fields) {
        if (error) throw error;
        results = rows;
    });
    connection.end();
    return results;
}




//MongoDB Code
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Set up MongoDB connection
mongoose.connect('mongodb://localhost/trading_platform', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Create Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Define API routes
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));

// Serve React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));