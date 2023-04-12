const express = require('express');
const router = express.Router();
const db = require('./db');

db.connect()


// Create Employee with multiple contact details (Relationship mapping)

router.post('/employees', (req, res) => {
    try {
        const { employee_id, name, job, email, phone, address, city, state, primary_name, primary_phone, primary_relation, secondary_name, secondary_phone, secondary_relation } = req.body;

        db.query(
            'INSERT INTO employees (employee_id, name, job, email, phone, address, city, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [employee_id, job, name, email, phone, address, city, state]
        );

        db.query(
            'INSERT INTO primary_contacts (employee_id, primary_name, primary_phone, primary_relation) VALUES (?, ?, ?, ?)',
            [employee_id, primary_name, primary_phone, primary_relation]
        );

        db.query(
            'INSERT INTO secondary_contacts (employee_id, secondary_name, secondary_phone, secondary_relation) VALUES (?, ?, ?, ?)',
            [employee_id, secondary_name, secondary_phone, secondary_relation]
        );

        res.status(201).json({
            employee_id,
            name,
            job,
            email,
            phone,
            address,
            city, 
            state,
            primary_name, 
            primary_phone, 
            primary_relation,
            secondary_name, 
            secondary_phone, 
            secondary_relation
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
            'SELECT e.employee_id, e.name, e.job, e.email, e.phone, e.address, e.city, e.state, ec.primary_name, ec.primary_phone, ec.primary_relation, ed.secondary_name, ed.secondary_phone, ed.secondary_relation FROM employees e LEFT JOIN primary_contacts ec ON e.employee_id = ec.employee_id LEFT JOIN secondary_contacts ed ON e.employee_id = ed.employee_id ORDER BY e.employee_id LIMIT ? OFFSET ?',[limit, offset],function(error,result){
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
        const { name, job, email, phone, address, city, state, primary_name, primary_phone, primary_relation, secondary_name, secondary_phone, secondary_relation } = req.body;
        const { id } = req.params;

        db.query(
            'UPDATE employees SET name = ?, job = ?, email = ?, phone = ?, address = ?, city = ?, state = ? WHERE employee_id = ?',
            [name, job, email, phone, address, city, state, id]
        );

        db.query(
            'UPDATE primary_contacts SET primary_name = ?, primary_phone = ?, primary_relation = ? WHERE employee_id = ?',
            [primary_name, primary_phone, primary_relation, id]
        );

        db.query(
            'UPDATE secondary_contacts SET secondary_name = ?, secondary_phone = ?, secondary_relation = ? WHERE employee_id = ?',
            [secondary_name, secondary_phone, secondary_relation, id]
        );

        res.json({   
            name,
            job,
            email,
            phone,
            address,
            city, 
            state,
            primary_name, 
            primary_phone, 
            primary_relation,
            secondary_name, 
            secondary_phone, 
            secondary_relation
        });

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
            'SELECT e.employee_id, e.name, e.job, e.email, e.phone, e.address, e.city, e.state, ec.primary_name, ec.primary_phone, ec.primary_relation, ed.secondary_name, ed.secondary_phone, ed.secondary_relation FROM employees e LEFT JOIN primary_contacts ec ON e.employee_id = ec.employee_id LEFT JOIN secondary_contacts ed ON e.employee_id = ed.employee_id WHERE e.employee_id = ?',
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