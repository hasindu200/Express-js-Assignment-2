const express = require('express');
const cusRouter = express.Router();
const mysql = require('mysql')
const db = require('../configs/db.config')

const connection = mysql.createConnection(db._database)

connection.connect(function (error) {
    if (error) {
        console.log(error);
    }else {
        console.log("Connected to the MySQL Server")
        var userTableQuery = "CREATE TABLE IF NOT EXISTS customer (id VARCHAR(255) PRIMARY KEY , name VARCHAR (255),address VARCHAR (255), contact VARCHAR (255))"
        connection.query(userTableQuery, function (error,result) {
            if (error) throw error;
            //console.log(result);
            if (result.warningCount === 0){
                console.log("customer table Created");
            }
        })
    }
})

cusRouter.post('/', (req,res) =>{
    console.log(req.body)
    const id = req.body.id;
    const name = req.body.name;
    const address = req.body.address;
    const contact = req.body.contact;

    var query = "INSERT INTO customer (id, name, address,contact) VALUES (?,?,?,?)"
    connection.query(query, [id,name,address,contact],(error) =>{
        if (error){
            res.send({'message' :'Duplicate Entry'})
        }else {
            res.send({'message' : 'User created'})
        }
    });
})

cusRouter.get('/',(req,res) =>{
    var query = "SELECT * FROM customer"
    connection.query(query, (error,rows) =>{
        if (error) throw error
        res.send(rows)
    })
})

cusRouter.put('/', (req,res) =>{
    const id = req.body.id;
    const name = req.body.name;
    const address = req.body.address;
    const contact = req.body.contact;

    var query = "UPDATE customer SET name=?, address=?,contact=? WHERE id=?"
    connection.query(query, [name,address,contact,id],(error,rows) =>{
        if (error) throw error
        if (rows.affectedRows > 0){
            res.send({'message':'User Updated'})
        }else {
            res.send({'message':'User not found'})
        }
    });
})

cusRouter.delete('/:id', (req,res) =>{
    const id = req.params.id

    var query = "DELETE FROM customer WHERE id=?";

    connection.query(query, [id], (error, rows) => {
        if (error) console.log(error);

        if (rows.affectedRows > 0){
            res.send({'message': 'user deleted'})
        }else {
            res.send({'message': 'user not found'})
        }
    })
})

cusRouter.get('/:id', (req,res) =>{
    const id = req.params.id

    var query = "SELECT * FROM customer WHERE id=?"

    connection.query(query, [id], (error, rows) => {
        if (error) console.log(error);

        res.send(rows)
    })
})

module.exports = cusRouter