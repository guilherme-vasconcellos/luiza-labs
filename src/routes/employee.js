import { Router } from 'express';

import EmployeeRepository from '../repositories/EmployeeRepository';

const router = new Router();

EmployeeRepository.initialize();

router.post('/', async (req, res) => {
    try {
        const employee = await EmployeeRepository.create(req.body);

        return res.status(201).json(employee);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

router.get('/', async (_, res) => {
    try {
        const employees = await EmployeeRepository.list();

        return res.status(200).json(employees);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const employee = await EmployeeRepository.findByEmail(email);

        return res.status(200).json(employee);
    } catch (err) {
        return res.status(404).json({ error: err.message });
    }
});

router.put('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const employee = await EmployeeRepository.updateByEmail(email, req.body);

        return res.status(200).json(employee);
    } catch (err) {
        return res.status(404).json({ error: err.message });
    }
});

router.delete('/:email', async (req, res) => {
    try {
        const email = req.params.email;
        await EmployeeRepository.deleteByEmail(email);

        return res.sendStatus(204);
    } catch (err) {
        return res.status(404).json({ error: err.message });
    }
});

export default router;
