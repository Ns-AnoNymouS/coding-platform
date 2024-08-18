import express from 'express';
import { verifyToken, adminOnly, checkToken } from '../middlewares/login-middleware.js';

const router = express.Router();

router.get("/all-contest", checkToken, getProblems);

export default router;
