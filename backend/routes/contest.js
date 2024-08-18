import express from 'express';
import { verifyToken, adminOnly, checkToken } from '../middlewares/login-middleware.js';
import {
    createContest, getContest,
    getContestQuestions, getContestQuestionsById, registerContest
} from '../controllers/contest-controller.js';

const router = express.Router();

router.get("/all-contest", checkToken, getContest);
router.post("/create-contest", verifyToken, createContest);
router.post("/register-contest", verifyToken, registerContest);

export default router;
