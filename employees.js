const express = require('express');
const router = express.Router();
const db = require('./db');

// Create Employee with multiple contact details (Relationship mapping)
router.post('/employees', async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        const conn = await db.getConnection();

        await conn.beginTransaction();

        const [result1] = await conn.query(
            'INSERT INTO employees (name) VALUES (?)',
            [name]
        );

        const employeeId = result1.insertId;

        const [result2] = await conn.query(
            'INSERT INTO employee_contacts (employee_id, email, phone) VALUES (?, ?, ?)',
            [employeeId, email, phone]
        );

        await conn.commit();

        res.status(201).json({
            id: employeeId,
            name,
            email,
            phone,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    } finally {
        conn && conn.release();
    }
});

// List Employee (with pagination)
router.get('/employees', async (req, res) => {
    try {
        const page = parseInt(req.query.page || 1, 10);
        const limit = parseInt(req.query.limit || 10, 10);
        const offset = (page - 1) * limit;

        const [result] = await db.query(
            'SELECT e.id, e.name, ec.email, ec.phone FROM employees e LEFT JOIN employee_contacts ec ON e.id = ec.employee_id ORDER BY e.id LIMIT ? OFFSET ?',
            [limit, offset]
        );

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Update Employee
router.put('/employees/:id', async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const { id } = req.params;

        const [result] = await db.query(
            'UPDATE employees SET name = ? WHERE id = ?',
            [name, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        await db.query(
            'UPDATE employee_contacts SET email = ?, phone = ? WHERE employee_id = ?',
            [email, phone, id]
        );

        res.json({
            id,
            name,
            email,
            phone,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Delete Employee
router.delete('/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM employees WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        await db.query(
            'DELETE FROM employee_contacts WHERE employee_id = ?',
            [id]
        );

        res.json({
            id,
            message: 'Employee deleted successfully',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

// Get Employee
router.get('/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query(
            'SELECT e.id, e.name, ec.email, ec.phone FROM employees e LEFT JOIN employee_contacts ec ON e.id = ec.employee_id WHERE e.id = ?',
            [id]
        );

        if (result.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        const { name, email, phone } = result[0];

        res.json({
            id,
            name,
            email,
            phone,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

module.exports = router;          