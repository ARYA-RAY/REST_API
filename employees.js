const express = require('express');
const router = express.Router();
const db = require('./db');

db.connect()


// Create Employee with multiple contact details (Relationship mapping)

router.post('/employees', (req, res) => {
    try {
        const { employee_id, name, job, email, phone, address, city, state } = req.body;

        db.query(
            'INSERT INTO employees (employee_id, name, email, phone, address, city, state) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [employee_id, job, name, email, phone, address, city, state]
        );

        res.status(201).json({
            employee_id,
            job,
            name,
            email,
            phone,
            address,
            city, 
            state
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


// List Employee (with pagination)

router.get('/employees', (req, res) => {
    try {
        const page = parseInt(req.query.page || 1, 10);
        const limit = parseInt(req.query.limit || 10, 10);
        const offset = (page - 1) * limit;

        db.query(
            'SELECT e.employee_id, e.name, e.job, e.email, e.phone, e.address, e.city, e.state FROM employees e ORDER BY e.employee_id LIMIT ? OFFSET ?',[limit, offset],function(error,result){
                if(error) throw error;
                res.json(result)
            }
        )
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


// Update Employee

router.put('/employees/:id', (req, res) => {
    try {
        const { name, job, email, phone, address, city, state } = req.body;
        const { id } = req.params;

        db.query(
            'UPDATE employees SET name = ?, job = ?, email = ?, phone = ?, address = ?, city = ?, state = ? WHERE employee_id = ?',
            [name, job, email, phone, address, city, state, id],function(error,result){
                if (result.affectedRows === 0) {
                    return res.status(404).json({ error: 'Employee not found' });
                }
                res.json(result)
            }
        );

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


// Delete Employee

router.delete('/employees/:id', (req, res) => {
    try {
        const { id } = req.params;

        const result = db.query(
            'DELETE FROM employees WHERE employee_id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json({
            id,
            message: 'Employee deleted successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


// Get Employee by id

router.get('/employees/:id', (req, res) => {
    try {
        const { id } = req.params;

        db.query(
            'SELECT e.employee_id, e.name, e.job, e.email, e.phone, e.address, e.city, e.state FROM employees e WHERE e.employee_id = ?',
            [id],function(error,result){
                if (result.length === 0) {
                    return res.status(404).json({ error: 'Employee not found' });
                }
                res.json(result)
            }
        )

        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;          