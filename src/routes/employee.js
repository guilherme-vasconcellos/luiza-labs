import { Router } from 'express';

import EmployeeRepository from '../repositories/EmployeeRepository';

const router = new Router();

const employeeRepository = new EmployeeRepository();

router.post('/', async (req, res) => {
    try {
        const employee = await employeeRepository.create(req.body);

        return res.status(201).json(employee);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

router.get('/', async (_, res) => {
    try {
        const employees = await employeeRepository.list();

        return res.status(200).json(employees);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const employee = await employeeRepository.findByEmail(email);

        return res.status(200).json(employee);
    } catch (err) {
        return res.status(404).json({ error: err.message });
    }
});

router.put('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const employee = await employeeRepository.updateByEmail(email, req.body);

        return res.status(200).json(employee);
    } catch (err) {
        return res.status(404).json({ error: err.message });
    }
});

router.delete('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        await employeeRepository.deleteByEmail(email);

        return res.sendStatus(204);
    } catch (err) {
        return res.status(404).json({ error: err.message });
    }
});

export default router;
