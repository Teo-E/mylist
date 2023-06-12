const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

// Inizializzazione del server
const app = express();
app.use(express.urlencoded({extended:false}));

// Configurazione del server
const port = process.env.PORT || 3000;

// Configurazione del database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

// Configurazione del middleware
app.use(bodyParser.json());
app.use(cookieParser());

// API per la lettura di tutti gli prodotto
app.get('/products', (req, res) => {
    let sql = 'SELECT * FROM products WHERE idUser = ?';
    let valueID = [req.cookies.idUser];
    let query = db.query(sql,valueID,(err, results) => {
        if (err) throw err;
        res.send(results);
    });
});

// API per la lettura di un prodotto
app.get('/products/:id', (req, res) => {
    let sql = `SELECT * FROM products WHERE id = ?`;
    let valueID = [req.params.id];
    let query = db.query(sql, valueID, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// API per la creazione di un prodotto
app.post('/products', (req, res) => {
    let sql = 'INSERT INTO products (product,quantity,idUser) values (?,?,?)';
    let values = [req.body.product, req.body.quantity, req.cookies.idUser];
    let query = db.query(sql, values, (err) => {
        if (err) throw err;
         res.redirect('/home');
    });
});




// API per l'aggiornamento di un prodotto
app.put('/products/:id', (req, res) => {
    let sql = `UPDATE products SET product = ?, quantity = ? WHERE id = ?`;
    let values= [req.body.productMod, req.body.quantityMod, req.params.id]
    let query = db.query(sql,values, (err) => {
        if (err) throw err;
        res.redirect('/home');
    });
});

// API per la cancellazione di un prodotto
app.delete('/products/:id', (req, res) => {
    let sql = `DELETE FROM products WHERE products.id = ?`; 
    let valueID = [req.params.id];
    let query = db.query(sql, valueID, (err) => {
        if (err) throw err;
        res.redirect('/home');
    });
});


//API per la login
app.post('/users', (req,res)=>{
    let values= [req.body.nameUser, req.body.passwordUser];
    let passHash = crypto.createHash('sha256').update(values[1]).digest('hex');
    let valuesHash = [values[0], passHash];
    let sql = `SELECT idUser FROM users WHERE nameUser = ? AND passwordUser = ?`;
    let query = db.query(sql, valuesHash, (err, result) => {
        if (err || result.length === 0) throw err;
        
        res.cookie('idUser', result[0].idUser, {maxAge: 3600000, httpOnly: true});
        res.redirect('/home');

    });
});


//API per il logout
app.get('/logout', (req,res)=>{
    res.clearCookie('idUser');
    res.redirect('/');
});


//API per la registrazione
app.post('/register', (req,res)=>{
    let values= [req.body.nameUser, req.body.passwordUser];
    let passHash = crypto.createHash('sha256').update(values[1]).digest('hex');
    let valuesHash = [values[0], passHash];
    let sql = `INSERT INTO users (nameUser, passwordUser) VALUES (?,?)`;
    let query = db.query(sql, valuesHash, (err) => {
        if (err) throw err;
        res.redirect('/');
    });

});






//routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname ,'/login.html'));
});

app.get('/home',(req,res)=>{
    if(req.cookies.idUser){
        res.sendFile(path.join(__dirname ,'/home.html'));
    }else{
        res.redirect('/');
    }
});

app.get('/register',(req,res)=>{   
    res.sendFile(path.join(__dirname ,'/register.html'));
});

// Avvio del server 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});




