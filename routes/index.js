import express from 'express';
import Home from './controllers/Home.js';
import Host from './controllers/Host.js';

const router = express.Router();

router.get('/', Home);
router.get('/host', Host);
router.all('/health', (req, res) => { res.status(200).send('OK') });

export default router;