import express from 'express';
import { verifyToken, adminOnly, checkToken } from '../middlewares/login-middleware.js';

import {
    getProblems, createProblem, declineProblem, getPendingProblemById,
    createPendingProblem, getProblemById, getPendingProblem
} from "../controllers/problems-controller.js";

import { submitCode, runCode } from "../controllers/submission-controller.js";

const router = express.Router();

router.get("/all-problems", checkToken, getProblems);
router.get("/problems", checkToken, getProblems);
router.post("/create-problem", createProblem);
router.post("/create-pending-problem", verifyToken, createPendingProblem);
router.get("/get-pending-problem", verifyToken, adminOnly, getPendingProblem);
router.post("/decline-pending-problem", declineProblem);

router.post("/submit-code", verifyToken, submitCode);
router.post("/run-arena-code", runCode);
router.post("/run-playground-code", runCode);

router.get("/problem/:problemId", getProblemById);
router.get("/pending-problem/:problemId", verifyToken, adminOnly, getPendingProblemById);

export default router;
