const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

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

// API per la lettura di tutti gli prodotto
app.get('/products', (req, res) => {
    let sql = 'SELECT * FROM products';
    let query = db.query(sql, (err, results) => {
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
    let sql = 'INSERT INTO products (product,quantity,idUser) values (?,?,1)';
    let values = [req.body.product, req.body.quantity];
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


// API per il match di un utente
// app.get('/users', (req,res)=>{
//     let sql = 'SELECT * FROM users WHERE users.nameUser = ? AND users.passwordUser = ?';
//     let values = [req.body.nameUser, req.body.passwordUser];
//     let query = db.query(sql, values, (err, results) => {
//         if (err) throw err;
//         res.sendFile(path.join(__dirname ,'/home.html'));
//     });
// });



// app.get('/users', (req,res)=>{
//     let sql = 'SELECT * FROM users WHERE users.nameUser = ?';
//     let values = [req.body.nameUser];
//     let query = db.query(sql, values, (err, results) => {
//         if (err) throw err;
//         console.log(results);
//         if(results.length===0)
//         return res.redirect('/');
//         const psw=results[0].passwordUser;
//         if(psw==req.params.passwordUser)
//         return res.sendFile(path.join(__dirname ,'/home.html'));
//         else
//         return res.redirect('/');
//     });
// });






//API per il confronto login
app.post('/users', (req,res)=>{
    let sql = 'SELECT * FROM users WHERE users.nameUser = ?';
    let values = [req.body.nameUser];
    let query = db.query(sql, values, (err, results) => {
       if (err) throw err;
     //  console.log(results);
       if(results.length===0)
         return res.redirect('/');
       
        const psw=results[0].passwordUser;

        if(psw==req.body.passwordUser)
        {
            res.sendFile(path.join(__dirname ,'/home.html'));
        }
        else
        {
            res.redirect('/');
        }
    
    });
});


//routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname ,'/login.html'));
});

app.get('/home',(req,res)=>{
res.sendFile(path.join(__dirname ,'/home.html'));
});

// Avvio del server 
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});




