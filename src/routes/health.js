import { Router } from 'express';

const router = new Router();

router.get('/', (_, res) => res.sendStatus(200));

export default router;
